"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ArrowRight, Star, Users, BookOpen } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const quickCategories = ["UPSC", "SSC", "JEE", "NEET", "Banking", "GATE", "CAT", "GATE"];

export default function HeroSection() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/books?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#0056D2]">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#004BB5] to-[#0056D2]" />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/[0.06] blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/[0.04] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              Trusted by 50,000+ students
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.1]"
          >
            Master your next exam
            <br />
            <span className="text-white/80">with the right books</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-white/70 sm:text-xl max-w-xl mx-auto leading-relaxed"
          >
            Quality e-books for UPSC, SSC, Banking, Railway, JEE, NEET, CAT & GATE.
            Learn from India&apos;s best authors.
          </motion.p>

          {/* Search bar */}
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleSearch}
            className="mt-8 mx-auto max-w-xl"
          >
            <div className="flex items-center rounded-full bg-white p-1.5 shadow-lg shadow-black/10">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for books, exams, or topics..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 w-full rounded-full bg-transparent pl-12 pr-4 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="h-12 rounded-full bg-[#0056D2] px-8 text-[15px] font-semibold text-white transition-colors hover:bg-[#004BB5]"
              >
                Search
              </button>
            </div>
          </motion.form>

          {/* Popular categories */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-sm text-white/50">Popular:</span>
            {quickCategories.slice(0, 6).map((cat) => (
              <Link
                key={cat}
                href={`/books?category=${cat.toLowerCase()}`}
                className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white hover:border-white/25"
              >
                {cat}
              </Link>
            ))}
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8"
          >
            {[
              { icon: BookOpen, text: "500+ E-Books" },
              { icon: Users, text: "50K+ Students" },
              { icon: Star, text: "4.7 Average Rating" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-sm text-white/60">
                <item.icon className="h-4 w-4" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full text-white">
          <path d="M0 60V20C240 45 480 5 720 20C960 35 1200 0 1440 20V60H0Z" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
}
