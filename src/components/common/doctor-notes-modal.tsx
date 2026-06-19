"use client";

import { useState } from "react";
import {
  Sparkles,
  Pencil,
  Check,
  X,
  Loader2,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  open: boolean;
  notes: string;
  onClose: () => void;
  onSave: (notes: string, summary: string) => void;
  onNotesChange: (value: string) => void;
};

export default function DoctorNotesModal({
  open,
  notes,
  onClose,
  onSave,
  onNotesChange,
}: Props) {
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [editingSummary, setEditingSummary] = useState(false);
  const [editedSummary, setEditedSummary] = useState("");

  if (!open) return null;

  async function generateSummary() {
    try {
      setLoadingSummary(true);
      setEditingSummary(false);

      const response = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });

      const result = await response.json();

      if (result.success) {
        setSummary(result.summary);
        setEditedSummary(result.summary);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSummary(false);
    }
  }

  function startEditing() {
    setEditedSummary(summary);
    setEditingSummary(true);
  }

  function saveEdit() {
    setSummary(editedSummary);
    setEditingSummary(false);
  }

  function cancelEdit() {
    setEditedSummary(summary);
    setEditingSummary(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl bg-card shadow-xl animate-fade-in-scale">
        {/* Header */}
        <div className="border-b border-border p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
              <FileText className="h-4.5 w-4.5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Complete Appointment</h2>
              <p className="text-sm text-muted-foreground">
                Add doctor notes and generate an AI-powered summary.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {/* Doctor Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Doctor Notes</label>
            <Textarea
              rows={5}
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Patient has fever for 3 days. Prescribed Paracetamol and advised hydration..."
              className="border-border/60 bg-background/50 text-sm placeholder:text-muted-foreground/40 focus-visible:border-emerald-500/40 focus-visible:ring-emerald-500/20"
            />
          </div>

          {/* AI Summary */}
          {summary && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  AI Summary
                </label>

                {!editingSummary && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={startEditing}
                    className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </Button>
                )}
              </div>

              {editingSummary ? (
                <div className="space-y-2">
                  <Textarea
                    rows={5}
                    value={editedSummary}
                    onChange={(e) => setEditedSummary(e.target.value)}
                    className="border-emerald-500/40 bg-background/50 text-sm focus-visible:border-emerald-500/40 focus-visible:ring-emerald-500/20"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={saveEdit}
                      className="h-7 gap-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    >
                      <Check className="h-3 w-3" />
                      Save
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={cancelEdit}
                      className="h-7 gap-1.5 text-muted-foreground"
                    >
                      <X className="h-3 w-3" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-border/40 bg-muted/30 p-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-foreground/90">
                    {summary}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-end gap-2 border-t border-border p-5">
          <Button
            type="button"
            variant="outline"
            onClick={generateSummary}
            disabled={loadingSummary || !notes.trim()}
            className="gap-2 border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10"
          >
            {loadingSummary ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {summary ? "Regenerate" : "Generate AI Summary"}
              </>
            )}
          </Button>

          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            type="button"
            onClick={() => onSave(notes, summary)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
          >
            Save & Complete
          </Button>
        </div>
      </div>
    </div>
  );
}
