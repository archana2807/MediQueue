import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDoctorByUserId } from "@/lib/queries/doctors";
import { getPatientsByDoctorId, getPatientsByDoctorCount } from "@/lib/queries/users";

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

    const patients = await getPatientsByDoctorId(doctor.id, search, limit, offset);
    const total = await getPatientsByDoctorCount(doctor.id, search);

    return NextResponse.json({
      success: true,
      data: patients,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("MY PATIENTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}
