"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  FileWarning,
  Pill,
  ShieldAlert,
  Stethoscope,
  TestTube,
} from "lucide-react";

interface PatientContextData {
  patientOneLiner: string;
  activeProblems: string[];
  currentMedications: string[];
  allergies: string[];
  relevantObservations: string[];
  riskFlags: string[];
  missingInformation: string[];
}

export default function PatientContextCard({
  context,
}: {
  context: PatientContextData;
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="size-5 text-emerald-400" />
          Patient Context
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {context.patientOneLiner}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <ContextSection
          icon={<Stethoscope className="size-4" />}
          title="Active Problems"
          items={context.activeProblems}
          emptyText="No active problems documented"
          color="text-blue-400"
        />

        <ContextSection
          icon={<Pill className="size-4" />}
          title="Current Medications"
          items={context.currentMedications}
          emptyText="No medications documented"
          color="text-violet-400"
        />

        <ContextSection
          icon={<ShieldAlert className="size-4" />}
          title="Allergies"
          items={context.allergies}
          emptyText="No allergy information"
          color="text-amber-400"
        />

        <ContextSection
          icon={<TestTube className="size-4" />}
          title="Relevant Observations"
          items={context.relevantObservations}
          emptyText="No observations available"
          color="text-cyan-400"
        />

        {context.riskFlags.length > 0 && (
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="size-4 text-red-400" />
              Risk Flags
            </h4>
            <div className="flex flex-wrap gap-2">
              {context.riskFlags.map((flag, i) => (
                <Badge
                  key={i}
                  variant="destructive"
                  className="text-xs"
                >
                  {flag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {context.missingInformation.length > 0 && (
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <FileWarning className="size-4 text-orange-400" />
              Missing Information
            </h4>
            <ul className="space-y-1">
              {context.missingInformation.map((item, i) => (
                <li
                  key={i}
                  className="text-sm text-muted-foreground"
                >
                  - {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ContextSection({
  icon,
  title,
  items,
  emptyText,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  emptyText: string;
  color: string;
}) {
  return (
    <div>
      <h4 className={`mb-2 flex items-center gap-2 text-sm font-semibold ${color}`}>
        {icon}
        {title}
      </h4>
      {items.length > 0 ? (
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-muted-foreground">
              - {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          {emptyText}
        </p>
      )}
    </div>
  );
}
