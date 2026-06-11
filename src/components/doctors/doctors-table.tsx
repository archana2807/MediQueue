"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import DeleteDoctorButton from "./delete-doctor-button";

import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";

type Doctor = {
  id: string;
  name: string;
  specialization: string;
  email: string;
};

export default function DoctorsTable() {
  const [doctors, setDoctors] =
    useState<Doctor[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(2);

  const [total, setTotal] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors();
    }, 300);

    return () =>
      clearTimeout(timer);
  }, [page, pageSize, search]);

  async function fetchDoctors() {
    try {
      setLoading(true);

      const response =
        await fetch(
          `/api/doctors?page=${page}&limit=${pageSize}&search=${search}`
        );

      const result =
        await response.json();

      setDoctors(
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
      data={doctors}
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
          key: "name",
          label: "Doctor Name",
        },
        {
          key: "specialization",
          label: "Specialization",
        },
        {
          key: "email",
          label: "Email",
        },
      ]}
      actions={(doctor) => (
        <div className="flex gap-2">
          <Link
            href={`/doctors/${doctor.id}/edit`}
          >
            <Button
              size="sm"
              variant="outline"
            >
              Edit
            </Button>
          </Link>

          <DeleteDoctorButton
            id={doctor.id}
              onSuccess={fetchDoctors}

          />
        </div>
      )}
    />
  );
}