"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ShoppingCart,
  Library,
  Menu,
  X,
  Search,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";

const navLinks = [
  { href: "/books", label: "Explore" },
  { href: "/library", label: "My Library" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-200 bg-white",
        scrolled ? "shadow-md border-gray-200" : "border-gray-100"
      )}
    >
      <nav className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-1.5 group flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0056D2] transition-transform duration-200 group-hover:scale-105">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-[20px] font-bold tracking-tight text-[#0056D2] hidden sm:block">
              ExamVerse
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-[14px] font-medium transition-colors duration-150",
                    isActive
                      ? "text-[#0056D2] bg-[#0056D2]/5"
                      : "text-gray-700 hover:text-[#0056D2] hover:bg-gray-50"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Search + Cart + Auth */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/books"
            className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-[7px] text-[14px] text-gray-500 transition-all duration-200 hover:border-[#0056D2] hover:text-[#0056D2] hover:shadow-sm"
          >
            <Search className="h-4 w-4" />
            <span className="hidden xl:inline">Search books...</span>
          </Link>

          <div className="relative ml-1">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 text-gray-600 hover:text-[#0056D2] hover:bg-gray-50 transition-colors duration-150"
              asChild
            >
              <Link href="/checkout">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#0056D2] px-1 text-[10px] font-bold text-white"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </motion.span>
                )}
              </Link>
            </Button>
          </div>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          <Button
            variant="ghost"
            size="sm"
            className="text-[14px] font-semibold text-[#0056D2] hover:bg-[#0056D2]/5 h-9 px-4 transition-colors duration-150"
            asChild
          >
            <Link href="/login">Log In</Link>
          </Button>

          <Button
            size="sm"
            className="rounded-full bg-[#0056D2] text-white hover:bg-[#004BB5] font-semibold px-5 h-9 text-[14px] shadow-none transition-all duration-200 hover:shadow-md"
            asChild
          >
            <Link href="/register">Join for Free</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 text-gray-600"
            asChild
          >
            <Link href="/checkout">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#0056D2] px-1 text-[9px] font-bold text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-t border-gray-100 overflow-hidden bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors duration-150",
                      pathname === link.href
                        ? "text-[#0056D2] bg-[#0056D2]/5"
                        : "text-gray-700 hover:text-[#0056D2] hover:bg-gray-50"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="flex-1 justify-start gap-2.5 text-gray-600 hover:text-[#0056D2]">
                <Link href="/books" onClick={() => setMobileOpen(false)}>
                  <Search className="h-4 w-4" /> Browse Books
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="flex-1 justify-start gap-2.5 text-gray-600 hover:text-[#0056D2]">
                <Link href="/library" onClick={() => setMobileOpen(false)}>
                  <Library className="h-4 w-4" /> My Library
                </Link>
              </Button>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 flex gap-2">
              <Button variant="outline" size="sm" asChild className="flex-1 rounded-full border-gray-300 text-[#0056D2] font-semibold">
                <Link href="/login" onClick={() => setMobileOpen(false)}>Log In</Link>
              </Button>
              <Button size="sm" asChild className="flex-1 rounded-full bg-[#0056D2] text-white hover:bg-[#004BB5] font-semibold">
                <Link href="/register" onClick={() => setMobileOpen(false)}>Join for Free</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
