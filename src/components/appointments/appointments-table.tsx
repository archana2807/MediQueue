"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStatusClass } from "@/lib/utils";
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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const { data: session } = useSession();
  const isPatient = (session?.user as any)?.role === "PATIENT";

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAppointments();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, pageSize, search]);

  async function fetchAppointments() {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/appointments?page=${page}&limit=${pageSize}&search=${search}`
      );
      const result = await response.json();

      setAppointments(
        (result.data || []).map((appointment: Appointment) => ({
          ...appointment,
          appointment_date: new Date(
            appointment.appointment_date
          ).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }))
      );

      setTotal(result.total || 0);
      setTotalPages(result.totalPages || 1);
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
      onSearchChange={(value) => {
        setSearch(value);
        setPage(1);
      }}
      onPageChange={setPage}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setPage(1);
      }}
      columns={[
        { key: "patient_name", label: "Patient" },
        { key: "doctor_name", label: "Doctor" },
        { key: "appointment_date", label: "Appointment Date" },
        {
          key: "status",
          label: "Status",
          render: (value: string) => (
            <Badge className={getStatusClass(value)}>
              {value.replace("_", " ")}
            </Badge>
          ),
        },
      ]}
      actions={(appointment) => {
        const locked = ["CHECKED_IN", "WAITING", "IN_PROGRESS", "COMPLETED"].includes(appointment.status);
        return !isPatient && (
          <div className="flex items-center gap-1">
            {!locked && (
              <Link href={`/appointments/${appointment.id}/edit`}>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 hover:bg-emerald-500/10"
                  title="Edit Appointment"
                >
                  <Pencil className="h-4 w-4 text-emerald-400" />
                </Button>
              </Link>
            )}
            <Link href={`/patients/${appointment.patient_id}/history`}>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-cyan-500/10"
                title="View History"
              >
                <History className="h-4 w-4 text-cyan-400" />
              </Button>
            </Link>
            {!locked && (
              <DeleteAppointmentButton
                id={appointment.id}
                onSuccess={fetchAppointments}
              />
            )}
          </div>
        );
      }}
    />
  );
}
