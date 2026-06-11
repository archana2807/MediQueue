"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import DeleteAppointmentButton from "./delete-appointment-button";

type Appointment = {
  id: string;
  patient_name: string;
  doctor_name: string;
  appointment_date: string;
  status: string;
};

export default function AppointmentsTable() {
  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(5);

  const [total, setTotal] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  const { data: session } =
  useSession();

const isPatient =
  (session?.user as any)
      ?.role === "PATIENT";
  
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAppointments();
    }, 300);

    return () =>
      clearTimeout(timer);
  }, [page, pageSize, search]);

  async function fetchAppointments() {
    try {
      setLoading(true);

      const response =
        await fetch(
          `/api/appointments?page=${page}&limit=${pageSize}&search=${search}`
        );

      const result =
        await response.json();

      setAppointments(
        result.data || []
      );

      setTotal(
        result.total || 0
      );

      setTotalPages(
        result.totalPages || 1
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DataTable
      loading={loading}
      data={appointments}
      total={total}
      totalPages={totalPages}
      page={page}
      pageSize={pageSize}
      search={search}
      onSearchChange={(
        value
      ) => {
        setSearch(value);
        setPage(1);
      }}
      onPageChange={setPage}
      onPageSizeChange={(
        size
      ) => {
        setPageSize(size);
        setPage(1);
      }}
      columns={[
        {
          key: "patient_name",
          label: "Patient",
        },
        {
          key: "doctor_name",
          label: "Doctor",
        },
        {
          key: "appointment_date",
          label:
            "Appointment Date",
        },
        {
          key: "status",
          label: "Status",
        },
      ]}
      actions={(
  appointment
) =>
  !isPatient && (
    <div className="flex gap-2">
      <Link
        href={`/appointments/${appointment.id}/edit`}
      >
        <Button
          size="sm"
          variant="outline"
        >
          Edit
        </Button>
      </Link>
       <Link
  href={`/patients/${appointment.patient_id}/history`}
>
  <Button
    size="sm"
    variant="secondary"
  >
    View History
  </Button>
</Link>
      <DeleteAppointmentButton
        id={appointment.id}
        onSuccess={
          fetchAppointments
        }
      />
    </div>
  )
}
    />
  );
}