"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { CheckIcon, ChevronsUpDown, LoaderCircle, X } from "lucide-react";
import { approveInvitation, cancelInvitation } from "../server/action/workspace-member";
import { tableInvitationType } from "./table-list-invitations";

export const ActonColumn = ({ row }: { row: tableInvitationType }) => {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      await approveInvitation({ value: row });
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });

  const {isPending: cancelInvitationPending, mutate: cancelInvitationMutate} = useMutation({
    mutationFn: async () => {
        await cancelInvitation({value: row});
        await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    }
  })

  return (
    <div className="flex gap-2 items-center">
      {row.status === "pending" && (
        <Button
          variant={"outline"}
          size={"icon"}
          className="cursor-pointer"
          onClick={() => mutate()}
        >
          {isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <CheckIcon />
          )}
        </Button>
      )}
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => cancelInvitationMutate()}
        className="text-destructive cursor-pointer"
      >
        {cancelInvitationPending ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <X />
        )}
      </Button>
    </div>
  );
};

export const TableColumnsListInvitaion: ColumnDef<tableInvitationType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
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
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={row.original.avatar || "/placeholder.png"}
              alt={row.getValue("username")}
            />
            <AvatarFallback>
              {(row.getValue("username") as string)?.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {row.getValue("username")}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          size={"sm"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.getValue("email")}</div>;
    },
  },
  {
    accessorKey: "workspace",
    header: "Workspace",
    cell: ({ row }) => {
      return <div>{row.getValue("workspace")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={row.original.status === "answer" ? "default" : "outline"}
        >
          {row.getValue("status") as string}
        </Badge>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      return <ActonColumn row={row.original} />;
    },
  },
];
