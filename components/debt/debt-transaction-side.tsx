import dynamic from "next/dynamic";

import { format } from "date-fns";
import { createChartConfig, formatNum } from "@/lib/function-lib";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
const DonutChart = dynamic(() => import("@/components/donut-chart").then((mod) => mod.DonutChart));

import { IDebtAccount, IDebtTransaction } from "@/lib/types";
import { Pen } from "lucide-react";
import { ChartConfig } from "../ui/chart";

const Details = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="flex font-semibold  justify-between w-full">
      <h1 className="text-muted-foreground">{title}:</h1>
      <h3>{value}</h3>
    </div>
  );
};

export const DebtTransactionsSide = ({ debtData, data }: { debtData: IDebtAccount; data: IDebtTransaction[] }) => {
  const totalPenalties = data.reduce((acc, item) => (item.type === "Penalty" ? acc + item.amount : acc), 0);
  const totalPaid = debtData.amountWithInterest - debtData.amountToPay;
  const chartData = [
    { name: "Penalties", mapData: totalPenalties, fill: "hsl(0, 84%, 60%)" },
    { name: "Paid", mapData: totalPaid, fill: "hsl(142, 71%, 45%)" },
    { name: "Remaining", mapData: debtData.amountToPay, fill: "hsl(217, 91%, 60%)" },
  ];

  return (
    <Card className="rounded-md">
      <CardHeader>
        <CardTitle>Debt Details</CardTitle>
        <CardDescription>{debtData.reason}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 w-80">
        <DonutChart
          chartConfig={createChartConfig(chartData)}
          middle={`₹ ${formatNum(totalPaid)}`}
          chartData={chartData}
        />
        <div className=" flex flex-col gap-2">
          <Details title="Amount Borrowed" value={`₹ ${formatNum(debtData.amountBorrowed)}`} />
          <Details title="Amount to Pay" value={`₹ ${formatNum(debtData.amountToPay)}`} />
          <Details title="Date Borrowed" value={format(debtData.dateBorrowed, "PP")} />
          <Details title="Due Date" value={format(debtData.dueDate, "PP")} />
          <Details title="Interest Rate" value={`${debtData.interestRate}%`} />
          <Details title="Source" value={debtData.source} />
          <Details title="Status" value={debtData.status} />
          <Details
            title="Last Payment Date"
            value={debtData.lastPaymentDate ? format(debtData.lastPaymentDate, "PP") : "-"}
          />
        </div>
      </CardContent>
    </Card>
  );
};
