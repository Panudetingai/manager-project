"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getUserClient } from "@/lib/supabase/getUser-client";
import { useWorkspaceState } from "@/modules/manager/store/workspace-state";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { createClient } from "../../../../../utils/supabase/client";
import { Database } from "../../../../../utils/supabase/database.types";
import { TableListGroupsColumnGroup } from "./table-colunm-group";

export type TableListGroupsType = {
  workspace_owner_id: string;
  user_id_owner_id: string;
  username: string;
  avatar_url: string;
  role: Database["public"]["Enums"]["workspace_role"];
  workspace: string;
  joined_at: string;
};

export default function TableListGroups() {
  const supabase = createClient();
  const { workspaceId } = useWorkspaceState();

  const { data, isPending } = useQuery({
    queryKey: ["groups-workspaces"],
    queryFn: async () => {
      const user = await getUserClient();
      const { data } = await supabase
        .from("workspace_member")
        .select(
          "workspace_owner_id, user_id_owner_id, role, joined_at, workspace:workspace_owner_id(name), account!workspace_member_user_id_owner_id_fkey(username, avatar_url)"
        )
        .eq("invited_by", user.id)
        .eq("workspace_owner_id", workspaceId);

      if (!data) return [] as TableListGroupsType[];

      const formatgroups = data.map((item) => ({
        workspace_owner_id: item.workspace_owner_id,
        user_id_owner_id: item.user_id_owner_id,
        username: item.account && item.account.username,
        avatar_url: item.account && item.account.avatar_url,
        workspace: item.workspace && item.workspace.name,
        role: item.role,
        joined_at: item.joined_at,
      })) as TableListGroupsType[];

      return formatgroups;
    },
  });

  const table = useReactTable({
    data: data || [],
    columns: TableListGroupsColumnGroup,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col max-w-4xl w-full mx-auto">
      <h2 className="text-lg font-medium overflow-hidden rounded-md">
        My Groups
      </h2>
      <div className="w-full mt-4">
        <Table>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableHeader key={headerGroup.id}>
              <TableRow>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          ))}
          <TableBody className="max-h-52 overflow-y-auto">
            {table && table.getRowModel().rows.length ? (
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
                  className="text-center"
                >
                  {isPending ? "Loading..." : "No invitations."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
