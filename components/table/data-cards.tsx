"use client";

import * as React from "react";
import * as _ from "lodash";

import { ChevronDown, MoreHorizontal, LayoutGrid, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CardContent, Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

import transactionData from "@/lib/fetch-data";
import { format } from "date-fns";
import { useChangeModal } from "@/hooks/use-modals-store";
import { ActionTooltip } from "../action-tool-tip";
import { FilterAction } from "./filter-action";

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

export function DataCard() {
  const [data, setData] = React.useState<TransactionData[]>([]);
  const [filteredData, setFilteredData] = React.useState<TransactionData[]>([]);
  const [loaderOn, setLoaderOn] = React.useState(true);

  const { change } = useChangeModal();

  React.useEffect(() => {
    setLoaderOn(true);
    const fetchData = async () => {
      const data = await transactionData();
      setData(data?.transactions);
      setLoaderOn(false);
    };
    fetchData();
  }, [change]);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const totalPages = Math.ceil(data.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const currentData = filteredData.slice(startIndex, endIndex);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const filtered = data.filter((item) => {
      return item.description.toLowerCase().includes(value.toLowerCase());
    });
    setFilteredData(filtered);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search for transaction..."
          onChange={(event) => handleSearch(event)}
          className=" max-w-60 dark:bg-neutral-950"
        />
        <div className="space-x-2">
          <FilterAction data={data} setFilteredData={setFilteredData} />
        </div>
      </div>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>View and manage all {filteredData.length} transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md flex flex-col gap-3">
            {loaderOn && (
              <>
                <Skeleton className="h-[134px]" />
                <Skeleton className="h-[134px]" />
                <Skeleton className="h-[134px]" />
                <Skeleton className="h-[134px]" />
                <Skeleton className="h-[134px]" />
                <Skeleton className="h-[134px]" />
              </>
            )}
            {currentData?.map((item, index) => {
              return (
                <Card key={index}>
                  <CardHeader className="space-y-[2px] p-4">
                    <CardTitle
                      className={`flex justify-between text-xl ${
                        item.type === "Expense" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      <p>
                        {item.type === "Expense" ? "-" : "+"}
                        {item.amount}
                      </p>
                      <Badge className=" m-1">{item.methodCode}</Badge>
                    </CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className=" flex justify-between">
                    <p className="flex items-center gap-2">
                      <LayoutGrid className=" h-4 w-4" /> {item.categoryId}
                    </p>
                    <p className="flex items-center gap-2">
                      <CalendarDays className=" h-4 w-4" />
                      {format(item.date, "PP")}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex items-center justify-between w-full mt-4">
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-auto ">
                    {pageSize} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" value={pageSize}>
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <DropdownMenuRadioItem
                      key={pageSize}
                      value={pageSize.toString()}
                      onClick={() => setPageSize(pageSize)}
                    >
                      {pageSize}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className=" flex gap-2 items-center">
              <Button variant="outline" size="sm" onClick={() => prevPage()} disabled={currentPage === 1}>
                Previous
              </Button>
              <span className=" text-sm">
                {currentPage} of {totalPages}
              </span>
              <Button variant="outline" size="sm" onClick={() => nextPage()} disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
