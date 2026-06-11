import { pool } from "@/lib/db";

export async function createAppointmentNote(
  appointmentId: string,
  doctorNotes: string,
  aiSummary: string
) {
  const existing =
    await pool.query(
      `
      SELECT id
      FROM appointment_notes
      WHERE appointment_id = $1
      LIMIT 1
      `,
      [appointmentId]
    );

  if (existing.rows.length > 0) {
    const result =
      await pool.query(
        `
        UPDATE appointment_notes
        SET
          doctor_notes = $2,
          ai_summary = $3
        WHERE appointment_id = $1
        RETURNING *
        `,
        [
          appointmentId,
          doctorNotes,
          aiSummary,
        ]
      );

    return result.rows[0];
  }

  const result =
    await pool.query(
      `
      INSERT INTO appointment_notes (
        appointment_id,
        doctor_notes,
        ai_summary
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [
        appointmentId,
        doctorNotes,
        aiSummary,
      ]
    );

  return result.rows[0];
}

export async function getAppointmentNote(
  appointmentId: string
) {
  const result =
    await pool.query(
      `
      SELECT *
      FROM appointment_notes
      WHERE appointment_id = $1
      LIMIT 1
      `,
      [appointmentId]
    );

  return result.rows[0];
}