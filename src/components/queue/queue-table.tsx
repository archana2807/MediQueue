"use client";

import { useEffect, useState } from "react";

import DataTable from "@/components/common/data-table";
import QueueActions from "./queue-actions";
import DoctorNotesModal from "@/components/common/doctor-notes-modal";

import { toast } from "sonner";
type QueueItem = {
  id: string;
  // queue_number: number;
  patient_name: string;
  doctor_name: string;
  appointment_date: string;
  status: string;
};

export default function QueueTable() {
  console.log("QueueTable Render");
  const [queue, setQueue] =
    useState<QueueItem[]>([]);

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
  
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQueue();
    }, 300);

    return () =>
      clearTimeout(timer);
  }, [page, pageSize, search]);

  const [open, setOpen] =
  useState(false);

const [doctorNotes, setDoctorNotes] =
  useState("");

const [
  selectedAppointmentId,
  setSelectedAppointmentId,
] = useState("");

  async function fetchQueue() {
    try {
      setLoading(true);

      const response =
        await fetch(
          `/api/queue?page=${page}&limit=${pageSize}&search=${search}`
        );

      const result =
        await response.json();

      setQueue(
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

  async function handleComplete(
  notes: string,
  summary: string
) {
  if (!doctorNotes.trim()) {
    toast.error(
      "Please enter doctor notes before completing the appointment"
    );
    return;
  }

  try {
    const response = await fetch(
      `/api/queue/${selectedAppointmentId}`,
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
      toast.error(
        result.message ||
          "Failed to complete appointment"
      );
      return;
    }

    toast.success(
      "Appointment completed successfully"
    );

    setOpen(false);
    setDoctorNotes("");
    setSelectedAppointmentId("");

    fetchQueue();
  } catch (error) {
    console.error(error);

    toast.error(
      "Something went wrong. Please try again."
    );
  }
}
  return (
    <>
    <DataTable
      loading={loading}
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
        },
      ]}
      actions={(item) => (
  <QueueActions
    appointmentId={item.id}
    status={item.status}
    onSuccess={fetchQueue}
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