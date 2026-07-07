import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const MAX_RETRIES = 3;
const BASE_DELAY = 2000;

export async function chatWithRetry(
  params: OpenAI.ChatCompletionCreateParamsNonStreaming,
  retries = MAX_RETRIES
): Promise<OpenAI.ChatCompletion> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await openai.chat.completions.create(params);
    } catch (error: any) {
      const isRateLimit = error?.status === 429 || error?.code === 429;
      const isLastAttempt = attempt === retries;

      if (isRateLimit && !isLastAttempt) {
        const delay = BASE_DELAY * Math.pow(2, attempt);
        console.log(`Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${retries})`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      throw error;
    }
  }

  throw new Error("Max retries exceeded");
}
