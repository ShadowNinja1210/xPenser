"use client";

import { useEffect, useState } from "react";
import { savingsData } from "@/lib/fetch-data";
import { formatNum } from "@/lib/function-lib";
import { ISavingsGoal } from "@/lib/types";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SavingsSideDash({ savings }: { savings: ISavingsGoal[] }) {
  const [filteredData, setFilteredData] = useState([] as { source: string; achieved: number }[]);
  const [total, setTotal] = useState(0);
  const [target, setTarget] = useState(0);
  const [loaderOn, setLoaderOn] = useState(true);

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        setLoaderOn(true);
        const data = await savingsData();
        setFilteredData(data?.sourceMetricsArray || []);
      } catch (e) {
        console.log(e);
      } finally {
        setLoaderOn(false);
      }
    };

    const calculateMetrics = async () => {
      try {
        let total = 0;
        let target = 0;
        savings.forEach((item: any) => {
          total += item.achieved;
          console.log(total, item.achieved);
          target += item.targetAmount;
          console.log(target, item.targetAmount);
        });
        setTotal(total);
        setTarget(target);
      } catch (error) {
        console.log(error);
      }
    };

    calculateMetrics();
    fetchSavings();
  }, []);

  return (
    <section>
      {/* Side Dashboard for savings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold grid grid-cols-2 w-full">
            <p>Savings:</p>
            <p className="text-right">{formatNum(total)}</p>
          </CardTitle>
          <CardDescription className="grid grid-cols-2 w-full">
            <p>Targeted Savings:</p>
            <p className="text-right">{formatNum(target)}</p>
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </section>
  );
}
