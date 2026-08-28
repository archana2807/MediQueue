"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Activity,
  Stethoscope,
  HeartPulse,
  Shield,
  FileSearch,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

const baseNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    items: [],
  },
  {
    title: "Patients",
    url: "/patients",
    icon: HeartPulse,
    items: [],
  },
  {
    title: "Appointments",
    url: "#",
    icon: CalendarDays,
    items: [
      { title: "All Appointments", url: "/appointments" },
      { title: "Book Appointment", url: "/appointments/new" },
    ],
  },
  {
    title: "My Appointments",
    url: "/my-appointments",
    icon: CalendarDays,
    items: [],
  },
  {
    title: "My Patients",
    url: "/my-patients",
    icon: HeartPulse,
    items: [],
  },
  {
    title: "Doctors",
    url: "/doctors",
    icon: Users,
    items: [],
  },
  {
    title: "Queue Management",
    url: "/queue",
    icon: Activity,
    items: [],
  },
  {
    title: "My Queue",
    url: "/my-queue",
    icon: Activity,
    items: [],
  },
  {
    title: "Report Analyzer",
    url: "/reports/analyzer",
    icon: FileSearch,
    items: [],
  },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const role = session?.user.role;
  const { state } = useSidebar();

  const navItems = baseNavItems.filter((item) => {
    if (role === "ADMIN")
      return !["/my-appointments", "/my-queue", "/my-patients"].includes(item.url);
    if (role === "DOCTOR")
      return ["/dashboard", "/my-appointments", "/my-patients", "/my-queue", "/reports/analyzer"].includes(item.url);
    if (role === "PATIENT")
      return ["/dashboard", "/my-appointments"].includes(item.url);
    return false;
  });

  const roleIcon = {
    ADMIN: Shield,
    DOCTOR: Stethoscope,
    PATIENT: HeartPulse,
  }[role ?? "PATIENT"];

  const RoleIcon = roleIcon ?? HeartPulse;

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]! border-r-0"
      collapsible="icon"
      {...props}
    >
      <SidebarHeader className="pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="group/brand cursor-pointer transition-all duration-300 hover:bg-white/5 data-[active=true]:bg-white/5"
            >
              <a href="/dashboard" className="flex items-center gap-3">
                <div className="relative flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 group-hover/brand:shadow-emerald-500/40 group-hover/brand:scale-105">
                  <HeartPulse className="size-5" />
                  <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 opacity-0 blur transition-opacity duration-300 group-hover/brand:opacity-20" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold tracking-tight text-sidebar-foreground">
                    MediQueue
                  </span>
                  <span className="truncate text-[11px] font-medium text-emerald-400">
                    Hospital Management
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className="mx-3 bg-white/5" />

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
            Navigation
          </SidebarGroupLabel>
          <NavMain items={navItems} />
        </SidebarGroup>

      
      </SidebarContent>

      <SidebarSeparator className="mx-3 bg-white/5" />

      <SidebarFooter className="p-2">
        <NavUser
          user={{
            name: session?.user?.name || "",
            email: session?.user?.email || "",
            avatar: "/avatars/user.png",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
