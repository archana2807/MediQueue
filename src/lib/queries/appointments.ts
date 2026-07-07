

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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Create walk-in patient
    if (!patientId && patientName) {
      const userResult = await client.query(
        `
        INSERT INTO users (
          id, name, email, password, role, phone
        )
        VALUES (
          gen_random_uuid(), $1, $2, '', 'PATIENT', $3
        )
        RETURNING id
        `,
        [patientName, `${Date.now()}@walkin.local`, patientPhone]
      );
      patientId = userResult.rows[0].id;
    }

    // Get next queue number for this doctor on this date
    const queueResult = await client.query(
      `
      SELECT COALESCE(MAX(queue_number), 0) + 1 AS next_queue
      FROM appointments
      WHERE doctor_id = $1
        AND DATE(appointment_date) = DATE($2)
      `,
      [doctorId, appointmentDate]
    );
    const queueNumber = Number(queueResult.rows[0].next_queue);

    const result = await client.query(
      `
      INSERT INTO appointments (
        id, patient_id, doctor_id, appointment_date, queue_number, status
      )
      VALUES (
        gen_random_uuid(), $1, $2, $3, $4, 'PENDING'
      )
      RETURNING *
      `,
      [patientId, doctorId, appointmentDate, queueNumber]
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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

    // Assign queue number when
    // moving to CHECKED_IN or WAITING
    // Queue number is per-doctor per-day

    if (
      (status === "CHECKED_IN" ||
        status === "WAITING") &&
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
          WHERE doctor_id = (
            SELECT doctor_id FROM appointments WHERE id = $1
          )
          AND DATE(appointment_date) = (
            SELECT DATE(appointment_date) FROM appointments WHERE id = $1
          )
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

export async function getDoctorAppointments(
  doctorId: string,
  date: string
) {
  const result = await pool.query(
    `
    SELECT appointment_date
    FROM appointments
    WHERE doctor_id = $1
    AND DATE(appointment_date) = DATE($2)
    `,
    [doctorId, date]
  );

  return result.rows;
}

export async function getAppointmentsByDoctorId(
  doctorId: string,
  search = "",
  limit = 10,
  offset = 0
) {
  const result = await pool.query(
    `
    SELECT
      a.*,
      u.name AS patient_name,
      u.phone AS patient_phone
    FROM appointments a
    LEFT JOIN users u ON u.id = a.patient_id
    WHERE a.doctor_id = $1
      AND (
        u.name ILIKE $2
        OR u.phone ILIKE $2
      )
    ORDER BY a.appointment_date DESC
    LIMIT $3 OFFSET $4
    `,
    [doctorId, `%${search}%`, limit, offset]
  );

  return result.rows;
}

export async function getAppointmentsByDoctorCount(
  doctorId: string,
  search = ""
) {
  const result = await pool.query(
    `
    SELECT COUNT(*)::int AS count
    FROM appointments a
    LEFT JOIN users u ON u.id = a.patient_id
    WHERE a.doctor_id = $1
      AND (
        u.name ILIKE $2
        OR u.phone ILIKE $2
      )
    `,
    [doctorId, `%${search}%`]
  );

  return result.rows[0].count;
}