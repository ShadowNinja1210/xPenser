import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

// React UI Components
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
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

// Types
import { IDebtTransaction } from "@/lib/types";
import { ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { ActionTooltip } from "../action-tool-tip";
import _ from "lodash";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

export const columns: ColumnDef<IDebtTransaction>[] = [
  // Column for Transaction ID (Selection)
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select this row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "amount",
    header: () => <div>Amount</div>,
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <ActionTooltip label={type == "Penalty" ? "Penalty" : "Re-payment"}>
          <div className={`${type == "Penalty" ? "text-red-500" : "text-green-500"}`}>₹ {row.getValue("amount")}</div>
        </ActionTooltip>
      );
    },
  },
  {
    accessorKey: "date",
    header: () => <div>Date</div>,
    cell: ({ row }) => <span>{format(row.getValue("date"), "PP")}</span>,
  },
  {
    accessorKey: "modeOfPayment",
    header: () => <div>Mode of Payment</div>,
    cell: ({ row }) => <span>{row.getValue("modeOfPayment")}</span>,
  },
  {
    accessorKey: "remarks",
    header: () => <div>Remarks</div>,
    cell: ({ row }) => {
      return (
        <ActionTooltip label={row.getValue("remarks")}>
          <span>
            {_.truncate(row.getValue("remarks"), {
              length: 24,
              separator: /,? +/,
            })}
          </span>
        </ActionTooltip>
      );
    },
  },
];

export default function DebtTable({
  filteredData,
  debtorName,
}: {
  filteredData: IDebtTransaction[];
  debtorName: string;
}) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 }); // Pagination
  const [loaderOn, setLoaderOn] = useState(true); // Loader

  // React Table Hook to manage table state and actions (pagination, sorting, filtering)
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
    <Card>
      <CardHeader>
        <CardTitle>{debtorName}</CardTitle>
        <CardDescription>Debt transactions for {debtorName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
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
      </CardContent>

      <CardFooter>
        <div className="flex items-center justify-end space-x-2">
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
      </CardFooter>
    </Card>
  );
}
