"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">
        Failed to load doctors
      </h2>

      <p className="text-muted-foreground">
        {error.message}
      </p>

      <Button onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}