"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";
import { createClient } from "../../../../../utils/supabase/client";
import { TableColumnsListInvitaion } from "./table-colunm";

export type tableInvitationType = {
  workspace_owner_id: string;
  user_owner_id: string;
  invited_by: string;
  email: string | null;
  username: string | null;
  avatar: string | null;
  workspace: string;
  status: string;
};

export default function TableListInvitations() {
  const supabase = createClient();
  const [sorting, setsorting] = useState<SortingState>([]);
  const [columnFilter, setcolumnFilter] = useState<ColumnFiltersState>([]);
  const [columvnVisibility, setcolumnVisibility] = useState<VisibilityState>(
    {}
  );
  const [rowSelect, setrowSelect] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      const { data } = await supabase
        .from("workspace_invite")
        .select(
          "workspace_status, account!workspace_invite_invited_by_fkey(id, email, username, avatar_url), workspace(name, id)"
        )
        .eq("user_owner_id", user.data.user?.id || "");

      if (!data) return [];

      const formatdata = data.map((item) => ({
        workspace_owner_id: item.workspace.id,
        user_owner_id: user.data.user?.id || "",
        invited_by: item.account.id,
        email: item.account.email,
        username: item.account.username,
        avatar: item.account.avatar_url,
        workspace: item.workspace.name,
        status: item.workspace_status,
      })) as tableInvitationType[];
      return formatdata;
    },
  });

  const table = useReactTable({
    data: data || [],
    columns: TableColumnsListInvitaion,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setsorting,
    onColumnFiltersChange: setcolumnFilter,
    onColumnVisibilityChange: setcolumnVisibility,
    onRowSelectionChange: setrowSelect,
    state: {
      sorting,
      columnFilters: columnFilter,
      columnVisibility: columvnVisibility,
      rowSelection: rowSelect,
    },
  });

  return (
    <>
      <div className="flex items-center justify-between w-full max-w-4xl">
        <h1 className="font-medium text-lg">Invitations</h1>
      </div>
      <div className="w-full max-w-4xl border overflow-hidden rounded-md mt-4">
        <Table>
          {table &&
            table.getHeaderGroups().map((headerGroup) => (
              <TableHeader key={headerGroup.id}>
                <TableRow>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
            ))}
          <TableBody className="max-h-52 overflow-y-auto">
            {table && table.getRowModel().rows.length
              ? table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="text-center"
                    >
                      {isLoading ? "Loading..." : "No invitations."}
                    </TableCell>
                  </TableRow>
              )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
