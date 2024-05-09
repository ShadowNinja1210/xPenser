import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { CardContent, Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import TransactionsPreview from "./transactions-preview";

export default function Dashboard() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {/* Card  - Creating a new Goal */}
          <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardTitle>Expense Goals</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Introducing Our New Goals Feature! <br />
                Set your goals and track your expenses.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button>Create New Goal</Button>
            </CardFooter>
          </Card>

          {/* Card - Weekly Goal */}
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription>This Week&#39;s Expense</CardDescription>
              <CardTitle className="text-4xl">$1,329</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">+25% from last week</div>
            </CardContent>
            <CardFooter>
              <Progress value={25} aria-label="25% increase" />
            </CardFooter>
          </Card>

          {/* Card - Monthly Goal */}
          <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
              <CardDescription>This Month&#39;s Expense</CardDescription>
              <CardTitle className="text-4xl">$5,329</CardTitle>
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
      <div></div>
    </main>
  );
}
