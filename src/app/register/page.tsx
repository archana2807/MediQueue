"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Eye, EyeOff, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="flex min-h-[calc(100vh-60px)] bg-white">
      {/* Left side - Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-16 sm:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[360px]"
        >
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-12">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0056D2]">
              <BookOpen className="h-[18px] w-[18px] text-white" />
            </div>
            <span className="text-xl font-bold text-[#111827]">ExamVerse</span>
          </Link>

          {/* Heading */}
          <h1 className="text-[26px] font-semibold text-[#111827] tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-[15px] text-[#6b7280]">
            Start preparing for your dream exam.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            {/* Name */}
            <div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
                className="h-12 w-full rounded-lg border border-[#e5e7eb] bg-white px-4 text-[15px] text-[#111827] placeholder:text-[#9ca3af] outline-none transition-all duration-200 focus:border-[#0056D2] focus:ring-[3px] focus:ring-[#0056D2]/10"
              />
            </div>

            {/* Email */}
            <div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="h-12 w-full rounded-lg border border-[#e5e7eb] bg-white px-4 text-[15px] text-[#111827] placeholder:text-[#9ca3af] outline-none transition-all duration-200 focus:border-[#0056D2] focus:ring-[3px] focus:ring-[#0056D2]/10"
              />
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="h-12 w-full rounded-lg border border-[#e5e7eb] bg-white px-4 pr-12 text-[15px] text-[#111827] placeholder:text-[#9ca3af] outline-none transition-all duration-200 focus:border-[#0056D2] focus:ring-[3px] focus:ring-[#0056D2]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 rounded border-[#d1d5db] text-[#0056D2] focus:ring-[#0056D2]/20 cursor-pointer accent-[#0056D2]"
                />
                <span className="text-[13px] text-[#6b7280] leading-relaxed">
                  I agree to the{" "}
                  <Link href="#" className="text-[#0056D2] hover:text-[#004bb5]">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-[#0056D2] hover:text-[#004bb5]">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-lg bg-[#0056D2] text-[15px] font-medium text-white hover:bg-[#004bb5] transition-all duration-150 disabled:opacity-50 mt-1"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#f3f4f6]" />
            <span className="text-[13px] text-[#9ca3af]">or</span>
            <div className="h-px flex-1 bg-[#f3f4f6]" />
          </div>

          {/* Social login */}
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-[#e5e7eb] bg-white text-[14px] font-medium text-[#374151] transition-all duration-150 hover:bg-[#fafafa] active:bg-[#f3f4f6]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Sign in link */}
          <p className="mt-8 text-center text-[14px] text-[#6b7280]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#0056D2] hover:text-[#004bb5] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side - Visual (hidden on mobile) */}
      <div className="hidden lg:flex w-[480px] xl:w-[540px] flex-col justify-between bg-[#0a0f1a] p-12 relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#0056D2]/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[400px] w-[400px] rounded-full bg-[#0056D2]/10 blur-[100px]" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-20">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-[15px] font-medium text-white/60">ExamVerse</span>
          </div>

          <h2 className="text-[32px] font-bold text-white leading-[1.2] tracking-tight">
            Ace your next exam
            <br />
            <span className="text-[#4d9fff]">with confidence.</span>
          </h2>

          <p className="mt-5 text-[15px] text-white/40 leading-relaxed max-w-[340px]">
            Get access to expert-curated e-books, practice tests, and personalized study plans.
          </p>

          {/* Features */}
          <div className="mt-14 space-y-3">
            {[
              "500+ expert-curated e-books",
              "Personalized study recommendations",
              "Track progress across exams",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.06] px-5 py-3.5 backdrop-blur-sm">
                <CheckCircle2 className="h-[18px] w-[18px] text-emerald-400 shrink-0" />
                <span className="text-[14px] text-white/50">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 flex items-center gap-6">
          {[
            { value: "10K+", label: "Students" },
            { value: "50+", label: "Exams" },
            { value: "4.8", label: "Rating" },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-4">
              {i > 0 && <div className="h-8 w-px bg-white/10" />}
              <div>
                <p className="text-[18px] font-bold text-white">{stat.value}</p>
                <p className="text-[12px] text-white/30">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
