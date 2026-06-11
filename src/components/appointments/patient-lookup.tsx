"use client";

import { useState } from "react";

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
  const [phone, setPhone] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [patientFound, setPatientFound] =
    useState(false);

  const searchPatient =
    async () => {
      if (!phone.trim()) {
        toast.error(
          "Enter phone number"
        );
        return;
      }

      try {
        setLoading(true);

        const response =
          await fetch(
            `/api/patients/search?phone=${phone}`
          );

        const result =
          await response.json();

        if (result.data) {
          const patient: Patient =
            result.data;

          setPatientFound(
            true
          );

          onPatientSelect({
            patientId:
              patient.id,

            patientName:
              patient.name,

            patientPhone:
              patient.phone,
          });

          toast.success(
            "Patient found"
          );
        } else {
          setPatientFound(
            false
          );

          onPatientSelect({
            patientId:
              undefined,

            patientName:
              "",

            patientPhone:
              phone,
          });

          toast.info(
            "Patient not found. Create new patient."
          );
        }
      } catch (error) {
        console.error(
          error
        );

        toast.error(
          "Search failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <Field>
        <FieldLabel>
          Mobile Number
        </FieldLabel>

        <div className="flex gap-2">
          <Input
            value={phone}
            placeholder="Enter phone number"
            onChange={(
              e
            ) =>
              setPhone(
                e.target
                  .value
              )
            }
          />

          <Button
            type="button"
            variant="outline"
            onClick={
              searchPatient
            }
          >
            {loading
              ? "Searching..."
              : "Search"}
          </Button>
        </div>
      </Field>

      {patientFound && (
        <p className="text-sm text-green-600">
          Existing patient found
        </p>
      )}
    </div>
  );
}