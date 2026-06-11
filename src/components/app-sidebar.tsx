"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UserRound,
  Activity,
  LogOut,
  LifeBuoy,
  Hospital,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";


const baseNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    items: [],
  },

  {
    title: "Appointments",
    url: "#",
    icon: CalendarDays,
    items: [
      {
        title: "All Appointments",
        url: "/appointments",
      },
      {
        title: "Book Appointment",
        url: "/appointments/new",
      },
    ],
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

  
];



export function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {

  const { data: session } =
  useSession();

const role =
    session?.user.role;
  
  const navItems = baseNavItems.filter(
  (item) => {
    if (role === "ADMIN") {
      return true;
    }

    if (role === "DOCTOR") {
      return [
        "/dashboard",
        "#",
        "/queue",
        "/profile",
      ].includes(item.url);
    }

    if (role === "PATIENT") {
      return [
        "/dashboard",
        "#",
        "/profile",
      ].includes(item.url);
    }

    return false;
  }
);

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Hospital className="size-4" />
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    MediQueue
                  </span>

                  <span className="truncate text-xs">
                    Hospital Management
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
       <NavMain items={navItems} />

       
      </SidebarContent>

     
    </Sidebar>
  );
}