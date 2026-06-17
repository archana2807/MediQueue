"use client";


import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMutation,useQueryClient } from "@tanstack/react-query";

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
};

export default function DeleteDoctorButton({
  id,
}: Props) {
  const router = useRouter();

  const queryClient = useQueryClient();
  const deleteDoctor = useMutation({
  mutationFn: async () => {
    const response = await fetch(
      `/api/doctors/${id}`,
      {
        method: "DELETE",
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
        "Failed to delete doctor"
      );
    }

    return result;
  },

  onSuccess: () => {
    toast.success(
      "Doctor deleted successfully"
    );

    queryClient.invalidateQueries({
      queryKey: ["doctors"],
    });

    router.refresh();
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
          className="h-8 w-8 hover:bg-red-500/10"
          title="Delete Doctor"
        >
          <Trash2 className="h-4 w-4 text-red-400" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Doctor</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove the doctor
            from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteDoctor.mutate()}
           disabled={deleteDoctor.isPending}
            className="bg-red-500 hover:bg-red-600"
          >
            {deleteDoctor.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
           {deleteDoctor.isPending ?"Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
