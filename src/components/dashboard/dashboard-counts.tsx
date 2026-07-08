import {
  CalendarDays,
  Clock3,
  Stethoscope,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

type Props = {
  stats: {
    totalAppointments: number;
    todaysPatients: number;
    doctorsAvailable: number;
    queueWaiting: number;
  };
};

const cardConfig = [
  {
    title: "Appointments",
    key: "totalAppointments" as const,
    icon: CalendarDays,
    gradient: "from-emerald-500 to-emerald-600",
    lightBg: "bg-emerald-50 dark:bg-emerald-950/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Today's Patients",
    key: "todaysPatients" as const,
    icon: Users,
    gradient: "from-teal-500 to-teal-600",
    lightBg: "bg-teal-50 dark:bg-teal-950/50",
    iconColor: "text-teal-600 dark:text-teal-400",
  },
  {
    title: "Doctors Available",
    key: "doctorsAvailable" as const,
    icon: Stethoscope,
    gradient: "from-cyan-500 to-cyan-600",
    lightBg: "bg-cyan-50 dark:bg-cyan-950/50",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
  {
    title: "Queue Waiting",
    key: "queueWaiting" as const,
    icon: Clock3,
    gradient: "from-emerald-600 to-teal-500",
    lightBg: "bg-emerald-50 dark:bg-emerald-950/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
];

export default function DashboardCounts({
  stats,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cardConfig.map((card, index) => {
        const Icon = card.icon;
        const value = stats[card.key];

        return (
          <Card
            key={card.title}
            className={`relative overflow-hidden border-border/50 hover:shadow-md transition-all duration-300 hover:scale-[1.02] animate-fade-in-up stagger-${index + 1}`}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold tracking-tight">
                    {value}
                  </p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.lightBg} ${card.iconColor}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              {/* Subtle bottom accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} opacity-60`} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}