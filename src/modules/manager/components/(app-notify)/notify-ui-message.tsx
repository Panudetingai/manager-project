"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NotificationType } from "../app-notify";

export default function NotifyUIMessage({ item }: { item: NotificationType }) {
  switch (item.type) {
    case "info":
      return (
        <Card className="!w-full rounded-sm shadow-none mt-2 p-0 bg-muted border-none">
          <CardContent className="w-full !p-2">
            <p className="text-sm">{item.detail}</p>
          </CardContent>
        </Card>
      );
    case "joined":
      return (
        <Card className="!w-full rounded-sm shadow-none mt-2 p-0 bg-muted border-none">
          <CardContent className="w-full !p-2">
            <p className="text-sm">{item.detail}</p>
          </CardContent>
        </Card>
      );
    case "request":
      return (
        <Card className="!w-full rounded-sm shadow-none mt-2 p-0 border-none">
          <CardContent className="w-full !p-2">
            <div className="flex gap-2">
              <Button size={"sm"}>Accept</Button>
              <Button size={"sm"} variant="outline">Decline</Button>
            </div>
          </CardContent>
        </Card>
      );
    case "alert":
      return (
        <Card className="!w-full rounded-sm shadow-none mt-2 p-0 bg-muted border-none">
          <CardContent className="w-full !p-2">
            <p className="text-sm">{item.detail}</p>
          </CardContent>
        </Card>
      );
  }
}
