// import { NextResponse }
//   from "next/server";

// import { ai }
//   from "@/lib/gemini";

// export async function POST(
//   request: Request
// ) {
//   try {
//     const { notes } =
//       await request.json();

//     if (!notes) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "Doctor notes are required",
//         },
//         {
//           status: 400,
//         }
//       );
//     }

//     const response =
//   await ai.models.generateContent({
//     model: "gemini-2.0-flash-lite",

//     contents: `
// You are a medical assistant.

// Analyze doctor notes and generate:

// Symptoms
// Medication
// Advice
// Diet Recommendation

// Rules:
// - Advice should be automatically generated based on the condition.
// - Diet recommendation should be appropriate for the condition.
// - Keep each section short.
// - Do not mention that advice was AI generated.

// Doctor Notes:
// ${notes}
// `,
//   });

//     return NextResponse.json({
//       success: true,
//       summary:
//         response.text,
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         success: false,
//         message:
//           "Failed to generate AI summary",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { generateText } from "ai";

import { openrouter } from "@/lib/openrouter";

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

    const { text } =
      await generateText({
        model: openrouter(
          "openai/gpt-4o-mini",
        ),

        prompt: `
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

Doctor Notes:
${notes}
`,
      });

    return NextResponse.json({
      success: true,
      summary: text,
    });
  } catch (error) {
    console.error(error);

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