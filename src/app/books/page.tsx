"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  Grid3X3,
  List,
  X,
  Search,
  ChevronDown,
  BookOpen,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import BookCard from "@/components/books/BookCard";
import BookCardSkeleton from "@/components/books/BookCardSkeleton";
import { useBooks } from "@/hooks/use-books";
import type { BookFilters } from "@/types";

const examCategories = [
  "UPSC",
  "SSC",
  "Banking",
  "Railway",
  "JEE",
  "NEET",
  "CAT",
  "GATE",
];
const languages = ["English", "Hindi"];
const subjects = [
  "General Studies",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Reasoning",
  "English",
  "Computer Science",
];
const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "latest", label: "Newest" },
  { value: "bestseller", label: "Best Sellers" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];
const priceRanges = [
  { label: "Under ₹300", min: 0, max: 300 },
  { label: "₹300 – ₹500", min: 300, max: 500 },
  { label: "₹500 – ₹700", min: 500, max: 700 },
  { label: "Above ₹700", min: 700, max: 9999 },
];

function BooksContent() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number] | null
  >(null);
  const [sort, setSort] = useState<BookFilters["sort"]>(
    (searchParams.get("sort") as BookFilters["sort"]) || "popular"
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters: BookFilters = useMemo(
    () => ({
      category: selectedCategory || undefined,
      language: selectedLanguage || undefined,
      subject: selectedSubject || undefined,
      priceRange: selectedPriceRange || undefined,
      sort,
      search: search || undefined,
      page,
      limit: 12,
    }),
    [
      selectedCategory,
      selectedLanguage,
      selectedSubject,
      selectedPriceRange,
      sort,
      search,
      page,
    ]
  );

  const { data, isLoading } = useBooks(filters);

  const activeFilters: { label: string; onClear: () => void }[] = [
    selectedCategory
      ? {
          label: selectedCategory,
          onClear: () => setSelectedCategory(null),
        }
      : null,
    selectedLanguage
      ? {
          label: selectedLanguage,
          onClear: () => setSelectedLanguage(null),
        }
      : null,
    selectedSubject
      ? {
          label: selectedSubject,
          onClear: () => setSelectedSubject(null),
        }
      : null,
    selectedPriceRange
      ? {
          label: `₹${selectedPriceRange[0]} – ₹${selectedPriceRange[1]}`,
          onClear: () => setSelectedPriceRange(null),
        }
      : null,
  ].filter(
    (f): f is { label: string; onClear: () => void } => f !== null
  );

  const clearAll = () => {
    setSelectedCategory(null);
    setSelectedLanguage(null);
    setSelectedSubject(null);
    setSelectedPriceRange(null);
  };

  const FilterSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div>
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-[#9a9a9a]">
        {title}
      </h3>
      {children}
    </div>
  );

  const FilterSidebar = () => (
    <div className="space-y-6">
      <FilterSection title="Exam Category">
        <div className="space-y-2.5">
          {examCategories.map((cat) => (
            <label
              key={cat}
              className="flex cursor-pointer items-center gap-2.5 group"
            >
              <Checkbox
                id={cat}
                checked={selectedCategory === cat}
                onCheckedChange={() =>
                  setSelectedCategory(selectedCategory === cat ? null : cat)
                }
                className="border-[#d4d4d4] data-[state=checked]:bg-[#0056D2] data-[state=checked]:border-[#0056D2]"
              />
              <span className="text-sm text-[#373737] group-hover:text-[#1f1f1f] transition-colors">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <div className="h-px bg-[#e5e5e5]" />

      <FilterSection title="Price Range">
        <div className="space-y-2.5">
          {priceRanges.map((range) => (
            <label
              key={range.label}
              className="flex cursor-pointer items-center gap-2.5 group"
            >
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors ${
                  selectedPriceRange?.[0] === range.min
                    ? "border-[#0056D2] bg-[#0056D2]"
                    : "border-[#d4d4d4]"
                }`}
              >
                {selectedPriceRange?.[0] === range.min && (
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </div>
              <span className="text-sm text-[#373737] group-hover:text-[#1f1f1f] transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <div className="h-px bg-[#e5e5e5]" />

      <FilterSection title="Language">
        <div className="space-y-2.5">
          {languages.map((lang) => (
            <label
              key={lang}
              className="flex cursor-pointer items-center gap-2.5 group"
            >
              <Checkbox
                id={lang}
                checked={selectedLanguage === lang}
                onCheckedChange={() =>
                  setSelectedLanguage(selectedLanguage === lang ? null : lang)
                }
                className="border-[#d4d4d4] data-[state=checked]:bg-[#0056D2] data-[state=checked]:border-[#0056D2]"
              />
              <span className="text-sm text-[#373737] group-hover:text-[#1f1f1f] transition-colors">
                {lang}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <div className="h-px bg-[#e5e5e5]" />

      <FilterSection title="Subject">
        <div className="space-y-2.5">
          {subjects.map((sub) => (
            <label
              key={sub}
              className="flex cursor-pointer items-center gap-2.5 group"
            >
              <Checkbox
                id={sub}
                checked={selectedSubject === sub}
                onCheckedChange={() =>
                  setSelectedSubject(selectedSubject === sub ? null : sub)
                }
                className="border-[#d4d4d4] data-[state=checked]:bg-[#0056D2] data-[state=checked]:border-[#0056D2]"
              />
              <span className="text-sm text-[#373737] group-hover:text-[#1f1f1f] transition-colors">
                {sub}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="border-b border-[#e5e5e5] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold text-[#1f1f1f] sm:text-3xl">
              Browse E-Books
            </h1>
            <p className="mt-1.5 text-sm text-[#6b6b6b]">
              Find the perfect book for your exam preparation
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
            <input
              placeholder="Search books..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-11 w-full rounded-xl border border-[#e5e5e5] bg-white pl-10 pr-4 text-sm text-[#1f1f1f] placeholder:text-[#9a9a9a] focus:border-[#0056D2] focus:outline-none focus:ring-2 focus:ring-[#0056D2]/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-2.5">
            {/* Mobile filter button */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <button className="flex h-10 items-center gap-2 rounded-xl border border-[#e5e5e5] bg-white px-4 text-sm font-medium text-[#373737] transition-all hover:border-[#d4d4d4] lg:hidden">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFilters.length > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0056D2] text-[10px] font-bold text-white">
                      {activeFilters.length}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-white p-0">
                <SheetTitle />
                <div className="flex items-center justify-between border-b border-[#e5e5e5] px-5 py-4">
                  <h2 className="text-base font-bold text-[#1f1f1f]">Filters</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b6b6b] hover:bg-[#f5f5f5]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-5">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>

            {/* View toggle */}
            <div className="hidden items-center rounded-xl border border-[#e5e5e5] bg-white p-0.5 lg:flex">
              <button
                onClick={() => setView("grid")}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                  view === "grid"
                    ? "bg-[#0056D2] text-white shadow-sm"
                    : "text-[#6b6b6b] hover:text-[#1f1f1f]"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                  view === "list"
                    ? "bg-[#0056D2] text-white shadow-sm"
                    : "text-[#6b6b6b] hover:text-[#1f1f1f]"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value as BookFilters["sort"])
                }
                className="h-10 appearance-none rounded-xl border border-[#e5e5e5] bg-white pl-4 pr-9 text-sm font-medium text-[#373737] cursor-pointer transition-all hover:border-[#d4d4d4] focus:border-[#0056D2] focus:outline-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9a9a9a] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active filters */}
        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 flex flex-wrap items-center gap-2 overflow-hidden"
            >
              {activeFilters.map((filter, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={filter.onClear}
                  className="flex h-8 items-center gap-1.5 rounded-full border border-[#e5e5e5] bg-white pl-3 pr-2 text-xs font-medium text-[#373737] transition-all hover:border-[#d4d4d4]"
                >
                  {filter.label}
                  <X className="h-3 w-3 text-[#9a9a9a]" />
                </motion.button>
              ))}
              <button
                onClick={clearAll}
                className="text-xs font-semibold text-[#0056D2] hover:text-[#004bb5] transition-colors ml-1"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden w-60 flex-shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-[#e5e5e5] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#1f1f1f]">Filters</h2>
                {activeFilters.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs font-semibold text-[#0056D2] hover:text-[#004bb5]"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <FilterSidebar />
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            {!isLoading && data && (
              <p className="mb-4 text-sm text-[#6b6b6b]">
                <span className="font-semibold text-[#1f1f1f]">
                  {data.total}
                </span>{" "}
                books found
              </p>
            )}

            {isLoading ? (
              <div
                className={
                  view === "grid"
                    ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                    : "space-y-3"
                }
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <BookCardSkeleton key={i} view={view} />
                ))}
              </div>
            ) : data?.data.length === 0 ? (
              <div className="py-20 text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#f5f5f5]">
                  <BookOpen className="h-8 w-8 text-[#9a9a9a]" />
                </div>
                <h3 className="text-lg font-bold text-[#1f1f1f]">
                  No books found
                </h3>
                <p className="mt-1.5 text-sm text-[#6b6b6b]">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearAll}
                  className="mt-5 rounded-full bg-[#0056D2] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#004bb5]"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div
                  className={
                    view === "grid"
                      ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                      : "space-y-3"
                  }
                >
                  {data?.data.map((book, i) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <BookCard book={book} view={view} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {data && data.totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="flex h-10 items-center gap-1 rounded-xl border border-[#e5e5e5] bg-white px-4 text-sm font-medium text-[#373737] transition-all hover:border-[#d4d4d4] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: data.totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                          page === i + 1
                            ? "bg-[#0056D2] text-white shadow-md shadow-[#0056D2]/20"
                            : "border border-[#e5e5e5] bg-white text-[#373737] hover:border-[#d4d4d4]"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setPage(Math.min(data.totalPages, page + 1))
                      }
                      disabled={page === data.totalPages}
                      className="flex h-10 items-center gap-1 rounded-xl border border-[#e5e5e5] bg-white px-4 text-sm font-medium text-[#373737] transition-all hover:border-[#d4d4d4] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fafafa]">
          <div className="border-b border-[#e5e5e5] bg-white">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="h-8 w-48 rounded-lg bg-gray-100 animate-pulse" />
              <div className="mt-2 h-4 w-72 rounded-lg bg-gray-100 animate-pulse" />
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <BooksContent />
    </Suspense>
  );
}
