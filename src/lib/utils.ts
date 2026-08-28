import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(
  ...inputs: ClassValue[]
) {
  return twMerge(
    clsx(inputs)
  );
}

export function formatDateTime(
  dateStr: string
) {
  return new Date(dateStr).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function getStatusClass(
  status: string
) {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800";

    case "CONFIRMED":
      return "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/50 dark:text-teal-400 dark:border-teal-800";

    case "CHECKED_IN":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800";

    case "WAITING":
      return "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950/50 dark:text-violet-400 dark:border-violet-800";

    case "IN_PROGRESS":
      return "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-400 dark:border-cyan-800";

    case "COMPLETED":
      return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800";

    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800";

    default:
      return "bg-muted text-muted-foreground";
  }
}