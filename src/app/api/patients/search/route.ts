import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getPatientByPhone,
} from "@/lib/queries/users";

export async function GET(
  request: NextRequest
) {
  try {
    const phone =
      request.nextUrl.searchParams.get(
        "phone"
      );

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Phone required",
        },
        {
          status: 400,
        }
      );
    }

    const patient =
      await getPatientByPhone(
        phone
      );

    return NextResponse.json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to search patient",
      },
      {
        status: 500,
      }
    );
  }
}