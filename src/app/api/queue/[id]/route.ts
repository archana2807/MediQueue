import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  updateQueueStatus,
} from "@/lib/queries/queue";

import {
  createAppointmentNote,
} from "@/lib/queries/appointment-notes";

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

    const queue =
      await updateQueueStatus(
        id,
        body.status
      );

    if (
      body.status ===
      "COMPLETED"
    ) {
      await createAppointmentNote(
        id,
        body.doctor_notes || "",
        body.ai_summary || ""
      );
    }

    return NextResponse.json({
      success: true,
      data: queue,
      message:
        body.status ===
        "COMPLETED"
          ? "Appointment completed successfully"
          : "Queue status updated successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update queue status",
      },
      {
        status: 500,
      }
    );
  }
}