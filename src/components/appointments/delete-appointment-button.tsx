"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
  id: string;
  onSuccess?: () => void;
  disabled?: boolean;
};

export default function DeleteAppointmentButton({
  id,
  onSuccess,
  disabled,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to delete appointment");
        return;
      }

      toast.success("Appointment deleted successfully");
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          disabled={disabled}
          className={`h-8 w-8 ${disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-red-500/10"}`}
          title={disabled ? "Cannot delete in current status" : "Delete Appointment"}
        >
          <Trash2 className="h-4 w-4 text-red-400" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove the
            appointment from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
