import AppointmentForm from "@/components/appointments/appointment-form";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getAppointmentById,
} from "@/lib/queries/appointments";

export default async function EditAppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } =
    await params;

  const appointment =
    await getAppointmentById(
      id
    );

  if (!appointment) {
    return (
      <div>
        Appointment not found
      </div>
    );
  }

  return (

     <Card >
      <CardHeader>
        <CardTitle>
          Create Appointment
        </CardTitle>
      </CardHeader>

      <CardContent>
       <AppointmentForm
  appointmentId={appointment.id}
  initialData={{
    patient_id: appointment.patient_id,
    patient_name: appointment.patient_name,
    patient_phone: appointment.patient_phone,
    doctor_id: appointment.doctor_id,
    appointment_date: appointment.appointment_date,
    // queue_number: appointment.queue_number,
    status: appointment.status,
  }}
/>
      </CardContent>
    </Card>
    
  );
}