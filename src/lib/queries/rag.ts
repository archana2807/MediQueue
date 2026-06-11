import { generateText } from "ai";
import { pool } from "@/lib/db";
import { getEmbedding } from "@/lib/ai/embed";
import { openrouter } from "@/lib/openrouter";

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
          `${doc.title}\n${doc.content}`
      )
      .join("\n\n");

  const { text } =
    await generateText({
      model: openrouter(
        "google/gemma-3-27b-it"
      ),
      prompt: `
You are MediQueue Hospital Assistant.

Answer ONLY using the provided context.

If the answer is not found in the context,
reply:
"I don't have that information."

Context:
${context}

Question:
${message}
`,
    });

  return text;
}

