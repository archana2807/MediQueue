"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/common/data-table";
import { useDebounce } from "use-debounce";
import { Mail, Phone, Calendar } from "lucide-react";

type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  appointment_count: number;
  last_visit: string;
};

export default function DoctorPatientsTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, isError, error, refetch } = useQuery<{
    data: Patient[];
    total: number;
    totalPages: number;
  }>({
    queryKey: ["my-patients", page, pageSize, debouncedSearch],
    queryFn: async () => {
      const response = await fetch(
        `/api/my-patients?page=${page}&limit=${pageSize}&search=${debouncedSearch}`
      );
      if (!response.ok) {
        throw new Error("Failed to load patients");
      }
      return response.json();
    },
    staleTime: 30000,
  });

  const patients = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <p className="text-red-500">
          {error instanceof Error ? error.message : "Failed to load patients"}
        </p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <DataTable
      loading={isLoading}
      data={patients}
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
          key: "name",
          label: "Patient Name",
          render: (value: string) => (
            <span className="font-medium">{value}</span>
          ),
        },
        {
          key: "phone",
          label: "Phone",
          render: (value: string) => (
            <span className="flex items-center gap-1 text-muted-foreground text-sm">
              <Phone className="size-3" />
              {value || "N/A"}
            </span>
          ),
        },
        {
          key: "email",
          label: "Email",
          render: (value: string) => (
            <span className="flex items-center gap-1 text-muted-foreground text-sm">
              <Mail className="size-3" />
              {value || "N/A"}
            </span>
          ),
        },
        {
          key: "appointment_count",
          label: "Visits",
          render: (value: number) => (
            <Badge variant="secondary" className="text-xs">
              {value} visit(s)
            </Badge>
          ),
        },
        {
          key: "last_visit",
          label: "Last Visit",
          render: (value: string) => (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="size-3" />
              {value
                ? new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A"}
            </span>
          ),
        },
      ]}
    />
  );
}
