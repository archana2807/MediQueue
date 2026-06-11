import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { query } from "@/lib/db";

export async function POST(
  req: NextRequest
) {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = await req.json();

    if (
      !name ||
      !email ||
      !phone ||
      !password
    ) {
      return NextResponse.json(
        {
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
        SELECT *
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
          message:
            "User already exists",
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
        'PATIENT'
      )
      `,
      [
        name,
        email,
        phone,
        hashedPassword,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "User registered successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}