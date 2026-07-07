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
import { ChevronDown, ChevronUp, Database } from "lucide-react";

interface RawDataProps {
  patient: Record<string, unknown>;
  visits: Record<string, unknown>[];
  reports: Record<string, unknown>[];
}

export default function PatientRawData({
  patient,
  visits,
  reports,
}: RawDataProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="shadow-sm">
      <CardHeader
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="size-4 text-muted-foreground" />
            Raw Patient Data
          </CardTitle>
          <Button variant="ghost" size="sm">
            {expanded ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-semibold">
              Patient Record
            </h4>
            <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
              {JSON.stringify(patient, null, 2)}
            </pre>
          </div>

          <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
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
                    className="rounded-lg border p-3 text-xs"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {visit.status as string}
                      </Badge>
                      <span className="text-muted-foreground">
                        {new Date(
                          visit.appointment_date as string
                        ).toLocaleDateString()}
                      </span>
                      <span className="text-muted-foreground">
                        Dr. {visit.doctor_name as string}
                      </span>
                    </div>
                    {typeof visit.ai_summary === "string" &&
                      visit.ai_summary && (
                        <p className="mt-1 text-muted-foreground">
                          {visit.ai_summary.slice(0, 200)}
                          {visit.ai_summary.length > 200
                            ? "..."
                            : ""}
                        </p>
                      )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No visits recorded
              </p>
            )}
          </div>

          <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
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
                    className="rounded-lg border p-3 text-xs"
                  >
                    <p className="font-medium">
                      {report.report_name as string}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      {new Date(
                        report.created_at as string
                      ).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No reports available
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
