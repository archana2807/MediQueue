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
  date: string
) {
  return new Date(date).toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );
}

export function getStatusClass(
  status: string
) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";

    case "CONFIRMED":
      return "bg-blue-100 text-blue-800 border-blue-200";

    case "IN_PROGRESS":
      return "bg-purple-100 text-purple-800 border-purple-200";

    case "COMPLETED":
      return "bg-green-100 text-green-800 border-green-200";

    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-200";

    default:
      return "bg-muted text-muted-foreground";
  }
}