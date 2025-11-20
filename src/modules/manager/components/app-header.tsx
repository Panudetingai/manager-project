'use client';
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/animate-ui/components/radix/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppBreadcrumb } from "./app-breadcrumb";
import AppNotify from "./app-notify";
import AppToggleMode from "./app-toggle-mode";

export default function AppHeader() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 p-2 justify-between">
        <div className="flex items-center">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-2 py-3" />
          <AppBreadcrumb />
        </div>
        <div className="flex items-center space-x-4">
          <AppNotify />
          <AppToggleMode />
        </div>
      </header>
    </SidebarInset>
  );
}
