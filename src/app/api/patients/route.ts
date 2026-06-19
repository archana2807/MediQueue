import { NextResponse } from "next/server";

import { getPatients } from "@/lib/queries/users";

export async function GET() {
  try {
    const patients =
      await getPatients();

    return NextResponse.json({
      success: true,
      data: patients,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch patients",
      },
      {
        status: 500,
      }
    );
  }
}