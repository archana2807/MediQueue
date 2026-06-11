// components/dashboard/dashboard-counts.tsx

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

export default function DashboardCounts({
  stats,
}: Props) {
  const cards = [
    {
      title: "Appointments",
      value: stats.totalAppointments,
      icon: CalendarDays,
    },
    {
      title: "Today's Patients",
      value: stats.todaysPatients,
      icon: Users,
    },
    {
      title: "Doctors",
      value: stats.doctorsAvailable,
      icon: Stethoscope,
    },
    {
      title: "Queue Waiting",
      value: stats.queueWaiting,
      icon: Clock3,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title}>
            <CardContent className="flex items-center justify-between p-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  {card.title}
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {card.value}
                </h3>
              </div>

              <Icon className="h-6 w-6" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}