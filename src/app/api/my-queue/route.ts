import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDoctorByUserId } from "@/lib/queries/doctors";
import { pool } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const doctor = await getDoctorByUserId(session.user.id);

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor profile not found" },
        { status: 404 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const date = searchParams.get("date") || "";
    const offset = (page - 1) * limit;

    let whereClause = `
      a.doctor_id = $1
        AND a.status IN ('CHECKED_IN', 'WAITING', 'IN_PROGRESS')
        AND (
          u.name ILIKE $2
          OR u.phone ILIKE $2
        )
    `;
    const params: (string | number)[] = [doctor.id, `%${search}%`];
    let paramIndex = 3;

    if (date) {
      whereClause += ` AND DATE(a.appointment_date) = $${paramIndex}`;
      params.push(date);
      paramIndex++;
    }

    const result = await pool.query(
      `
      SELECT
        a.id,
        a.queue_number,
        a.status,
        a.appointment_date,
        a.patient_id,
        u.name AS patient_name,
        u.phone AS patient_phone
      FROM appointments a
      LEFT JOIN users u ON a.patient_id = u.id
      WHERE ${whereClause}
      ORDER BY a.queue_number ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `,
      [...params, limit, offset]
    );

    const countResult = await pool.query(
      `
      SELECT COUNT(*)::int AS count
      FROM appointments a
      LEFT JOIN users u ON a.patient_id = u.id
      WHERE ${whereClause}
      `,
      params
    );

    const total = countResult.rows[0].count;

    return NextResponse.json({
      success: true,
      data: result.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("MY QUEUE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch queue" },
      { status: 500 }
    );
  }
}
