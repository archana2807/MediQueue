import { NextRequest, NextResponse } from "next/server";
import { getPatients, getPatientsCount } from "@/lib/queries/users";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const offset = (page - 1) * limit;

    const patients = await getPatients(search, limit, offset);
    const total = await getPatientsCount(search);

    return NextResponse.json({
      success: true,
      data: patients,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch patients",
      },
      { status: 500 }
    );
  }
}
