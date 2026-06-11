"use client";

import { useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type Props = {
  appointmentId: string;
  status: string;
  onSuccess: () => void;
  onComplete: (
    appointmentId: string
  ) => void;
};

export default function QueueActions({
   appointmentId,
  status,
  onSuccess,
  onComplete,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  async function updateStatus(
    newStatus: string
  ) {
    try {
      setLoading(true);

      const response =
        await fetch(
          `/api/queue/${appointmentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              status: newStatus,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        toast.error(
          result.message ||
            "Failed to update queue"
        );
        return;
      }

      toast.success(
        "Queue updated successfully"
      );

      onSuccess();
    } catch (error) {
      console.error(error);

      toast.error(
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      {status ===
        "CONFIRMED" && (
        <Button
          size="sm"
          disabled={loading}
          onClick={() =>
            updateStatus(
              "IN_PROGRESS"
            )
          }
        >
          Call Patient
        </Button>
      )}

      {status ===
        "IN_PROGRESS" && (
        <Button
          size="sm"
          variant="default"
          disabled={loading}
          onClick={() =>
  onComplete(
    appointmentId
  )
}
        >
          Complete
        </Button>
      )}
    </div>
  );
}