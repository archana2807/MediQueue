import { query } from "@/lib/db";

export async function getQueueList(
  search = "",
  limit = 5,
  offset = 0
) {
  const result = await query(
    `
    SELECT
      a.id,
      a.queue_number,
      a.status,
      a.appointment_date,
      u.name AS patient_name,
      du.name AS doctor_name
    FROM appointments a

    LEFT JOIN users u
      ON a.patient_id = u.id

    LEFT JOIN doctors d
      ON a.doctor_id = d.id

    LEFT JOIN users du
      ON d.user_id = du.id

    WHERE
      (
        u.name ILIKE $1
        OR du.name ILIKE $1
      )
      AND a.status IN (
        'CONFIRMED',
  'IN_PROGRESS'
      )

    ORDER BY a.queue_number ASC

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

export async function getQueueCount(
  search = ""
) {
  const result = await query(
    `
    SELECT COUNT(*)::int AS count
    FROM appointments a

    LEFT JOIN users u
      ON a.patient_id = u.id

    LEFT JOIN doctors d
      ON a.doctor_id = d.id

    LEFT JOIN users du
      ON d.user_id = du.id

    WHERE
      (
        u.name ILIKE $1
        OR du.name ILIKE $1
      )
      AND a.status IN (
        'CONFIRMED',
  'IN_PROGRESS'
      )
    `,
    [`%${search}%`]
  );

  return result.rows[0].count;
}

export async function updateQueueStatus(
  id: string,
  status: string
) {
  const result =
    await query(
      `
      UPDATE appointments
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

  return result.rows[0];
}

