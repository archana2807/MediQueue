"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DoctorAppointmentsTable from "@/components/patients/doctor-appointments-table";
import PatientAppointmentsTable from "@/components/patients/patient-appointments-table";
import { useSession } from "next-auth/react";

export const dynamic = "force-dynamic";

export default function MyAppointmentsPage() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>My Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {role === "DOCTOR" ? (
          <DoctorAppointmentsTable />
        ) : (
          <PatientAppointmentsTable />
        )}
      </CardContent>
    </Card>
  );
}
