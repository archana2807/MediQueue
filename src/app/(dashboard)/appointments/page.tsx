import Link from "next/link";

import AppointmentsTable from "@/components/appointments/appointments-table";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AppointmentsPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Appointments
          Management
        </CardTitle>

        <Link href="/appointments/new">
          <Button>
            Add Appointment
          </Button>
        </Link>
      </CardHeader>

      <CardContent>
        <AppointmentsTable />
      </CardContent>
    </Card>
  );
}