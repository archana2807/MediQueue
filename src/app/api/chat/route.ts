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
  const lastAssistantMsg = history && history.length > 0
    ? history.filter(m => m.role === "assistant").pop()?.content || ""
    : "";

  const lowerMsg = message.toLowerCase().trim();
  const lowerLastBot = lastAssistantMsg.toLowerCase();

  // DIRECT CHECK: If bot just asked for doctor name and user replies with a name
  if (lowerLastBot.includes("please provide a doctor name") ||
      lowerLastBot.includes("provide a doctor name")) {
    return "APPOINTMENT";
  }

  // DIRECT CHECK: If bot just showed available slots and user replies with a time
  if (lowerLastBot.includes("available slots") ||
      lowerLastBot.includes("preferred time") ||
      lowerLastBot.includes("reply with")) {
    if (/^\d{1,2}(:\d{2})?\s*(am|pm)?$/i.test(lowerMsg) ||
        /^\d{1,2}\s*(am|pm)$/i.test(lowerMsg) ||
        /^at\s+\d/i.test(lowerMsg)) {
      return "APPOINTMENT";
    }
  }

  // DIRECT CHECK: If user mentions booking keywords
  if (lowerMsg.includes("book") ||
      lowerMsg.includes("appointment") ||
      lowerMsg.includes("schedule") ||
      lowerMsg.includes("slot")) {
    return "APPOINTMENT";
  }

  // DIRECT CHECK: If user describes a symptom
  if (lowerMsg.includes("i have") ||
      lowerMsg.includes("my ") && lowerMsg.includes("hurt") ||
      lowerMsg.includes("i feel") ||
      lowerMsg.includes("i am ") ||
      lowerMsg.includes("my child")) {
    return "SYMPTOM";
  }

  // DIRECT CHECK: If user asks about a doctor
  if (lowerMsg.includes("who is") ||
      lowerMsg.includes("who are") ||
      lowerMsg.includes("do you have") ||
      lowerMsg.includes("show me") ||
      lowerMsg.includes("list all") ||
      lowerMsg.includes("which doctor")) {
    return "DOCTOR";
  }

  // DIRECT CHECK: Queue and History stubs
  if (lowerMsg.includes("queue")) return "QUEUE";
  if (lowerMsg.includes("history")) return "HISTORY";

  // Default: use LLM for ambiguous cases
  const historyContext = history && history.length > 0
    ? `\n\nConversation history:\n${history.map(m => `${m.role}: ${m.content}`).join("\n")}`
    : "";

  const response = await openai.chat.completions.create({
    model: MODEL,
    temperature: 0,
    max_tokens: 20,
    messages: [
      {
        role: "user",
        content: `Classify into ONE: FAQ, DOCTOR, SYMPTOM, APPOINTMENT, QUEUE, HISTORY

Rules:
- Book/appointment/schedule/slot = APPOINTMENT
- Doctor name or time after bot asked for it = APPOINTMENT
- Describing symptoms = SYMPTOM
- Asking about doctors = DOCTOR
- General questions = FAQ

${historyContext}
Query: ${message}`,
      },
    ],
  });

  return (response.choices?.[0]?.message?.content || "FAQ").trim();
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
