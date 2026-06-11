"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  open: boolean;
  notes: string;
  onClose: () => void;

  onSave: (
    notes: string,
    summary: string
  ) => void;

  onNotesChange: (
    value: string
  ) => void;
};

export default function DoctorNotesModal({
  open,
  notes,
  onClose,
  onSave,
  onNotesChange,
}: Props) {
  const [summary, setSummary] =
    useState("");

  const [loadingSummary, setLoadingSummary] =
    useState(false);

  if (!open) return null;

  async function generateSummary() {
    try {
      setLoadingSummary(true);

      const response =
        await fetch(
          "/api/ai/summary",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              notes,
            }),
          }
        );

      const result =
        await response.json();

      if (result.success) {
        setSummary(
          result.summary
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSummary(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        <div className="border-b p-5">
          <h2 className="text-xl font-semibold">
            Complete Appointment
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add doctor notes and generate
            an AI-powered summary.
          </p>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Doctor Notes
            </label>

            <Textarea
              rows={6}
              value={notes}
              onChange={(e) =>
                onNotesChange(
                  e.target.value
                )
              }
              placeholder="Patient has fever for 3 days. Prescribed Paracetamol and advised hydration..."
            />
          </div>

          {summary && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <h3 className="mb-2 font-semibold">
                AI Summary
              </h3>

              <pre className="whitespace-pre-wrap text-sm">
                {summary}
              </pre>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t p-5">
          <Button
            type="button"
            variant="outline"
            onClick={
              generateSummary
            }
            disabled={
              loadingSummary ||
              !notes.trim()
            }
          >
            {loadingSummary
              ? "Generating..."
              : "Generate AI Summary"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>

         <Button
  type="button"
  onClick={() =>
    onSave(
      notes,
      summary
    )
  }
>
  Save & Complete
</Button>
        </div>
      </div>
    </div>
  );
}