"use client";

import { useState } from "react";
import {
  Sparkles,
  Pencil,
  Check,
  X,
  Loader2,
  FileText,
  Plus,
  Stethoscope,
  Pill,
  ShieldAlert,
  Eye,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

type ClinicalItem = string;

type ClinicalData = {
  conditions: ClinicalItem[];
  medications: ClinicalItem[];
  allergies: ClinicalItem[];
  observations: ClinicalItem[];
};

type Props = {
  open: boolean;
  notes: string;
  onClose: () => void;
  onSave: (
    notes: string,
    summary: string,
    clinicalData: ClinicalData
  ) => void;
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

  const [conditions, setConditions] = useState<ClinicalItem[]>([]);
  const [medications, setMedications] = useState<ClinicalItem[]>([]);
  const [allergies, setAllergies] = useState<ClinicalItem[]>([]);
  const [observations, setObservations] = useState<ClinicalItem[]>([]);

  const [newCondition, setNewCondition] = useState("");
  const [newMedication, setNewMedication] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newObservation, setNewObservation] = useState("");

  const [extracting, setExtracting] = useState(false);

  if (!open) return null;

  function addItem(
    value: string,
    setter: (v: string) => void,
    list: ClinicalItem[],
    listSetter: (v: ClinicalItem[]) => void
  ) {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      listSetter([...list, trimmed]);
      setter("");
    }
  }

  function removeItem(
    index: number,
    list: ClinicalItem[],
    listSetter: (v: ClinicalItem[]) => void
  ) {
    listSetter(list.filter((_, i) => i !== index));
  }

  async function generateSummary() {
    try {
      setLoadingSummary(true);
      setEditingSummary(false);

      const clinicalContext = [
        conditions.length > 0 ? `Conditions: ${conditions.join(", ")}` : "",
        medications.length > 0 ? `Medications: ${medications.join(", ")}` : "",
        allergies.length > 0 ? `Allergies: ${allergies.join(", ")}` : "",
        observations.length > 0 ? `Observations: ${observations.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const fullNotes = clinicalContext
        ? `${notes}\n\nClinical Data:\n${clinicalContext}`
        : notes;

      const response = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: fullNotes }),
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

  async function extractFromNotes() {
    if (!notes.trim()) return;
    try {
      setExtracting(true);
      const response = await fetch("/api/ai/extract-clinical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const result = await response.json();
      if (result.success && result.data) {
        const d = result.data;
        if (d.conditions?.length) setConditions((prev) => [...new Set([...prev, ...d.conditions])]);
        if (d.medications?.length) setMedications((prev) => [...new Set([...prev, ...d.medications])]);
        if (d.allergies?.length) setAllergies((prev) => [...new Set([...prev, ...d.allergies])]);
        if (d.observations?.length) setObservations((prev) => [...new Set([...prev, ...d.observations])]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setExtracting(false);
    }
  }

  function handleSave() {
    onSave(notes, summary, {
      conditions,
      medications,
      allergies,
      observations,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-xl bg-card shadow-xl animate-fade-in-scale">
        {/* Header */}
        <div className="border-b border-border p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
              <Stethoscope className="h-4.5 w-4.5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                Doctor Workspace
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter clinical notes and structured data for
                this visit.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Chief Complaint */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="size-4 text-muted-foreground" />
                Chief Complaint / Notes
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={extractFromNotes}
                disabled={extracting || !notes.trim()}
                className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                {extracting ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Sparkles className="size-3" />
                )}
                Extract from Notes
              </Button>
            </div>
            <Textarea
              rows={4}
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Patient presents with fever for 3 days, dry cough, and throat congestion..."
              className="border-border/60 bg-background/50 text-sm placeholder:text-muted-foreground/40 focus-visible:border-emerald-500/40 focus-visible:ring-emerald-500/20"
            />
          </div>

          {/* Conditions */}
          <ClinicalSection
            icon={<Stethoscope className="size-4 text-blue-400" />}
            title="Conditions"
            items={conditions}
            onRemove={(i) => removeItem(i, conditions, setConditions)}
            inputValue={newCondition}
            onInputChange={setNewCondition}
            onAdd={() =>
              addItem(newCondition, setNewCondition, conditions, setConditions)
            }
            placeholder="e.g., Hypertension, Diabetes"
            bgColor="bg-blue-500/10"
          />

          {/* Medications */}
          <ClinicalSection
            icon={<Pill className="size-4 text-violet-400" />}
            title="Medications"
            items={medications}
            onRemove={(i) => removeItem(i, medications, setMedications)}
            inputValue={newMedication}
            onInputChange={setNewMedication}
            onAdd={() =>
              addItem(newMedication, setNewMedication, medications, setMedications)
            }
            placeholder="e.g., Metformin 500mg twice daily"
            bgColor="bg-violet-500/10"
          />

          {/* Allergies */}
          <ClinicalSection
            icon={<ShieldAlert className="size-4 text-amber-400" />}
            title="Allergies"
            items={allergies}
            onRemove={(i) => removeItem(i, allergies, setAllergies)}
            inputValue={newAllergy}
            onInputChange={setNewAllergy}
            onAdd={() =>
              addItem(newAllergy, setNewAllergy, allergies, setAllergies)
            }
            placeholder="e.g., Penicillin, Aspirin"
            bgColor="bg-amber-500/10"
          />

          {/* Observations */}
          <ClinicalSection
            icon={<Eye className="size-4 text-cyan-400" />}
            title="Observations"
            items={observations}
            onRemove={(i) => removeItem(i, observations, setObservations)}
            inputValue={newObservation}
            onInputChange={setNewObservation}
            onAdd={() =>
              addItem(
                newObservation,
                setNewObservation,
                observations,
                setObservations
              )
            }
            placeholder="e.g., BP 140/90, Weight 82kg"
            bgColor="bg-cyan-500/10"
          />

          {/* AI Summary */}
          {summary && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="size-4 text-emerald-400" />
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
                    <Pencil className="size-3" />
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
                      <Check className="size-3" />
                      Save
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={cancelEdit}
                      className="h-7 gap-1.5 text-muted-foreground"
                    >
                      <X className="size-3" />
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
                <Loader2 className="size-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                {summary ? "Regenerate Summary" : "Generate AI Summary"}
              </>
            )}
          </Button>

          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
          >
            <Check className="size-4" />
            Save & Complete
          </Button>
        </div>
      </div>
    </div>
  );
}

function ClinicalSection({
  icon,
  title,
  items,
  onRemove,
  inputValue,
  onInputChange,
  onAdd,
  placeholder,
  bgColor,
}: {
  icon: React.ReactNode;
  title: string;
  items: ClinicalItem[];
  onRemove: (index: number) => void;
  inputValue: string;
  onInputChange: (v: string) => void;
  onAdd: () => void;
  placeholder: string;
  bgColor: string;
}) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      onAdd();
    }
  }

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold">
        <span className={`flex size-5 items-center justify-center rounded-md ${bgColor}`}>
          {icon}
        </span>
        {title}
      </label>

      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-xs"
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="ml-0.5 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-9 bg-background/50 text-sm"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          disabled={!inputValue.trim()}
          className="h-9 gap-1 px-3"
        >
          <Plus className="size-3.5" />
          Add
        </Button>
      </div>
    </div>
  );
}
