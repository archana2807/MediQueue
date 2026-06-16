
import OpenAI from "openai";

import {
  createAppointment,
  getDoctorAppointments,
} from "@/lib/queries/appointments";

import { findDoctor } from "./doctors";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});
const WORKING_HOURS = {
  start: 9,
  end: 18,
};

const BLOCKED_SLOTS = [
  "13:00",
];

const MAX_DAILY_APPOINTMENTS =
  5;

function normalizeDate(
  originalMessage: string,
  extractedDate: string
) {
  const text =
    originalMessage.toLowerCase();

  const today = new Date();

  if (text.includes("tomorrow")) {
    today.setDate(
      today.getDate() + 1
    );

    return today
      .toISOString()
      .split("T")[0];
  }

  if (text.includes("today")) {
    return today
      .toISOString()
      .split("T")[0];
  }

  return extractedDate;
}

export async function extractAppointmentDetails(
  message: string
) {
  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const response =
    await openai.chat.completions.create({
      model: "openai/gpt-oss-120b:free",

      temperature: 0,

      max_tokens: 200,

      messages: [
        {
          role: "system",
        content: `
You are a JSON extraction API.

Return ONLY valid JSON.

Example:

{
  "doctorName": "Dr Patel",
  "appointmentDate": "2026-06-17",
  "appointmentTime": "14:00",
  "symptoms": ""
}

Today's date is ${today}.

Rules:
- Return only JSON.
- No markdown.
- No explanations.
- doctorName is required.
- appointmentDate must be YYYY-MM-DD.
- appointmentTime must be HH:mm (24-hour format).
- If user says "2 PM" return "14:00".
- If user says "10:30 AM" return "10:30".
- If no time is mentioned return "09:00".
- If user says "today" or "tomorrow", convert them into actual dates.
`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

  console.log(
    "FULL RESPONSE:",
    JSON.stringify(
      response,
      null,
      2
    )
  );

  if (
    !response ||
    !response.choices ||
    response.choices.length === 0
  ) {
    throw new Error(
      "No choices returned from OpenRouter"
    );
  }

  const content =
    response.choices[0]
      ?.message?.content;

  console.log(
    "RAW AI CONTENT:",
    content
  );

  if (!content) {
    throw new Error(
      "No AI response content"
    );
  }

  try {
    return JSON.parse(
      content
    ) as {
      doctorName: string;
  appointmentDate: string;
      appointmentTime?: string;
      symptoms?: string;
    };
  } catch {
    throw new Error(
      "Invalid JSON returned by AI"
    );
  }
}



export async function handleAppointment(
  message: string,
  patientId: string
) {
  try {
    const details =
      await extractAppointmentDetails(
        message
      );
    console.log("DETAILS:", details);
details.appointmentDate =
  normalizeDate(
    message,
    details.appointmentDate
      );
    
   const appointmentDateTime =
  `${details.appointmentDate} ${
    details.appointmentTime || "09:00"
  }:00`;
    
    
    const appointmentTime =
  details.appointmentTime ||
  "09:00";

const hour = Number(
  appointmentTime.split(":")[0]
);

if (
  hour < WORKING_HOURS.start ||
  hour >= WORKING_HOURS.end
) {
  return `
Doctor appointments are available only between:

09:00 AM - 06:00 PM
`;
    }
    
    if (
  BLOCKED_SLOTS.includes(
    appointmentTime
  )
) {
  return `
Doctor is unavailable at ${appointmentTime}.

Lunch break:
01:00 PM - 02:00 PM
`;
}

    if (!details.doctorName) {
      return "Please provide a doctor name.";
    }

    if (!details.appointmentDate) {
      return "Please provide an appointment date.";
    }

    const appointmentDate =
      new Date(
        details.appointmentDate
      );

    if (
      isNaN(
        appointmentDate.getTime()
      )
    ) {
      return `
Invalid appointment date.

Please provide a valid date.
`;
    }

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    if (
      appointmentDate <
      today
    ) {
      return `
Invalid appointment date.

Please provide a future date.
`;
    }
const doctor =
  await findDoctor(
    details.doctorName
  );

if (!doctor) {
  return `Doctor "${details.doctorName}" not found.`;
}
   const existing =
  await getDoctorAppointments(
    doctor.id,
    details.appointmentDate
      );
    
    if (
  existing.length >=
  MAX_DAILY_APPOINTMENTS
) {
  return `
Doctor is fully booked for this date.

Please choose another day.
`;
}
    const conflict =
  existing.some(
    (item) =>
      new Date(
        item.appointment_date
      ).getTime() ===
      new Date(
        appointmentDateTime
      ).getTime()
  );

if (conflict) {
  const slots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const bookedTimes =
    existing.map((a) =>
      new Date(
        a.appointment_date
      )
        .toTimeString()
        .slice(0, 5)
    );

  const availableSlots =
    slots
      .filter(
        (slot) =>
          !bookedTimes.includes(
            slot
          )
      )
      .slice(0, 3);
  
  

  return `
Doctor already has an appointment at ${
    appointmentTime
  }.

Available slots:

${availableSlots
  .map(
    (slot) => `✓ ${slot}`
  )
  .join("\n")}

Reply with a preferred time.
`;
}
    const workload =
      existing.length;

    let workloadStatus =
      "Low";

    let workloadReason =
      "Doctor has good availability on the selected date.";

    if (
      workload >= 5
    ) {
      workloadStatus =
        "Medium";

      workloadReason =
        "Doctor already has several appointments scheduled.";
    }

    if (
      workload >= 10
    ) {
      workloadStatus =
        "High";

      workloadReason =
        "Doctor has a busy schedule on the selected date.";
    }

   const appointment =
  await createAppointment(
    patientId,
    null,
    null,
    doctor.id,
    appointmentDateTime,
    "PENDING"
  );

    const symptoms =
      details.symptoms?.toLowerCase() ||
      "";

    const urgentKeywords =
      [
        "chest pain",
        "difficulty breathing",
        "shortness of breath",
        "heart attack",
        "stroke",
        "unconscious",
        "bleeding",
      ];

    const urgent =
      urgentKeywords.some(
        (keyword) =>
          symptoms.includes(
            keyword
          )
      );
    const waitingMinutes =
  existing.length * 15;

    return `
✅ Appointment booked successfully

Appointment ID:
${appointment.id}

Doctor:
${doctor.name}

Appointment:
${appointmentDateTime}

AI Scheduling Analysis:
${workloadStatus} Workload

Reason:
${workloadReason}

Current Doctor Load:
${existing.length + 1} appointments

Estimated Waiting Time:
${waitingMinutes} minutes

${
  urgent
    ? `
🚨 Urgent Symptoms Detected

Please seek immediate medical attention if symptoms worsen.
`
    : ""
}

Status:
Pending Confirmation

You will receive a queue number once the appointment is confirmed.
`;
  } catch (error) {
    console.error(
      "APPOINTMENT ERROR:",
      error
    );

    return `
Unable to process appointment request.

Please try again.
`;
  }
}

