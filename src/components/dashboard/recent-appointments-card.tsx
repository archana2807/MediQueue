// components/dashboard/recent-appointments-table.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  appointments: any[];
};

export default function RecentAppointmentsTable({
  appointments,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Recent Appointments
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">
                  Patient
                </th>

                <th className="py-2 text-left">
                  Doctor
                </th>

                <th className="py-2 text-left">
                  Status
                </th>

                <th className="py-2 text-left">
                  Queue
                </th>

                <th className="py-2 text-left">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {appointments.map(
                (appointment) => (
                  <tr
                    key={
                      appointment.id
                    }
                    className="border-b"
                  >
                    <td className="py-3">
                      {
                        appointment.patient_name
                      }
                    </td>

                    <td className="py-3">
                      {
                        appointment.doctor_name
                      }
                    </td>

                    <td className="py-3">
                      {
                        appointment.status
                      }
                    </td>

                    <td className="py-3">
                      #
                      {
                        appointment.queue_number
                      }
                    </td>

                    <td className="py-3">
                      {new Date(
                        appointment.appointment_date
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}