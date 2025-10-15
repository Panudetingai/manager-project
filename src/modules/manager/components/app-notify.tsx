"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SocketClient from "@/lib/socket";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

export default function AppNotify() {
  const socket = SocketClient();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    socket.on("app-notify", (data) => {
        console.log("Received notification:", data);
        setNotifications((prev) => [...prev, data]);
    })
    return () => {
        socket.off("app-notify");
    }
  }, [socket]);

  console.log(notifications)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Bell />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
            {notifications.length === 0 ? "ไม่มีการแจ้งเตือน" : notifications.map((notify, index) => (
                <div key={index} className="p-2 border-b last:border-0">
                    <p className="font-medium">{notify.title}</p>
                    <p className="text-sm text-muted-foreground">{notify.message}</p>
                </div>
            ))}
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
