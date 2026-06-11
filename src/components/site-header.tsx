"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarIcon } from "lucide-react";

import { NavUser } from "@/components/nav-user";

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
import { useSession } from "next-auth/react";

const routeNames: Record<string, string> = {
  dashboard: "Dashboard",
  appointments: "Appointments",
  doctors: "Doctors",
  queue: "Queue Management",
  profile: "Profile",
  interviews: "AI Interview Agent",
};

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
const { data: session } =
  useSession();


  const segments = pathname
    .split("/")
    .filter(Boolean);

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
      <div className="flex h-14 w-full items-center px-4">
        <div className="flex items-center gap-2">
          <Button
            className="h-8 w-8"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <SidebarIcon className="size-4" />
          </Button>

          <Separator
            orientation="vertical"
            className="mr-2 h-4"
          />

          <Breadcrumb className="hidden md:block">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">
                    MediQueue
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {segments.map(
                (segment, index) => {
                  const href =
                    "/" +
                    segments
                      .slice(0, index + 1)
                      .join("/");

                  const isLast =
                    index ===
                    segments.length - 1;

                  const label =
                    routeNames[
                      segment
                    ] ??
                    segment
                      .replaceAll("-", " ")
                      .replace(
                        /\b\w/g,
                        (c) =>
                          c.toUpperCase()
                      );

                  return (
                    <div
                      key={href}
                      className="flex items-center"
                    >
                      <BreadcrumbSeparator />

                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>
                            {label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            asChild
                          >
                            <Link href={href}>
                              {label}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  );
                }
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="ml-auto">
          <NavUser
  user={{
    name:
      session?.user?.name ||
      "",
    email:
      session?.user?.email ||
      "",
    avatar:
      "/avatars/user.png",
  }}
/>
        </div>
      </div>
    </header>
  );
}