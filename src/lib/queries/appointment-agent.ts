import { generateObject } from "ai";
import { z } from "zod";

import { openrouter } from "@/lib/openrouter";
import {
  createAppointment,
} from "@/lib/queries/appointments";
import { findDoctor } from "./doctors";

export async function extractAppointmentDetails(
  message: string
) {
  const { object } =
    await generateObject({
      model: openrouter(
        "google/gemma-3-27b-it"
      ),

      schema: z.object({
        doctorName: z.string(),
        appointmentDate:
          z.string(),
      }),

      prompt: `
Extract appointment details.

User:
${message}
`,
    });

  return object;
}

export async function handleAppointment(
  message: string,
  patientId: string
) {

      // console.log("Starting appointment handler");

  const details =
    await extractAppointmentDetails(
      message
    );

  const doctor =
    await findDoctor(
      details.doctorName
    );

  if (!doctor) {
    return "Doctor not found.";
  }

  const appointment =
    await createAppointment(
      patientId,
      null,
      null,
      doctor.id,
      details.appointmentDate,
      "PENDING"
    );

  return `
Appointment booked successfully.

Doctor:
${doctor.name}

Date:
${details.appointmentDate}

Queue Number:
${appointment.queue_number}
`;
}