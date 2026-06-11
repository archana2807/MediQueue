import { LoginForm } from "@/components/auth/LoginForm";
import { 
  Activity, 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  KeyRound 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  return (
    // Changed grid flow: mobile stacks normally (form top), lg screens use 2 columns
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-2 bg-background">
      
      {/* Right Side (Now Top on Mobile) */}
      <div className="flex items-center justify-center p-6 sm:p-10 order-1 lg:order-2 bg-background">
        <LoginForm className="w-full max-w-sm" />
      </div>

      {/* Left Side (Now Bottom on Mobile) */}
      <div className="flex flex-col justify-center bg-zinc-50 dark:bg-zinc-900/50 px-6 py-10 sm:px-16 order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-border">
        <div className="max-w-md mx-auto lg:mx-0 space-y-8">
          
          {/* Logo & Headline */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-primary">
              <Activity className="h-7 w-7 stroke-[2.5]" />
              <span className="text-2xl font-bold tracking-tight">MediQueue</span>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              AI-Powered Hospital Management System for Patients, Doctors, and Administrators.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-4 w-4" />
              </div>
              Patient & Doctor Management
            </div>

            <div className="flex items-center gap-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-4 w-4" />
              </div>
              Smart Appointment Scheduling
            </div>

            <div className="flex items-center gap-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-4 w-4" />
              </div>
              AI Medical Report Analysis
            </div>

            <div className="flex items-center gap-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageSquare className="h-4 w-4" />
              </div>
              AI Hospital Assistant
            </div>
          </div>

          {/* Low-Profile Compact Demo Credentials */}
          <Card className="shadow-sm border-neutral-200/80 dark:border-zinc-800 bg-background/50 backdrop-blur-sm">
            <CardContent className="p-4 space-y-3">
              
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground">
                <KeyRound className="h-3.5 w-3.5" />
                <span>Quick Demo Access (Password: Admain)</span>
                
              </div>

              {/* Responsive columns to reduce height */}
              <div className="grid grid-cols-3 gap-2 text-xs border-t border-border/60 pt-3">
                <div className="space-y-0.5">
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">Admin</p>
                  <p className="text-muted-foreground font-mono truncate">admin@gmail.com</p>
                  
                </div>

                <div className="space-y-0.5 border-l border-border/60 pl-2">
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">Doctor</p>
                  <p className="text-muted-foreground font-mono truncate">doctor@gmail.com</p>
                </div>

                <div className="space-y-0.5 border-l border-border/60 pl-2">
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">Patient</p>
                  <p className="text-muted-foreground font-mono truncate">patient@gmail.com</p>
                </div>
              </div>
                <div >
  <a
    href="/reports/demo-flow.pdf"
    target="_blank"
    rel="noopener noreferrer"
    className="text-sm text-blue-600 underline"
  >
    MediQueue End-to-End Demo Flow
  </a>
</div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}