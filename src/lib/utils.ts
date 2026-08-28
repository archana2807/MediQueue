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
  // Parse timestamp manually as IST to avoid JS Date interpreting as UTC
  // Matches both "2026-08-28 15:00:00" and "2026-08-28T15:00:00.000Z"
  const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})[T\s]+(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!match) {
    return dateStr;
  }
  const [, y, mo, d, h, mi] = match;
  const hour = parseInt(h);
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${d} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(mo)-1]} ${y}, ${String(h12).padStart(2,"0")}:${mi} ${period}`;
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