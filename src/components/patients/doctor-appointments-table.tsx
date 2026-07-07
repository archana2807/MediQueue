"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/common/data-table";
import { useDebounce } from "use-debounce";
import { getStatusClass } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Hourglass,
  Stethoscope,
  Phone,
} from "lucide-react";

type Appointment = {
  id: string;
  queue_number: number | null;
  status: string;
  appointment_date: string;
  patient_name: string;
  patient_phone: string;
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <Clock className="size-3" />,
  CONFIRMED: <CheckCircle2 className="size-3" />,
  CHECKED_IN: <Phone className="size-3" />,
  WAITING: <Hourglass className="size-3" />,
  IN_PROGRESS: <Stethoscope className="size-3" />,
  COMPLETED: <CheckCircle2 className="size-3" />,
  CANCELLED: <XCircle className="size-3" />,
};

export default function DoctorAppointmentsTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, isError, error, refetch } = useQuery<{
    data: Appointment[];
    total: number;
    totalPages: number;
  }>({
    queryKey: ["my-appointments", page, pageSize, debouncedSearch],
    queryFn: async () => {
      const response = await fetch(
        `/api/my-appointments?page=${page}&limit=${pageSize}&search=${debouncedSearch}`
      );
      if (!response.ok) {
        throw new Error("Failed to load appointments");
      }
      return response.json();
    },
    staleTime: 30000,
  });

  const appointments = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <p className="text-red-500">
          {error instanceof Error
            ? error.message
            : "Failed to load appointments"}
        </p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <DataTable
      loading={isLoading}
      data={appointments.map((a) => ({
        ...a,
        appointment_date: formatDateTime(a.appointment_date),
      }))}
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
        {
          key: "patient_name",
          label: "Patient",
          render: (value: string) => (
            <span className="font-medium">{value || "Unknown"}</span>
          ),
        },
        {
          key: "patient_phone",
          label: "Phone",
          render: (value: string) => (
            <span className="flex items-center gap-1 text-muted-foreground text-sm">
              <Phone className="size-3" />
              {value || "N/A"}
            </span>
          ),
        },
        {
          key: "appointment_date",
          label: "Date & Time",
        },
        {
          key: "status",
          label: "Status",
          render: (value: string) => (
            <Badge className={getStatusClass(value)}>
              {STATUS_ICONS[value]}
              <span className="ml-1">
                {value.replaceAll("_", " ")}
              </span>
            </Badge>
          ),
        },
      ]}
    />
  );
}
