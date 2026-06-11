import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "@/lib/queries/appointments";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const { id } =
    await params;

  const appointment =
    await getAppointmentById(
      id
    );

  return NextResponse.json({
    success: true,
    data: appointment,
  });
}

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await params;

    const body =
      await request.json();

    const appointment =
  await updateAppointment(
    id,
    body.patient_id,
    body.patient_phone,
    body.doctor_id,
    body.appointment_date,
    body.status
  );

    return NextResponse.json({
      success: true,
      data: appointment,
      message:
        "Appointment updated successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update appointment",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await params;

    await deleteAppointment(id);

    return Response.json({
      success: true,
      message:
        "Appointment deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message:
          "Failed to delete appointment",
      },
      {
        status: 500,
      }
    );
  }
}