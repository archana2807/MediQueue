

import { pool } from "@/lib/db";

export async function getAppointments(
  search = "",
  limit = 2,
  offset = 0
) {
  const result = await pool.query(
    `
    SELECT
      a.*,
      du.name AS doctor_name,
      u.name AS patient_name,
      u.phone AS patient_phone
    FROM appointments a

    LEFT JOIN doctors d
      ON d.id = a.doctor_id

    LEFT JOIN users du
      ON du.id = d.user_id

    LEFT JOIN users u
      ON u.id = a.patient_id

    WHERE
      du.name ILIKE $1
      OR u.name ILIKE $1

    ORDER BY
      a.appointment_date DESC

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

export async function getAppointmentsCount(
  search = ""
) {
  const result = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM appointments a

    LEFT JOIN doctors d
      ON d.id = a.doctor_id

    LEFT JOIN users du
      ON du.id = d.user_id

    LEFT JOIN users u
      ON u.id = a.patient_id

    WHERE
      du.name ILIKE $1
      OR u.name ILIKE $1
    `,
    [`%${search}%`]
  );

  return Number(
    result.rows[0].total
  );
}

export async function getAppointmentById(
  id: string
) {
  const result =
    await pool.query(
      `
      SELECT
        a.*,
        du.name AS doctor_name,
        u.name AS patient_name,
        u.phone AS patient_phone
      FROM appointments a

      LEFT JOIN doctors d
        ON d.id = a.doctor_id

      LEFT JOIN users du
        ON du.id = d.user_id

      LEFT JOIN users u
        ON u.id = a.patient_id

      WHERE a.id = $1
      `,
      [id]
    );

  return result.rows[0];
}

export async function createAppointment(
  patientId: string | null,
  patientName: string | null,
  patientPhone: string | null,
  doctorId: string,
  appointmentDate: string,
  status: string
) {
  // Create walk-in patient
  if (!patientId && patientName) {
    const userResult =
      await pool.query(
        `
        INSERT INTO users (
          id,
          name,
          email,
          password,
          role,
          phone
        )
        VALUES (
          gen_random_uuid(),
          $1,
          $2,
          '',
          'PATIENT',
          $3
        )
        RETURNING id
        `,
        [
          patientName,
          `${Date.now()}@walkin.local`,
          patientPhone,
        ]
      );

    patientId =
      userResult.rows[0].id;
  }

  const result =
  await pool.query(
    `
    INSERT INTO appointments (
      id,
      patient_id,
      doctor_id,
      appointment_date,
      queue_number,
      status
    )
    VALUES (
      gen_random_uuid(),
      $1,
      $2,
      $3,
      NULL,
      'PENDING'
    )
    RETURNING *
    `,
    [
      patientId,
      doctorId,
      appointmentDate,
    ]
  );

  return result.rows[0];
}

export async function updateAppointment(
  id: string,
  patientId: string,
  patientPhone: string,
  doctorId: string,
  appointmentDate: string,
  status: string
) {
  const client =
    await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
      UPDATE users
      SET phone = $1
      WHERE id = $2
      `,
      [patientPhone, patientId]
    );

    const current =
      await client.query(
        `
        SELECT
          status,
          queue_number
        FROM appointments
        WHERE id = $1
        `,
        [id]
      );

    if (
      current.rows.length === 0
    ) {
      throw new Error(
        "Appointment not found"
      );
    }

    let queueNumber =
      current.rows[0]
        .queue_number;

    const currentStatus =
      current.rows[0].status;

    // Assign queue number only
    // when moving from
    // PENDING -> CONFIRMED

    if (
      currentStatus ===
        "PENDING" &&
      status ===
        "CONFIRMED" &&
      !queueNumber
    ) {
      const queueResult =
        await client.query(`
          SELECT
            COALESCE(
              MAX(queue_number),
              0
            ) AS last_queue
          FROM appointments
        `);

      queueNumber =
        Number(
          queueResult.rows[0]
            .last_queue
        ) + 1;
    }

    const result =
      await client.query(
        `
        UPDATE appointments
        SET
          patient_id = $1,
          doctor_id = $2,
          appointment_date = $3,
          status = $4,
          queue_number = $5
        WHERE id = $6
        RETURNING *
        `,
        [
          patientId,
          doctorId,
          appointmentDate,
          status,
          queueNumber,
          id,
        ]
      );

    await client.query(
      "COMMIT"
    );

    return result.rows[0];
  } catch (error) {
    await client.query(
      "ROLLBACK"
    );
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteAppointment(
  id: string
) {
  await pool.query(
    `
    DELETE FROM appointments
    WHERE id = $1
    `,
    [id]
  );

  return true;
}