import { pool } from "@/lib/db";

export async function getPatientHistory(
  patientId: string
) {
  const result =
    await pool.query(
      `
      SELECT
        a.id,
        a.patient_id,
        a.appointment_date,
        a.status,
        du.name AS doctor_name,
        an.doctor_notes,
        an.ai_summary

      FROM appointments a

      LEFT JOIN appointment_notes an
        ON an.appointment_id = a.id

      LEFT JOIN doctors d
        ON d.id = a.doctor_id

      LEFT JOIN users du
        ON du.id = d.user_id

      WHERE a.patient_id = $1

      ORDER BY
        a.appointment_date DESC
      `,
      [patientId]
    );

  return result.rows;
}