"use client";

import { useEffect, useState } from "react";
import { formatNum } from "@/lib/function-lib";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { CardContent, Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import TransactionsPreview from "./transactions-preview";
import SideDash from "./side-dash";
import { transactionMetrics } from "@/lib/fetch-metrics";

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

export default function Dashboard() {
  const [loaderOn, setLoaderOn] = useState(true);
  const [weeklyExpenses, setWeeklyExpenses] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [income, setIncome] = useState(0);

  useEffect(() => {
    setLoaderOn(true);
    const fetchMetrics = async () => {
      const data = await transactionMetrics();
      if (data) {
        setWeeklyExpenses(data.weeklyExpenses);
        setMonthlyExpenses(data.monthlyExpenses);
        setIncome(data.income);
      }
      setLoaderOn(false);
    };

    fetchMetrics();
  }, []);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:p-6  md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {/* Card  - Creating a new Goal */}
          <Card className="sm:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Expense Goals</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Introducing Our New Goals Feature! <br />
                Set your goals and make your budget for month and week.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className=" bg-blue-700 dark:bg-white">Create New Goal</Button>
            </CardFooter>
          </Card>

          {/* Card - Weekly Goal */}
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>This Week&#39;s Expense</CardDescription>
              <CardTitle className="text-4xl">₹ {formatNum(weeklyExpenses)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">+25% from last week</div>
            </CardContent>
            <CardFooter>
              <Progress value={25} aria-label="25% increase" />
            </CardFooter>
          </Card>

          {/* Card - Monthly Goal */}
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>This Month&#39;s Expense</CardDescription>
              <CardTitle className="text-4xl">₹ {formatNum(monthlyExpenses)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">+10% from last month</div>
            </CardContent>
            <CardFooter>
              <Progress value={12} aria-label="12% increase" />
            </CardFooter>
          </Card>
        </div>

        {/* -------------------- */}
        {/* Transactions Preview Table */}
        <TransactionsPreview />
      </div>
      <div>
        {/* -------------------- */}
        {/* Side Dashboard */}
        <SideDash />
      </div>
    </main>
  );
}
