"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import type { Book } from "@/types";

interface BookCardProps {
  book: Book;
  view?: "grid" | "list";
}

export default function BookCard({ book, view = "grid" }: BookCardProps) {
  const discount = getDiscountPercent(book.originalPrice, book.price);

  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link href={`/books/${book.id}`}>
          <div className="group flex gap-5 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md">
            <div className="relative h-36 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                sizes="112px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {discount > 0 && (
                <span className="absolute top-2 left-2 rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  -{discount}%
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between min-w-0">
              <div>
                <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
                  {book.category}
                </span>
                <h3 className="mt-2 font-semibold text-base line-clamp-1 group-hover:text-[#0056D2] transition-colors duration-150">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">{book.author}</p>
                <div className="mt-2 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium text-gray-700">{book.rating}</span>
                  <span className="text-xs text-gray-400">({book.reviewCount.toLocaleString()})</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-gray-900">{formatPrice(book.price)}</span>
                  {discount > 0 && (
                    <span className="text-sm text-gray-400 line-through">{formatPrice(book.originalPrice)}</span>
                  )}
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); }}
                  className="flex h-9 items-center gap-1.5 rounded-lg bg-[#0056D2] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#004BB5]"
                >
                  <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/books/${book.id}`}>
        <div className="group h-full overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-lg">
          {/* Image */}
          <div className="relative h-44 overflow-hidden bg-gray-100">
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {discount > 0 && (
              <span className="absolute top-2.5 left-2.5 rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                -{discount}% OFF
              </span>
            )}
            {book.isBestSeller && (
              <span className="absolute top-2.5 right-2.5 rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                Bestseller
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                {book.category}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-gray-700">{book.rating}</span>
              </div>
            </div>

            <h3 className="mt-2.5 font-semibold text-sm line-clamp-2 leading-snug text-gray-900 group-hover:text-[#0056D2] transition-colors duration-150 min-h-[40px]">
              {book.title}
            </h3>

            <p className="mt-1 text-xs text-gray-500 truncate">{book.author}</p>

            <div className="mt-3 flex items-end justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-gray-900">{formatPrice(book.price)}</span>
                {discount > 0 && (
                  <span className="text-xs text-gray-400 line-through">{formatPrice(book.originalPrice)}</span>
                )}
              </div>
              <span className="text-[10px] text-gray-400">{book.reviewCount.toLocaleString()} reviews</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
