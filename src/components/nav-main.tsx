"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
};

export function NavMain({
  items,
}: {
  items: NavItem[];
}) {
  const pathname = usePathname();

  return (
    <SidebarMenu>
        {items.map((item, index) => {
          const isActive =
            pathname === item.url ||
            item.items?.some((sub) => pathname === sub.url);

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
            >
              <SidebarMenuItem className="animate-fade-in-up" style={{ animationDelay: `${index * 40}ms` }}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  className="group/nav relative transition-all duration-200 ease-out hover:bg-white/5 data-[active=true]:bg-white/5 data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium data-[active=true]:shadow-sm"
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-gradient-to-b from-emerald-500 to-teal-500 shadow-md shadow-emerald-500/30" />
                    )}
                    <div className="flex size-8 items-center justify-center rounded-lg bg-white/5 transition-all duration-200 group-hover/nav:bg-white/10 group-data-[active=true]:bg-emerald-500/15 group-data-[active=true]:text-emerald-400">
                      <item.icon className="size-4 transition-transform duration-200 group-hover/nav:scale-110" />
                    </div>
                    <span className="truncate text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>

                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="size-6 rounded-md transition-all duration-200 hover:bg-white/10 hover:text-white data-[state=open]:rotate-90">
                        <ChevronRight className="size-3.5 transition-transform duration-200" />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
                      <SidebarMenuSub className="mx-2 border-l-emerald-500/20 pl-3">
                        {item.items.map((subItem) => {
                          const subActive = pathname === subItem.url;
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={subActive}
                                className="group/sub relative transition-all duration-200 hover:bg-white/5 data-[active=true]:bg-white/5 data-[active=true]:text-emerald-400 data-[active=true]:font-medium"
                              >
                                <Link href={subItem.url} className="flex items-center gap-2">
                                  {subActive && (
                                    <div className="size-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/30" />
                                  )}
                                  <span className="truncate text-[13px]">{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
  );
}
