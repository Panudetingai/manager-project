"use client";
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
  SidebarMenuSub,
} from "@/components/animate-ui/components/radix/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/animate-ui/primitives/radix/collapsible";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Database } from "../../../../utils/supabase/database.types";
import { APP_ROUTE } from "../const/app-route";
import { getAppRouteIsActive } from "../lib/app-route-active";
import { SidebarBanner } from "./sidebar-banner";
import { SidebarAccount } from "./sidebar-footer";

export function AppSidebar({role}: {role: Database["public"]["Enums"]["user_roles"]}) {
  const { project } = useParams();
  const workspaceName = project && project !== "undefined" ? project : "/";
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarBanner />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {APP_ROUTE.map(
          (item) =>
            // filter group ตาม role
            item.role.includes(role) && (
              <div key={item.labelgroup}>
                <SidebarGroup>
                  <SidebarGroupLabel>{item.labelgroup}</SidebarGroupLabel>
                  <SidebarMenu>
                    <Collapsible className="group/collapsible">
                      {item.items
                        .filter((i) => !i.role || i.role.includes(role)) // filter menu ตาม role
                        .map((i) => (
                          <SidebarMenuItem key={i.path}>
                            {i.submenu && i.submenu.length > 0 ? (
                              <CollapsibleTrigger className="w-full" asChild>
                                <Link
                                  href={{
                                    pathname: i.path.replace(
                                      "[workspace]",
                                      workspaceName.toString()
                                    ),
                                  }}
                                  passHref
                                >
                                  <SidebarMenuButton
                                    className="cursor-pointer"
                                    tooltip={i.label}
                                    isActive={getAppRouteIsActive(
                                      pathname,
                                      i.path
                                    )}
                                  >
                                    <i.icon className="h-5 w-5" />
                                    {i.label}
                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                  </SidebarMenuButton>
                                </Link>
                              </CollapsibleTrigger>
                            ) : (
                              <Link
                                href={{
                                  pathname: i.path.replace(
                                    "[workspace]",
                                    workspaceName.toString()
                                  ),
                                }}
                                passHref
                              >
                                <SidebarMenuButton
                                  className="cursor-pointer"
                                  isActive={getAppRouteIsActive(
                                    pathname,
                                    i.path
                                  )}
                                >
                                  <i.icon className="h-5 w-5" />
                                  {i.label}
                                </SidebarMenuButton>
                              </Link>
                            )}
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {i.submenu && i.submenu.length > 0 && (
                                  <>
                                    {i.submenu.map((sub) => (
                                      <SidebarMenuItem key={sub.path}>
                                        <Link
                                          href={{
                                            pathname: sub.path.replace(
                                                "[workspace]",
                                                workspaceName.toString()
                                              ),
                                            }}
                                            passHref
                                          >
                                            <SidebarMenuButton
                                              className="cursor-pointer"
                                              isActive={getAppRouteIsActive(
                                                pathname,
                                                sub.path
                                              )}
                                            >
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
                </SidebarGroup>
              </div>
            )
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarAccount />
      </SidebarFooter>
    </Sidebar>
  );
}
