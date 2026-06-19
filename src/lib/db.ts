// import { Pool } from "pg";

// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });




import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}