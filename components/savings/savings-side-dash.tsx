"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { createChartConfig, formatNum } from "@/lib/function-lib";
import { chartData, ISavingsGoal, ISavingsSourceMetrics } from "@/lib/types";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";
interface DonutChartProps {
  chartData: chartData[];
  middle: string;
}

const DonutChart = dynamic(() => import("@/components/donut-chart").then((mod) => mod.DonutChart), {
  loading: () => <Skeleton className=" h-[180px] w-full" />,
  ssr: false,
}); // NECESSARY STEP - React.FC is a type for functional components and it is used here because the DonutChart component is a functional component and it is being imported dynamically. This is done to avoid circular dependencies.

export default function SavingsSideDash({ savings }: { savings: ISavingsGoal[] }) {
  const [savingMetrics, setSavingMetrics] = useState<ISavingsSourceMetrics>({} as ISavingsSourceMetrics);
  const [mapData, setMapData] = useState<chartData[]>([]);
  const [dataReady, setDataReady] = useState<boolean>(false);
  const initialColorsHex = useMemo(
    () => ["#22c55e", "#f97316", "#3b82f6", "#a855f7", "#ec4899", "#eab308", "#06b6d4"],
    []
  );

  useEffect(() => {
    const calculateMetrics = async () => {
      const filteredBySource = new Map<string, number>();
      setDataReady(false);

      try {
        let total = 0;
        let target = 0;
        savings.forEach((item: any) => {
          if (filteredBySource.has(item.source)) {
            filteredBySource.set(item.source, filteredBySource.get(item.source) + item.achieved);
          } else {
            filteredBySource.set(item.source, item.achieved);
          }
          total += item.achieved;
          target += item.targetAmount;
        });
        const data = {
          achievedTotal: total,
          targetTotal: target,
          achievedPercentage: Math.floor((total / target) * 100),
          filteredBySource: Object.fromEntries(filteredBySource),
        };

        // Transform the data to be used in the Donut Chart
        const keyValueArray = Array.from(filteredBySource.entries()); // Convert the Map to an Array
        const filteredAndTransformed = keyValueArray.map(([key, value], index) => ({
          name: key,
          mapData: value,
          fill: initialColorsHex[index],
        }));

        filteredAndTransformed.push({ name: "Remaining", mapData: target - total, fill: "#525252" });

        // Set the data to the state
        setMapData(filteredAndTransformed);
        setSavingMetrics(data);
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          setDataReady(true);
        }, 4000);
      }
    };

    calculateMetrics();
  }, [savings, initialColorsHex]);

  return (
    <section>
      {!dataReady ? (
        // Skeleton Loading
        <Skeleton className=" h-[485px] w-full" />
      ) : (
        // Side Dashboard for savings
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold grid grid-cols-2 w-full">
              <p>Savings:</p>
              <p className="text-right">{savingMetrics.achievedTotal && formatNum(savingMetrics.achievedTotal)}</p>
            </CardTitle>
            <CardDescription className="grid grid-cols-2 w-full">
              <p>Targeted Savings:</p>
              <p className="text-right">{savingMetrics.achievedTotal && formatNum(savingMetrics.targetTotal)}</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-6">
              <DonutChart
                chartConfig={createChartConfig(mapData)}
                chartData={mapData}
                middle={savingMetrics.achievedPercentage.toString() + "%"}
              />
            </div>
          </CardContent>
          <CardContent className="flex flex-col gap-2">
            <CardTitle className="text-xl">Savings by Source</CardTitle>
            <ul>
              {Object.entries(savingMetrics.filteredBySource || {}).map(([key, value], index) => (
                <li key={key} className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">{key}:</span>
                  <span className={`text-right text-[#${initialColorsHex[index]}]`}>₹ {formatNum(value)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
