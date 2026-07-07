import { NextRequest, NextResponse } from "next/server";
import { createDraft, getDrafts } from "@/lib/queries/drafts";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");

    if (!patientId) {
      return NextResponse.json(
        {
          success: false,
          message: "patientId query parameter is required",
        },
        { status: 400 }
      );
    }

    const drafts = await getDrafts(patientId);

    return NextResponse.json({
      success: true,
      data: drafts,
    });
  } catch (error) {
    console.error("DRAFTS FETCH ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch drafts",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, taskType, content, evidenceReferences } =
      body;

    if (!patientId || !taskType || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "patientId, taskType, and content are required",
        },
        { status: 400 }
      );
    }

    const draft = await createDraft(
      patientId,
      taskType,
      content,
      evidenceReferences || []
    );

    return NextResponse.json(
      {
        success: true,
        data: draft,
        message: "Draft saved successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("DRAFT SAVE ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save draft",
      },
      { status: 500 }
    );
  }
}
