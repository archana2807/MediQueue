"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, BookOpen, Users, Star, Award } from "lucide-react";

const features = [
  "500+ curated e-books for all major exams",
  "Expert authors and verified content",
  "Interactive reader with notes & highlights",
];

const stats = [
  { icon: BookOpen, value: "500+", label: "E-Books" },
  { icon: Users, value: "50K+", label: "Students" },
  { icon: Award, value: "8+", label: "Exams" },
  { icon: Star, value: "4.7", label: "Rating" },
];

export default function CTASection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-[#0056D2]"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#004BB5] to-[#0056D2]" />
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
          </div>

          <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:gap-16 lg:p-16">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                Start Your Exam Preparation Today
              </h2>
              <p className="mt-4 text-base text-white/70 leading-relaxed">
                Join 50,000+ students who are already using ExamVerse to prepare for their dream exams.
              </p>
              <div className="mt-6 space-y-3">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-2.5"
                  >
                    <CheckCircle className="h-5 w-5 text-white/40 flex-shrink-0" />
                    <span className="text-sm text-white/80">{feature}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/books" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#0056D2] transition-all duration-200 hover:bg-white/90 hover:shadow-lg">
                  Browse Books <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/library" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10">
                  My Library
                </Link>
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex flex-col items-center justify-center rounded-xl bg-white/10 p-6 text-center backdrop-blur-sm"
                >
                  <stat.icon className="h-6 w-6 text-white/50" />
                  <div className="mt-3 text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/50">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
