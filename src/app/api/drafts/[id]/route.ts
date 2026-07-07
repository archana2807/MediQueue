import { NextResponse } from "next/server";
import { deleteDraft } from "@/lib/queries/drafts";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteDraft(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Draft not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Draft deleted successfully",
    });
  } catch (error) {
    console.error("DRAFT DELETE ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete draft",
      },
      { status: 500 }
    );
  }
}
