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
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { APP_ROUTE } from "../const/app-route";
import SidebarBanner from "./sidebar-banner";

export async function AppSidebar() {
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
        <SidebarGroup>
          <SidebarGroupLabel>
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
                {APP_ROUTE.map((item) => (
                    <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton>
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
