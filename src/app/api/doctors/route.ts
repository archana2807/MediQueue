import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { query } from "@/lib/db";

import {
  getDoctors,
  createDoctor,
  getDoctorsCount,
} from "@/lib/queries/doctors";

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

    const doctors =
      await getDoctors(
        search,
        limit,
        offset
      );

    const total =
      await getDoctorsCount(
        search
      );

    return NextResponse.json({
      success: true,
      data: doctors,
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
          "Failed to fetch doctors",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const {
      name,
      email,
      phone,
      password,
      specialization,
    } = body;

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !specialization
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser =
      await query(
        `
        SELECT id
        FROM users
        WHERE email = $1
        `,
        [email]
      );

    if (
      existingUser.rows.length > 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email already exists",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await query(
        `
        INSERT INTO users (
          name,
          email,
          phone,
          password,
          role
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          'DOCTOR'
        )
        RETURNING id
        `,
        [
          name,
          email,
          phone,
          hashedPassword,
        ]
      );

    const userId =
      user.rows[0].id;

    const doctor =
      await createDoctor(
        userId,
        specialization
      );

    return NextResponse.json(
      {
        success: true,
        data: doctor,
        message:
          "Doctor created successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create doctor",
      },
      {
        status: 500,
      }
    );
  }
}