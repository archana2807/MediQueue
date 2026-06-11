import { generateText } from "ai";
import { pool } from "@/lib/db";
import { getEmbedding } from "@/lib/ai/embed";
import { openrouter } from "@/lib/openrouter";


export async function getAllDoctors() {
  const result = await pool.query(`
    SELECT
      u.name,
      d.specialization
    FROM doctors d
    JOIN users u
      ON u.id = d.user_id
    ORDER BY u.name
  `);

  return result.rows;
}
export async function handleDoctorSearch(
  message: string
) {
  const doctors =
    await getAllDoctors();

  const doctorList =
    doctors
      .map(
        (d) =>
          `${d.name} - ${d.specialization}`
      )
      .join("\n");

  const { text } =
    await generateText({
      model: openrouter(
        "google/gemma-3-27b-it"
      ),
      prompt: `
You are a hospital assistant.

Available doctors:

${doctorList}

Answer the user's question using only the doctor list.

Question:
${message}
`,
    });

  return text;
}

export async function handleSymptoms(
  message: string
) {
  const { text: specialization } =
    await generateText({
      model: openrouter(
        "google/gemma-3-27b-it"
      ),
      prompt: `
You are a medical triage assistant.

Determine the most appropriate
hospital specialization for the symptoms.

Examples:

Fever -> General Medicine
Headache -> General Medicine
Ear Pain -> ENT
Eye Pain -> Ophthalmology
Skin Rash -> Dermatology
Joint Pain -> Orthopedics

Symptoms:
${message}

Return ONLY specialization.
`,
    });

  const result =
    await pool.query(
      `
      SELECT
        u.name,
        d.specialization
      FROM doctors d
      JOIN users u
        ON u.id = d.user_id
      WHERE LOWER(d.specialization)
      = LOWER($1)
      `,
      [specialization.trim()]
    );

  if (
    result.rows.length === 0
  ) {
    return `Recommended department: ${specialization}`;
  }

  return `
Recommended Department:
${specialization}

Available Doctors:

${result.rows
  .map(
    (d) => `• ${d.name}`
  )
  .join("\n")}
`;
}