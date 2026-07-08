
import {
  createAppointment,
  getDoctorAppointments,
} from "@/lib/queries/appointments";

import { findDoctor } from "./doctors";

import { openai } from "@/lib/ai/client";
import { MODEL } from "@/lib/ai/model";
const WORKING_HOURS = {
  start: 9,
  end: 18,
};

const BLOCKED_SLOTS = [
  "13:00",
];



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
      model: MODEL,

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
- If no time is mentioned return "".
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
    
   const appointmentTime =
  details.appointmentTime;

const appointmentDateTime =
  appointmentTime
    ? `${details.appointmentDate} ${appointmentTime}:00`
    : null;


    
    
  

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
   const todayString =
  new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Asia/Kolkata",
    }
  ).format(new Date());

if (
  details.appointmentDate ===
    todayString &&
  appointmentTime
) {
  const now =
    new Date();

  const [hours, minutes] =
    appointmentTime
      .split(":")
      .map(Number);

  const selectedTime =
    new Date();

  selectedTime.setHours(
    hours,
    minutes,
    0,
    0
  );

  if (
    selectedTime <= now
  ) {
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

    const currentTime =
      now.toLocaleTimeString(
        "en-GB",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }
      );

    const availableSlots =
      slots.filter(
        (slot) =>
          slot > currentTime
      );
    if (
  availableSlots.length === 0
) {
  return `
No slots available for today.

Please choose tomorrow or another date.
`;
}

    return `
The selected time (${appointmentTime}) has already passed.

Available slots:

${availableSlots
  .map(
    (slot) => `✓ ${slot}`
  )
  .join("\n")}

Please choose a future time.
`;
  }
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

if (!appointmentTime) {
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
      new Date(a.appointment_date)
        .toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
    );

  let availableSlots =
    slots.filter(
      (slot) =>
        !bookedTimes.includes(slot)
    );

 

  if (
    details.appointmentDate ===
    todayString
  ) {
    const currentTime =
      new Date().toLocaleTimeString(
        "en-GB",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }
      );

    availableSlots =
      availableSlots.filter(
        (slot) =>
          slot > currentTime
      );
  }
if (availableSlots.length === 0) {
  return `
No slots available for ${
    details.appointmentDate === todayString
      ? "today"
      : details.appointmentDate
  }.

Please choose another date.
`;
}
  return `
${doctor.name} is available on ${details.appointmentDate}.

Available slots:

${availableSlots
  .map((slot) => `✓ ${slot}`)
  .join("\n")}

Reply with your preferred time.
`;
}

const hour = Number(
  appointmentTime?.split(":")[0]
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
    
    
   
    
    if (!appointmentDateTime) {
  return "Please select a valid time.";
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
    ).toLocaleTimeString(
      "en-GB",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
    )
  );

  let availableSlots =
  slots.filter(
    (slot) =>
      !bookedTimes.includes(slot)
  );



if (
  details.appointmentDate ===
  todayString
) {
  const currentTime =
    new Date().toLocaleTimeString(
      "en-GB",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
    );

  availableSlots =
    availableSlots.filter(
      (slot) =>
        slot > currentTime
    );
}
  
  if (availableSlots.length === 0) {
  return `
No alternative slots available.

Please choose another date.
`;
}

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
    const currentLoad =
  existing.length + 1;

    

   const appointment =
  await createAppointment(
    patientId,
    null,
    null,
    doctor.id,
    appointmentDateTime,
    "PENDING"
  );

    
    const waitingMinutes =
  Math.max(
    0,
    currentLoad - 1
  ) * 15;

   return `
✅ Appointment Booked

Doctor: ${doctor.name}
Date: ${details.appointmentDate}
Time: ${appointmentTime}


Estimated Wait: ${waitingMinutes} min

Appointment ID: ${appointment.id}
Status: Pending
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

