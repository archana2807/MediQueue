import { NextRequest, NextResponse } from "next/server";

import {
  getQueueList,
  getQueueCount,
} from "@/lib/queries/queue";

export async function GET(
  request: NextRequest
) {
  try {
    const searchParams =
      request.nextUrl.searchParams;

    const search =
      searchParams.get("search") || "";

    const page = Number(
      searchParams.get("page") || 1
    );

    const limit = Number(
      searchParams.get("limit") || 5
    );

    const offset =
      (page - 1) * limit;

    const queue =
      await getQueueList(
        search,
        limit,
        offset
      );

    const total =
      await getQueueCount(
        search
      );

    return NextResponse.json({
      success: true,
      data: queue,
      total,
      page,
      limit,
      totalPages: Math.ceil(
        total / limit
      ),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch queue",
      },
      {
        status: 500,
      }
    );
  }
}