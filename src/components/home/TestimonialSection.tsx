"use client";

import { motion } from "framer-motion";
import { Star, Quote, CheckCircle } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Arjun Singh",
    role: "UPSC CSE 2025 — AIR 342",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
    rating: 5,
    text: "ExamVerse has been a game-changer for my UPSC preparation. The quality of e-books is outstanding and the reading experience is smooth.",
  },
  {
    name: "Priya Nair",
    role: "NEET 2025 — Score: 680/720",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    rating: 5,
    text: "I cracked NEET with the help of ExamVerse's biology and chemistry books. The content is well-structured and easy to understand.",
  },
  {
    name: "Vikram Rao",
    role: "JEE Main 2025 — 99.2 Percentile",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
    rating: 5,
    text: "The physics book for JEE is phenomenal. The problem-solving approach and practice sets are exactly what I needed.",
  },
  {
    name: "Sneha Joshi",
    role: "SSC CGL 2025 — AIR 89",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
    rating: 5,
    text: "Thanks to ExamVerse, I qualified SSC CGL in my first attempt. The mathematics book is a must-have for all SSC aspirants.",
  },
];

export default function TestimonialSection() {
  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0056D2]/20 bg-[#0056D2]/5 px-4 py-1.5 text-xs font-semibold text-[#0056D2]">
            <CheckCircle className="h-3.5 w-3.5" />
            Success Stories
          </span>
          <h2 className="mt-4 text-2xl font-bold sm:text-3xl text-gray-900">
            What Our Students Say
          </h2>
          <p className="mt-2 text-gray-500">Join thousands of successful candidates</p>
        </motion.div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex"
            >
              <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-gray-300 hover:shadow-md w-full">
                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`h-4 w-4 ${
                        j < t.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="mt-3 text-[13px] leading-relaxed text-gray-600 flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Author */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="rounded-full ring-2 ring-gray-100"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{t.name}</p>
                    <p className="text-xs text-[#0056D2] font-medium truncate">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
