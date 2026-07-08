import { NextResponse } from "next/server";
import { MODEL } from "@/lib/ai/model";
import { openai } from "@/lib/ai/client";

export async function POST(request: Request) {
  try {
    const { notes } = await request.json();

    if (!notes?.trim()) {
      return NextResponse.json(
        { success: false, message: "Notes are required" },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `Extract structured clinical data from the doctor's notes. Return a JSON object with these fields:
- conditions: array of condition/diagnosis strings (e.g., "Hypertension", "Type 2 Diabetes")
- medications: array of medication strings with dosage if mentioned (e.g., "Metformin 500mg twice daily")
- allergies: array of allergy strings (e.g., "Penicillin", "Aspirin")
- observations: array of clinical observation strings (e.g., "BP 140/90", "Heart Rate 88 bpm", "Temperature 101°F")

Only include items that are clearly stated or strongly implied in the notes. Return ONLY valid JSON, no markdown.`,
        },
        {
          role: "user",
          content: `Extract clinical data from these notes:\n\n${notes}`,
        },
      ],
      temperature: 0.1,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || "";

    let data;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      data = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
    } catch {
      return NextResponse.json(
        { success: false, message: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        conditions: Array.isArray(data.conditions) ? data.conditions : [],
        medications: Array.isArray(data.medications) ? data.medications : [],
        allergies: Array.isArray(data.allergies) ? data.allergies : [],
        observations: Array.isArray(data.observations) ? data.observations : [],
      },
    });
  } catch (error) {
    console.error("EXTRACT CLINICAL ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to extract clinical data" },
      { status: 500 }
    );
  }
}
