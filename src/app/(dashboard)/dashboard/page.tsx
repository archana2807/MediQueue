import {
  CalendarDays,
  Clock3,
  Stethoscope,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Total Appointments
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">24</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Today's Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">18</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Doctors Available
            </CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">6</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Queue Waiting
            </CardTitle>
            <Clock3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">7</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>
            Recent Appointments
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">
                  Rahul Sharma
                </p>
                <p className="text-sm text-muted-foreground">
                  General Consultation
                </p>
              </div>

              <span className="text-sm">
                10:30 AM
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">
                  Priya Patel
                </p>
                <p className="text-sm text-muted-foreground">
                  ENT Specialist
                </p>
              </div>

              <span className="text-sm">
                11:15 AM
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  Amit Kumar
                </p>
                <p className="text-sm text-muted-foreground">
                  Follow-up Visit
                </p>
              </div>

              <span className="text-sm">
                12:00 PM
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}