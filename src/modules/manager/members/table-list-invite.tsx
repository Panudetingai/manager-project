"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserClient } from "@/lib/supabase/getUser-client";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "../../../../utils/supabase/client";
import { useWorkspaceState } from "../store/workspace-state";
import ModalInvite from "./modal-invite";
import { TableColumnsListInvite, tableColumnType } from "./table-column";

export default function TableListInvite() {
  const supabase = createClient();
  const [sorting, setsorting] = useState<SortingState>([]);
  const [columnFilter, setcolumnFilter] = useState<ColumnFiltersState>([]);
  const [columvnVisibility, setcolumnVisibility] = useState<VisibilityState>(
    {}
  );
  const [rowSelect, setrowSelect] = useState({});
  const [isopen, setisopen] = useState(false);
  const { data: user } = useUserClient();
  const {workspaceId} = useWorkspaceState();
  const {project} = useParams();

  const { data: members } = useQuery({
    queryKey: ["workspaces", user?.id, workspaceId, project],
    queryFn: async () => {
      const { data } = await supabase
        .from("workspace_invite")
        .select(
          "workspace_owner_id, workspace_status, created_at, account!user_owner_id(id, email, username, avatar_url), workspace:workspace_owner_id(name)"
        )
        .eq("workspace_owner_id", workspaceId || "")
        .eq("invited_by", user?.id || "")
        .in("workspace_status", ["pending", "answer"]);

      if (!data) return [];

      const formatdata: tableColumnType[] = data.map((member) => ({
        id: member.workspace_owner_id,
        user_owner_id: member.account.id,
        email: member.account.email,
        username: member.account.username,
        avatar: member.account.avatar_url,
        workspace: member.workspace.name,
        status: member.workspace_status,
        created_at: member.created_at,
      }));

      return formatdata;
    },
  });

  const table = useReactTable({
    data: members || [],
    columns: TableColumnsListInvite,
    onSortingChange: setsorting,
    onColumnFiltersChange: setcolumnFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
        <h1 className="font-medium text-lg">Members</h1>
        <Button variant="outline" onClick={() => setisopen(true)}>
          <PlusCircle />
          Invite Member
        </Button>
      </div>
      <div className="w-full mt-4 max-w-4xl overflow-hidden rounded-md shadow max-h-52">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
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
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
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
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
      </div>
      <ModalInvite isopen={isopen} setisopen={setisopen} />
    </>
  );
}
