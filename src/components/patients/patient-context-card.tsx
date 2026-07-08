"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
    <Card className="border-border/60 overflow-hidden">
      <CardHeader className="border-b border-border/60 bg-gradient-to-r from-emerald-500/[0.04] to-transparent pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <Stethoscope className="size-4 text-emerald-500" />
          </div>
          Clinical Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ContextSection
          icon={<Stethoscope className="size-4" />}
          title="Active Problems"
          items={context.activeProblems}
          emptyText="No active problems documented"
          color="text-blue-500"
          bgColor="bg-blue-500/10"
        />

        <Separator />

        <ContextSection
          icon={<Pill className="size-4" />}
          title="Current Medications"
          items={context.currentMedications}
          emptyText="No medications documented"
          color="text-violet-500"
          bgColor="bg-violet-500/10"
        />

        <Separator />

        <ContextSection
          icon={<ShieldAlert className="size-4" />}
          title="Allergies"
          items={context.allergies}
          emptyText="No allergy information"
          color="text-amber-500"
          bgColor="bg-amber-500/10"
        />

        <Separator />

        <ContextSection
          icon={<TestTube className="size-4" />}
          title="Relevant Observations"
          items={context.relevantObservations}
          emptyText="No observations available"
          color="text-cyan-500"
          bgColor="bg-cyan-500/10"
        />

        {context.riskFlags.length > 0 && (
          <>
            <Separator />
            <div className="px-6 py-4">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-500">
                <AlertTriangle className="size-4" />
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
          </>
        )}

        {context.missingInformation.length > 0 && (
          <>
            <Separator />
            <div className="px-6 py-4">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-orange-500">
                <FileWarning className="size-4" />
                Missing Information
              </h4>
              <div className="flex flex-wrap gap-2">
                {context.missingInformation.map((item, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="border-orange-500/20 bg-orange-500/5 text-xs text-orange-500"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </>
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
  bgColor,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  emptyText: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="px-6 py-4">
      <h4 className={`mb-3 flex items-center gap-2 text-sm font-semibold ${color}`}>
        <span className={`flex h-6 w-6 items-center justify-center rounded-md ${bgColor}`}>
          {icon}
        </span>
        {title}
      </h4>
      {items.length > 0 ? (
        <ul className="space-y-1.5 pl-8">
          {items.map((item, i) => (
            <li
              key={i}
              className="text-sm leading-relaxed text-muted-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="pl-8 text-sm italic text-muted-foreground/50">
          {emptyText}
        </p>
      )}
    </div>
  );
}
