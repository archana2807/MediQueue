import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import QueueTable from "@/components/queue/queue-table";

export const dynamic =
  "force-dynamic";

export default function QueuePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Queue Management
        </CardTitle>
      </CardHeader>

      <CardContent>
        <QueueTable />
      </CardContent>
    </Card>
  );
}