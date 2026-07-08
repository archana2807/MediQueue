"use client";

import { useQuery } from "@tanstack/react-query";
import DashboardCounts from "./dashboard-counts";
import RecentAppointmentsTable from "./recent-appointments-card";
import { Spinner } from "../ui/spinner";
export default function DashboardContent() {
  const { data, isLoading, isError,error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard");
      return res.json();
    },
  });

    if (isLoading) {
       return (
    <div className="flex min-h-[60vh] items-center justify-center animate-fade-in">
      <Spinner className="size-8 animate-spin-slow" />
    </div>
  );
       }
  return (
    <>
      <DashboardCounts
  stats={data?.data?.stats}
/>

<RecentAppointmentsTable
  appointments={
    data?.data?.recentAppointments ?? []
  }
/>
    </>
  );
}