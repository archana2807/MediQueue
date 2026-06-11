import DoctorForm from "@/components/doctors/doctor-form";

import { getDoctorById } from "@/lib/queries/doctors";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function EditDoctorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const doctor =
    await getDoctorById(id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Edit Doctor
        </CardTitle>
      </CardHeader>

      <CardContent>
        <DoctorForm
          doctorId={id}
          initialData={doctor}
        />
      </CardContent>
    </Card>
  );
}