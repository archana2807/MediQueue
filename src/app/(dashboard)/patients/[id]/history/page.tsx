import {
  getPatientHistory,
} from "@/lib/queries/patient-history";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function PatientHistoryPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } =
    await params;

  const history =
    await getPatientHistory(id);
console.log("history",history);  return (
    <div className="container mx-auto max-w-8xl p-6 animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-bold">
      Patient Medical History
    </h1>

    <p className="mt-2 text-sm text-muted-foreground">
      AI-generated clinical summaries from
      previous consultations.
    </p>
  </div>

  <Link
    href={`/patients/${id}/reports`}
  >
    <Button>
      Add Medical Report
    </Button>
  </Link>
</div>

      <div className="space-y-6">
        {history.map(
          (visit: any, index: number) => (
            <Card
              key={visit.id}
              className="shadow-sm animate-fade-in-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {new Date(
                      visit.appointment_date
                    ).toLocaleDateString()}
                  </CardTitle>

                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    {visit.status}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Consulting Doctor
                  </p>

                  <p className="font-medium">
                    {visit.doctor_name}
                  </p>
                </div>

                <div className="rounded-lg border bg-muted p-4">
                  <h3 className="mb-3 font-semibold">
                    AI Clinical Summary
                  </h3>

                  <pre className="whitespace-pre-wrap text-sm leading-6">
                    {visit.ai_summary ||
                      "No summary available"}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}