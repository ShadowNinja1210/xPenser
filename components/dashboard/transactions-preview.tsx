"use client";

import { useEffect, useState } from "react";
import transactionData from "@/lib/fetch-data";
import { TableComponent } from "./table";

import { CardContent, Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
      <CardHeader className="px-7">
        <CardTitle>Transactions</CardTitle>
        <CardDescription>Your recent transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <TableComponent filteredData={data} loaderOn={loaderOn} />
      </CardContent>
    </Card>
  );
}
