import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DoctorQueueTable from "@/components/patients/doctor-queue-table";

export const dynamic = "force-dynamic";

export default async function DoctorQueuePage() {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>My Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <DoctorQueueTable />
      </CardContent>
    </Card>
  );
}
