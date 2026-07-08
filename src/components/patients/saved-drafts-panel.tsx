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
import { Separator } from "@/components/ui/separator";
import { Trash2, FileText, Clock, Inbox } from "lucide-react";

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

const TASK_COLORS: Record<string, string> = {
  handover_summary: "border-blue-500/20 bg-blue-500/10 text-blue-500",
  patient_summary: "border-violet-500/20 bg-violet-500/10 text-violet-500",
  risk_flags: "border-amber-500/20 bg-amber-500/10 text-amber-500",
  missing_information: "border-orange-500/20 bg-orange-500/10 text-orange-500",
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
      const response = await fetch(`/api/drafts/${draftId}`, {
        method: "DELETE",
      });
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
    <Card className="border-border/60 overflow-hidden">
      <CardHeader className="border-b border-border/60 bg-gradient-to-r from-violet-500/[0.04] to-transparent pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
            <FileText className="size-4 text-violet-500" />
          </div>
          Saved Drafts
          {drafts.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {drafts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="size-6 animate-spin-slow" />
          </div>
        ) : drafts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Inbox className="size-6 text-muted-foreground/60" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                No saved drafts yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                Use the Agent panel to generate and save clinical outputs.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="rounded-xl border border-border/60 bg-muted/20 p-4 transition-colors hover:bg-muted/30"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${TASK_COLORS[draft.task_type] || ""}`}
                    >
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
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap font-sans text-xs leading-5 text-muted-foreground">
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
