"use client";

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
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
type Props = {
  id: string;
  
  disabled?: boolean;
};

export default function DeleteAppointmentButton({
  id,
  
  disabled,
}: Props) {

  const queryClient =
  useQueryClient();

  const deleteAppointment =
  useMutation({
    mutationKey: [
      "deleteAppointment",
    ],

    mutationFn: async () => {
      const response =
        await fetch(
          `/api/appointments/${id}`,
          {
            method: "DELETE",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete appointment"
        );
      }

      return result;
    },

    onSuccess: () => {
      toast.success(
        "Appointment deleted successfully"
      );

      queryClient.invalidateQueries({
        queryKey: [
          "appointments",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "dashboard",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["queue"],
      });
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    },
  });

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
            onClick={() =>
  deleteAppointment.mutate()
}
            disabled={
  deleteAppointment.isPending
}
            className="bg-red-500 hover:bg-red-600"
          >
           {deleteAppointment.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            {deleteAppointment.isPending
  ? "Deleting..."
  : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
