"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import {
  FileText,
  ImageIcon,
  Upload,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ReportAnalysis() {
  const params = useParams();

  const patientId =
    params.id as string;

  const [reportName, setReportName] =
    useState("");

  const [reportText, setReportText] =
    useState("");

  const [analysis, setAnalysis] =
    useState("");

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

 async function handleAnalyze() {
  try {
    setLoading(true);

    const formData = new FormData();

    formData.append(
      "reportName",
      reportName
    );

    formData.append(
      "reportContent",
      reportText
    );

    if (file) {
      formData.append(
        "file",
        file
      );
    }

    const response =
      await fetch(
        "/api/ai/report-analysis",
        {
          method: "POST",
          body: formData,
        }
      );

    const result =
      await response.json();

    if (!response.ok) {
      toast.error(
        result.message
      );
      return;
    }

    setAnalysis(
      result.analysis
    );

    toast.success(
      "Report analyzed successfully"
    );
  } catch (error) {
    console.error(error);

    toast.error(
      "Failed to analyze report"
    );
  } finally {
    setLoading(false);
  }
}
  async function handleSave() {
    try {
      const response =
        await fetch(
          "/api/reports",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              patientId,
              reportName,
              reportContent:
                reportText,
              aiAnalysis:
                analysis,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        toast.error(
          result.message
        );
        return;
      }

      toast.success(
        "Report saved successfully"
      );

      setReportName("");
      setReportText("");
      setAnalysis("");
      setFile(null);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to save report"
      );
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">
          AI Medical Report Analysis
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Upload a report or paste report
          content to generate AI-powered
          medical insights.
        </p>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">
            Report Name
          </label>

          <Input
            value={reportName}
            onChange={(e) =>
              setReportName(
                e.target.value
              )
            }
            placeholder="e.g. CBC Report"
          />
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">
            Upload Report
          </label>

          <div className="rounded-lg border border-dashed p-6">
            <Input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) =>
                setFile(
                  e.target.files?.[0] ||
                    null
                )
              }
            />
            

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileText size={16} />
                PDF Reports
              </div>

              <div className="flex items-center gap-2">
                <ImageIcon size={16} />
                JPG / PNG Images
              </div>

              <div className="flex items-center gap-2">
                <Upload size={16} />
                Medical Documents
              </div>
              <div >
  <a
    href="/reports/sample-medical-report.pdf"
    target="_blank"
    rel="noopener noreferrer"
    className="text-sm text-blue-600 underline"
  >
    Download Sample Medical Report
  </a>
</div>
            </div>

            {file && (
              <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
                Selected: {file.name}
              </div>
            )}
          </div>
        </div>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />

          <span className="text-sm text-muted-foreground">
            OR
          </span>

          <div className="h-px flex-1 bg-border" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Paste Report Content
          </label>

          <Textarea
            rows={10}
            value={reportText}
            onChange={(e) =>
              setReportText(
                e.target.value
              )
            }
            placeholder="Hemoglobin: 8.5 g/dL, WBC: 11000, Platelets: 250000..."
          />
        </div>

        <Button
          className="mt-6"
          onClick={handleAnalyze}
          disabled={
  loading ||
  !reportName.trim() ||
  (!reportText.trim() && !file)
}
        >
          {loading
            ? "Analyzing..."
            : "Analyze Report"}
        </Button>
      </div>

      {analysis && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              AI Medical Analysis
            </h2>

            <Button
              onClick={handleSave}
            >
              Save Report
            </Button>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <pre className="whitespace-pre-wrap text-sm leading-6">
              {analysis}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}