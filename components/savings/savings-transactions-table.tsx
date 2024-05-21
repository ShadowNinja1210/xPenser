"use client";

import { useState, useEffect } from "react";
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

import { ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CardContent, Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { savingsTransactionsData } from "@/lib/fetch-data";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import { useChangeModal, useModal } from "@/hooks/use-modals-store";
import { ActionTooltip } from "../action-tool-tip";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "range" | "select";
  }
}

export type SavingsTransactions = {
  _id: string;
  amount: number;
  type: "Deposit" | "Withdrawalal";
  description: string;
  date: Date;
};

export const columns: ColumnDef<SavingsTransactions>[] = [
  {
    accessorKey: "amount",
    header: () => {
      return <div>Amount</div>;
    },
    cell: ({ row }) => {
      const type = row.getValue("type");
      return (
        <div className={` whitespace-nowrap ${type === "Withdrawal" ? "text-red-500" : "text-green-500"} `}>
          {(type === "Withdrawal" ? "-" : "+") + "₹" + row.getValue("amount")}
        </div>
      );
    },
  },
  {
    id: "type",
    accessorKey: "type",
    header: () => {
      return <div>Filter</div>;
    },
    cell: ({ row }) => (
      <Badge className={row.getValue("type") == "Withdrawal" ? "bg-red-500" : " bg-green-500"}>
        {row.getValue("type")}
      </Badge>
    ),
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
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          {/* <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent> */}
        </DropdownMenu>
      );
    },
  },
];

export function SavingTable({ savingId }: { savingId: string }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filteredData, setFilteredData] = useState<SavingsTransactions[]>([]);
  const [loaderOn, setLoaderOn] = useState(true);
  const [savingGoalName, setSavingGoalName] = useState("");

  const { change } = useChangeModal();
  const { onOpen } = useModal();

  useEffect(() => {
    setLoaderOn(true);
    const fetchData = async () => {
      const data = await savingsTransactionsData(savingId);
      setFilteredData(data?.transactions);
      setSavingGoalName(data?.saving?.name);
      setLoaderOn(false);
    };
    if (savingId != "" || savingId != undefined) fetchData();
  }, [change]);

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
    onPaginationChange: setPagination,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const calcRowShowed = (pageIndex: number, pageSize: number, pageCount: number) => {
    if (pageIndex === 0 && pageCount === 1) return table.getFilteredRowModel().rows.length;
    else {
      if (pageCount === 0) return pageSize;
    }
    if (pageIndex + 1 === pageCount) return table.getFilteredRowModel().rows.length;
    return (pageIndex + 1) * pageSize;
  };

  return (
    <div className="w-full">
      <div className="py-4">
        <Input
          placeholder="Search for transaction..."
          value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("description")?.setFilterValue(event.target.value)}
          className="max-w-sm dark:bg-neutral-950 dark:border-neutral-600"
        />
      </div>
      <Card x-chunk="dashboard-05-chunk-3">
        <CardHeader className="px-7">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                <p>{savingGoalName}</p>
              </CardTitle>
              <CardDescription>View and manage all {filteredData.length} Saving transactions.</CardDescription>
            </div>
            <Button
              className=" bg-blue-700 text-white hover:bg-blue-800"
              onClick={() => {
                onOpen("AddSavingTransaction");
              }}
            >
              Add new
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="dark:bg-neutral-950 dark:hover:bg-neutral-950 ">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="dark:hover:bg-neutral-950">
                    {headerGroup.headers.map((header) => {
                      return header.id != "type" ? (
                        <TableHead key={header.id} className="dark:hover:bg-neutral-950">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ) : null;
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
                        return cell.column.id != "type" ? (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ) : null;
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
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {calcRowShowed(
                table.getState().pagination.pageIndex,
                table.getState().pagination.pageSize,
                table.getPageCount()
              )}{" "}
              of {table.getFilteredRowModel().rows.length} row(s) visible.
            </div>
            <div className="space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-auto ">
                    {table.getState().pagination.pageSize} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <DropdownMenuRadioItem
                      key={pageSize}
                      value={pageSize.toString()}
                      onClick={() => table.setPageSize(Number(pageSize))}
                    >
                      {pageSize}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
    </div>
  );
}
