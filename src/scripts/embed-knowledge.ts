import { pool } from "@/lib/db";
import { getEmbedding } from "@/lib/ai/embed";

async function run() {
  const rows = await pool.query(`
    SELECT *
    FROM knowledge_chunks
    WHERE embedding IS NULL
  `);

  for (const row of rows.rows) {
    const embedding =
      await getEmbedding(
        row.content
      );

    await pool.query(
      `
      UPDATE knowledge_chunks
      SET embedding = $1
      WHERE id = $2
      `,
      [
        JSON.stringify(
          embedding
        ),
        row.id,
      ]
    );

    console.log(
      "Embedded:",
      row.title
    );
  }

  process.exit(0);
}

run();