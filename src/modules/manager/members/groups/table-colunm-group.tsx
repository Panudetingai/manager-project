import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Ellipsis, Shield, Trash, User } from "lucide-react";
import { Database } from "../../../../../utils/supabase/database.types";
import { tableInvitationType } from "../invitations/table-list-invitations";
import { cancelInvitation, updateRoleMember } from "../server/action/workspace-member";
import { TableListGroupsType } from "./table-list-groups";

const ActionsCell = ({ row }: { row: TableListGroupsType }) => {
  const queryClient = useQueryClient();
  const { mutate: updateRole } = useMutation({
    mutationFn: async ({
      value,
    }: {
      value: Database["public"]["Enums"]["workspace_role"];
    }) => {
      await updateRoleMember({
        memberId: row.workspace_owner_id,
        user_owner_id: row.user_id_owner_id,
        role: value,
      });
      await queryClient.invalidateQueries({ queryKey: ["groups-workspaces"] });
    },
  });

  const { mutate: cancelInvite } = useMutation({
    mutationFn: async () => {
      await cancelInvitation({
        value: {
          workspace_owner_id: row.workspace_owner_id,
          user_owner_id: row.user_id_owner_id,
        } as tableInvitationType
      });
      await queryClient.invalidateQueries({ queryKey: ["groups-workspaces"] });
    }
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"ghost"} className="cursor-pointer">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>
          <User />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => cancelInvite()}>
          <Trash />
          Remove
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Role</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() =>
            updateRole({ value: row.role === "admin" ? "member" : "admin" })
          }
        >
          <Shield />
          {row.role === "member" ? "Make Admin" : "Make Member"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const TableListGroupsColumnGroup: ColumnDef<TableListGroupsType>[] = [
  {
    id: "select",
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || false}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      );
    },
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage
            src={row.original.avatar_url}
            alt={row.original.username.slice(0, 2)}
          />
          <AvatarFallback>
            {row.original.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <p>{row.getValue("username")}</p>
      </div>
    ),
  },
  {
    accessorKey: "workspace",
    header: "Workspace",
    cell: ({ row }) => <p>{row.getValue("workspace")}</p>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <p>{row.getValue("role")}</p>,
  },
  {
    accessorKey: "joined_at",
    header: "Joined At",
    cell: ({ row }) => (
      <p>{new Date(row.getValue("joined_at")).toLocaleDateString()}</p>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row.original} />,
  },
];
