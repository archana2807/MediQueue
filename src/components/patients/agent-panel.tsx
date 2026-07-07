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
    description:
      "Generate a clinical handover note for shift change or transfer",
  },
  {
    value: "patient_summary",
    label: "Patient Summary",
    icon: FileText,
    description:
      "Comprehensive summary for a new clinician",
  },
  {
    value: "risk_flags",
    label: "Risk Flags",
    icon: AlertTriangle,
    description:
      "Identify clinical risk factors and concerns",
  },
  {
    value: "missing_information",
    label: "Missing Information",
    icon: Search,
    description:
      "Identify gaps in patient documentation",
  },
];

export default function AgentPanel({
  patientId,
}: {
  patientId: string;
}) {
  const [selectedTask, setSelectedTask] = useState<
    string | null
  >(null);
  const [result, setResult] =
    useState<AgentResult | null>(null);

  const runAgent = useMutation({
    mutationFn: async (taskType: string) => {
      const response = await fetch(
        `/api/patients/${patientId}/agent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
        headers: {
          "Content-Type": "application/json",
        },
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
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="size-5 text-emerald-400" />
          Clinical Agent
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select a task and run the agent to generate
          structured clinical output from patient context.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {TASK_OPTIONS.map((task) => {
            const Icon = task.icon;
            return (
              <button
                key={task.value}
                onClick={() =>
                  setSelectedTask(task.value)
                }
                className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                  selectedTask === task.value
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="size-4" />
                  <span className="font-medium">
                    {task.label}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {task.description}
                </p>
              </button>
            );
          })}
        </div>

        <Button
          onClick={handleRunTask}
          disabled={!selectedTask || runAgent.isPending}
          className="w-full"
        >
          {runAgent.isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Bot className="mr-2 size-4" />
              Run Agent
            </>
          )}
        </Button>

        {runAgent.isError && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
            Failed to run agent. Please try again.
          </div>
        )}

        {result && (
          <div className="space-y-4 rounded-lg border p-4">
            <div>
              <h4 className="text-sm font-semibold">
                Task: {result.taskRequested}
              </h4>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold">
                Steps Taken
              </h4>
              <ol className="space-y-1 text-xs text-muted-foreground">
                {result.stepsTaken.map((step, i) => (
                  <li key={i}>
                    {i + 1}. {step}
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold">
                Draft Output
              </h4>
              <div className="rounded-lg bg-muted p-3">
                <pre className="whitespace-pre-wrap text-sm leading-6">
                  {result.draftOutput}
                </pre>
              </div>
            </div>

            {result.evidenceReferences.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold">
                  Evidence References
                </h4>
                <div className="space-y-1">
                  {result.evidenceReferences.map(
                    (ref, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <Badge
                          variant="outline"
                          className="text-[10px]"
                        >
                          {ref.source}
                        </Badge>
                        <span>{ref.detail}</span>
                        {ref.visitDate && (
                          <span className="text-[10px]">
                            ({ref.visitDate})
                          </span>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {result.missingInfo.length > 0 && (
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Info className="size-4 text-orange-400" />
                  Missing Info
                </h4>
                <ul className="space-y-1">
                  {result.missingInfo.map((item, i) => (
                    <li
                      key={i}
                      className="text-xs text-muted-foreground"
                    >
                      - {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-400" />
                <p className="text-xs text-amber-400">
                  {result.disclaimer}
                </p>
              </div>
            </div>

            <Button
              onClick={handleSaveDraft}
              disabled={saveDraft.isPending}
              variant="outline"
              className="w-full"
            >
              {saveDraft.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : saveDraft.isSuccess ? (
                <>
                  <Save className="mr-2 size-4" />
                  Draft Saved
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
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
