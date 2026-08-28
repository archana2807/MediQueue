"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStatusClass, formatDateTime } from "@/lib/utils";
import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import DeleteAppointmentButton from "./delete-appointment-button";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
type Appointment = {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_name: string;
  appointment_date: string;
  status: string;
  queue_number: number | null;
};

export default function AppointmentsTable() {
 
  const [search, setSearch] = useState("");
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  

  const { data: session } = useSession();
  const isPatient = (session?.user as any)?.role === "PATIENT";
const [debouncedSearch] =
  useDebounce(search, 500);
  

  const {
  data,
  isLoading,
  isError,
  error,
  refetch,
} = useQuery<{
  data: Appointment[];
  total: number;
  totalPages: number;
}>({
  queryKey: [
    "appointments",
    page,
    pageSize,
    debouncedSearch,
  ],

  queryFn: async () => {
    const response =
      await fetch(
        `/api/appointments?page=${page}&limit=${pageSize}&search=${debouncedSearch}`
      );

    if (!response.ok) {
      throw new Error(
        "Failed to load appointments"
      );
    }

    return response.json();
  },

  staleTime: 30000,
  placeholderData: (prev) => prev,
});
  const appointments =
  (data?.data ?? []).map(
    (appointment: Appointment) => ({
      ...appointment,
      appointment_date:
        formatDateTime(appointment.appointment_date),
    })
  );

const total =
  data?.total ?? 0;

const totalPages =
  data?.totalPages ?? 1;

  if (isError) {
  return (
    <div className="flex flex-col items-center gap-4 py-10">
      <p className="text-red-500">
        {error instanceof Error
          ? error.message
          : "Failed to load appointments"}
      </p>

      <Button
        onClick={() => refetch()}
      >
        Retry
      </Button>
    </div>
  );
}

  return (
    <DataTable
     loading={isLoading}
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
        {
          key: "queue_number",
          label: "Queue #",
          render: (value: number | null) =>
            value ? (
              <Badge className="bg-emerald-500/10 text-emerald-400 font-bold text-sm">
                Q{value}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                --
              </Badge>
            ),
        },
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
            <Link href={`/patients/${appointment.patient_id}`}>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-cyan-500/10"
                title="View Patient"
              >
                <History className="h-4 w-4 text-cyan-400" />
              </Button>
            </Link>
            {!locked && (
              <DeleteAppointmentButton
                id={appointment.id}
                
              />
            )}
          </div>
        );
      }}
    />
  );
}
