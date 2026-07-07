import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DoctorAppointmentsTable from "@/components/patients/doctor-appointments-table";

export const dynamic = "force-dynamic";

export default async function DoctorAppointmentsPage() {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>My Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <DoctorAppointmentsTable />
      </CardContent>
    </Card>
  );
}
