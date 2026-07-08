import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import OpenAI from "openai";
import { Pool } from "pg";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});

const MODEL = "openai/gpt-oss-120b:free";

async function backfill() {
  console.log("Starting clinical data backfill...\n");

  const notesResult = await pool.query(`
    SELECT
      an.id,
      an.appointment_id,
      an.doctor_notes,
      a.patient_id
    FROM appointment_notes an
    JOIN appointments a ON a.id = an.appointment_id
    WHERE NOT EXISTS (
      SELECT 1 FROM patient_medications pm WHERE pm.visit_id = an.appointment_id
    )
    ORDER BY a.appointment_date ASC
  `);

  const notes = notesResult.rows;
  console.log(`Found ${notes.length} appointment notes to process\n`);

  if (notes.length === 0) {
    console.log("Nothing to backfill. Exiting.");
    await pool.end();
    process.exit(0);
  }

  let successCount = 0;
  let failCount = 0;

  for (const note of notes) {
    const { appointment_id, doctor_notes, patient_id } = note;

    if (!doctor_notes || !doctor_notes.trim()) {
      console.log(`Skipping ${appointment_id} — no doctor notes`);
      continue;
    }

    console.log(`Processing ${appointment_id} for patient ${patient_id}...`);

    try {
      const response = await openai.chat.completions.create({
        model: MODEL,
        temperature: 0,
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: `Extract structured clinical data from doctor notes.

Return ONLY valid JSON:

{
  "medications": [
    { "name": "aspirin", "dosage": "81mg", "frequency": "daily" }
  ],
  "allergies": [
    { "allergen": "penicillin", "severity": "severe" }
  ],
  "conditions": [
    { "condition_name": "hypertension", "status": "active" }
  ],
  "observations": [
    "Blood pressure elevated at 140/90"
  ]
}

Rules:
- Return JSON only, no markdown.
- If a section has no data, return empty array.
- Extract ALL medications mentioned.
- Extract ALL allergies mentioned.
- Extract ALL conditions/diagnoses mentioned.
- Observations include vitals, test results, and clinical notes.
- Keep observations concise (one line each).`,
          },
          {
            role: "user",
            content: doctor_notes,
          },
        ],
      });

      const content = response.choices?.[0]?.message?.content;
      if (!content) {
        console.log(`  No AI response for ${appointment_id}`);
        failCount++;
        continue;
      }

      const data = JSON.parse(content);
      let insertedCount = 0;

      if (Array.isArray(data.medications)) {
        for (const med of data.medications) {
          if (med.name) {
            await pool.query(
              `INSERT INTO patient_medications (patient_id, name, dosage, frequency, visit_id) VALUES ($1, $2, $3, $4, $5)`,
              [patient_id, med.name, med.dosage || null, med.frequency || null, appointment_id]
            );
            insertedCount++;
          }
        }
      }

      if (Array.isArray(data.allergies)) {
        for (const allergy of data.allergies) {
          if (allergy.allergen) {
            await pool.query(
              `INSERT INTO patient_allergies (patient_id, allergen, severity, visit_id) VALUES ($1, $2, $3, $4)`,
              [patient_id, allergy.allergen, allergy.severity || null, appointment_id]
            );
            insertedCount++;
          }
        }
      }

      if (Array.isArray(data.conditions)) {
        for (const cond of data.conditions) {
          if (cond.condition_name) {
            await pool.query(
              `INSERT INTO patient_conditions (patient_id, condition_name, status, visit_id) VALUES ($1, $2, $3, $4)`,
              [patient_id, cond.condition_name, cond.status || "active", appointment_id]
            );
            insertedCount++;
          }
        }
      }

      if (Array.isArray(data.observations)) {
        for (const obs of data.observations) {
          if (typeof obs === "string" && obs.trim()) {
            await pool.query(
              `INSERT INTO patient_observations (patient_id, observation, visit_id) VALUES ($1, $2, $3)`,
              [patient_id, obs.trim(), appointment_id]
            );
            insertedCount++;
          }
        }
      }

      console.log(`  Inserted ${insertedCount} clinical records`);
      successCount++;
    } catch (e: any) {
      console.error(`  Failed: ${e.message}`);
      failCount++;
    }
  }

  console.log(`\nBackfill complete: ${successCount} succeeded, ${failCount} failed`);
  await pool.end();
  process.exit(0);
}

backfill();
