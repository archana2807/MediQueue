import { NextResponse } from "next/server";
import { chatWithRetry } from "@/lib/ai/chat";

export async function POST(
  request: Request
) {
  try {
    const { notes } =
      await request.json();

    if (!notes) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Doctor notes are required",
        },
        {
          status: 400,
        }
      );
    }

   const response =
   await chatWithRetry({
    model: "openai/gpt-oss-120b:free",

    temperature: 0.3,

    max_tokens: 800,

    messages: [
      {
        role: "user",
        content: `
You are a medical assistant.

Analyze doctor notes and generate:

Symptoms

Medication

Advice

Diet Recommendation

Rules:
- Advice should be automatically generated based on the condition.
- Diet recommendation should be appropriate for the condition.
- Keep each section short.
- Do not mention AI.
- Use markdown headings.
- Use bullet points.
- Do not use tables.

Doctor Notes:

${notes}
`,
      },
    ],
  });

const summary =
  response.choices?.[0]?.message?.content ||
  "Unable to generate summary.";

   

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error(
      "SUMMARY ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to generate AI summary",
      },
      {
        status: 500,
      }
    );
  }
}