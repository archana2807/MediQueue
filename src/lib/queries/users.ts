import { pool } from "@/lib/db";

export async function getPatients() {
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      email
    FROM users
    WHERE role = 'PATIENT'
    ORDER BY name
    `
  );

  return result.rows;
}


export async function getPatientByPhone(
  phone: string
) {
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      email,
      phone
    FROM users
    WHERE role = 'PATIENT'
      AND phone = $1
    LIMIT 1
    `,
    [phone]
  );

  return result.rows[0] || null;
}