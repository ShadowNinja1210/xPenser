"use client";

import { useEffect, useState } from "react";
import { transactionData } from "@/lib/fetch-data";
import { TableComponent } from "./table";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { CardContent, Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

export default function TransactionsPreview() {
  const [data, setData] = useState<TransactionData[]>([]);
  const [loaderOn, setLoaderOn] = useState(true);

  useEffect(() => {
    setLoaderOn(true);
    const fetchData = async () => {
      const data = await transactionData();
      setData(data?.transactions);
      setLoaderOn(false);
    };
    fetchData();
  }, []);

  return (
    <Card x-chunk="dashboard-05-chunk-3">
      <CardHeader className="px-7 ">
        <CardTitle className="flex items-center justify-between">
          Transactions
          <Link href="/transactions">
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1 border-blue-700 border-2 text-blue-700 dark:text-white dark:border-neutral-800"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">View all</span>
            </Button>
          </Link>
        </CardTitle>
        <CardDescription>Your recent transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <TableComponent filteredData={data} loaderOn={loaderOn} />
      </CardContent>
    </Card>
  );
}
