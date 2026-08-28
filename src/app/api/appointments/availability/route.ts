import { NextRequest, NextResponse } from "next/server";
import { getDoctorAppointments } from "@/lib/queries/appointments";

const ALL_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export async function GET(
  request: NextRequest
) {
  try {
    const doctorId =
      request.nextUrl.searchParams.get(
        "doctorId"
      );

    const date =
      request.nextUrl.searchParams.get(
        "date"
      );

    if (!doctorId || !date) {
      return NextResponse.json({
        availableSlots: [],
        bookedSlots: [],
      });
    }

    console.log("Doctor:", doctorId);
    console.log("Date:", date);

    const appointments =
      await getDoctorAppointments(
        doctorId,
        date
      );

    console.log(
      "Appointments:",
      appointments
    );

    const bookedSlots =
      appointments.map((a) => {
        const d = new Date(
          a.appointment_date
        );

        return d
          .toLocaleTimeString("en-GB", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
      });

    const availableSlots =
      ALL_SLOTS.filter(
        (slot) =>
          !bookedSlots.includes(slot)
          );
      

    return NextResponse.json({
      availableSlots,
      bookedSlots,
    });
  } catch (error) {
    console.error(
      "AVAILABILITY ERROR:",
      error
    );

    return NextResponse.json(
      {
        availableSlots: [],
        bookedSlots: [],
        error: "Failed to load slots",
      },
      {
        status: 500,
      }
    );
  }
}