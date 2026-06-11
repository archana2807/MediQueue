import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export default function Loading() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-10 animate-pulse rounded bg-muted"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}