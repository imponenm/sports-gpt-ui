// Query psql database and return list of results
import { Pool } from 'pg';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query_list, page = 0, rowsPerPage = 100, sport }: { 
      query_list: string[],
      page?: number,
      rowsPerPage?: number,
      sport: string
    } = await req.json();

    // Query the database
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    // Set the search path based on sport
    const searchPath = sport.toLowerCase();
    await pool.query(`SET search_path TO ${searchPath}`);

    // Execute each query and collect results
    const results = await Promise.all(
      query_list.map(async (query) => {
        try {
          // Remove any trailing semicolons from the query
          let cleanQuery = query.trim();
          if (cleanQuery.endsWith(';')) {
            cleanQuery = cleanQuery.slice(0, -1);
          }

          // Validate query doesn't contain destructive operations
          const destructiveOperations = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'TRUNCATE', 'ALTER', 'CREATE', 'GRANT', 'REVOKE'];
          const upperQuery = cleanQuery.toUpperCase();
          const hasDestructiveOperation = destructiveOperations.some(op => upperQuery.includes(op));
          
          if (hasDestructiveOperation) {
            return {
              success: false,
              error: 'Query contains destructive operations that are not allowed',
              query,
            };
          }
          
          // First get the total count by wrapping the query
          const countQuery = `SELECT COUNT(*) FROM (${cleanQuery}) AS count_query`;
          const countResult = await pool.query(countQuery);
          const totalRows = parseInt(countResult.rows[0].count, 10);
          
          // Apply pagination to the original query
          const offset = page * rowsPerPage;
          let paginatedQuery = cleanQuery;

          // Check if the query already has a LIMIT clause
          if (!paginatedQuery.toUpperCase().includes('LIMIT')) {
            paginatedQuery = `${cleanQuery} LIMIT ${rowsPerPage} OFFSET ${offset}`;
          } else {
            // If query already has LIMIT, use it as is
            console.log("Query already contains LIMIT clause, skipping pagination");
          }
          
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