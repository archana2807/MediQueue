import { NextRequest, NextResponse } from "next/server";

import {
  getAppointments,
  getAppointmentsCount,
  createAppointment,
} from "@/lib/queries/appointments";

export async function GET(
  request: NextRequest
) {
  try {
    const searchParams =
      request.nextUrl.searchParams;

    const search =
      searchParams.get("search") || "";

    const page = Number(
      searchParams.get("page") || 1
    );

    const limit = Number(
      searchParams.get("limit") || 5
    );

    const offset =
      (page - 1) * limit;

    const appointments =
      await getAppointments(
        search,
        limit,
        offset
      );

    const total =
      await getAppointmentsCount(
        search
      );

    return NextResponse.json({
      success: true,
      data: appointments,
      total,
      page,
      limit,
      totalPages: Math.ceil(
        total / limit
      ),
    });
  } catch (error) {
    console.error(error);

  return NextResponse.json(
    {
      success: false,
      error: String(error),
    },
    {
      status: 500,
    }
  );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const appointment =
  await createAppointment(
     body.patient_id ?? null,
  body.patient_name ?? null,
  body.patient_phone ?? null,
  body.doctor_id,
  body.appointment_date,
  // body.queue_number,
  body.status
  );

    return NextResponse.json(
      {
        success: true,
        data: appointment,
        message:
          "Appointment created successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create appointment",
      },
      {
        status: 500,
      }
    );
  }
}