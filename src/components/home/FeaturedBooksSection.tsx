"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import BookCard from "@/components/books/BookCard";
import { books } from "@/data/books";

export default function FeaturedBooksSection() {
  const featured = books.filter((b) => b.isBestSeller).slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold sm:text-3xl text-gray-900">Featured E-Books</h2>
            <p className="mt-2 text-gray-500">Handpicked bestsellers for your exam prep</p>
          </motion.div>
          <Link href="/books" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#0056D2] hover:text-[#004BB5] transition-colors">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <BookCard book={book} />
            </motion.div>
          ))}
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
