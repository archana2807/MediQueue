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
    name: z.string().min(2),
    specialization:
      z.string().min(2),
    email:
      z.email(),
    phone:
      z.string().min(10),
    password:
      z.string().min(6),
  });

export type DoctorFormData =
  z.infer<typeof doctorSchema>;


export const appointmentSchema =
  z.object({
    patient_id: z.string().optional(),
    patient_name: z.string().optional(),
    patient_phone: z.string().optional(),

    doctor_id: z.string().min(1),
    appointment_date: z.string().min(1),
    // queue_number: z.number().min(1),
    status: z.string().min(1),
  });

export type AppointmentFormData =
  z.infer<
    typeof appointmentSchema
  >;