"use client";

import {  useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getStatusClass } from "@/lib/utils";
import DataTable from "@/components/common/data-table";
import QueueActions from "./queue-actions";
import DoctorNotesModal from "@/components/common/doctor-notes-modal";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { Button } from "../ui/button";
import { useMemo } from "react";
type QueueItem = {
  id: string;
  // queue_number: number;
  patient_name: string;
  doctor_name: string;
  appointment_date: string;
  status: string;
};

export default function QueueTable() {
  
 

  const [search, setSearch] =
    useState("");
const [debouncedSearch] =
  useDebounce(search, 500);
  const [page, setPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(5);

  const queryClient =
  useQueryClient();



  const [open, setOpen] =
  useState(false);

const [doctorNotes, setDoctorNotes] =
  useState("");

const [
  selectedAppointmentId,
  setSelectedAppointmentId,
] = useState("");

  const {
  data,
  isLoading,
  isError,
  error,
  refetch,
} = useQuery<{
  data: QueueItem[];
  total: number;
  totalPages: number;
}>({
  queryKey: [
    "queue",
    page,
    pageSize,
    debouncedSearch,
  ],

  queryFn: async () => {
    const response =
      await fetch(
        `/api/queue?page=${page}&limit=${pageSize}&search=${debouncedSearch}`
      );

    if (!response.ok) {
      throw new Error(
        "Failed to load queue"
      );
    }

    return response.json();
  },

  staleTime: 30000,
});
  const queue = useMemo(
  () =>
    (data?.data ?? []).map(
      (item: QueueItem) => ({
        ...item,
        appointment_date:
          formatDateTime(
            item.appointment_date
          ),
      })
    ),
  [data]
);

const total =
  data?.total ?? 0;

const totalPages =
  data?.totalPages ?? 1;

  const completeAppointment =
  useMutation({
    mutationFn: async ({
      appointmentId,
      notes,
      summary,
    }: {
      appointmentId: string;
      notes: string;
      summary: string;
    }) => {
      const response =
        await fetch(
          `/api/queue/${appointmentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              status: "COMPLETED",
              doctor_notes: notes,
              ai_summary: summary,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to complete appointment"
        );
      }

      return result;
    },

   onSuccess: async () => {
  toast.success(
    "Appointment completed successfully"
  );

  setOpen(false);
  setDoctorNotes("");
  setSelectedAppointmentId("");

  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ["queue"],
    }),
    queryClient.invalidateQueries({
      queryKey: ["appointments"],
    }),
    queryClient.invalidateQueries({
      queryKey: ["dashboard"],
    }),
  ]);
},

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    },
  });
  function handleComplete(
  notes: string,
  summary: string
) {
  if (!notes.trim()) {
    toast.error(
      "Please enter doctor notes"
    );
    return;
  }

  completeAppointment.mutate({
    appointmentId:
      selectedAppointmentId,
    notes,
    summary,
  });
}
  
  if (isError) {
  return (
    <div className="flex flex-col items-center gap-4 py-10">
      <p className="text-red-500">
        {error instanceof Error
          ? error.message
          : "Failed to load queue"}
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
    <>
    <DataTable
      loading={isLoading}
      data={queue}
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
          key: "queue_number",
          label: "Queue No",
        },
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
          label: "Appointment Date",
        },
        {
  key: "status",
  label: "Status",
  render: (value: string) => (
    <Badge
      className={getStatusClass(
        value
      )}
    >
      {value.replaceAll(
        "_",
        " "
      )}
    </Badge>
  ),
},
      ]}
      actions={(item) => (
 <QueueActions
  appointmentId={item.id}
  status={item.status}
  onSuccess={() => {
  queryClient.invalidateQueries({
    queryKey: ["queue"],
  });

  queryClient.invalidateQueries({
    queryKey: ["dashboard"],
  });

  queryClient.invalidateQueries({
    queryKey: ["appointments"],
  });
}}
   
    onComplete={(
      appointmentId
    ) => {
      setSelectedAppointmentId(
        appointmentId
      );

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
  onNotesChange={
    setDoctorNotes
  }
/>
    </>
  );
}