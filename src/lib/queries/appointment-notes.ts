import { pool } from "@/lib/db";
import {
  insertMedication,
  insertAllergy,
  insertCondition,
  insertObservation,
  deleteClinicalDataForVisit,
} from "./clinical-data";

type ClinicalData = {
  conditions: string[];
  medications: string[];
  allergies: string[];
  observations: string[];
};

export async function createAppointmentNote(
  appointmentId: string,
  doctorNotes: string,
  aiSummary: string,
  clinicalData?: ClinicalData
) {
  const existing = await pool.query(
    `
    SELECT id
    FROM appointment_notes
    WHERE appointment_id = $1
    LIMIT 1
    `,
    [appointmentId]
  );

  let note;
  if (existing.rows.length > 0) {
    const result = await pool.query(
      `
      UPDATE appointment_notes
      SET doctor_notes = $2, ai_summary = $3
      WHERE appointment_id = $1
      RETURNING *
      `,
      [appointmentId, doctorNotes, aiSummary]
    );
    note = result.rows[0];
  } else {
    const result = await pool.query(
      `
      INSERT INTO appointment_notes (appointment_id, doctor_notes, ai_summary)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [appointmentId, doctorNotes, aiSummary]
    );
    note = result.rows[0];
  }

  const patientResult = await pool.query(
    `SELECT patient_id FROM appointments WHERE id = $1`,
    [appointmentId]
  );

  if (patientResult.rows.length === 0) return note;

  const patientId = patientResult.rows[0].patient_id;

  await deleteClinicalDataForVisit(appointmentId);

  if (clinicalData) {
    for (const name of clinicalData.conditions) {
      if (name.trim()) {
        await insertCondition(patientId, name.trim(), "active", appointmentId);
      }
    }

    for (const name of clinicalData.medications) {
      if (name.trim()) {
        await insertMedication(patientId, name.trim(), null, null, appointmentId);
      }
    }

    for (const name of clinicalData.allergies) {
      if (name.trim()) {
        await insertAllergy(patientId, name.trim(), null, appointmentId);
      }
    }

    for (const obs of clinicalData.observations) {
      if (obs.trim()) {
        await insertObservation(patientId, obs.trim(), appointmentId);
      }
    }
  }

  return note;
}

export async function getAppointmentNote(appointmentId: string) {
  const result = await pool.query(
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
