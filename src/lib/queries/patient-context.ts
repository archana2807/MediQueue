import { pool } from "@/lib/db";
import {
  getPatientMedications,
  getPatientAllergies,
  getPatientConditions,
  getPatientObservations,
} from "./clinical-data";

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

  // Query structured clinical data directly from tables
  const medications = await getPatientMedications(patientId);
  const allergies = await getPatientAllergies(patientId);
  const conditions = await getPatientConditions(patientId);
  const observations = await getPatientObservations(patientId);

  const activeProblems = conditions
    .filter((c) => c.status === "active")
    .map((c) => c.condition_name);

  const currentMedications = medications.map(
    (m) => m.dosage ? `${m.name} ${m.dosage} ${m.frequency || ""}`.trim() : m.name
  );

  const allergyList = allergies.length > 0
    ? allergies.map((a) => a.severity ? `${a.allergen} (${a.severity})` : a.allergen)
    : ["No known allergies documented"];

  const observationList = observations.map((o) => o.observation);

  const riskFlags = deriveRiskFlags(visits);
  const missingInformation = deriveMissingInfo(
    activeProblems,
    currentMedications,
    allergyList,
    observationList
  );
  const evidenceReferences = buildEvidenceReferences(visits, reports);

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
    allergies: allergyList,
    relevantObservations: observationList,
    riskFlags,
    missingInformation,
    evidenceReferences,
    rawPatient: patient,
    recentVisits: visits,
    reports,
  };
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
