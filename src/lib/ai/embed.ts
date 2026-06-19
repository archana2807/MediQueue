import { OpenAIEmbeddings }
from "@langchain/openai";

const embeddings =
  new OpenAIEmbeddings({
    model:
      "text-embedding-3-small",

    configuration: {
      apiKey:
        process.env.OPENROUTER_API_KEY,

      baseURL:
        "https://openrouter.ai/api/v1",
    },
  });

export async function getEmbedding(
  text: string
) {
  return embeddings.embedQuery(
    text
  );
}