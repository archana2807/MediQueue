import DoctorForm from "@/components/doctors/doctor-form";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewDoctorPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Add Doctor
        </CardTitle>
      </CardHeader>

      <CardContent>
        <DoctorForm />
      </CardContent>
    </Card>
  );
}