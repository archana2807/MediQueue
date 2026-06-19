"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingCart,
  BookOpen,
  ArrowLeft,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Zap,
  Check,
  Users,
  Globe,
  Hash,
  Clock,
  Award,
  BarChart3,
  FileText,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBook, useBooks } from "@/hooks/use-books";
import { useCart } from "@/providers/cart-provider";
import { formatPrice, getDiscountPercent, formatDate } from "@/lib/utils";
import { reviews } from "@/data/reviews";
import BookCard from "@/components/books/BookCard";
import { useState } from "react";

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: book, isLoading } = useBook(id);
  const { data: allBooks } = useBooks({ limit: 4 });
  const { addItem } = useCart();
  const [previewIndex, setPreviewIndex] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "reviews">(
    "overview"
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <div className="space-y-5">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
              <div className="h-10 w-3/4 animate-pulse rounded bg-gray-100" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-gray-100" />
              <div className="h-6 w-40 animate-pulse rounded bg-gray-100" />
              <div className="h-24 w-full animate-pulse rounded-2xl bg-gray-100" />
            </div>
            <div className="mx-auto w-full max-w-[340px] lg:max-w-none">
              <div className="aspect-[3/4] animate-pulse rounded-2xl bg-gray-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <BookOpen className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-[#1f1f1f]">Book not found</h2>
        <p className="mt-2 text-sm text-[#6b6b6b]">
          The book you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button
          asChild
          className="mt-8 rounded-full bg-[#0056D2] px-6 text-sm font-semibold hover:bg-[#004bb5]"
        >
          <Link href="/books">Browse Books</Link>
        </Button>
      </div>
    );
  }

  const discount = getDiscountPercent(book.originalPrice, book.price);
  const bookReviews = reviews.filter((r) => r.bookId === book.id);
  const relatedBooks =
    allBooks?.data
      .filter((b) => b.category === book.category && b.id !== book.id)
      .slice(0, 4) || [];

  const handleAddToCart = () => {
    addItem({
      bookId: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      coverImage: book.coverImage,
    });
  };

  const handleBuyNow = () => {
    addItem({
      bookId: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      coverImage: book.coverImage,
    });
    router.push("/checkout");
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = bookReviews.filter((r) => r.rating === star).length;
    const pct = bookReviews.length ? (count / bookReviews.length) * 100 : 0;
    return { star, count, pct };
  });

  return (
    <div className="min-h-screen bg-white">
      {/* ═══════ BREADCRUMB ═══════ */}
      <div className="border-b border-[#e5e5e5]">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-[13px] text-[#6b6b6b]">
            <Link href="/" className="transition-colors hover:text-[#0056D2]">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/books"
              className="transition-colors hover:text-[#0056D2]"
            >
              Books
            </Link>
            <span>/</span>
            <Link
              href={`/books?category=${book.category}`}
              className="transition-colors hover:text-[#0056D2]"
            >
              {book.category}
            </Link>
            <span>/</span>
            <span className="text-[#1f1f1f] font-medium truncate max-w-[200px]">
              {book.title}
            </span>
          </nav>
        </div>
      </div>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* ═══════ LEFT: Details ═══════ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Category */}
            <span className="inline-flex items-center rounded-full bg-[#0056D2]/8 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0056D2]">
              {book.category}
            </span>

            {/* Title */}
            <h1 className="mt-4 text-3xl font-bold leading-tight text-[#1f1f1f] sm:text-4xl">
              {book.title}
            </h1>

            {/* Author */}
            <p className="mt-2 text-base text-[#6b6b6b]">
              by{" "}
              <span className="font-semibold text-[#1f1f1f]">
                {book.author}
              </span>
            </p>

            {/* Rating + Meta */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(book.rating)
                        ? "fill-[#f59e0b] text-[#f59e0b]"
                        : "text-[#d4d4d4]"
                    }`}
                  />
                ))}
                <span className="ml-1.5 text-sm font-bold text-[#1f1f1f]">
                  {book.rating}
                </span>
              </div>
              <span className="text-sm text-[#6b6b6b]">
                ({book.reviewCount.toLocaleString()} reviews)
              </span>
              <span className="text-[#d4d4d4]">·</span>
              <span className="flex items-center gap-1 text-sm text-[#6b6b6b]">
                <Users className="h-3.5 w-3.5" />
                {book.publisher}
              </span>
            </div>

            {/* Tabs */}
            <div className="mt-8 border-b border-[#e5e5e5]">
              <div className="flex gap-0">
                {(["overview", "details", "reviews"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`relative px-5 py-3 text-sm font-semibold capitalize transition-colors ${
                      activeTab === t
                        ? "text-[#0056D2]"
                        : "text-[#6b6b6b] hover:text-[#1f1f1f]"
                    }`}
                  >
                    {t}
                    {activeTab === t && (
                      <motion.div
                        layoutId="tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0056D2]"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab: Overview */}
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-8"
              >
                {/* What you'll learn */}
                <div className="rounded-2xl border border-[#e5e5e5] bg-[#f9f9f9] p-6">
                  <h2 className="text-lg font-bold text-[#1f1f1f]">
                    What you&apos;ll learn
                  </h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {[
                      `Comprehensive preparation for ${book.category} competitive exams`,
                      "Previous year question analysis and pattern recognition",
                      "Time management strategies for exam success",
                      "Conceptual clarity with practical applications",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0056D2]/10">
                          <Check className="h-3 w-3 text-[#0056D2]" />
                        </div>
                        <span className="text-sm leading-relaxed text-[#373737]">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-8">
                  <h2 className="text-lg font-bold text-[#1f1f1f]">
                    Skills you&apos;ll gain
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {book.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-sm text-[#373737] transition-colors hover:border-[#0056D2]/30 hover:bg-[#0056D2]/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="mt-8">
                  <h2 className="text-lg font-bold text-[#1f1f1f]">
                    About this book
                  </h2>
                  <p className="mt-4 text-[15px] leading-[1.8] text-[#373737]">
                    {book.description}
                  </p>
                </div>

                {/* Modules/Chapters Preview */}
                <div className="mt-8">
                  <h2 className="text-lg font-bold text-[#1f1f1f]">
                    Contents
                  </h2>
                  <div className="mt-4 space-y-3">
                    {[
                      { title: "Introduction & Fundamentals", pages: "pp. 1-45", duration: "Core concepts" },
                      { title: "Key Concepts & Definitions", pages: "pp. 46-95", duration: "Essential terms" },
                      { title: "Policy & Governance", pages: "pp. 96-150", duration: "Framework analysis" },
                      { title: "Advanced Topics", pages: "pp. 151-200", duration: "In-depth study" },
                    ].map((mod, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 rounded-xl border border-[#e5e5e5] bg-white p-4 transition-all hover:border-[#d4d4d4] hover:shadow-sm"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0056D2]/8 text-sm font-bold text-[#0056D2]">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1f1f1f]">
                            {mod.title}
                          </p>
                          <p className="mt-0.5 text-xs text-[#6b6b6b]">
                            {mod.pages} · {mod.duration}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-[#9a9a9a]" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab: Details */}
            {activeTab === "details" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-8"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { icon: FileText, label: "Pages", value: String(book.pages) },
                    { icon: Globe, label: "Language", value: book.language },
                    { icon: Users, label: "Publisher", value: book.publisher },
                    { icon: Hash, label: "ISBN", value: book.isbn },
                    {
                      icon: BarChart3,
                      label: "Category",
                      value: book.category,
                    },
                    { icon: Clock, label: "Published", value: "2024" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-4 rounded-xl border border-[#e5e5e5] bg-white p-4 transition-all hover:border-[#d4d4d4] hover:shadow-sm"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f5f5f5]">
                        <item.icon className="h-5 w-5 text-[#6b6b6b]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#9a9a9a]">
                          {item.label}
                        </p>
                        <p className="text-sm font-semibold text-[#1f1f1f] truncate">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tab: Reviews */}
            {activeTab === "reviews" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-8"
              >
                {/* Rating Summary */}
                <div className="flex items-start gap-8">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-[#1f1f1f]">
                      {book.rating}
                    </p>
                    <div className="mt-2 flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(book.rating)
                              ? "fill-[#f59e0b] text-[#f59e0b]"
                              : "text-[#d4d4d4]"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-[#6b6b6b]">
                      {book.reviewCount.toLocaleString()} reviews
                    </p>
                  </div>

                  <div className="flex-1 space-y-2">
                    {ratingDistribution.map((d) => (
                      <div key={d.star} className="flex items-center gap-3">
                        <span className="w-3 text-right text-xs font-semibold text-[#6b6b6b]">
                          {d.star}
                        </span>
                        <Star className="h-3.5 w-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                        <div className="flex-1 h-2 rounded-full bg-[#e5e5e5] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#f59e0b] transition-all"
                            style={{ width: `${d.pct}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-xs text-[#9a9a9a]">
                          {d.pct.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="mt-8 space-y-4">
                  {bookReviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-xl border border-[#e5e5e5] p-5 transition-all hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={review.userAvatar}
                          alt={review.userName}
                          width={36}
                          height={36}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-[#1f1f1f]">
                            {review.userName}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating
                                      ? "fill-[#f59e0b] text-[#f59e0b]"
                                      : "text-[#d4d4d4]"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[11px] text-[#9a9a9a]">
                              {formatDate(review.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-[1.8] text-[#373737]">
                        {review.comment}
                      </p>
                      <div className="mt-3 flex items-center gap-4">
                        <button className="text-xs font-medium text-[#9a9a9a] transition-colors hover:text-[#0056D2]">
                          👍 Helpful ({review.helpful})
                        </button>
                        <button className="text-xs font-medium text-[#9a9a9a] transition-colors hover:text-[#0056D2]">
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* ═══════ RIGHT: Sticky Card ═══════ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
              {/* Cover */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#f9f9f9]">
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  sizes="380px"
                  className="object-cover"
                  priority
                />
                {discount > 0 && (
                  <span className="absolute top-3 left-3 rounded-lg bg-[#0056D2] px-2.5 py-1 text-xs font-bold text-white">
                    -{discount}% OFF
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-2.5">
                <span className="text-3xl font-bold text-[#1f1f1f]">
                  {formatPrice(book.price)}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-base text-[#9a9a9a] line-through">
                      {formatPrice(book.originalPrice)}
                    </span>
                    <span className="rounded-md bg-[#059669]/10 px-2 py-0.5 text-xs font-bold text-[#059669]">
                      {discount}% off
                    </span>
                  </>
                )}
              </div>

              {/* Sale info */}
              <p className="mt-2 text-xs text-[#6b6b6b]">
                <span className="font-semibold text-[#059669]">
                  Sale ends soon!
                </span>{" "}
                Get it before it&apos;s gone.
              </p>

              {/* Buttons */}
              <div className="mt-5 space-y-3">
                <button
                  onClick={handleBuyNow}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0056D2] text-sm font-bold text-white transition-all hover:bg-[#004bb5] active:scale-[0.98]"
                >
                  <Zap className="h-4 w-4" /> Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-[#0056D2] text-sm font-bold text-[#0056D2] transition-all hover:bg-[#0056D2]/5 active:scale-[0.98]"
                >
                  <ShoppingCart className="h-4 w-4" /> Add to Cart
                </button>
              </div>

              {/* Secondary */}
              <div className="mt-4 flex items-center justify-center gap-4">
                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    wishlisted
                      ? "text-[#e11d48]"
                      : "text-[#6b6b6b] hover:text-[#1f1f1f]"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`}
                  />
                  Wishlist
                </button>
                <span className="text-[#d4d4d4]">|</span>
                <button className="flex items-center gap-1.5 text-sm font-medium text-[#6b6b6b] transition-colors hover:text-[#1f1f1f]">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>

              {/* Divider */}
              <div className="my-5 h-px bg-[#e5e5e5]" />

              {/* Book Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9a9a9a]">
                  Book Details
                </h3>
                {[
                  { label: "Pages", value: String(book.pages) },
                  { label: "Language", value: book.language },
                  { label: "Publisher", value: book.publisher },
                  { label: "ISBN", value: book.isbn },
                ].map((d) => (
                  <div key={d.label} className="flex items-center justify-between">
                    <span className="text-sm text-[#6b6b6b]">{d.label}</span>
                    <span className="text-sm font-semibold text-[#1f1f1f]">
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="my-5 h-px bg-[#e5e5e5]" />

              {/* Instant Access */}
              <div className="flex items-center gap-3 rounded-xl bg-[#0056D2]/5 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0056D2]/10">
                  <Zap className="h-4 w-4 text-[#0056D2]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1f1f1f]">
                    Instant Digital Access
                  </p>
                  <p className="text-[11px] text-[#6b6b6b]">
                    Read immediately after purchase
                  </p>
                </div>
              </div>

              {/* Guarantee */}
              <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#f9f9f9] p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5f5f5]">
                  <Award className="h-4 w-4 text-[#6b6b6b]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1f1f1f]">
                    30-Day Money-Back Guarantee
                  </p>
                  <p className="text-[11px] text-[#6b6b6b]">
                    Full refund if not satisfied
                  </p>
                </div>
              </div>

              {/* Read Sample */}
              <Link
                href={`/reader/${book.id}`}
                className="mt-4 flex h-11 items-center justify-center gap-2 rounded-full border border-[#e5e5e5] text-sm font-semibold text-[#1f1f1f] transition-all hover:border-[#d4d4d4] hover:bg-[#f9f9f9]"
              >
                <Play className="h-4 w-4 text-[#0056D2]" /> Read Free Sample
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ═══════ RELATED BOOKS ═══════ */}
        {relatedBooks.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 border-t border-[#e5e5e5] pt-12"
          >
            <h2 className="text-xl font-bold text-[#1f1f1f]">
              Related Books
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
              {relatedBooks.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* ═══════ MOBILE STICKY BAR ═══════ */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e5e5e5] bg-white/95 px-4 py-3 backdrop-blur-2xl lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold text-[#1f1f1f]">
              {book.title}
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-[#0056D2]">
                {formatPrice(book.price)}
              </span>
              {discount > 0 && (
                <span className="text-xs text-[#9a9a9a] line-through">
                  {formatPrice(book.originalPrice)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleBuyNow}
            className="flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-[#0056D2] px-5 text-sm font-bold text-white shadow-lg shadow-[#0056D2]/25"
          >
            <Zap className="h-4 w-4" /> Buy Now
          </button>
          <button
            onClick={handleAddToCart}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#0056D2] text-[#0056D2]"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
