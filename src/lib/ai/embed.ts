import { openai } from "./client";
import { EMBEDDING_MODEL } from "./model";

export async function getEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return response.data[0].embedding;
}
