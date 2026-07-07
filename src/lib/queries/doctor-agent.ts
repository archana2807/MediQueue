import { pool } from "@/lib/db";
import { chatWithRetry } from "@/lib/ai/chat";

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
          `${d.name} - ${d.specialization.toUpperCase()}`
      )
      .join("\n");

  const response =
    await chatWithRetry({
      model: "openai/gpt-oss-120b:free",

      temperature: 0.2,

      max_tokens: 500,

      messages: [
        {
          role: "user",
          content: `
You are a hospital assistant.

Available doctors:

${doctorList}

Rules:
- Answer ONLY using the doctor list.
- If doctor is unavailable, say so.
- Keep responses short and professional.

Question:
${message}
`,
        },
      ],
    });

  return (
    response.choices?.[0]
      ?.message?.content ||
    "No doctor information available."
  );
}

export async function handleSymptoms(
  message: string
) {
  const response =
    await chatWithRetry({
      model: "openai/gpt-oss-120b:free",

      temperature: 0,

      max_tokens: 50,

      messages: [
        {
          role: "user",
          content: `
You are a medical triage assistant.

Determine the most appropriate
hospital specialization.

Examples:

Fever -> General Medicine
Headache -> General Medicine
Ear Pain -> ENT
Eye Pain -> Ophthalmology
Skin Rash -> Dermatology
Joint Pain -> Orthopedics
Chest Pain -> Cardiology
Tooth Pain -> Dental

Symptoms:
${message}

Return ONLY specialization.
`,
        },
      ],
    });

  const specialization =
    (
      response.choices?.[0]
        ?.message?.content || ""
    ).trim();

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
      [specialization]
    );

  if (
    result.rows.length === 0
  ) {
    return `
Recommended Department:
${specialization}

No doctors currently available.
`;
  }

  return `
Recommended Department:
${specialization.toUpperCase()}

Available Doctors:

${result.rows
  .map(
    (d) => `• ${d.name}`
  )
  .join("\n")}
`;
}