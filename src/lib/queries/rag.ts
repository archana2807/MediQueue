import { pool } from "@/lib/db";
import { getEmbedding }
from "@/lib/ai/embed";

export async function retrieveContext(
  question: string
) {
  const embedding =
    await getEmbedding(
      question
    );

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
      [
        JSON.stringify(
          embedding
        ),
      ]
    );

  return result.rows;
}