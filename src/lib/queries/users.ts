import { pool } from "@/lib/db";

export async function getPatients(
  search: string = "",
  limit: number = 10,
  offset: number = 0
) {
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      email,
      phone,
      created_at
    FROM users
    WHERE role = 'PATIENT'
      AND (
        name ILIKE $1
        OR email ILIKE $1
        OR phone ILIKE $1
      )
    ORDER BY name
    LIMIT $2 OFFSET $3
    `,
    [`%${search}%`, limit, offset]
  );

  return result.rows;
}

export async function getPatientsCount(
  search: string = ""
) {
  const result = await pool.query(
    `
    SELECT COUNT(*)::int AS count
    FROM users
    WHERE role = 'PATIENT'
      AND (
        name ILIKE $1
        OR email ILIKE $1
        OR phone ILIKE $1
      )
    `,
    [`%${search}%`]
  );

  return result.rows[0].count;
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

export async function getPatientsByDoctorId(
  doctorId: string,
  search = "",
  limit = 10,
  offset = 0
) {
  const result = await pool.query(
    `
    SELECT DISTINCT
      u.id,
      u.name,
      u.email,
      u.phone,
      u.created_at,
      COUNT(a.id)::int AS appointment_count,
      MAX(a.appointment_date) AS last_visit
    FROM users u
    INNER JOIN appointments a ON a.patient_id = u.id
    WHERE a.doctor_id = $1
      AND (
        u.name ILIKE $2
        OR u.email ILIKE $2
        OR u.phone ILIKE $2
      )
    GROUP BY u.id, u.name, u.email, u.phone, u.created_at
    ORDER BY last_visit DESC
    LIMIT $3 OFFSET $4
    `,
    [doctorId, `%${search}%`, limit, offset]
  );

  return result.rows;
}

export async function getPatientsByDoctorCount(
  doctorId: string,
  search = ""
) {
  const result = await pool.query(
    `
    SELECT COUNT(DISTINCT u.id)::int AS count
    FROM users u
    INNER JOIN appointments a ON a.patient_id = u.id
    WHERE a.doctor_id = $1
      AND (
        u.name ILIKE $2
        OR u.email ILIKE $2
        OR u.phone ILIKE $2
      )
    `,
    [doctorId, `%${search}%`]
  );

  return result.rows[0].count;
}