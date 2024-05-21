import Link from "next/link";

import { ExternalLink, Landmark } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardContent, Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { ProgressCircle } from "@tremor/react";

import { HealthDonut } from "./financial-health-score";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { savingsData } from "@/lib/fetch-data";
import { formatNum } from "@/lib/function-lib";

import mongoose from "mongoose";
import { useLoaderModal } from "@/hooks/use-modals-store";

const transactions = [
  {
    name: "Expenses",
    transactions: 22000,
  },
  {
    name: "Savings",
    transactions: 2000,
  },
  {
    name: "Debt",
    transactions: 7000,
  },
];

interface ISavingsGoal extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  name: string;
  targetAmount: number;
  achieved: number;
  source: string;
  description: string;
}

const total = transactions.reduce((acc, curr) => acc + curr.transactions, 0);
const income = 50000;
const balanceValue = income - total;

transactions.push({
  name: "Balance",
  transactions: balanceValue,
});

export default function SideDash() {
  const [saving, setSaving] = useState<ISavingsGoal>({});
  const [loaderOn, setLoaderOn] = useState(true);
  const today = new Date();
  const month = format(today, "MMMM");
  const year = format(today, "yyyy");

  const { setIsLoaderOn } = useLoaderModal();

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        setLoaderOn(true);
        const data = await savingsData();
        setSaving(data?.savings[0]);
      } catch (e) {
        console.log(e);
      } finally {
        setLoaderOn(false);
      }
    };

    fetchSavings();
  }, []);

  return (
    <>
      {/* Analysis Report */}
      <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">Analysis Report</CardTitle>
            <CardDescription>
              {month}, {year}
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Link href="/reports" onClick={() => setIsLoaderOn(true)}>
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1 border-blue-700 border-2 text-blue-700 dark:text-white dark:border-neutral-800"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">View full</span>
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <HealthDonut transactions={transactions} income={50000} investments={7000} />
          </div>
        </CardContent>
      </Card>

      {/* Savings Accounts */}
      <Card>
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">Savings</CardTitle>
            <CardDescription>All your Savings Information in one place.</CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Link href="/savings" onClick={() => setIsLoaderOn(true)}>
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1 border-blue-700 border-2 text-blue-700 dark:text-white dark:border-neutral-800"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">View all</span>
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loaderOn ? (
            <Skeleton className="min-w-80 w-full max-w-[400px] h-[201px] mx-auto" />
          ) : (
            <Link href={`/savings/${saving._id?.toString()}`} onClick={() => setIsLoaderOn(true)}>
              <Card className=" min-w-80 w-full max-w-[400px] cursor-pointer mx-auto">
                <CardHeader className="pb-2">
                  <CardTitle className=" text-xl">{saving.name}</CardTitle>
                  <CardDescription>{saving.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-end justify-between">
                  <div className=" text-md">
                    <p>Goal: ₹ {formatNum(Number(saving.targetAmount))}</p>
                    <p>Achieved: ₹ {formatNum(Number(saving.achieved))}</p>
                  </div>
                  <div>
                    <ProgressCircle
                      value={Math.floor((Number(saving.achieved) / Number(saving.targetAmount)) * 100)}
                      size="md"
                      showAnimation
                    >
                      <span className="text-sm font-medium text-white">
                        {Math.floor((Number(saving.achieved) / Number(saving.targetAmount)) * 100)}%
                      </span>
                    </ProgressCircle>
                  </div>
                </CardContent>
                <CardFooter className="text-xs py-1 bg-neutral-600 rounded-[0px_0px_5px_5px] flex items-center justify-center gap-1">
                  <Landmark className=" h-3.5 w-3.5" /> <span className="mt-[2px]">{saving.source}</span>
                </CardFooter>
              </Card>
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Debt Accounts */}
      <Card>
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">Debts</CardTitle>
            <CardDescription>All your Debt Information in one place.</CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Link href="/debts" onClick={() => setIsLoaderOn(true)}>
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1 border-blue-700 border-2 text-blue-700 dark:text-white dark:border-neutral-800"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">View all</span>
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-3">
            <div className="font-semibold">Debts Accounts</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Customer</dt>
                <dd>Liam Johnson</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd>
                  <a href="mailto:">liam@acme.com</a>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Phone</dt>
                <dd>
                  <a href="tel:">+1 234 567 890</a>
                </dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
