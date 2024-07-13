"use client";

import { useEffect, useState, useMemo } from "react";
import { formatNum } from "@/lib/function-lib";
import { ISavingsGoal, ISavingsSourceMetrics } from "@/lib/types";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DonutChart, Legend } from "@tremor/react";

export default function SavingsSideDash({ savings }: { savings: ISavingsGoal[] }) {
  const [savingMetrics, setSavingMetrics] = useState<ISavingsSourceMetrics>({} as ISavingsSourceMetrics);
  const [mapData, setMapData] = useState<{ name: string; mapData: number }[]>([]);
  const [keys, setKeys] = useState<string[]>([""]);
  const initialColors = useMemo(() => ["red", "green", "orange", "blue", "purple", "pink", "yellow", "cyan"], []);
  const initialColorsHex = ["ef4444", "22c55e", "f97316", "3b82f6", "a855f7", "ec4899", "eab308", "06b6d4"];
  const [colors, setColors] = useState<string[]>(initialColors);

  useEffect(() => {
    const calculateMetrics = async () => {
      const filteredBySource = new Map<string, number>();

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
        const filteredAndTransformed = keyValueArray.map(([key, value]) => ({
          name: key,
          mapData: value,
        }));

        filteredAndTransformed.push({ name: "Remaining", mapData: target - total });

        // Get keys from the map for the Legend Component
        const keys = keyValueArray.map(([key]) => key);

        // Set the data to the state
        setKeys(keys);
        setMapData(filteredAndTransformed);
        setColors([...initialColors.slice(0, filteredAndTransformed.length - 1)]);
        setSavingMetrics(data);
      } catch (error) {
        console.error(error);
      }
    };

    calculateMetrics();
  }, [savings, initialColors]);

  return (
    <section>
      {/* Side Dashboard for savings */}
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
              variant="donut"
              data={mapData}
              category="mapData"
              valueFormatter={(value) => `₹ ${formatNum(value)}`}
              label={`${savingMetrics.achievedPercentage}%`}
              index="name"
              colors={[...colors, "neutral"]}
              className="w-40 z-10"
              showAnimation
            />
            <Legend categories={keys} colors={colors} className="max-w-xs" />
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
    </section>
  );
}
