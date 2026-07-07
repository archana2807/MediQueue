"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Trash2, FileText, Clock } from "lucide-react";

interface Draft {
  id: string;
  patient_id: string;
  task_type: string;
  content: string;
  evidence_references: unknown;
  created_at: string;
}

const TASK_LABELS: Record<string, string> = {
  handover_summary: "Handover Summary",
  patient_summary: "Patient Summary",
  risk_flags: "Risk Flags",
  missing_information: "Missing Information",
};

export default function SavedDraftsPanel({
  patientId,
}: {
  patientId: string;
}) {
  const queryClient = useQueryClient();

  const { data: draftsData, isLoading } = useQuery({
    queryKey: ["patient-drafts", patientId],
    queryFn: async () => {
      const response = await fetch(
        `/api/drafts?patientId=${patientId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch drafts");
      }
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (draftId: string) => {
      const response = await fetch(
        `/api/drafts/${draftId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete draft");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patient-drafts", patientId],
      });
    },
  });

  const drafts: Draft[] = draftsData?.data || [];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5 text-violet-400" />
          Saved Drafts
          {drafts.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {drafts.length}
            </Badge>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Agent-generated outputs saved for this patient.
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner className="size-6 animate-spin-slow" />
          </div>
        ) : drafts.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No saved drafts yet. Use the Agent panel to generate and save clinical outputs.
          </div>
        ) : (
          <div className="space-y-3">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="rounded-lg border p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {TASK_LABELS[draft.task_type] || draft.task_type}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {new Date(draft.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(draft.id)}
                    disabled={deleteMutation.isPending}
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
                  {draft.content}
                </pre>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
