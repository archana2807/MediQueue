import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/queries/dashboard";

export async function GET() {
  try {
    const data =
      await getDashboardData();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load dashboard",
      },
      { status: 500 }
    );
  }
}