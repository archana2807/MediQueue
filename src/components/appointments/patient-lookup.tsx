"use client";

import { useState } from "react";
import { Search, Loader2, CheckCircle2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Field,
  FieldLabel,
} from "@/components/ui/field";

import { toast } from "sonner";

type Patient = {
  id: string;
  name: string;
  phone: string;
};

type Props = {
  onPatientSelect: (
    patient: {
      patientId?: string;
      patientName: string;
      patientPhone: string;
    }
  ) => void;
};

export default function PatientLookup({
  onPatientSelect,
}: Props) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [patientFound, setPatientFound] = useState(false);

  // Added check state to conditionally render different visual helper banners
  const [hasSearched, setHasSearched] = useState(false);

  const searchPatient = async () => {
    if (!phone.trim()) {
      toast.error("Enter phone number");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/patients/search?phone=${phone}`
      );

      const result = await response.json();
      setHasSearched(true);

      if (result.data) {
        const patient: Patient = result.data;

        setPatientFound(true);

        onPatientSelect({
          patientId: patient.id,
          patientName: patient.name,
          patientPhone: patient.phone,
        });

        toast.success("Patient found");
      } else {
        setPatientFound(false);

        onPatientSelect({
          patientId: undefined,
          patientName: "",
          patientPhone: phone,
        });

        toast.info("Patient not found. Create new patient.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-border/80 bg-background/50 p-5 shadow-sm">
      <Field className="space-y-2">
        <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Patient Verification
        </FieldLabel>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="tel"
              value={phone}
              placeholder="Enter phone number"
              className="pl-9 bg-background focus-visible:ring-primary"
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  searchPatient();
                }
              }}
              
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
          </div>

          <Button
            type="button"
            variant="default"
            className="shadow-sm min-w-[100px] transition-all"
            disabled={loading}
            onClick={searchPatient}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Searching
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </Field>

      {/* Replaced raw strings with modern context status alerts */}
      {hasSearched && (
        <div className="pt-1">
          {patientFound ? (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0 stroke-[2.5]" />
              <span>Verified customer registry profile found.</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400">
              <UserPlus className="h-4 w-4 shrink-0 stroke-[2.5]" />
              <span>No profile match. Ready to record new entry registry details.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}