import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PatientsTable from "@/components/patients/patients-table";

export const dynamic = "force-dynamic";

export default async function PatientsPage() {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Patients</CardTitle>
      </CardHeader>
      <CardContent>
        <PatientsTable />
      </CardContent>
    </Card>
  );
}
