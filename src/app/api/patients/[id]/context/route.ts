import { NextResponse } from "next/server";
import { getPatientContext } from "@/lib/queries/patient-context";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await getPatientContext(id);

    if (!context) {
      return NextResponse.json(
        {
          success: false,
          message: "Patient not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: context,
    });
  } catch (error) {
    console.error("PATIENT CONTEXT ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch patient context",
      },
      { status: 500 }
    );
  }
}
