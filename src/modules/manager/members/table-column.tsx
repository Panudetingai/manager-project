import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import {
  ChevronsUpDown,
  EllipsisIcon,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Database } from "../../../../utils/supabase/database.types";
import { tableInvitationType } from "./invitations/table-list-invitations";
import {
  cancelInvitation,
  cancelInvite,
  updateRoleMember,
} from "./server/action/workspace-member";

export type tableColumnType = {
  id: string;
  user_owner_id: string;
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
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    });
  };

  const handleupdateRole = ({
    role,
  }: {
    role: Database["public"]["Enums"]["workspace_role"];
  }) => {
    // Update the role in the database
    updateRoleMember({
      role,
      user_owner_id: row.user_owner_id,
      memberId: row.id,
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    });
  };

  const { mutate: removeInvite } = useMutation({
    mutationFn: async () => {
      await cancelInvitation({
        value: {
          workspace_owner_id: row.id,
          user_owner_id: row.user_owner_id,
        } as tableInvitationType,
      });
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
  return (
    <>
      {row.status === "pending" ? (
        <DropdownMenuItem
          onClick={handleCancelInvite}
          className="cursor-pointer"
        >
          Cancel Invitation
        </DropdownMenuItem>
      ) : (
        <>
          <DropdownMenuItem
            onClick={() => handleupdateRole({ role: "member" })}
            className="cursor-pointer"
          >
            <ShieldCheck />
            Member
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleupdateRole({ role: "admin" })}
            className="cursor-pointer"
          >
            <ShieldAlert />
            Admin
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => removeInvite()}
          >
            <Trash2 />
            Remove Member
          </DropdownMenuItem>
        </>
      )}
    </>
  );
};

export const TableColumnsListInvite: ColumnDef<tableColumnType>[] = [
  {
    accessorKey: "username",
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
          <AvatarFallback>{row.original.username?.slice(0, 1)}</AvatarFallback>
        </Avatar>
        {row.getValue("username")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("email") || "No email"}</div>,
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
