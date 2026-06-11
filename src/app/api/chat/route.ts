import {
  NextRequest,
  NextResponse,
} from "next/server";

import { generateText } from "ai";

import { openrouter } from "@/lib/openrouter";

import { retrieveContext } from "@/lib/queries/rag";
import { handleDoctorSearch } from "@/lib/queries/doctor-agent";
import { handleAppointment } from "@/lib/queries/appointment-agent";
import {
  handleSymptoms,
} from "@/lib/queries/doctor-agent";


import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";



async function detectIntent(
  message: string
) {
  const { text } =
    await generateText({
      model: openrouter(
        "google/gemma-3-27b-it"
      ),
      prompt: `
Classify the user query.

Return ONLY one value:

FAQ
DOCTOR
SYMPTOM
APPOINTMENT
QUEUE
HISTORY

Query:
${message}
`,
    });

  return text.trim();
}

async function handleFAQ(
  message: string
) {
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

  return text;
}

export async function POST(
  request: NextRequest
) {
  try {
    const { message } =
      await request.json();
  const session =
  await getServerSession(
    authOptions
      );

    const intent =
      await detectIntent(
        message
      );

    let answer = "";

    switch (intent) {
      case "FAQ":
        answer =
          await handleFAQ(
            message
          );
        break;

     case "DOCTOR":
  answer =
    await handleDoctorSearch(
      message
    );
        break;
      case "SYMPTOM":
  answer =
    await handleSymptoms(
      message
    );
  break;

    case "APPOINTMENT":
  if (!session?.user?.id) {
    answer =
      "Please login to book an appointment.";
  } else if (
    (session.user as any).role !==
    "PATIENT"
  ) {
    answer =
      "Only patients can book appointments.";
  } else {
    answer =
      await handleAppointment(
        message,
        (session.user as any).id
      );
  }
  break;

      case "QUEUE":
        answer =
          "Queue assistant coming next.";
        break;

      case "HISTORY":
        answer =
          "Patient history assistant coming next.";
        break;
      

      default:
        answer =
          await handleFAQ(
            message
          );
    }

    return NextResponse.json({
      success: true,
      answer,
      intent,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}