"use client";

import { SidebarMenuButton } from "@/components/animate-ui/components/radix/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useQuery } from "@tanstack/react-query";
import * as LucideIcons from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { elysia } from "../../../../config/eylsia.config";
import { createClient } from "../../../../utils/supabase/client";
import CreateWorkspaceForm from "./create-workspace";

export function SidebarBanner() {
  const supabase = createClient();
  const { project } = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();

  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return await getUserClient();
    },
    staleTime: Infinity,
  });

  const { data: workspaces } = useQuery({
    queryKey: ["workspace", user?.id],
    queryFn: async () => {
      const res = await elysia.api.workspaces.get();
      const data = res.data;
      return data;
    },
    enabled: !!user?.id,
    staleTime: Infinity,
  });
  const { data: workspace } = useQuery({
    queryKey: ["workspace", project, user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("workspace")
        .select("name, workspace_icon")
        .eq("user_id", user!.id)
        .eq("name", project as string)
        .single();
      return data;
    },
    enabled: !!user?.id && !!project,
    staleTime: Infinity,
  });

  if (!workspace) return null;

  const iconName = workspace.workspace_icon as keyof typeof LucideIcons;
  const IconComponent = (LucideIcons[iconName] ??
    LucideIcons.Folder) as unknown as React.ElementType;

  if (userLoading) {
    return (
      <Skeleton>
        <SidebarMenuButton className="w-full justify-between data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div className="flex items-center space-x-2">
            <div className="h-12 w-8 rounded-full bg-muted" />
          </div>
        </SidebarMenuButton>
      </Skeleton>
    );
  }
  if (userError || !user) return null;

  console.log(workspaces)

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="flex items-center">
          <SidebarMenuButton className="w-full justify-between" size="lg">
            <div className="flex items-center space-x-2">
              <div className="bg-foreground rounded-sm p-2">
                <IconComponent className="w-4 h-4 text-muted" />
              </div>
              <div className="flex flex-col">
                <p className="font-medium text-sm">{project}</p>
                <span className="text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>
            <LucideIcons.ChevronsUpDownIcon />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52" side={isMobile ? "bottom" : "right"}>
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Workspaces
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {workspaces &&
              workspaces.map((workspace) => {
                const Icon = (LucideIcons[
                  workspace.workspace_icon as keyof typeof LucideIcons
                ] ?? LucideIcons.Folder) as unknown as React.ElementType;
                return (
                  <DropdownMenuItem
                    key={workspace.name}
                    className="w-full"
                    onClick={() => {
                      router.push(`/dashboard/${workspace.name}`);
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {workspace.name}
                  </DropdownMenuItem>
                );
              })}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DialogTrigger className="w-full" asChild>
            <DropdownMenuItem className="cursor-pointer text-muted-foreground">
              <LucideIcons.PlusCircle className="mr-2 h-4 w-4" />
              Create Workspace
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="max-w-sm w-sm">
        <DialogTitle>Create Workspace</DialogTitle>
        <DialogDescription className="text-xs">
          Create a new workspace to manage your projects and settings.
        </DialogDescription>
        <CreateWorkspaceForm workspaces={workspaces} />
      </DialogContent>
    </Dialog>
  );
}
