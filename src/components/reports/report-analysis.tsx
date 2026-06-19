"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  FileText,
  ImageIcon,
  Upload,
  Sparkles,
  Save,
  Clipboard,
  CheckCircle2,
  Activity,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function ReportAnalysis() {
  const params = useParams();
  const patientId = params.id as string;

  const [reportName, setReportName] = useState("");
  const [reportText, setReportText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleAnalyze() {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("reportName", reportName);
      formData.append("reportContent", reportText);
      if (file) formData.append("file", file);

      const response = await fetch("/api/ai/report-analysis", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message);
        return;
      }

      setAnalysis(result.analysis);
      toast.success("Report analyzed successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze report");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          reportName,
          reportContent: reportText,
          aiAnalysis: analysis,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message);
        return;
      }

      toast.success("Report saved successfully");
      setReportName("");
      setReportText("");
      setAnalysis("");
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save report");
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    toast.success("Analysis copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              AI Medical Report Analysis
            </h1>
            <p className="text-sm text-muted-foreground">
              Upload or paste a medical report to generate AI-powered clinical insights.
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="rounded-xl border bg-card p-6 shadow-sm animate-fade-in-up stagger-1">
        {/* Report Name + File Upload Row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Report Name
            </label>
            <Input
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="e.g. CBC Report, Blood Sugar Test"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Upload File
            </label>
            <div className="relative">
              <Input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="h-10 cursor-pointer file:mr-2 file:h-10 file:rounded-lg file:border-0 file:bg-emerald-500/10 file:px-3 file:text-sm file:font-medium file:text-emerald-400 hover:file:bg-emerald-500/20"
              />
            </div>
          </div>
        </div>

        {/* File Selected Badge */}
        {file && (
          <div className="mt-3 flex items-center gap-2 animate-fade-in">
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 gap-1.5 py-1">
              <FileText className="h-3 w-3" />
              {file.name}
              <span className="ml-1 text-emerald-400/60">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </Badge>
          </div>
        )}

        {/* Upload Area Visual */}
        <div className="mt-4 rounded-lg border border-dashed border-border/60 bg-muted/20 p-4 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/5">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-emerald-400/70" />
              <span>PDF Reports</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-emerald-400/70" />
              <span>JPG / PNG Images</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Upload className="h-3.5 w-3.5 text-emerald-400/70" />
              <span>Medical Documents</span>
            </div>
            <a
              href="/reports/sample-medical-report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-medium text-emerald-400 transition-colors hover:text-emerald-300"
            >
              <Activity className="h-3.5 w-3.5" />
              Sample Report
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 flex items-center gap-4">
          <div className="h-px flex-1 bg-border/60" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
            or paste below
          </span>
          <div className="h-px flex-1 bg-border/60" />
        </div>

        {/* Paste Content */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Paste Report Content
          </label>
          <Textarea
            rows={8}
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder={"Hemoglobin: 8.5 g/dL\nWBC: 11000 /uL\nPlatelets: 250000 /uL\nRandom Blood Sugar: 180 mg/dL\n..."}
            className="resize-none border-border/60 bg-muted/20 font-mono text-sm placeholder:text-muted-foreground/40 focus-visible:border-emerald-500/40 focus-visible:ring-emerald-500/20"
          />
          {reportText && (
            <p className="text-right text-xs text-muted-foreground/50">
              {reportText.length} characters
            </p>
          )}
        </div>

        {/* Analyze Button */}
        <div className="mt-5 flex items-center gap-3">
          <Button
            onClick={handleAnalyze}
            disabled={loading || !reportName.trim() || (!reportText.trim() && !file)}
            className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300"
            size="lg"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analyze Report
              </>
            )}
          </Button>

          {!reportText.trim() && !file && reportName.trim() && (
            <p className="text-xs text-muted-foreground/60">
              Add report content or upload a file to analyze
            </p>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="rounded-xl border bg-card p-6 shadow-sm animate-fade-in-scale">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  AI Medical Analysis
                </h2>
                <p className="text-xs text-muted-foreground">
                  Generated for {reportName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5 border-border/60"
              >
                {copied ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Clipboard className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
              {patientId && (
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="gap-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save Report
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border/40 bg-muted/30 p-5">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-foreground/90">
              {analysis}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
