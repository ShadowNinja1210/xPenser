"use client";

import * as React from "react";
import * as _ from "lodash";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  RowData,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import { ActionTooltip } from "../action-tool-tip";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "range" | "select";
  }
}

export type ICategory = {
  name: string;
  description?: string;
  type: "Expense" | "Income";
};

export type TransactionData = {
  id: string;
  userId: string;
  amount: number;
  type: "Expense" | "Income";
  categoryId: string;
  description: string;
  date: string;
  methodCode: string;
};

function Filter({ column }: { column: Column<any, unknown> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="ml-auto">
          Type <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent defaultValue={""} align="end">
        <DropdownMenuRadioGroup value={column.getFilterValue()} onValueChange={column.setFilterValue}>
          <DropdownMenuRadioItem value="">Both</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="expense">Expense</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="income">Income</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<TransactionData>[] = [
  {
    accessorKey: "amount",
    header: () => {
      return <div>Amount</div>;
    },
    cell: ({ row }) => {
      const type = row.getValue("type");
      return (
        <div className={`${type === "Expense" ? "text-red-500" : "text-green-500"} whitespace-nowrap `}>
          {(type === "Expense" ? "-" : "+") + "₹" + row.getValue("amount")}
        </div>
      );
    },
  },
  {
    id: "type",
    accessorKey: "type",
    header: ({ column }) => {
      return <Filter column={column} />;
    },
    cell: ({ row }) => (
      <Badge className={row.getValue("type") == "Expense" ? "bg-red-500" : " bg-green-500"}>
        {row.getValue("type")}
      </Badge>
    ),
  },
  {
    accessorKey: "categoryId",
    header: () => <div className="text-left">Category</div>,
    cell: ({ row }) => <div className=" whitespace-nowrap">{row.getValue("categoryId")}</div>,
  },
  {
    accessorKey: "methodCode",
    header: () => <div className="text-left">Method</div>,
    cell: ({ row }) => <div className=" whitespace-nowrap">{row.getValue("methodCode")}</div>,
  },
  {
    accessorKey: "description",
    header: () => <div className="text-left">Description</div>,
    cell: ({ row }) => (
      <ActionTooltip label={row.getValue("description")}>
        <div>
          {_.truncate(row.getValue("description"), {
            length: 24,
            separator: /,? +/,
          })}
        </div>
      </ActionTooltip>
    ),
  },
  {
    accessorKey: "date",
    header: () => <div>Date</div>,
    cell: ({ row }) => <div>{format(row.getValue("date"), "PP")}</div>,
  },
];

export type DataTableProps = {
  filteredData: TransactionData[];
  loaderOn: boolean;
};

export function TableComponent({ filteredData, loaderOn }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: filteredData,
    columns,
    initialState: {
      columnVisibility: {
        type: false,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <Table>
        <TableHeader className="dark:bg-neutral-950 dark:hover:bg-neutral-950 ">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="dark:hover:bg-neutral-950">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={`dark:hover:bg-neutral-950 ${
                      header.id == "type"
                        ? "hidden"
                        : header.id == "description"
                        ? "hidden md:table-cell"
                        : header.id == "method"
                        ? "hidden sm:table-cell"
                        : header.id == "category"
                        ? "hidden sm:table-cell"
                        : ""
                    }`}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="dark:bg-neutral-950">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="dark:bg-neutral-950 dark:hover:bg-neutral-900/50"
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell
                      className={`${
                        cell.column.id == "type"
                          ? "hidden"
                          : cell.column.id == "description"
                          ? "hidden md:table-cell"
                          : cell.column.id == "method"
                          ? "hidden sm:table-cell"
                          : cell.column.id == "category"
                          ? "hidden sm:table-cell"
                          : ""
                      }`}
                      key={cell.id}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {loaderOn ? (
                  <div className=" space-y-4">
                    <Skeleton className="w-full h-[64px]" />
                    <Skeleton className="w-full h-[64px]" />
                    <Skeleton className="w-full h-[64px]" />
                    <Skeleton className="w-full h-[64px]" />
                    <Skeleton className="w-full h-[64px]" />
                  </div>
                ) : (
                  "No results."
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
