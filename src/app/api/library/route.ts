import { NextResponse } from "next/server";
import { libraryBooks, purchaseHistory } from "@/data/library";

export async function GET() {
  return NextResponse.json({
    books: libraryBooks,
    purchaseHistory,
  });
}
