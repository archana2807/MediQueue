import {
  NextRequest,
  NextResponse,
} from "next/server";

import { generateText } from "ai";

import { openrouter }
from "@/lib/openrouter";

import { retrieveContext }
from "@/lib/queries/rag";

export async function POST(
  request: NextRequest
) {
  try {
    const { message } =
      await request.json();

    const docs =
      await retrieveContext(
        message
      );

    const context =
      docs
        .map(
          (d) =>
            `${d.title}\n${d.content}`
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

If information is unavailable,
say:
"I don't have that information."

Context:
${context}

Question:
${message}
`,
      });

    return NextResponse.json({
      success: true,
      answer: text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}