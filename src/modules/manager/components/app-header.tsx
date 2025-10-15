'use client';
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/animate-ui/components/radix/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SocketClient from "@/lib/socket";
import { AppBreadcrumb } from "./app-breadcrumb";
import AppNotify from "./app-notify";

export default function AppHeader() {

  const socket = SocketClient();

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              socket.emit("send-notification", {
                toUserId: "user1235",
                title: "New Notification",
                message: "This is a test notification from the manager app.",
              });
            }}
          >
            Send Notification
          </Button>
        </div>
      </header>
    </SidebarInset>
  );
}
