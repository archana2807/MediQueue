import { NextResponse } from "next/server";
import { getPatientContext } from "@/lib/queries/patient-context";
import { openai } from "@/lib/ai/client";
import { MODEL } from "@/lib/ai/model";

const ALLOWED_TASKS = [
  "handover_summary",
  "patient_summary",
  "risk_flags",
  "missing_information",
] as const;

type AllowedTask = (typeof ALLOWED_TASKS)[number];

const TASK_LABELS: Record<AllowedTask, string> = {
  handover_summary: "Handover Summary",
  patient_summary: "Patient Summary for New Clinician",
  risk_flags: "Risk Flags Assessment",
  missing_information: "Missing Information Analysis",
};

const TASK_PROMPTS: Record<AllowedTask, string> = {
  handover_summary: `Write a brief handover in this exact format (no extra text):

**Status:** [one line]
**Problems:** [comma-separated list]
**Meds:** [comma-separated list]
**Allergies:** [comma-separated list]
**Concerns:** [2-3 items, one line each]`,

  patient_summary: `Write a brief patient summary in this exact format (no extra text):

**Overview:** [one line]
**Conditions:** [comma-separated list]
**Meds:** [comma-separated list]
**Allergies:** [comma-separated list]
**Watch for:** [2-3 items]`,

  risk_flags: `List top 3 risks only, one line each:
- [Risk]: [severity] - [one line reason]`,

  missing_information: `List top 3 missing items only, one line each:
- [What's missing]: [why it matters]`,
};

function isAllowedTask(
  task: string
): task is AllowedTask {
  return ALLOWED_TASKS.includes(task as AllowedTask);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { taskType } = body;

    if (!taskType || !isAllowedTask(taskType)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid task type. Allowed: ${ALLOWED_TASKS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const context = await getPatientContext(id);
    if (!context) {
      return NextResponse.json(
        {
          success: false,
          message: "Patient not found",
        },
        { status: 404 }
      );
    }

    const contextForAgent = {
      patientOneLiner: context.patientOneLiner,
      activeProblems: context.activeProblems,
      currentMedications: context.currentMedications,
      allergies: context.allergies,
      relevantObservations: context.relevantObservations,
      riskFlags: context.riskFlags,
      missingInformation: context.missingInformation,
      evidenceReferences: context.evidenceReferences,
    };

    let draftOutput: string;
    let usedMock = false;

    if (process.env.OPENROUTER_API_KEY) {
      const response = await openai.chat.completions.create({
        model: MODEL,
        temperature: 0.3,
        max_tokens: 400,
        messages: [
          {
            role: "system",
            content: `You are a clinical agent. Output ONLY what is requested, nothing else. Be extremely brief. No extra sections, no disclaimers, no headers.`,
          },
          {
            role: "user",
            content: `${TASK_PROMPTS[taskType]}

PATIENT CONTEXT:
${JSON.stringify(contextForAgent, null, 2)}`,
          },
        ],
      });

      draftOutput =
        response.choices?.[0]?.message?.content || "";

      if (!draftOutput) {
        console.error("AGENT EMPTY RESPONSE:", JSON.stringify(response));
        draftOutput = "No output generated. Please try again.";
      }
    } else {
      draftOutput = generateMockOutput(
        taskType,
        contextForAgent
      );
      usedMock = true;
    }

    const agentResult = {
      taskRequested: TASK_LABELS[taskType],
      contextUsed: contextForAgent,
      stepsTaken: [
        "Retrieved patient context from database",
        usedMock
          ? "Generated mock output (no LLM key configured)"
          : "Called LLM with clinical context",
        "Validated output against allowed task types",
      ],
      draftOutput,
      evidenceReferences: context.evidenceReferences,
      missingInfo: context.missingInformation,
      disclaimer:
        "This output is AI-generated and must be reviewed by a qualified clinician before use in clinical decision-making. It is not a substitute for professional medical judgment.",
    };

    return NextResponse.json({
      success: true,
      data: agentResult,
    });
  } catch (error) {
    console.error("AGENT ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Agent processing failed",
      },
      { status: 500 }
    );
  }
}

function generateMockOutput(
  taskType: AllowedTask,
  context: Record<string, unknown>
): string {
  const patient = context.patientOneLiner as string;
  const problems =
    (context.activeProblems as string[]) || [];
  const meds =
    (context.currentMedications as string[]) || [];
  const allergies =
    (context.allergies as string[]) || [];
  const riskFlags =
    (context.riskFlags as string[]) || [];
  const missing =
    (context.missingInformation as string[]) || [];

  switch (taskType) {
    case "handover_summary":
      return `## Handover Summary

**Patient:** ${patient}

### Active Problems
${problems.length > 0 ? problems.map((p) => `- ${p}`).join("\n") : "- No active problems documented"}

### Current Medications
${meds.length > 0 ? meds.map((m) => `- ${m}`).join("\n") : "- No medications documented"}

### Allergies
${allergies.map((a) => `- ${a}`).join("\n")}

### Key Concerns
${riskFlags.length > 0 ? riskFlags.map((r) => `- ${r}`).join("\n") : "- No risk flags identified"}

### Recommendations
- Review and update medication list
- Ensure allergy documentation is current
- Address any outstanding follow-up items

---
*AI-Generated | Requires Clinician Review*`;

    case "patient_summary":
      return `## Patient Summary

**Patient:** ${patient}

### Overview
This patient has ${(context.recentVisits as unknown[])?.length || 0} recent visit(s) on record.

### Active Conditions
${problems.length > 0 ? problems.map((p) => `- ${p}`).join("\n") : "- Conditions not yet documented"}

### Medication Profile
${meds.length > 0 ? meds.map((m) => `- ${m}`).join("\n") : "- Medication profile not available"}

### Allergy Status
${allergies.map((a) => `- ${a}`).join("\n")}

### Points of Attention
${riskFlags.length > 0 ? riskFlags.map((r) => `- ${r}`).join("\n") : "- No immediate concerns flagged"}

---
*AI-Generated | Requires Clinician Review*`;

    case "risk_flags":
      return `## Risk Flags Assessment

**Patient:** ${patient}

### Identified Risk Flags
${riskFlags.length > 0 ? riskFlags.map((r) => `- **Flag:** ${r}`).join("\n") : "- No risk flags currently identified"}

### Clinical Observations
${(context.relevantObservations as string[])?.length > 0
      ? (context.relevantObservations as string[]).map((o) => `- ${o}`).join("\n")
      : "- No observations available for risk assessment"}

### Documentation Gaps
${missing.length > 0 ? missing.map((m) => `- **Gap:** ${m}`).join("\n") : "- Documentation appears complete"}

### Risk Level
Based on available data, risk level cannot be fully determined due to missing information.

---
*AI-Generated | Requires Clinician Review*`;

    case "missing_information":
      return `## Missing Information Analysis

**Patient:** ${patient}

### Critical Missing Information
${missing.length > 0
      ? missing.map((m) => `- **Missing:** ${m}`).join("\n")
      : "- Core information appears documented"}

### Recommendations for Data Completion
1. Obtain current vital signs if not recent
2. Verify and update medication reconciliation
3. Complete allergy assessment if not formally documented
4. Ensure recent lab results are available
5. Confirm diagnosis codes are current

### Impact on Clinical Decision-Making
Incomplete information increases clinical risk. Prioritize collecting missing data before making significant treatment decisions.

---
*AI-Generated | Requires Clinician Review*`;

    default:
      return "Unknown task type.";
  }
}
