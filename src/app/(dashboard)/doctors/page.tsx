import Link from "next/link";

// import { getDoctors } from "@/lib/queries/doctors";

import DoctorsTable from "@/components/doctors/doctors-table";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function DoctorsPage() {
  // const doctors = await getDoctors();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Doctors Management
        </CardTitle>

        <Link href="/doctors/new">
          <Button>
            Add Doctor
          </Button>
        </Link>
      </CardHeader>

      <CardContent>
        <DoctorsTable
          // doctors={doctors}
        />
      </CardContent>
    </Card>
  );
}