import Link from "next/link";

import { CreditCard, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { CardContent, Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthDonut } from "./financial-health-score";
import { format } from "date-fns";

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

const total = transactions.reduce((acc, curr) => acc + curr.transactions, 0);
const income = 50000;
const balanceValue = income - total;

transactions.push({
  name: "Balance",
  transactions: balanceValue,
});

export default function SideDash() {
  const today = new Date();
  const month = format(today, "MMMM");
  const year = format(today, "yyyy");

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
            <Link href="/reports">
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
            <Link href="/savings">
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
            <div className="font-semibold">Savings Accounts</div>
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

      {/* Debt Accounts */}
      <Card>
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">Debts</CardTitle>
            <CardDescription>All your Debt Information in one place.</CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Link href="/debts">
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
