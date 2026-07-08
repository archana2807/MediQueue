"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  History,
  User,
  Mail,
  Phone,
  Calendar,
  Pill,
  ShieldAlert,
  AlertTriangle,
  Activity,
  Stethoscope,
} from "lucide-react";
import PatientContextCard from "@/components/patients/patient-context-card";
import PatientRawData from "@/components/patients/patient-raw-data";
import AgentPanel from "@/components/patients/agent-panel";
import SavedDraftsPanel from "@/components/patients/saved-drafts-panel";

export default function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const {
    data: contextData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["patient-context", id],
    queryFn: async () => {
      const response = await fetch(
        `/api/patients/${id}/context`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch patient context");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="size-8 animate-spin-slow" />
      </div>
    );
  }

  if (error || !contextData?.success) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="size-8 text-destructive" />
        </div>
        <p className="text-lg text-muted-foreground">
          Patient not found or failed to load.
        </p>
        <Link href="/patients">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="size-4" />
            Back to Patients
          </Button>
        </Link>
      </div>
    );
  }

  const ctx = contextData.data;
  const patient = ctx.rawPatient;
  const initials = (patient.name as string)
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const totalVisits = ctx.recentVisits?.length ?? 0;
  const medicationCount = ctx.currentMedications?.length ?? 0;
  const allergyCount =
    ctx.allergies?.[0] === "No known allergies documented"
      ? 0
      : ctx.allergies?.length ?? 0;
  const riskCount = ctx.riskFlags?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Link
        href="/patients"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Patients
      </Link>

      {/* Patient Hero */}
      <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-teal-500/[0.03]" />
        <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xl font-bold text-white shadow-md shadow-emerald-500/20">
              {initials || <User className="size-7" />}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">
                  {patient.name as string}
                </h1>
                {riskCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="text-xs"
                  >
                    {riskCount} Risk{riskCount > 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {patient.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="size-3.5" />
                    {patient.email as string}
                  </span>
                )}
                {patient.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="size-3.5" />
                    {patient.phone as string}
                  </span>
                )}
                {patient.created_at && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    Joined{" "}
                    {new Date(
                      patient.created_at as string
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Link href={`/patients/${id}/history`}>
              <Button variant="outline" size="sm" className="gap-2">
                <History className="size-4" />
                History
              </Button>
            </Link>
            <Link href={`/patients/${id}/reports`}>
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="size-4" />
                Reports
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={<Stethoscope className="size-4" />}
          label="Visits"
          value={totalVisits}
          color="text-blue-500"
          bgColor="bg-blue-500/10"
        />
        <StatCard
          icon={<Pill className="size-4" />}
          label="Medications"
          value={medicationCount}
          color="text-violet-500"
          bgColor="bg-violet-500/10"
        />
        <StatCard
          icon={<ShieldAlert className="size-4" />}
          label="Allergies"
          value={allergyCount}
          color="text-amber-500"
          bgColor="bg-amber-500/10"
        />
        <StatCard
          icon={<Activity className="size-4" />}
          label="Risk Flags"
          value={riskCount}
          color={riskCount > 0 ? "text-red-500" : "text-emerald-500"}
          bgColor={riskCount > 0 ? "bg-red-500/10" : "bg-emerald-500/10"}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PatientContextCard context={ctx} />
          <SavedDraftsPanel patientId={id} />
        </div>
        <div>
          <AgentPanel patientId={id} />
        </div>
      </div>

      {/* Raw Data */}
      <PatientRawData
        patient={ctx.rawPatient}
        visits={ctx.recentVisits}
        reports={ctx.reports}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 transition-colors hover:bg-muted/30">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${bgColor} ${color}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-xl font-bold tracking-tight">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
