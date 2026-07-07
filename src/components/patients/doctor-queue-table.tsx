"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/common/data-table";
import { useDebounce } from "use-debounce";
import { getStatusClass, formatDateTime } from "@/lib/utils";
import QueueActions from "@/components/queue/queue-actions";
import DoctorNotesModal from "@/components/common/doctor-notes-modal";
import { toast } from "sonner";
import { User } from "lucide-react";

type QueueItem = {
  id: string;
  queue_number: number | null;
  status: string;
  appointment_date: string;
  patient_name: string;
  patient_phone: string;
};

export default function DoctorQueueTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [debouncedSearch] = useDebounce(search, 500);
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");

  const { data, isLoading, isError, error, refetch } = useQuery<{
    data: QueueItem[];
    total: number;
    totalPages: number;
  }>({
    queryKey: ["my-queue", page, pageSize, debouncedSearch],
    queryFn: async () => {
      const response = await fetch(
        `/api/my-queue?page=${page}&limit=${pageSize}&search=${debouncedSearch}`
      );
      if (!response.ok) {
        throw new Error("Failed to load queue");
      }
      return response.json();
    },
    staleTime: 15000,
  });

  const completeAppointment = useMutation({
    mutationFn: async ({
      appointmentId,
      notes,
      summary,
    }: {
      appointmentId: string;
      notes: string;
      summary: string;
    }) => {
      const response = await fetch(`/api/queue/${appointmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "COMPLETED",
          doctor_notes: notes,
          ai_summary: summary,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to complete appointment");
      }
      return result;
    },
    onSuccess: async () => {
      toast.success("Appointment completed successfully");
      setOpen(false);
      setDoctorNotes("");
      setSelectedAppointmentId("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["my-queue"] }),
        queryClient.invalidateQueries({ queryKey: ["my-appointments"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      ]);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    },
  });

  function handleComplete(notes: string, summary: string) {
    if (!notes.trim()) {
      toast.error("Please enter doctor notes");
      return;
    }
    completeAppointment.mutate({
      appointmentId: selectedAppointmentId,
      notes,
      summary,
    });
  }

  const queue = (data?.data ?? []).map((item) => ({
    ...item,
    appointment_date: formatDateTime(item.appointment_date),
  }));

  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <p className="text-red-500">
          {error instanceof Error ? error.message : "Failed to load queue"}
        </p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <>
      <DataTable
        loading={isLoading}
        data={queue}
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
                <Badge className="bg-emerald-500/10 text-emerald-400 font-bold text-base">
                  Q{value}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  --
                </Badge>
              ),
          },
          {
            key: "patient_name",
            label: "Patient",
            render: (value: string) => (
              <span className="flex items-center gap-2 font-medium">
                <User className="size-4 text-muted-foreground" />
                {value || "Unknown"}
              </span>
            ),
          },
          {
            key: "appointment_date",
            label: "Scheduled",
          },
          {
            key: "status",
            label: "Status",
            render: (value: string) => (
              <Badge className={getStatusClass(value)}>
                {value.replaceAll("_", " ")}
              </Badge>
            ),
          },
        ]}
        actions={(item) => (
          <QueueActions
            appointmentId={item.id}
            status={item.status}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ["my-queue"] });
              queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
            }}
            onComplete={(appointmentId) => {
              setSelectedAppointmentId(appointmentId);
              setDoctorNotes("");
              setOpen(true);
            }}
          />
        )}
      />

      <DoctorNotesModal
        open={open}
        notes={doctorNotes}
        onClose={() => {
          setOpen(false);
          setDoctorNotes("");
        }}
        onSave={handleComplete}
        onNotesChange={setDoctorNotes}
      />
    </>
  );
}
