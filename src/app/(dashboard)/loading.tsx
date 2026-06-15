import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center animate-fade-in">
      <Spinner className="size-8 animate-spin-slow" />
    </div>
  );
}