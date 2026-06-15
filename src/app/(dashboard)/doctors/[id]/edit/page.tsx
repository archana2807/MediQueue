import DoctorForm from "@/components/doctors/doctor-form";
import { getDoctorById } from "@/lib/queries/doctors";

export default async function EditDoctorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doctor = await getDoctorById(id);

  return (
    <div className="animate-fade-in">
      <DoctorForm doctorId={id} initialData={doctor} />
    </div>
  );
}
