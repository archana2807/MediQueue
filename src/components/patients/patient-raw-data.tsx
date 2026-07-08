"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  ChevronUp,
  Database,
  User,
  Calendar,
  Stethoscope,
  FileText,
} from "lucide-react";

interface RawDataProps {
  patient: Record<string, unknown>;
  visits: Record<string, unknown>[];
  reports: Record<string, unknown>[];
}

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
  PENDING: "border-amber-500/20 bg-amber-500/10 text-amber-500",
  CANCELLED: "border-red-500/20 bg-red-500/10 text-red-500",
  IN_PROGRESS: "border-blue-500/20 bg-blue-500/10 text-blue-500",
};

export default function PatientRawData({
  patient,
  visits,
  reports,
}: RawDataProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-border/60 overflow-hidden">
      <CardHeader
        className="cursor-pointer select-none border-b border-border/60 transition-colors hover:bg-muted/30"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-base">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Database className="size-4 text-muted-foreground" />
            </div>
            Raw Data
            <Badge variant="secondary" className="text-xs">
              {visits.length} visits &middot; {reports.length} reports
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {expanded ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-6 p-5">
          {/* Patient Record */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <User className="size-4 text-muted-foreground" />
              Patient Record
            </h4>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <pre className="overflow-x-auto font-mono text-xs leading-5 text-muted-foreground">
                {JSON.stringify(patient, null, 2)}
              </pre>
            </div>
          </div>

          <Separator />

          {/* Recent Visits */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Stethoscope className="size-4 text-muted-foreground" />
              Recent Visits
              <Badge variant="secondary" className="text-xs">
                {visits.length}
              </Badge>
            </h4>
            {visits.length > 0 ? (
              <div className="space-y-2">
                {visits.map((visit, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border/60 bg-muted/20 p-3 transition-colors hover:bg-muted/30"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${STATUS_COLORS[visit.status as string] || ""}`}
                      >
                        {visit.status as string}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="size-3" />
                        {new Date(
                          visit.appointment_date as string
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Dr. {visit.doctor_name as string}
                      </span>
                    </div>
                    {typeof visit.ai_summary === "string" &&
                      visit.ai_summary && (
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {visit.ai_summary.slice(0, 200)}
                          {visit.ai_summary.length > 200 ? "..." : ""}
                        </p>
                      )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm italic text-muted-foreground/50">
                No visits recorded
              </p>
            )}
          </div>

          <Separator />

          {/* Reports */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <FileText className="size-4 text-muted-foreground" />
              Reports
              <Badge variant="secondary" className="text-xs">
                {reports.length}
              </Badge>
            </h4>
            {reports.length > 0 ? (
              <div className="space-y-2">
                {reports.map((report, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-3 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                        <FileText className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {report.report_name as string}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            report.created_at as string
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm italic text-muted-foreground/50">
                No reports available
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
