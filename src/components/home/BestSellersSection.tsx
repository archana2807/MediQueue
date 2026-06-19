"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import { books } from "@/data/books";
import { formatPrice, getDiscountPercent } from "@/lib/utils";

export default function BestSellersSection() {
  const bestsellers = books.sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 6);

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold sm:text-3xl text-gray-900">Best Selling Books</h2>
            <p className="mt-2 text-gray-500">Most popular among students this month</p>
          </motion.div>
          <Link href="/books" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#0056D2] hover:text-[#004BB5] transition-colors">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bestsellers.map((book, i) => {
            const discount = getDiscountPercent(book.originalPrice, book.price);
            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={`/books/${book.id}`}>
                  <div className="group flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md">
                    <div className="relative h-[80px] w-[56px] flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <Image src={book.coverImage} alt={book.title} fill sizes="56px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      {discount > 0 && (
                        <span className="absolute top-0.5 left-0.5 rounded bg-red-500 px-1 py-px text-[8px] font-bold text-white">-{discount}%</span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between min-w-0 py-0.5">
                      <div>
                        <span className="inline-block rounded bg-[#0056D2]/10 px-1.5 py-px text-[9px] font-semibold text-[#0056D2]">{book.category}</span>
                        <h3 className="mt-1 text-sm font-semibold line-clamp-1 group-hover:text-[#0056D2] transition-colors duration-150">{book.title}</h3>
                        <p className="text-[11px] text-gray-500 mt-0.5">{book.author}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-medium">{book.rating}</span>
                          <span className="text-[10px] text-gray-400">({book.reviewCount.toLocaleString()})</span>
                        </div>
                        <span className="text-sm font-bold text-[#0056D2]">{formatPrice(book.price)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/books" className="inline-flex items-center gap-1 text-sm font-semibold text-[#0056D2]">
            View All Books <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
