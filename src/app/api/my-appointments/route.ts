import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDoctorByUserId } from "@/lib/queries/doctors";
import {
  getAppointmentsByDoctorId,
  getAppointmentsByDoctorCount,
} from "@/lib/queries/appointments";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const doctor = await getDoctorByUserId(session.user.id);

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor profile not found" },
        { status: 404 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const offset = (page - 1) * limit;

    const appointments = await getAppointmentsByDoctorId(
      doctor.id,
      search,
      limit,
      offset
    );

    const total = await getAppointmentsByDoctorCount(
      doctor.id,
      search
    );

    return NextResponse.json({
      success: true,
      data: appointments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("MY APPOINTMENTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
