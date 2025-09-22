"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/animate-ui/components/radix/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { getUserClient } from "@/lib/supabase/getUser-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LoaderCircle, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AccountSidebarItems } from "../const/sidebar-items";
import { signOut } from "../server/sign-out";

export function SidebarAccount() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const { data: user, isPending } = useQuery({
    queryKey: ["getUser"],
    queryFn: getUserClient,
    staleTime: Infinity,
  });

  const { mutate: mutateSignOut, isPending: isSigningOut } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      router.refresh();
    },
  });

  if (isPending) {
    return (
      <div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  if (!user) router.push("/auth/sign-in");

  return (
    <DropdownMenu open={open || isSigningOut} onOpenChange={(v) => setOpen(v)}>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <SidebarMenuItem>
          <SidebarMenuButton className="py-6" size={"lg"}>
            <Image
              className="rounded-sm"
              src={user && user.user_metadata.avatar_url}
              alt="User Avatar"
              width={32}
              height={32}
            />
            <div className="flex flex-col">
              <p className="font-medium">
                {user && user.user_metadata.full_name}
              </p>
              <span className="text-xs text-muted-foreground">
                {user && user.user_metadata.email}
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side={isMobile ? "bottom" : "right"}
        className="w-52"
        forceMount
      >
        {AccountSidebarItems().map((group) => (
          <div key={group.labelGroup}>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                {group.labelGroup}
              </DropdownMenuLabel>
              {group.items.map((item) => (
                <DropdownMenuItem key={item.label} onClick={item.onclick}>
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </div>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => mutateSignOut()}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <>
              <LoaderCircle className="animate-spin mr-2" />
              Signing Out...
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
