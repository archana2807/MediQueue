"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import {
  Bot,
  Save,
  FileText,
  AlertTriangle,
  ClipboardList,
  Search,
  Info,
  Loader2,
  Sparkles,
} from "lucide-react";

interface AgentResult {
  taskRequested: string;
  contextUsed: Record<string, unknown>;
  stepsTaken: string[];
  draftOutput: string;
  evidenceReferences: Array<{
    source: string;
    detail: string;
    visitDate?: string;
  }>;
  missingInfo: string[];
  disclaimer: string;
}

const TASK_OPTIONS = [
  {
    value: "handover_summary",
    label: "Handover Summary",
    icon: ClipboardList,
    description: "Clinical handover note for shift change or transfer",
  },
  {
    value: "patient_summary",
    label: "Patient Summary",
    icon: FileText,
    description: "Comprehensive summary for a new clinician",
  },
  {
    value: "risk_flags",
    label: "Risk Flags",
    icon: AlertTriangle,
    description: "Identify clinical risk factors and concerns",
  },
  {
    value: "missing_information",
    label: "Missing Info",
    icon: Search,
    description: "Identify gaps in patient documentation",
  },
];

export default function AgentPanel({
  patientId,
}: {
  patientId: string;
}) {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [result, setResult] = useState<AgentResult | null>(null);

  const runAgent = useMutation({
    mutationFn: async (taskType: string) => {
      const response = await fetch(
        `/api/patients/${patientId}/agent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskType }),
        }
      );
      if (!response.ok) {
        throw new Error("Agent request failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data.data);
    },
  });

  const saveDraft = useMutation({
    mutationFn: async (data: {
      taskType: string;
      content: string;
      evidenceReferences: unknown[];
    }) => {
      const response = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          taskType: data.taskType,
          content: data.content,
          evidenceReferences: data.evidenceReferences,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to save draft");
      }
      return response.json();
    },
  });

  function handleRunTask() {
    if (!selectedTask) return;
    setResult(null);
    runAgent.mutate(selectedTask);
  }

  function handleSaveDraft() {
    if (!result || !selectedTask) return;
    saveDraft.mutate({
      taskType: selectedTask,
      content: result.draftOutput,
      evidenceReferences: result.evidenceReferences,
    });
  }

  return (
    <Card className="border-border/60 overflow-hidden">
      <CardHeader className="border-b border-border/60 bg-gradient-to-r from-violet-500/[0.04] to-transparent pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
            <Bot className="size-4 text-violet-500" />
          </div>
          Clinical Agent
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Generate structured clinical outputs from patient context.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        {/* Task Selection */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {TASK_OPTIONS.map((task) => {
            const Icon = task.icon;
            return (
              <button
                key={task.value}
                onClick={() => setSelectedTask(task.value)}
                className={`group rounded-lg border p-3 text-left text-sm transition-all ${
                  selectedTask === task.value
                    ? "border-emerald-500 bg-emerald-500/10 shadow-sm shadow-emerald-500/10"
                    : "border-border/60 hover:border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className={`size-4 ${
                      selectedTask === task.value
                        ? "text-emerald-500"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  <span className="font-medium">{task.label}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {task.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Run Button */}
        <Button
          onClick={handleRunTask}
          disabled={!selectedTask || runAgent.isPending}
          className="w-full gap-2"
        >
          {runAgent.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Run Agent
            </>
          )}
        </Button>

        {/* Error */}
        {runAgent.isError && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
            Failed to run agent. Please try again.
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-4 rounded-xl border border-border/60 bg-muted/30 p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-emerald-500" />
              <h4 className="text-sm font-semibold">
                {result.taskRequested}
              </h4>
            </div>

            <Separator />

            {/* Steps Taken */}
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Steps Taken
              </h4>
              <ol className="space-y-1 text-xs text-muted-foreground">
                {result.stepsTaken.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Draft Output */}
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Draft Output
              </h4>
              <div className="rounded-lg bg-background/50 p-3">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-foreground/90">
                  {result.draftOutput}
                </pre>
              </div>
            </div>

            {/* Evidence References */}
            {result.evidenceReferences.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Evidence References
                </h4>
                <div className="space-y-1.5">
                  {result.evidenceReferences.map((ref, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <Badge variant="outline" className="text-[10px]">
                        {ref.source}
                      </Badge>
                      <span>{ref.detail}</span>
                      {ref.visitDate && (
                        <span className="text-[10px]">({ref.visitDate})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Info */}
            {result.missingInfo.length > 0 && (
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-500">
                  <Info className="size-4" />
                  Missing Info
                </h4>
                <ul className="space-y-1">
                  {result.missingInfo.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground">
                      - {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disclaimer */}
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                <p className="text-xs text-amber-600 dark:text-amber-500">
                  {result.disclaimer}
                </p>
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSaveDraft}
              disabled={saveDraft.isPending}
              variant="outline"
              className="w-full gap-2"
            >
              {saveDraft.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : saveDraft.isSuccess ? (
                <>
                  <Save className="size-4" />
                  Draft Saved
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save as Draft
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
