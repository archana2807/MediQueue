import OpenAI from "openai";

import { pool } from "@/lib/db";
import { getEmbedding } from "@/lib/ai/embed";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function retrieveContext(
  question: string
) {
  const embedding =
    await getEmbedding(question);

  const result =
    await pool.query(
      `
      SELECT
        title,
        content
      FROM knowledge_chunks
      ORDER BY
        embedding <-> $1
      LIMIT 5
      `,
      [JSON.stringify(embedding)]
    );

  return result.rows;
}

export async function handleFAQ(
  message: string
) {
  const docs =
    await retrieveContext(
      message
    );

  const context =
    docs
      .map(
        (doc) =>
          `${doc.title}

${doc.content}`
      )
      .join("\n\n");

  const response =
    await openai.chat.completions.create({
      model: "openai/gpt-oss-120b:free",

      temperature: 0.2,

      max_tokens: 800,

      messages: [
        {
          role: "user",
          content: `
You are MediQueue Hospital Assistant.

Answer ONLY using the provided context.

Rules:
- Use only information from the context.
- If the answer is not found in the context, reply exactly:
  "I don't have that information."
- Do not make assumptions.
- Keep responses concise and professional.

Context:
${context}

Question:
${message}
`,
        },
      ],
    });

  return (
    response.choices?.[0]
      ?.message?.content ||
    "I don't have that information."
  );
}