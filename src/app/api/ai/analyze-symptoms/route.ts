import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/ai/client";
import { MODEL } from "@/lib/ai/model";
import { pool } from "@/lib/db";



export async function POST(request: NextRequest) {
  try {
    const { symptoms } = await request.json();

    if (!symptoms || symptoms.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Symptoms are required" },
        { status: 400 }
      );
    }

    const doctorsResult = await pool.query(`
      SELECT
        d.id,
        d.specialization,
        u.name
      FROM doctors d
      JOIN users u ON u.id = d.user_id
      ORDER BY u.name
    `);

    const doctors = doctorsResult.rows;

    if (doctors.length === 0) {
      return NextResponse.json(
        { success: false, message: "No doctors available" },
        { status: 404 }
      );
    }

    const doctorList = doctors
      .map((d) => `${d.id}|${d.name}|${d.specialization}`)
      .join("\n");

    const response = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0,
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content: `You are a medical triage assistant.

Determine ONLY the most appropriate medical specialization.

Available specializations:
${[...new Set(doctors.map(d => d.specialization))].join(", ")}

Return ONLY valid JSON:

{
  "department": "specialization name",
  "reason": "brief reason"
}

Rules:
- Recommend only the department.
- Do NOT return doctor names.
- Do NOT return doctor ids.
- Never diagnose diseases.
- Return JSON only.
`,
        },
        {
          role: "user",
          content: `Patient symptoms: ${symptoms}`,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { success: false, message: "No AI response" },
        { status: 500 }
      );
    }

let parsed: {
  department: string;
  reason: string;
    };
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid AI response format" },
        { status: 500 }
      );
    }

    // const doctorExists = doctors.find((d) => d.id === parsed.doctorId);
    // if (!doctorExists) {
    //   return NextResponse.json(
    //     { success: false, message: "Recommended doctor not found" },
    //     { status: 500 }
    //   );
    // }

    const today = new Date().toISOString().split("T")[0];

   

   const allDoctorsInDept =
  doctors.filter(
    (d) =>
      d.specialization
        .trim()
        .toUpperCase() ===
      parsed.department
        .trim()
        .toUpperCase()
  );

    const departmentDoctors = await Promise.all(
      allDoctorsInDept.map(async (d) => {
        const wl = await pool.query(
          `SELECT COUNT(*)::int AS count FROM appointments WHERE doctor_id = $1 AND DATE(appointment_date) = DATE($2)`,
          [d.id, today]
        );
        return {
          id: d.id,
          name: d.name,
          specialization: d.specialization,
          currentLoad: wl.rows[0].count,
          estimatedWait: wl.rows[0].count * 15,
        };
      })
    );

    departmentDoctors.sort(
  (a, b) =>
    a.currentLoad -
    b.currentLoad
    );
    const recommendedDoctor =
      departmentDoctors[0];
    if (!recommendedDoctor) {
  return NextResponse.json(
    {
      success: false,
      message:
        "No doctors found for this department",
    },
    {
      status: 404,
    }
  );
}

    return NextResponse.json({
      success: true,
      data: {
        department: parsed.department,
       recommendedDoctor: {
  id: recommendedDoctor.id,
  name: recommendedDoctor.name,
  currentLoad:
    recommendedDoctor.currentLoad,
  estimatedWait:
    recommendedDoctor.estimatedWait,
  reason: parsed.reason,
},
        departmentDoctors,
      },
    });
  } catch (error) {
    console.error("Symptom analysis error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to analyze symptoms" },
      { status: 500 }
    );
  }
}
