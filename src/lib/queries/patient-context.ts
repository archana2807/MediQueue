import { pool } from "@/lib/db";

export interface PatientContext {
  patientOneLiner: string;
  activeProblems: string[];
  currentMedications: string[];
  allergies: string[];
  relevantObservations: string[];
  riskFlags: string[];
  missingInformation: string[];
  evidenceReferences: EvidenceReference[];
  rawPatient: Record<string, unknown>;
  recentVisits: Record<string, unknown>[];
  reports: Record<string, unknown>[];
}

export interface EvidenceReference {
  source: string;
  detail: string;
  visitDate?: string;
}

export async function getPatientContext(
  patientId: string
): Promise<PatientContext | null> {
  const patientResult = await pool.query(
    `
    SELECT id, name, email, phone, created_at
    FROM users
    WHERE id = $1 AND role = 'PATIENT'
    `,
    [patientId]
  );

  if (patientResult.rows.length === 0) {
    return null;
  }

  const patient = patientResult.rows[0];

  const visitsResult = await pool.query(
    `
    SELECT
      a.id,
      a.appointment_date,
      a.status,
      du.name AS doctor_name,
      an.doctor_notes,
      an.ai_summary
    FROM appointments a
    LEFT JOIN appointment_notes an ON an.appointment_id = a.id
    LEFT JOIN doctors d ON d.id = a.doctor_id
    LEFT JOIN users du ON du.id = d.user_id
    WHERE a.patient_id = $1
    ORDER BY a.appointment_date DESC
    LIMIT 10
    `,
    [patientId]
  );

  const reportsResult = await pool.query(
    `
    SELECT id, report_name, ai_analysis, created_at
    FROM patient_reports
    WHERE patient_id = $1
    ORDER BY created_at DESC
    LIMIT 10
    `,
    [patientId]
  );

  const visits = visitsResult.rows;
  const reports = reportsResult.rows;

  const activeProblems = deriveActiveProblems(visits);
  const currentMedications = deriveMedications(visits);
  const allergies = deriveAllergies(reports);
  const relevantObservations = deriveObservations(visits, reports);
  const riskFlags = deriveRiskFlags(visits);
  const missingInformation = deriveMissingInfo(
    activeProblems,
    currentMedications,
    allergies,
    relevantObservations
  );
  const evidenceReferences = buildEvidenceReferences(
    visits,
    reports
  );

  const lastVisit = visits[0];
  const statusSummary =
    visits.length > 0
      ? `Last seen ${formatDate(lastVisit.appointment_date)} (${lastVisit.status})`
      : "No visits recorded";

  const patientOneLiner =
    `${patient.name} | ${patient.email || "No email"} | ${statusSummary} | ${visits.length} total visit(s)`;

  return {
    patientOneLiner,
    activeProblems,
    currentMedications,
    allergies,
    relevantObservations,
    riskFlags,
    missingInformation,
    evidenceReferences,
    rawPatient: patient,
    recentVisits: visits,
    reports,
  };
}

function deriveActiveProblems(
  visits: Record<string, unknown>[]
): string[] {
  const problems = new Set<string>();
  for (const visit of visits) {
    if (visit.status === "COMPLETED") {
      const summary = visit.ai_summary as string | null;
      const notes = visit.doctor_notes as string | null;
      const text = summary || notes || "";
      const lines = text.split("\n").filter((l) => l.trim());
      for (const line of lines) {
        const trimmed = line.replace(/^[-*•]\s*/, "").trim();
        if (
          trimmed.length > 5 &&
          trimmed.length < 200 &&
          !trimmed.startsWith("#") &&
          !trimmed.startsWith("Advice") &&
          !trimmed.startsWith("Diet")
        ) {
          problems.add(trimmed);
        }
      }
    }
  }
  return Array.from(problems).slice(0, 8);
}

