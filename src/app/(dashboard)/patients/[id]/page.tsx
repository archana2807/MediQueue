"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  ArrowLeft,
  FileText,
  History,
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
      <div className="flex min-h-[60vh] items-center justify-center animate-fade-in">
        <Spinner className="size-8 animate-spin-slow" />
      </div>
    );
  }

  if (error || !contextData?.success) {
    return (
      <div className="container mx-auto max-w-8xl p-6 animate-fade-in">
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <p className="text-lg text-muted-foreground">
            Patient not found or failed to load.
          </p>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="mr-2 size-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const ctx = contextData.data;

  return (
    <div className="container mx-auto max-w-8xl p-6 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Patient Detail
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Clinical context, agent workspace, and raw
            data for this patient.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/patients/${id}/history`}>
            <Button variant="outline" size="sm">
              <History className="mr-2 size-4" />
              History
            </Button>
          </Link>
          <Link href={`/patients/${id}/reports`}>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 size-4" />
              Reports
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PatientContextCard context={ctx} />
          <AgentPanel patientId={id} />
        </div>

        <SavedDraftsPanel patientId={id} />

        <PatientRawData
          patient={ctx.rawPatient}
          visits={ctx.recentVisits}
          reports={ctx.reports}
        />
      </div>
    </div>
  );
}
