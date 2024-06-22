"use client";

import * as React from "react";
import * as _ from "lodash";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { ChevronDown, Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CardContent, Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { transactionData } from "@/lib/fetch-data";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import { useChangeModal, useModal } from "@/hooks/use-modals-store";
import { ActionTooltip } from "../action-tool-tip";
import { FilterAction } from "./filter-action";
import { TransactionData } from "@/lib/types";

// Function to copy transaction details to clipboard (Used in action button of each row)
const copyTransaction = (transaction: TransactionData) => {
  const formattedTransaction = `
Amount: ${transaction.amount}
Type: ${transaction.type}
Category: ${transaction.categoryId}
Description: ${transaction.description}
Date: ${format(new Date(transaction.date), "PP")}
Method: ${transaction.methodCode}
  `;

  try {
    navigator.clipboard.writeText(formattedTransaction);
  } catch (error) {
    console.error("Failed to copy text", error);
  }
};

// Declaration of functions to delete and edit transactions (Used in action button of each row)
let deleteTransaction: (ids: string[], userId: string) => Promise<void>;
let editTransaction: (transaction: TransactionData) => Promise<void>;

export const columns: ColumnDef<TransactionData>[] = [
  // Select Checkboxes Column
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // Amount Column
  {
    accessorKey: "amount",
    header: () => {
      return <div>Amount</div>;
    },
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <div className={` whitespace-nowrap ${type === "Expense" ? "text-red-500" : "text-green-500"} `}>
          {(type === "Expense" ? "-" : "+") + "₹" + row.getValue("amount")}
        </div>
      );
    },
  },

  // Category Column
  {
    accessorKey: "categoryId",
    header: () => <div className="text-left">Category</div>,
    cell: ({ row }) => <div className="">{row.getValue("categoryId")}</div>,
  },

  // Method Column
  {
    accessorKey: "methodCode",
    header: () => <div className="text-left">Method</div>,
    cell: ({ row }) => <div className="">{row.getValue("methodCode")}</div>,
  },

  // Description Column
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

  // Date Column
  {
    accessorKey: "date",
    header: () => <div>Date</div>,
    cell: ({ row }) => <div>{format(row.getValue("date"), "PP")}</div>,
  },

  // Actions Column
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            {/* Edit Button */}
            <DropdownMenuItem
              onClick={() => editTransaction(transaction)}
              className="flex gap-2 items-center cursor-pointer"
            >
              <Pencil width={16} />
              Edit
            </DropdownMenuItem>

            {/* Copy Button */}
            <DropdownMenuItem
              onClick={() => copyTransaction(transaction)}
              className="flex gap-2 items-center cursor-pointer"
            >
              <Copy width={16} />
              Copy
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            {/* Delete Button  */}
            <DropdownMenuItem
              onClick={() => deleteTransaction([transaction._id], transaction.userId)}
              className=" text-red-500 flex gap-2 items-center hover:text-red-400 cursor-pointer"
            >
              <Trash2 width={16} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function DataTable() {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [data, setData] = React.useState<TransactionData[]>([]);
  const [filteredData, setFilteredData] = React.useState<TransactionData[]>([]);
  const [loaderOn, setLoaderOn] = React.useState(true);

  const { change } = useChangeModal(); // Used to refresh data after transaction is added
  const { onOpen, setEditData } = useModal(); // Used to open modal for editing/adding transaction

  // Fetch data from API every time change is made i.e. transaction is added
  React.useEffect(() => {
    setLoaderOn(true);
    const fetchData = async () => {
      const data = await transactionData();
      setData(data?.transactions);
      setLoaderOn(false);
    };
    fetchData();
  }, [change]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  // Delete function for single transaction (Used in action button of each row)
  deleteTransaction = async (ids: string[], userId: string) => {
    const body = { ids: ids };
    try {
      const res = await fetch("/api/user");
      const fetchedUser = await res.json();

      if (fetchedUser.userId != userId) {
        console.error("Unauthorized");
        return;
      }

      const response = await fetch(`/api/transaction/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.status !== 200) {
        throw new Error(response.statusText);
      } else {
        const newTransactions = data.filter((transaction) => !ids.includes(transaction._id));
        setFilteredData(newTransactions);
      }
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  };

  // Edit function for transaction (Used in action button of each row)
  editTransaction = async (transaction: TransactionData) => {
    setEditData(transaction);
    onOpen("EditTransaction");
  };

  // Delete function for multiple transactions (Used in delete button)
  const deleteTransactions = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const ids = selectedRows.map((row) => row.original._id);
    const userId = selectedRows[0].original.userId;
    console.log("Deleting", ids, " for ", userId);

    const body = { ids: ids };
    try {
      const res = await fetch("/api/user");
      const fetchedUser = await res.json();

      if (fetchedUser.userId != userId) {
        console.error("Unauthorized");
        return;
      }

      const response = await fetch(`/api/transaction/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.status !== 200) {
        throw new Error(response.statusText);
      } else {
        const newTransactions = data.filter((transaction) => !ids.includes(transaction._id));
        setFilteredData(newTransactions);
        table.toggleAllPageRowsSelected(false);
      }
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  };

  // Function to calculate number of rows visible (Used in pagination)
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
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search for transaction..."
          value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("description")?.setFilterValue(event.target.value)}
          className="max-w-sm dark:bg-neutral-950 dark:border-neutral-600"
        />
        <div className="space-x-2">
          <FilterAction data={data} setFilteredData={setFilteredData} />
        </div>
      </div>
      <Card x-chunk="dashboard-05-chunk-3">
        <CardHeader className="px-7">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                <p>Transactions</p>
              </CardTitle>
              <CardDescription>View and manage all {filteredData.length} transactions.</CardDescription>
            </div>
            <div className=" flex gap-2 items-center">
              <Button className=" bg-blue-700 text-white hover:bg-blue-800" onClick={() => onOpen("AddTransaction")}>
                Add new
              </Button>
              <Button
                className="gap-2 text-white bg-red-600 dark:bg-red-700 active:bg-red-900 hover:bg-red-800"
                variant="outline"
                onClick={deleteTransactions}
              >
                <Trash2 className=" h-6 w-6" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
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
