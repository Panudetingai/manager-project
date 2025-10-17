'use client';
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/animate-ui/components/radix/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSocket } from "@/lib/providers/socket-provider";
import { getUserClient } from "@/lib/supabase/getUser-client";
import { useQuery } from "@tanstack/react-query";
import { AppBreadcrumb } from "./app-breadcrumb";
import AppNotify, { NotificationType } from "./app-notify";

export default function AppHeader() {
  const socket = useSocket();

  const { data: user } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const user = await getUserClient();
      return user;
    }
  })

  const sendTestNotification = () => {
    if (!user) throw new Error("User not authenticated");
    socket.emit("send-notification", {
      id: "4a900e38-fb0c-49d7-bd2a-2e7c5e995d5d",
      user_info: {
        id: user.id,
        avatar: user.user_metadata.avatar_url || "",
        username: user.user_metadata.full_name || "Unknown User",
      },
      title: "Test Notification",
      type: "request",
      detail: "This is a test notification from the manager app.",
      date: new Date(),
      is_read: false,
    } as NotificationType)
  }

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
            onClick={() => sendTestNotification()}
          >
            Send Notification
          </Button>
        </div>
      </header>
    </SidebarInset>
  );
}
