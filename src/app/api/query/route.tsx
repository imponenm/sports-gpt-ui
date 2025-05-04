// Query psql database and return list of results
import { Pool } from 'pg';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query_list, page = 0, rowsPerPage = 100 }: { 
      query_list: string[],
      page?: number,
      rowsPerPage?: number
    } = await req.json();

    // Query the database
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    // Execute each query and collect results
    const results = await Promise.all(
      query_list.map(async (query) => {
        try {
          // Remove any trailing semicolons from the query
          let cleanQuery = query.trim();
          if (cleanQuery.endsWith(';')) {
            cleanQuery = cleanQuery.slice(0, -1);
          }

          // Validate query is a SELECT statement
          const trimmedQuery = cleanQuery.toUpperCase();
          if (!trimmedQuery.startsWith('SELECT')) {
            return {
              success: false,
              error: 'Only SELECT statements are allowed',
              query,
            };
          }
          
          // First get the total count by wrapping the query
          const countQuery = `SELECT COUNT(*) FROM (${cleanQuery}) AS count_query`;
          const countResult = await pool.query(countQuery);
          const totalRows = parseInt(countResult.rows[0].count, 10);
          
          // Apply pagination to the original query
          const offset = page * rowsPerPage;
          const paginatedQuery = `${cleanQuery} LIMIT ${rowsPerPage} OFFSET ${offset}`;
          
          const result = await pool.query(paginatedQuery);
          return {
            success: true,
            data: result.rows,
            rowCount: result.rowCount,
            totalRows: totalRows,
            page: page,
            rowsPerPage: rowsPerPage,
            totalPages: Math.ceil(totalRows / rowsPerPage)
          };
        } catch (error) {
          console.error("Query execution error:", error);
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            query,
          };
        }
      })
    );

    await pool.end();

    // Fix the response structure
    const formattedResults = results.map(result => {
      if (!result.success) {
        return { error: result.error, query: result.query };
      }
      
      return {
        data: result.data,
        pagination: {
          page: result.page,
          rowsPerPage: result.rowsPerPage,
          totalRows: result.totalRows,
          totalPages: result.totalPages
        }
      };
    });
    
    return NextResponse.json({ results: formattedResults });
    
  } catch (error) {
    console.error("Route handler error:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to process request' 
      },
      { status: 500 }
    );
  }
}