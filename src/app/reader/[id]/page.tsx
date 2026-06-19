"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReaderContent from "@/components/reader/ReaderContent";
import { useBook } from "@/hooks/use-books";
import { useLibrary } from "@/hooks/use-library";
import { Button } from "@/components/ui/button";
import { BookOpen, ShoppingCart, Lock, ArrowLeft } from "lucide-react";

const mockChapters = [
  {
    id: "ch1",
    title: "Introduction & Fundamentals",
    pageStart: 1,
    pageEnd: 45,
    sections: [
      { title: "Overview", page: 2 },
      { title: "Historical Context", page: 12 },
      { title: "Core Principles", page: 28 },
    ],
  },
  {
    id: "ch2",
    title: "Key Concepts & Definitions",
    pageStart: 46,
    pageEnd: 95,
    sections: [
      { title: "Essential Terms", page: 48 },
      { title: "Framework Analysis", page: 62 },
      { title: "Current Trends", page: 80 },
    ],
  },
  {
    id: "ch3",
    title: "Policy & Governance",
    pageStart: 96,
    pageEnd: 150,
    sections: [
      { title: "Policy Framework", page: 98 },
      { title: "Administrative Structure", page: 115 },
      { title: "Recent Amendments", page: 135 },
    ],
  },
  {
    id: "ch4",
    title: "Advanced Topics",
    pageStart: 151,
    pageEnd: 200,
    sections: [
      { title: "In-Depth Analysis", page: 153 },
      { title: "Case Studies", page: 170 },
      { title: "Practice Questions", page: 190 },
    ],
  },
];

export default function ReaderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: book } = useBook(id);
  const { data: library } = useLibrary();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  // Check if book is in library (purchased)
  useEffect(() => {
    if (library) {
      const isInLibrary = library.books.some((b) => b.bookId === id);
      setHasAccess(isInLibrary);
    }
  }, [library, id]);

  // Disable right-click globally on reader
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  // Disable keyboard shortcuts for copying/saving
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+C, Ctrl+S, Ctrl+U, Ctrl+P, F12
      if (
        (e.ctrlKey && e.key === "c") ||
        (e.ctrlKey && e.key === "s") ||
        (e.ctrlKey && e.key === "u") ||
        (e.ctrlKey && e.key === "p") ||
        e.key === "F12"
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Loading state
  if (hasAccess === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#e5e5e5] border-t-[#0056D2]" />
          <p className="text-sm text-[#6b6b6b]">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Access denied - book not purchased
  if (!hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#0056D2]/8">
            <Lock className="h-8 w-8 text-[#0056D2]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1f1f1f]">
            Access Restricted
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#6b6b6b]">
            You haven&apos;t purchased this book yet. Purchase it to gain
            instant access to the full content.
          </p>

          {book && (
            <div className="mt-6 rounded-2xl border border-[#e5e5e5] bg-white p-5">
              <p className="text-sm font-bold text-[#1f1f1f]">{book.title}</p>
              <p className="mt-1 text-xs text-[#6b6b6b]">by {book.author}</p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <Button
              asChild
              className="h-12 rounded-full bg-[#0056D2] text-sm font-bold shadow-lg shadow-[#0056D2]/25 hover:bg-[#004bb5]"
            >
              <Link href={`/books/${id}`}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Purchase Now
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-[#d4d4d4] text-sm font-semibold"
            >
              <Link href="/library">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Library
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-[11px] text-[#9a9a9a]">
            This is a protected digital reading experience. Downloads are
            disabled.
          </p>
        </div>
      </div>
    );
  }

  // Access granted - show reader
  return (
    <div
      className="select-none"
      onDragStart={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
    >
      {/* DRM Notice Banner */}
      <div className="bg-[#0056D2] px-4 py-2 text-center">
        <p className="text-[11px] font-medium text-white/90">
          <Lock className="mr-1.5 inline h-3 w-3" />
          Protected Content — This book is for personal use only. Copying,
          downloading, or sharing is prohibited.
        </p>
      </div>

      <ReaderContent
        bookId={id}
        title={book?.title || "Reading..."}
        author={book?.author || "Author"}
        chapters={mockChapters}
        totalPages={200}
      />
    </div>
  );
}
