import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(
      6,
      "Password must be at least 6 characters"
  ),
  phone: z
  .string()
  .min(10, "Phone number required")
  .max(15),
});

export type RegisterFormData =
  z.infer<typeof registerSchema>;

export const doctorSchema =
  z.object({
    name: z
      .string()
      .min(
        2,
        "Doctor name must be at least 2 characters"
      ),

    specialization: z
      .string()
      .min(
        2,
        "Specialization is required"
      ),

    email: z
      .string()
      .email(
        "Please enter a valid email address"
      ),

    phone: z
      .string()
      .regex(
        /^[0-9]{10}$/,
        "Phone number must be 10 digits"
      ),

    password: z
      .string()
      .min(
        6,
        "Password must be at least 6 characters"
      ),
  });

export type DoctorFormData =
  z.infer<typeof doctorSchema>;


export const appointmentSchema =
  z.object({
    patient_name: z
      .string()
      .min(
        2,
        "Patient name is required"
      ),

    patient_phone: z
      .string()
      .regex(
        /^[0-9]{10}$/,
        "Phone number must be 10 digits"
      ),

    doctor_id: z
      .string()
      .min(
        1,
        "Please select a doctor"
      ),

    appointment_date: z
      .string()
      .min(
        1,
        "Please select an appointment date"
      ),

    status: z.enum([
      "PENDING",
      "CONFIRMED",
      "COMPLETED",
    ]),
  });

export type AppointmentFormData =
  z.infer<
    typeof appointmentSchema
  >;