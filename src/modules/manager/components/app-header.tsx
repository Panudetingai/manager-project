import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/animate-ui/components/radix/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import { AppBreadcrumb } from "./app-breadcrumb";

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
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </header>
    </SidebarInset>
  );
}
