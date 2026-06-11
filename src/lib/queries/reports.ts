import { pool } from "@/lib/db";

export async function createReport(
  patientId: string,
  reportName: string,
  reportUrl: string,
  aiAnalysis: string
) {
  const result = await pool.query(
    `
    INSERT INTO patient_reports (
      patient_id,
      report_name,
      report_url,
      ai_analysis
    )
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [
      patientId,
      reportName,
      reportUrl,
      aiAnalysis,
    ]
  );

  return result.rows[0];
}

export async function getReports(
  patientId: string
) {
  const result =
    await pool.query(
      `
      SELECT *
      FROM patient_reports
      WHERE patient_id = $1
      ORDER BY created_at DESC
      `,
      [patientId]
    );

  return result.rows;
}