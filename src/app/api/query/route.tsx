// Query psql database and return list of results
import { Pool } from 'pg';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query_list }: { query_list: string[] } = await req.json();

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
          const result = await pool.query(query);
          return {
            success: true,
            data: result.rows,
            rowCount: result.rowCount,
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            query,
          };
        }
      })
    );

    await pool.end();

    const formattedResults = results.map(result => result.success ? result.data : []);

    return NextResponse.json({ results: formattedResults });
  } catch (error) {
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to process request' 
      },
      { status: 500 }
    );
  }
}