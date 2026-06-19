import { Metadata } from "next";
import LibraryContent from "@/components/library/LibraryContent";

export const metadata: Metadata = {
  title: "My Library | ExamVerse",
};

export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Library</h1>
        <p className="mt-2 text-muted-foreground">
          Your purchased e-books and reading progress
        </p>
      </div>
      <LibraryContent />
    </div>
  );
}
