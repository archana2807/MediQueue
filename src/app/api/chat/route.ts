import {
  NextRequest,
  NextResponse,
} from "next/server";

import { retrieveContext } from "@/lib/queries/rag";
import { handleDoctorSearch } from "@/lib/queries/doctor-agent";
import { handleAppointment } from "@/lib/queries/appointment-agent";
import {
  handleSymptoms,
} from "@/lib/queries/doctor-agent";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { openai } from "@/lib/ai/client";
import { MODEL } from "@/lib/ai/model";


async function detectIntent(
  message: string,
  history?: Array<{ role: string; content: string }>
) {
  const historyContext = history && history.length > 0
    ? `\n\nConversation history:\n${history.map(m => `${m.role}: ${m.content}`).join("\n")}`
    : "";

  const lastAssistantMsg = history && history.length > 0
    ? history.filter(m => m.role === "assistant").pop()?.content || ""
    : "";

  const isRespondingToPrompt = lastAssistantMsg.includes("doctor name") ||
    lastAssistantMsg.includes("available slots") ||
    lastAssistantMsg.includes("preferred time") ||
    lastAssistantMsg.includes("another date");

  const response = await openai.chat.completions.create({
    model: MODEL,
    temperature: 0,
    max_tokens: 20,
    messages: [
      {
        role: "user",
        content: `
Classify the user query into ONE of these intents:

FAQ - General questions about hospital, timings, policies
DOCTOR - Asking about doctors, searching for doctors
SYMPTOM - Describing symptoms to get doctor recommendation
APPOINTMENT - Booking, scheduling, or modifying an appointment. Also classify as APPOINTMENT if the user is responding to a question about doctor name, date, or time in an appointment flow.
QUEUE - Asking about queue status
HISTORY - Asking about patient history

CRITICAL RULES (check these first):
1. If the conversation history shows the bot just asked for a "doctor name", "preferred time", or "available slots", classify as APPOINTMENT.
2. If the user provides only a doctor name (like "Dr. Meena Iyer", "Priya", "Sharma") and the previous bot message asked for a doctor name, classify as APPOINTMENT.
3. If the user provides only a time (like "11:00", "2 PM") and the previous bot message showed available slots, classify as APPOINTMENT.
4. If the user mentions "book", "appointment", "schedule", "slot", or a time like "11:00", classify as APPOINTMENT.
5. If the user provides a doctor name after an appointment flow, classify as APPOINTMENT.

Other rules:
- If the user is describing symptoms, classify as SYMPTOM.
- If the user is asking about a doctor (who is, do you have, show me), classify as DOCTOR.
${historyContext}

Query:
${message}
`,
      },
    ],
  });

  const intent = (response.choices?.[0]?.message?.content || "FAQ").trim();

  if (isRespondingToPrompt && (intent === "DOCTOR" || intent === "FAQ")) {
    return "APPOINTMENT";
  }

  return intent;
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

 const response = await openai.chat.completions.create({
    model: MODEL,
    temperature: 0.2,
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: `
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
      },
    ],
  });

return (
  response.choices?.[0]
    ?.message?.content ||
  "I don't have that information."
  );
}

export async function POST(
  request: NextRequest
) {
  try {
    const { message, history } =
      await request.json();
  const session =
  await getServerSession(
    authOptions
      );

    const intent =
      await detectIntent(
        message,
        history
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
        (session.user as any).id,
        history
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
          "Something went wrong. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}
