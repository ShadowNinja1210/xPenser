"use client";

import { useState, useEffect } from "react";

// Other Libraries
import * as _ from "lodash";
import { format } from "date-fns";

// Tanstack React Table
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";

// ShadCn UI Components
import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActionTooltip } from "@/components/action-tool-tip";
import type { SavingsTransactions } from "@/lib/types";

export const columns: ColumnDef<SavingsTransactions>[] = [
  // Amount
  {
    accessorKey: "amount",
    header: () => {
      return <div>Amount</div>;
    },
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <div className={` whitespace-nowrap ${type === "Withdrawal" ? "text-red-500" : "text-green-500"} `}>
          {(type === "Withdrawal" ? "-" : "+") + "₹" + row.getValue("amount")}
        </div>
      );
    },
  },

  // Description
  {
    accessorKey: "description",
    header: () => <div className="text-left">Description</div>,
    cell: ({ row }) => (
      <ActionTooltip label={row.getValue("description")}>
        <div>
          {_.truncate(row.getValue("description"), {
            length: 18,
            separator: /,? +/,
          })}
        </div>
      </ActionTooltip>
    ),
  },

  // Date
  {
    accessorKey: "date",
    header: () => <div>Date</div>,
    cell: ({ row }) => <div>{format(row.getValue("date"), "PP")}</div>,
  },
];

export default function SavingTransactions({ data }: { data: SavingsTransactions[] }) {
  // States
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  // React Table
  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  // Calculate Row Showed
  const calcRowShowed = (pageIndex: number, pageSize: number, pageCount: number) => {
    if (pageIndex === 0 && pageCount === 1) return table.getFilteredRowModel().rows.length;
    else {
      if (pageCount === 0) return pageSize;
    }
    if (pageIndex + 1 === pageCount) return table.getFilteredRowModel().rows.length;
    return (pageIndex + 1) * pageSize;
  };

  return (
    <Card x-chunk="dashboard-05-chunk-3" className="max-h-[80vh] overflow-y-scroll custom-scrollbar">
      {/* TRANSACTIONS */}
      <CardContent className="p-0">
        <div className="rounded-md border min-h-[414px]">
          <Table className=" border-b">
            <TableHeader className="dark:bg-neutral-950 dark:hover:bg-neutral-950 ">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="dark:hover:bg-neutral-950">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="dark:hover:bg-neutral-950">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
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
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-end space-x-2 p-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {calcRowShowed(
              table.getState().pagination.pageIndex,
              table.getState().pagination.pageSize,
              table.getPageCount()
            )}{" "}
            of {table.getFilteredRowModel().rows.length} row(s) visible.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
