"use client";

import Link from "next/link";
import { Eye, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "use-debounce";

type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
};

export default function PatientsTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, isError, error, refetch } = useQuery<{
    data: Patient[];
    total: number;
    totalPages: number;
  }>({
    queryKey: ["patients", page, pageSize, debouncedSearch],
    queryFn: async () => {
      const response = await fetch(
        `/api/patients?page=${page}&limit=${pageSize}&search=${debouncedSearch}`
      );
      if (!response.ok) {
        throw new Error("Failed to load patients");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const patients = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <p className="text-red-500">
          {error instanceof Error
            ? error.message
            : "Failed to load patients"}
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
          key: "email",
          label: "Email",
          render: (value: string) => (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Mail className="size-3" />
              {value || "No email"}
            </span>
          ),
        },
        {
          key: "phone",
          label: "Phone",
          render: (value: string) => (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Phone className="size-3" />
              {value || "No phone"}
            </span>
          ),
        },
        {
          key: "created_at",
          label: "Registered",
          render: (value: string) => (
            <Badge variant="outline" className="text-xs">
              {new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Badge>
          ),
        },
      ]}
      actions={(patient) => (
        <div className="flex items-center gap-1">
          <Link href={`/patients/${patient.id}`}>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-emerald-500/10"
              title="View Patient"
            >
              <Eye className="h-4 w-4 text-emerald-400" />
            </Button>
          </Link>
        </div>
      )}
    />
  );
}
