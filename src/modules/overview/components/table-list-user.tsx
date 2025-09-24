"use client";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { getUserClient } from "@/lib/supabase/getUser-client";
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
import { useMemo, useState } from "react";
import { Database } from "../../../../utils/supabase/database.types";
import { TableColumnsListUser } from "./option/table-columns-list-user";

type Props = Database["public"]["Tables"]["account"]["Row"][] | undefined;
export type TableformatUser = {
  current: string;
  icon: string | null;
  username: string | null;
  email: string | null;
};

export default function TableListUser({ userlist }: { userlist: Props }) {
  const [sorting, setsorting] = useState<SortingState>([]);
  const [columnFilter, setcolumnFilter] = useState<ColumnFiltersState>([]);
  const [columvnVisibility, setcolumnVisibility] = useState<VisibilityState>(
    {}
  );
  const [rowSelect, setrowSelect] = useState({});

    const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
      queryFn: () => getUserClient(),
    });

  const formattedData = useMemo(
    () =>
      (userlist ?? []).map((item) => ({
        current: item.id === currentUser?.id ? " You" : item.id,
        icon: item.avatar_url,
        username: item.username,
        email: item.email,
      })),
    [userlist, currentUser]
  );

  const table = useReactTable({
    data: formattedData,
    columns: TableColumnsListUser,
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
  })

  return (
    <div>
      <Input
        placeholder="Search..."
        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
        type="text"
        className="mb-4"
        aria-label="Search"
        onChange={(e) =>
          table.getColumn("email")?.setFilterValue(e.target.value)
        }
      />
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
          {table.getRowModel().rows?.length
            ? table
                .getRowModel()
                .rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            : <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>}
        </TableBody>
      </Table>
    </div>
  );
}
