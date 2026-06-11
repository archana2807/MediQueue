import { pool } from "@/lib/db";

export async function getDoctors(
  search = "",
  limit = 10,
  offset = 0
) {
  const result = await pool.query(
    `
    SELECT
      d.id,
      d.specialization,
      d.user_id,
      u.name,
      u.email,
      u.phone
    FROM doctors d
    JOIN users u
      ON d.user_id = u.id
    WHERE
      u.name ILIKE $1 OR
      d.specialization ILIKE $1 OR
      u.email ILIKE $1
    ORDER BY u.name
    LIMIT $2
    OFFSET $3
    `,
    [
      `%${search}%`,
      limit,
      offset,
    ]
  );

  return result.rows;
}

export async function getDoctorsCount(
  search = ""
) {
  const result = await pool.query(
    `
    SELECT COUNT(*) as total
    FROM doctors d
    JOIN users u
      ON d.user_id = u.id
    WHERE
      u.name ILIKE $1 OR
      d.specialization ILIKE $1 OR
      u.email ILIKE $1
    `,
    [`%${search}%`]
  );

  return Number(
    result.rows[0].total
  );
}

export async function getDoctorById(
  id: string
) {
  const result = await pool.query(
    `
    SELECT
      d.id,
      d.specialization,
      d.user_id,
      u.name,
      u.email,
      u.phone
    FROM doctors d
    JOIN users u
      ON d.user_id = u.id
    WHERE d.id = $1
    `,
    [id]
  );

  return result.rows[0];
}

export async function updateDoctor(
  id: string,
  name: string,
  specialization: string,
  email: string,
  phone: string
) {
  const doctor =
    await getDoctorById(id);

  await pool.query(
    `
    UPDATE users
    SET
      name = $1,
      email = $2,
      phone = $3
    WHERE id = $4
    `,
    [
      name,
      email,
      phone,
      doctor.user_id,
    ]
  );

  const result =
    await pool.query(
      `
      UPDATE doctors
      SET specialization = $1
      WHERE id = $2
      RETURNING *
      `,
      [
        specialization,
        id,
      ]
    );

  return result.rows[0];
}

export async function deleteDoctor(
  id: string
) {
  const doctor =
    await getDoctorById(id);

  await pool.query(
    `
    DELETE FROM doctors
    WHERE id = $1
    `,
    [id]
  );

  await pool.query(
    `
    DELETE FROM users
    WHERE id = $1
    `,
    [doctor.user_id]
  );

  return {
    success: true,
  };
}

export async function createDoctor(
  userId: string,
  specialization: string
) {
  const result =
    await pool.query(
      `
      INSERT INTO doctors (
        user_id,
        specialization
      )
      VALUES (
        $1,
        $2
      )
      RETURNING *
      `,
      [
        userId,
        specialization,
      ]
    );

  return result.rows[0];
}