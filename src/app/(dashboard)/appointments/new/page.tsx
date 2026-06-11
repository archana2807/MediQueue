import AppointmentForm from "@/components/appointments/appointment-form";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewAppointmentPage() {
  return (
    <Card >
      <CardHeader>
        <CardTitle>
          Create Appointment
        </CardTitle>
      </CardHeader>

      <CardContent>
        <AppointmentForm />
      </CardContent>
    </Card>
  );
}