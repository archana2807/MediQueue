import { NextRequest, NextResponse } from "next/server";

import {
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "@/lib/queries/doctors";

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await context.params;

  const doctor = await getDoctorById(id);

  return NextResponse.json({
    success: true,
    data: doctor,
  });
}

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } =
    await context.params;

  const body =
    await request.json();

  const doctor =
    await updateDoctor(
      id,
      body.name,
      body.specialization,
      body.email,
      body.phone
    );

  return NextResponse.json({
    success: true,
    data: doctor,
  });
}

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await context.params;

  const deletedDoctor =
    await deleteDoctor(id);

  return NextResponse.json({
    success: true,
    data: deletedDoctor,
  });
}