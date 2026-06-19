"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Phone, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  appointmentId: string;
  status: string;
  onSuccess: () => void;
  onComplete: (appointmentId: string) => void;
};

export default function QueueActions({
  appointmentId,
  status,
  onSuccess,
  onComplete,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    try {
      setLoading(true);
      const response = await fetch(`/api/queue/${appointmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to update queue");
        return;
      }

      toast.success("Queue updated successfully");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      {status === "CONFIRMED" && (
        <Button
          size="icon"
          variant="ghost"
          disabled={loading}
          onClick={() => updateStatus("CHECKED_IN")}
          className="h-8 w-8 hover:bg-blue-500/10"
          title="Check In Patient"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
          ) : (
            <Phone className="h-4 w-4 text-blue-400" />
          )}
        </Button>
      )}

      {status === "CHECKED_IN" && (
        <Button
          size="icon"
          variant="ghost"
          disabled={loading}
          onClick={() => updateStatus("WAITING")}
          className="h-8 w-8 hover:bg-violet-500/10"
          title="Move to Waiting"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
          ) : (
            <Phone className="h-4 w-4 text-violet-400" />
          )}
        </Button>
      )}

      {status === "WAITING" && (
        <Button
          size="icon"
          variant="ghost"
          disabled={loading}
          onClick={() => updateStatus("IN_PROGRESS")}
          className="h-8 w-8 hover:bg-cyan-500/10"
          title="Call Patient"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
          ) : (
            <Phone className="h-4 w-4 text-cyan-400" />
          )}
        </Button>
      )}

      {status === "IN_PROGRESS" && (
        <Button
          size="icon"
          variant="ghost"
          disabled={loading}
          onClick={() => onComplete(appointmentId)}
          className="h-8 w-8 hover:bg-emerald-500/10"
          title="Complete Appointment"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        </Button>
      )}
    </div>
  );
}
