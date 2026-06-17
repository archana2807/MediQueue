"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DeleteDoctorButton from "./delete-doctor-button";
import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { useDebounce }
from "use-debounce";

type Doctor = {
  id: string;
  name: string;
  specialization: string;
  email: string;
};

export default function DoctorsTable() {
  
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading,isError,error, refetch} = useQuery<{
  data: Doctor[];
  total: number;
  totalPages: number;
}>({
    queryKey: ["doctors", page, pageSize, debouncedSearch],
  queryFn: async () => {
      // console.log("Fetching doctors...");
      const response = await fetch(`/api/doctors?page=${page}&limit=${pageSize}&search=${debouncedSearch}`)
     if (!response.ok) {
  const text =
    await response.text();

  console.log(text);

  throw new Error(
    `Failed to load doctors (${response.status})`
  );
}
      return response.json()
    },
    staleTime:  5 * 60 * 1000,
  })

  

  
 const doctors =
  data?.data ?? [];

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
          : "Failed to load doctors"}
      </p>

      <Button onClick={() => refetch()}>
        Retry
      </Button>
    </div>
  );
}
  return (
    
    <DataTable
      loading={isLoading}
      data={doctors}
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
        { key: "name", label: "Doctor Name" },
        { key: "specialization", label: "Specialization", render: (value: string) => value?.toUpperCase() },
        { key: "email", label: "Email" },
      ]}
      actions={(doctor) => (
        <div className="flex items-center gap-1">
          <Link href={`/doctors/${doctor.id}/edit`}>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-emerald-500/10"
              title="Edit Doctor"
            >
              <Pencil className="h-4 w-4 text-emerald-400" />
            </Button>
          </Link>
          <DeleteDoctorButton id={doctor.id}  />
        </div>
      )}
        
      />
       
  );
}
