"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSocket } from "@/lib/providers/socket-provider";
import { Bell, Inbox } from "lucide-react";
import { useEffect, useState } from "react";
import { countNotify, getTimeAgo } from "../lib/app-notify";
import NotifyUIMessage from "./(app-notify)/notify-ui-message";

export interface NotificationType {
  id: string;
  user_info: {
    id: string;
    avatar: string;
    username: string;
  };
  title: string;
  type: "info" | "request" | "alert" | "joined";
  detail: string;
  date: Date;
  is_read: boolean;
}

export default function AppNotify() {
  const socket = useSocket();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    if (!socket) return;
    socket.on("app-notify", (data) => {
      console.log("Received notification:", data);
      setNotifications((prev) => [...prev, data]);
    });
    return () => {
      socket.off("app-notify");
    };
  }, [socket]);

  const notifylabel = (type: NotificationType["type"]) => {
    switch (type) {
      case "info":
        return "Information";
      case "joined":
        return "New Member";
      case "request":
        return "Action Required";
      case "alert":
        return "Alert";
      default:
        return "Notification";
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <div className="relative">
            <Bell />
            <div className="absolute w-2 h-2 bg-primary rounded-full -top-0.5 right-0" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0 overflow-y-auto">
        <Card className="border-none shadow-none py-0 gap-0">
          <CardHeader className="border-b p-4 !pb-2">
            <div className="flex items-center justify-between">
              <h1 className="font-medium text-sm">Notifications</h1>
              <Badge className="rounded-full">
                {countNotify(notifications)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 max-h-96 h-auto overflow-y-auto">
            <div>
              {notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center h-52">
                  <Inbox />
                  <h2 className="mt-2">No notifications</h2>
                  <p className="text-center text-muted-foreground text-sm">
                    You&apos;re all caught up! Check back later for new
                    notifications.
                  </p>
                </div>
              )}
              {notifications
                .slice(0, 10)
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((item, index) => (
                  <div className="flex flex-col p-3" key={index}>
                    <div className="flex gap-2">
                      <Avatar className="w-10 h-10 mt-0.5 relative">
                        <AvatarImage
                          src={item.user_info.avatar}
                          alt="avatar"
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {item.user_info.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col w-full">
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm">
                              {item.user_info.username}{" "}
                              <span className="text-muted-foreground font-normal">
                                {notifylabel(item.type)}
                              </span>
                            </h3>
                            {item.is_read && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                              {new Date(item.date)
                                .toLocaleString("en-US", {
                                  weekday: "long",
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })
                                .replace(",", "")}
                            </p>
                            <p className="text-xs">
                              {getTimeAgo({ item: item.date })}
                            </p>
                          </div>
                        </div>
                        <NotifyUIMessage item={item} />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="w-full">
              View All
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
