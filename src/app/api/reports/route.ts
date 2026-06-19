import { NextRequest, NextResponse } from "next/server";

import {
  createReport,
} from "@/lib/queries/reports";

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const report =
      await createReport(
        body.patientId,
        body.reportName,
        body.reportContent,
        body.aiAnalysis
      );

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to save report",
      },
      {
        status: 500,
      }
    );
  }
}