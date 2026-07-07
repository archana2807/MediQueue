import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DoctorPatientsTable from "@/components/patients/doctor-patients-table";

export const dynamic = "force-dynamic";

export default async function DoctorPatientsPage() {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>My Patients</CardTitle>
      </CardHeader>
      <CardContent>
        <DoctorPatientsTable />
      </CardContent>
    </Card>
  );
}
