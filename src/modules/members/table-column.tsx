import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown, EllipsisIcon } from "lucide-react";
import { Database } from "../../../utils/supabase/database.types";
import { cancelInvite } from "./server/action/invite";

export type tableColumnType = {
  id: string;
  email: string;
  username: string | null;
  avatar: string | null;
  workspace: string | null;
  status: Database["public"]["Enums"]["workspace_status"] | null;
  created_at: string;
};

export const ActionCell = ({ row }: { row: tableColumnType }) => {
  const queryClient = useQueryClient();

  const handleCancelInvite = () => {
    cancelInvite(row.id).then(() => {
    queryClient.invalidateQueries({ queryKey: ["getmembers"] });
  });
  }

  return (
    <DropdownMenuItem
      onClick={handleCancelInvite}
      className="cursor-pointer bg-destructive/20 text-destructive hover:!text-destructive hover:!bg-destructive/30"
    >
      Cancel Invite
    </DropdownMenuItem>
  );
};

export const TableColumnsListInvite: ColumnDef<tableColumnType>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        size={"sm"}
        variant={"ghost"}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Invite Member
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <Avatar>
          <AvatarImage
            src={row.original.avatar || ""}
            alt={row.getValue("username")}
          />
          <AvatarFallback>user</AvatarFallback>
        </Avatar>
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => <div>{row.getValue("username") || "No username"}</div>,
  },
  {
    accessorKey: "workspace",
    header: "Workspace",
    cell: ({ row }) => <div>{row.getValue("workspace") || "No group"}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.getValue("status") === "pending"
            ? "outline"
            : row.getValue("status") === "answer"
            ? "default"
            : "destructive"
        }
      >
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <EllipsisIcon className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <ActionCell row={row.original} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
