// components/dashboard/recent-appointments-table.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock,
} from "lucide-react";

type Props = {
  appointments: any[];
};

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-400 dark:border-teal-800",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-400 dark:border-cyan-800",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800",
  },
};

export default function RecentAppointmentsTable({
  appointments,
}: Props) {
  return (
    <Card className="border-border/50 animate-fade-in stagger-5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <CalendarDays className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-lg">Recent Appointments</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {appointments.length} appointment{appointments.length !== 1 ? "s" : ""}
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="pb-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Patient
                </th>
                <th className="pb-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Doctor
                </th>
                <th className="pb-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="pb-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Queue
                </th>
                <th className="pb-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment, index) => {
                const statusInfo = statusConfig[appointment.status] || {
                  label: appointment.status,
                  className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
                };

                return (
                  <tr
                    key={appointment.id}
                    className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="py-3.5">
                      <p className="font-medium text-foreground">
                        {appointment.patient_name}
                      </p>
                    </td>

                    <td className="py-3.5">
                      <p className="text-sm text-muted-foreground">
                        {appointment.doctor_name}
                      </p>
                    </td>

                    <td className="py-3.5">
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${statusInfo.className}`}
                      >
                        {statusInfo.label}
                      </Badge>
                    </td>

                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 text-sm font-mono text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        #{appointment.queue_number}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          appointment.appointment_date
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}