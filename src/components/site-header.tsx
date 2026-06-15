"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, PanelLeft } from "lucide-react";

// User profile is in sidebar footer

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";

const routeNames: Record<string, string> = {
  dashboard: "Dashboard",
  appointments: "Appointments",
  doctors: "Doctors",
  patients: "Patients",
  reports: "Reports",
  queue: "Queue Management",
  profile: "Profile",
  interviews: "AI Interview Agent",
};

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => !isUuid(segment));

  const pageTitle =
    segments.length > 0
      ? routeNames[segments[segments.length - 1]] ??
        segments[segments.length - 1]
          .replaceAll("-", " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : "Dashboard";

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b border-white/5 bg-[oklch(0.145_0.007_285.823)] backdrop-blur-xl animate-fade-in-down">
      <div className="flex h-14 w-full items-center gap-3 px-4 lg:px-6">
        {/* Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="group relative size-9 shrink-0 rounded-lg transition-all duration-200 hover:bg-white/10 hover:text-white"
        >
          <PanelLeft className="size-4 transition-transform duration-200 group-hover:scale-110" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>

        <Separator
          orientation="vertical"
          className="h-5 bg-white/10"
        />

        {/* Page Title & Breadcrumb */}
        <div className="flex flex-1 items-center gap-2">
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold tracking-tight text-white">
              {pageTitle}
            </h1>
            <Breadcrumb className="hidden md:block">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/dashboard"
                      className="text-xs text-white/50 transition-colors duration-200 hover:text-emerald-400"
                    >
                      MediQueue
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {segments.map((segment, index) => {
                  const href =
                    "/" + segments.slice(0, index + 1).join("/");
                  const isLast = index === segments.length - 1;
                  const label =
                    routeNames[segment] ??
                    segment
                      .replaceAll("-", " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase());

                  return (
                    <div key={href} className="flex items-center">
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage className="text-xs font-medium text-white">
                            {label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link
                              href={href}
                              className="text-xs text-white/50 transition-colors duration-200 hover:text-emerald-400"
                            >
                              {label}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            className="group size-9 rounded-lg transition-all duration-200 hover:bg-white/10 hover:text-white"
          >
            <Search className="size-4 transition-transform duration-200 group-hover:scale-110" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="group relative size-9 rounded-lg transition-all duration-200 hover:bg-white/10 hover:text-white"
          >
            <Bell className="size-4 transition-transform duration-200 group-hover:scale-110" />
            <span className="absolute right-1.5 top-1.5 flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="sr-only">Notifications</span>
          </Button>

          <Separator
            orientation="vertical"
            className="mx-1 h-5 bg-white/10"
          />
        </div>
      </div>
    </header>
  );
}
