import { pool } from "@/lib/db";

export async function getPatientMedications(patientId: string) {
  const result = await pool.query(
    `
    SELECT id, name, dosage, frequency, visit_id, created_at
    FROM patient_medications
    WHERE patient_id = $1
    ORDER BY created_at DESC
    `,
    [patientId]
  );
  return result.rows;
}

export async function getPatientAllergies(patientId: string) {
  const result = await pool.query(
    `
    SELECT id, allergen, severity, visit_id, created_at
    FROM patient_allergies
    WHERE patient_id = $1
    ORDER BY created_at DESC
    `,
    [patientId]
  );
  return result.rows;
}

export async function getPatientConditions(patientId: string) {
  const result = await pool.query(
    `
    SELECT id, condition_name, status, visit_id, created_at
    FROM patient_conditions
    WHERE patient_id = $1
    ORDER BY created_at DESC
    `,
    [patientId]
  );
  return result.rows;
}

export async function getPatientObservations(patientId: string) {
  const result = await pool.query(
    `
    SELECT id, observation, visit_id, created_at
    FROM patient_observations
    WHERE patient_id = $1
    ORDER BY created_at DESC
    `,
    [patientId]
  );
  return result.rows;
}

export async function insertMedication(
  patientId: string,
  name: string,
  dosage: string | null,
  frequency: string | null,
  visitId: string | null
) {
  const result = await pool.query(
    `
    INSERT INTO patient_medications (patient_id, name, dosage, frequency, visit_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [patientId, name, dosage, frequency, visitId]
  );
  return result.rows[0];
}

export async function insertAllergy(
  patientId: string,
  allergen: string,
  severity: string | null,
  visitId: string | null
) {
  const result = await pool.query(
    `
    INSERT INTO patient_allergies (patient_id, allergen, severity, visit_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [patientId, allergen, severity, visitId]
  );
  return result.rows[0];
}

export async function insertCondition(
  patientId: string,
  conditionName: string,
  status: string,
  visitId: string | null
) {
  const result = await pool.query(
    `
    INSERT INTO patient_conditions (patient_id, condition_name, status, visit_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [patientId, conditionName, status, visitId]
  );
  return result.rows[0];
}

export async function insertObservation(
  patientId: string,
  observation: string,
  visitId: string | null
) {
  const result = await pool.query(
    `
    INSERT INTO patient_observations (patient_id, observation, visit_id)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [patientId, observation, visitId]
  );
  return result.rows[0];
}

export async function deleteClinicalDataForVisit(visitId: string) {
  await pool.query(`DELETE FROM patient_medications WHERE visit_id = $1`, [visitId]);
  await pool.query(`DELETE FROM patient_allergies WHERE visit_id = $1`, [visitId]);
  await pool.query(`DELETE FROM patient_conditions WHERE visit_id = $1`, [visitId]);
  await pool.query(`DELETE FROM patient_observations WHERE visit_id = $1`, [visitId]);
}
