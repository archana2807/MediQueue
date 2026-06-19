"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  Clock,
  ShoppingCart,
  Play,
  Filter,
  SortDesc,
  Library,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLibrary } from "@/hooks/use-library";
import { cn, formatPrice, formatDate } from "@/lib/utils";

export default function LibraryContent() {
  const { data, isLoading } = useLibrary();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"reading" | "history">("reading");

  const filteredBooks = useMemo(() => {
    if (!data?.books) return [];
    return data.books.filter(
      (book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
    );
  }, [data?.books, search]);

  const sortedBooks = useMemo(() => {
    return [...filteredBooks].sort(
      (a, b) => new Date(b.lastRead).getTime() - new Date(a.lastRead).getTime()
    );
  }, [filteredBooks]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border-0 shadow-md">
            <CardContent className="flex gap-4 p-4">
              <div className="h-32 w-24 animate-pulse rounded-lg bg-muted" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search + Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-background shadow-sm"
          />
        </div>
        <div className="flex gap-2 bg-muted/50 p-1 rounded-xl">
          <Button
            variant={activeTab === "reading" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("reading")}
            className={cn(
              "rounded-lg",
              activeTab === "reading" && "shadow-sm"
            )}
          >
            <BookOpen className="mr-1.5 h-4 w-4" />
            Continue Reading
          </Button>
          <Button
            variant={activeTab === "history" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("history")}
            className={cn(
              "rounded-lg",
              activeTab === "history" && "shadow-sm"
            )}
          >
            <Clock className="mr-1.5 h-4 w-4" />
            History
          </Button>
        </div>
      </div>

      {/* Reading Tab */}
      <AnimatePresence mode="wait">
        {activeTab === "reading" && (
          <motion.div
            key="reading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {sortedBooks.length > 0 ? (
              sortedBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="group overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="flex gap-3 p-3 sm:gap-4 sm:p-4">
                      <Link
                        href={`/reader/${book.bookId}`}
                        className="relative h-36 w-24 sm:h-32 sm:w-20 flex-shrink-0 overflow-hidden rounded-lg shadow-sm ring-1 ring-border"
                      >
                        <Image
                          src={book.coverImage}
                          alt={book.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {book.progress > 0 && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        )}
                        {book.progress > 0 && book.progress < 100 && (
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 backdrop-blur-sm">
                              <Play className="h-3 w-3 text-white fill-white" />
                              <span className="text-[10px] font-semibold text-white">
                                Continue
                              </span>
                            </div>
                          </div>
                        )}
                        {book.progress === 100 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                              <BookOpen className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                      </Link>
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div>
                          <Link
                            href={`/reader/${book.bookId}`}
                            className="font-bold line-clamp-1 group-hover:text-primary transition-colors text-sm sm:text-base"
                          >
                            {book.title}
                          </Link>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                            by {book.author}
                          </p>
                          <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                            Last read: {formatDate(book.lastRead)}
                          </p>
                        </div>
                        <div className="space-y-1.5 mt-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold">{book.progress}%</span>
                          </div>
                          <Progress value={book.progress} className="h-2" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start">
                        <Button size="sm" asChild className="h-9 text-xs font-semibold shadow-sm">
                          <Link href={`/reader/${book.bookId}`}>
                            <BookOpen className="mr-1 h-3 w-3" /> Read
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 sm:py-16"
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-muted to-muted/50 shadow-inner">
                  <BookOpen className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-xl font-bold">No books found</h3>
                <p className="mt-2 text-muted-foreground max-w-md mx-auto leading-relaxed">
                  {search
                    ? "Try a different search term."
                    : "Your library is empty. Browse our collection and purchase your first book!"}
                </p>
                {!search && (
                  <Button asChild className="mt-6 shadow-md" size="lg">
                    <Link href="/books">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Browse Books
                    </Link>
                  </Button>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {data?.purchaseHistory && data.purchaseHistory.length > 0 ? (
              data.purchaseHistory.map((purchase, index) => (
                <motion.div
                  key={purchase.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
                      <div className="relative h-20 w-14 flex-shrink-0 overflow-hidden rounded-lg shadow-sm ring-1 ring-border">
                        <Image
                          src={purchase.coverImage}
                          alt={purchase.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold line-clamp-1">
                          {purchase.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(purchase.purchaseDate)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-primary">
                          {formatPrice(purchase.price)}
                        </p>
                        <Badge
                          variant="secondary"
                          className="mt-1 text-[10px] font-medium"
                        >
                          {purchase.paymentMethod}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-muted to-muted/50 shadow-inner">
                  <Clock className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-xl font-bold">No purchases yet</h3>
                <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                  Your purchase history will appear here.
                </p>
                <Button asChild className="mt-6 shadow-md" size="lg">
                  <Link href="/books">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Start Shopping
                  </Link>
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}