function deriveMedications(
  visits: Record<string, unknown>[]
): string[] {
  const meds = new Set<string>();
  for (const visit of visits) {
    const summary = (visit.ai_summary as string) || "";
    const medSection = extractSection(summary, "Medication");
    if (medSection) {
      const items = medSection
        .split("\n")
        .map((l) =>
          l.replace(/^[-*•]\s*/, "").trim()
        )
        .filter((l) => l.length > 2);
      items.forEach((m) => meds.add(m));
    }
  }
  return Array.from(meds).slice(0, 10);
}

function deriveAllergies(
  reports: Record<string, unknown>[]
): string[] {
  const allergies: string[] = [];
  for (const report of reports) {
    const analysis = (report.ai_analysis as string) || "";
    if (
      analysis.toLowerCase().includes("allerg")
    ) {
      const lines = analysis.split("\n");
      for (const line of lines) {
        if (
          line.toLowerCase().includes("allerg")
        ) {
          allergies.push(
            line.replace(/^[-*•]\s*/, "").trim()
          );
        }
      }
    }
  }
  return allergies.length > 0
    ? allergies.slice(0, 5)
    : ["No known allergies documented"];
}

function deriveObservations(
  visits: Record<string, unknown>[],
  reports: Record<string, unknown>[]
): string[] {
  const obs: string[] = [];
  for (const visit of visits.slice(0, 3)) {
    if (visit.ai_summary) {
      obs.push(
        `Visit ${formatDate(visit.appointment_date)}: ${(visit.ai_summary as string).slice(0, 150)}...`
      );
    }
  }
  for (const report of reports.slice(0, 2)) {
    if (report.ai_analysis) {
      obs.push(
        `Report "${report.report_name}": ${(report.ai_analysis as string).slice(0, 150)}...`
      );
    }
  }
  return obs.slice(0, 5);
}

function deriveRiskFlags(
  visits: Record<string, unknown>[]
): string[] {
  const flags: string[] = [];
  const completedVisits = visits.filter(
    (v) => v.status === "COMPLETED"
  );
  if (completedVisits.length === 0 && visits.length > 0) {
    flags.push("Patient has visits but none completed");
  }
  if (visits.length === 0) {
    flags.push("No visit history available");
  }
  const recentVisit = visits[0];
  if (recentVisit) {
    const date = new Date(
      recentVisit.appointment_date as string
    );
    const now = new Date();
    const daysSince = Math.floor(
      (now.getTime() - date.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (daysSince > 180) {
      flags.push(
        `Last visit was ${daysSince} days ago (>6 months)`
      );
    }
  }
  return flags;
}

function deriveMissingInfo(
  problems: string[],
  meds: string[],
  allergies: string[],
  observations: string[]
): string[] {
  const missing: string[] = [];
  if (problems.length === 0)
    missing.push("Active problems not documented");
  if (meds.length === 0)
    missing.push("Current medications not documented");
  if (
    allergies.length === 0 ||
    allergies[0] === "No known allergies documented"
  )
    missing.push("Formal allergy assessment not recorded");
  if (observations.length === 0)
    missing.push("No clinical observations available");
  return missing;
}

function buildEvidenceReferences(
  visits: Record<string, unknown>[],
  reports: Record<string, unknown>[]
): EvidenceReference[] {
  const refs: EvidenceReference[] = [];
  for (const visit of visits.slice(0, 5)) {
    refs.push({
      source: `Visit ${visit.id}`,
      detail: visit.ai_summary
        ? "Has AI summary"
        : visit.doctor_notes
          ? "Has doctor notes"
          : "No clinical notes",
      visitDate: formatDate(
        visit.appointment_date
      ),
    });
  }
  for (const report of reports.slice(0, 3)) {
    refs.push({
      source: `Report: ${report.report_name}`,
      detail: report.ai_analysis
        ? "Has AI analysis"
        : "No analysis available",
    });
  }
  return refs;
}

function extractSection(
  text: string,
  sectionName: string
): string | null {
  const regex = new RegExp(
    `###?\\s*${sectionName}[\\s\\S]*?(?=###?\\s|$)`,
    "i"
  );
  const match = text.match(regex);
  return match ? match[0].trim() : null;
}

function formatDate(date: unknown): string {
  if (!date) return "Unknown";
  return new Date(date as string).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}
