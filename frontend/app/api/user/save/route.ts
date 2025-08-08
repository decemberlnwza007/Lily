import { Pool } from 'pg';
import { NextRequest, NextResponse } from 'next/server';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received body:", body);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
