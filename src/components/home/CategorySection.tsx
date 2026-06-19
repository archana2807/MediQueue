"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Landmark,
  FileText,
  Building2,
  Train,
  Atom,
  HeartPulse,
  GraduationCap,
  Cpu,
  ArrowRight,
} from "lucide-react";
import type { Category } from "@/types";

const iconMap: Record<string, React.ElementType> = {
  Landmark,
  FileText,
  Building2,
  Train,
  Atom,
  HeartPulse,
  GraduationCap,
  Cpu,
};

const categoryStyles: Record<
  string,
  {
    icon: string;
    iconBg: string;
    hoverBorder: string;
    hoverShadow: string;
    arrow: string;
  }
> = {
  UPSC: {
    icon: "text-[#0056D2]",
    iconBg: "bg-[#0056D2]/8",
    hoverBorder: "hover:border-[#0056D2]/30",
    hoverShadow: "hover:shadow-[0_8px_30px_-8px_rgba(0,86,210,0.2)]",
    arrow: "text-[#0056D2]",
  },
  SSC: {
    icon: "text-[#7c3aed]",
    iconBg: "bg-[#7c3aed]/8",
    hoverBorder: "hover:border-[#7c3aed]/30",
    hoverShadow: "hover:shadow-[0_8px_30px_-8px_rgba(124,58,237,0.2)]",
    arrow: "text-[#7c3aed]",
  },
  Banking: {
    icon: "text-[#059669]",
    iconBg: "bg-[#059669]/8",
    hoverBorder: "hover:border-[#059669]/30",
    hoverShadow: "hover:shadow-[0_8px_30px_-8px_rgba(5,150,105,0.2)]",
    arrow: "text-[#059669]",
  },
  Railway: {
    icon: "text-[#ea580c]",
    iconBg: "bg-[#ea580c]/8",
    hoverBorder: "hover:border-[#ea580c]/30",
    hoverShadow: "hover:shadow-[0_8px_30px_-8px_rgba(234,88,12,0.2)]",
    arrow: "text-[#ea580c]",
  },
  JEE: {
    icon: "text-[#0891b2]",
    iconBg: "bg-[#0891b2]/8",
    hoverBorder: "hover:border-[#0891b2]/30",
    hoverShadow: "hover:shadow-[0_8px_30px_-8px_rgba(8,145,178,0.2)]",
    arrow: "text-[#0891b2]",
  },
  NEET: {
    icon: "text-[#e11d48]",
    iconBg: "bg-[#e11d48]/8",
    hoverBorder: "hover:border-[#e11d48]/30",
    hoverShadow: "hover:shadow-[0_8px_30px_-8px_rgba(225,29,72,0.2)]",
    arrow: "text-[#e11d48]",
  },
  CAT: {
    icon: "text-[#d97706]",
    iconBg: "bg-[#d97706]/8",
    hoverBorder: "hover:border-[#d97706]/30",
    hoverShadow: "hover:shadow-[0_8px_30px_-8px_rgba(217,119,6,0.2)]",
    arrow: "text-[#d97706]",
  },
  GATE: {
    icon: "text-[#4f46e5]",
    iconBg: "bg-[#4f46e5]/8",
    hoverBorder: "hover:border-[#4f46e5]/30",
    hoverShadow: "hover:shadow-[0_8px_30px_-8px_rgba(79,70,229,0.2)]",
    arrow: "text-[#4f46e5]",
  },
};

interface CategorySectionProps {
  categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end justify-between"
        >
          <div>
            <span className="inline-flex items-center rounded-full bg-[#0056D2]/8 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-[#0056D2]">
              Categories
            </span>
            <h2 className="mt-3 text-2xl font-bold text-[#1f1f1f] sm:text-3xl">
              Popular Exam Categories
            </h2>
            <p className="mt-1.5 text-sm text-[#6b6b6b]">
              Find books curated for your specific exam
            </p>
          </div>
          <Link
            href="/books"
            className="hidden items-center gap-1.5 text-sm font-semibold text-[#0056D2] transition-colors hover:text-[#004bb5] sm:flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="mt-8 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-none">
          <div className="flex gap-3 sm:grid sm:grid-cols-4 lg:grid-cols-4 sm:gap-4 min-w-max sm:min-w-0">
            {categories.map((category, index) => {
              const Icon = iconMap[category.icon] || FileText;
              const style = categoryStyles[category.name] || {
                icon: "text-[#6b6b6b]",
                iconBg: "bg-[#f5f5f5]",
                hoverBorder: "hover:border-[#d4d4d4]",
                hoverShadow: "hover:shadow-sm",
                arrow: "text-[#6b6b6b]",
              };

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link href={`/books?category=${category.slug}`}>
                    <div
                      className={`group relative w-[150px] sm:w-auto rounded-2xl border border-[#e8e8e8] bg-[#f8f8f8] p-5 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:border-[#d4d4d4] hover:bg-white hover:shadow-lg`}
                    >
                      {/* Icon */}
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${style.iconBg} transition-all duration-300 group-hover:scale-110`}
                      >
                        <Icon className={`h-5 w-5 ${style.icon}`} />
                      </div>

                      {/* Text */}
                      <p className="mt-4 text-[15px] font-bold text-[#1f1f1f] whitespace-nowrap">
                        {category.name}
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#9a9a9a] whitespace-nowrap">
                        {category.bookCount} books
                      </p>

                      {/* Arrow */}
                      <div
                        className={`absolute right-4 bottom-4 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 ${style.arrow}`}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile view all link */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0056D2] transition-colors hover:text-[#004bb5]"
          >
            View all categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
