import { LoginForm } from "@/components/auth/LoginForm";
import {
  Activity,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  KeyRound,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-2">
      {/* Left Side - Hero (Bottom on Mobile) */}
      <div className="relative flex flex-col justify-center px-6 py-10 sm:px-16 order-2 lg:order-1 bg-gradient-to-br from-slate-50 via-emerald-50/50 to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/50 border-t lg:border-t-0 lg:border-r border-border/50">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-md mx-auto lg:mx-0 space-y-10">
          {/* Logo & Headline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  MediQueue
                </span>
                <p className="text-xs text-muted-foreground font-medium">Hospital Management</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              AI-Powered Hospital Management System for Patients, Doctors, and Administrators.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-3">
            {[
              { icon: Users, label: "Patient & Doctor Management", desc: "Complete user lifecycle" },
              { icon: Calendar, label: "Smart Scheduling", desc: "AI-optimized appointments" },
              { icon: FileText, label: "Report Analysis", desc: "AI-powered insights" },
              { icon: MessageSquare, label: "AI Assistant", desc: "24/7 hospital support" },
            ].map((feature, index) => (
              <div
                key={feature.label}
                className={`flex items-center gap-4 p-3 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/20 hover:bg-background/80 transition-all duration-200 animate-fade-in-up`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{feature.label}</p>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Demo Credentials */}
          <Card className="shadow-md border-border/50 bg-background/70 backdrop-blur-md">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                <KeyRound className="h-3.5 w-3.5" />
                <span>Quick Demo Access</span>
                <span className="ml-auto text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono">
                  Pass: Admain
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs border-t border-border/50 pt-3">
                {[
                  { role: "Admin", email: "admin@gmail.com", color: "bg-violet-500" },
                  { role: "Doctor", email: "doctor@gmail.com", color: "bg-emerald-500" },
                  { role: "Patient", email: "patient@gmail.com", color: "bg-amber-500" },
                ].map((cred) => (
                  <div key={cred.role} className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <div className={`h-2 w-2 rounded-full ${cred.color}`} />
                      <p className="font-bold text-foreground">{cred.role}</p>
                    </div>
                    <p className="text-muted-foreground font-mono text-[11px] truncate">{cred.email}</p>
                  </div>
                ))}
              </div>

              <a
                href="/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors pt-1"
              >
                <Zap className="h-3 w-3" />
                View End-to-End Demo Flow
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Form (Top on Mobile) */}
      <div className="flex items-center justify-center p-6 sm:p-10 order-1 lg:order-2 bg-background">
        <LoginForm className="w-full max-w-sm animate-fade-in-up stagger-4" />
      </div>
    </div>
  );
}