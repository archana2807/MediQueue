import DashboardCounts from "@/components/dashboard/dashboard-counts";
import RecentAppointmentsTable from "@/components/dashboard/recent-appointments-card";

import { getDashboardData } from "@/lib/queries/dashboard";

export default async function DashboardPage() {
  const data =
    await getDashboardData();

  return (
    <div className="space-y-4">
      <DashboardCounts
        stats={data.stats}
      />

      <RecentAppointmentsTable
        appointments={
          data.recentAppointments
        }
      />
    </div>
  );
}