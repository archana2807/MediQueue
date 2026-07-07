import { pool } from "@/lib/db";

export interface PatientDraft {
  id: string;
  patient_id: string;
  task_type: string;
  content: string;
  evidence_references: unknown;
  created_at: string;
}

export async function createDraft(
  patientId: string,
  taskType: string,
  content: string,
  evidenceReferences: unknown[]
): Promise<PatientDraft> {
  const result = await pool.query(
    `
    INSERT INTO patient_drafts (
      patient_id,
      task_type,
      content,
      evidence_references
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [
      patientId,
      taskType,
      content,
      JSON.stringify(evidenceReferences),
    ]
  );

  return result.rows[0];
}

export async function getDrafts(
  patientId: string
): Promise<PatientDraft[]> {
  const result = await pool.query(
    `
    SELECT *
    FROM patient_drafts
    WHERE patient_id = $1
    ORDER BY created_at DESC
    `,
    [patientId]
  );

  return result.rows;
}

export async function getDraftById(
  id: string
): Promise<PatientDraft | null> {
  const result = await pool.query(
    `SELECT * FROM patient_drafts WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

export async function deleteDraft(
  id: string
): Promise<boolean> {
  const result = await pool.query(
    `DELETE FROM patient_drafts WHERE id = $1`,
    [id]
  );

  return (result.rowCount ?? 0) > 0;
}
