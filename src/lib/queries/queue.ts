import { query, pool } from "@/lib/db";

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
        'CHECKED_IN',
        'WAITING',
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
        'CHECKED_IN',
        'WAITING',
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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let queueNumber: number | null = null;

    if (status === "CHECKED_IN" || status === "WAITING") {
      const current = await client.query(
        `SELECT queue_number FROM appointments WHERE id = $1`,
        [id]
      );

      if (current.rows.length > 0 && !current.rows[0].queue_number) {
        const queueResult = await client.query(
          `SELECT COALESCE(MAX(queue_number), 0) AS last_queue FROM appointments`
        );
        queueNumber = Number(queueResult.rows[0].last_queue) + 1;
      }
    }

    const result = queueNumber !== null
      ? await client.query(
          `UPDATE appointments SET status = $1, queue_number = $2 WHERE id = $3 RETURNING *`,
          [status, queueNumber, id]
        )
      : await client.query(
          `UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *`,
          [status, id]
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

