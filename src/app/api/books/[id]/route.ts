import { NextRequest, NextResponse } from "next/server";
import { books } from "@/data/books";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const book = books.find((b) => b.id === id);

  if (!book) {
    return NextResponse.json(
      { error: "Book not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(book);
}
