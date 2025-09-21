"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { APP_ROUTE, getAppRouteIsActive } from "../const/app-route";
import { SidebarBanner } from "./sidebar-banner";
import { SidebarAccount } from "./sidebar-footer";

export function AppSidebar() {
  const { project } = useParams();
  const workspaceName = project && project !== "undefined" ? project : "/";

  const pathname = usePathname();

  console.log("🚀 ~ file: app-sidebar.tsx:38 ~ AppSidebar ~ pathname:", pathname);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="relative">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarBanner />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {APP_ROUTE.map((item) => (
          <div key={item.labelgroup}>
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <Collapsible className="group/collapsible w-full">
                    {item.items.map((i) => (
                      <SidebarMenuItem key={i.path}>
                        <CollapsibleTrigger className="w-full" asChild >
                          <Link
                            href={i.path.replace(
                              "[workspace]",
                              workspaceName.toString()
                            )}
                            passHref
                          >
                            <SidebarMenuButton className="cursor-pointer" isActive={getAppRouteIsActive(pathname, i.label.toLocaleLowerCase())}>
                              <i.icon className="h-5 w-5" />
                              {i.label}
                              {i.submenu && i.submenu.length > 0 && (
                                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                              )}
                            </SidebarMenuButton>
                          </Link>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="duration-300 transition-all">
                            {i.submenu && i.submenu.length > 0 && (
                              <>
                                {i.submenu.map((sub) => (
                                  <SidebarMenuItem key={sub.path}>
                                    <Link
                                      href={sub.path.replace(
                                        "[workspace]",
                                        workspaceName.toString()
                                      )}
                                      passHref
                                    >
                                      <SidebarMenuButton className="cursor-pointer">
                                        <sub.icon className="h-4 w-4" />
                                        {sub.label}
                                      </SidebarMenuButton>
                                    </Link>
                                  </SidebarMenuItem>
                                ))}
                              </>
                            )}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    ))}
                  </Collapsible>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarAccount />
      </SidebarFooter>
    </Sidebar>
  );
}
