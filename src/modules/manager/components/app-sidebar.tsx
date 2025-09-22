"use client";
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
} from "@/components/animate-ui/components/radix/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/animate-ui/primitives/radix/collapsible";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { APP_ROUTE } from "../const/app-route";
import { getAppRouteIsActive } from "../lib/app-route-active";
import { SidebarBanner } from "./sidebar-banner";
import { SidebarAccount } from "./sidebar-footer";

export function AppSidebar() {
  const { project } = useParams();
  const workspaceName = project && project !== "undefined" ? project : "/";
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
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
              <SidebarGroupLabel>{item.labelgroup}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <Collapsible className="group/collapsible w-full">
                    {item.items.map((i) => (
                      <SidebarMenuItem key={i.path}>
                        {i.submenu && i.submenu.length > 0 ? (
                          <CollapsibleTrigger className="w-full" asChild>
                            <Link
                              href={i.path.replace(
                                "[workspace]",
                                workspaceName.toString()
                              )}
                              passHref
                            >
                              <SidebarMenuButton
                                className="cursor-pointer"
                                isActive={getAppRouteIsActive(pathname, i.path)}
                              >
                                <i.icon className="h-5 w-5" />
                                {i.label}
                                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                              </SidebarMenuButton>
                            </Link>
                          </CollapsibleTrigger>
                        ) : (
                          <Link
                            href={i.path.replace(
                              "[workspace]",
                              workspaceName.toString()
                            )}
                            passHref
                          >
                            <SidebarMenuButton
                              className="cursor-pointer"
                              isActive={getAppRouteIsActive(pathname, i.path)}
                            >
                              <i.icon className="h-5 w-5" />
                              {i.label}
                            </SidebarMenuButton>
                          </Link>
                        )}
                        <CollapsibleContent className="transition-all duration-300 opacity-0 translate-y-2 data-[state=open]:opacity-100 data-[state=open]:translate-y-0">
                          <SidebarMenuSub>
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
