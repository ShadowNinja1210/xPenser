"use client";

import { useEffect, useState } from "react";

import { savingsData } from "@/lib/fetch-data";
import { formatNum } from "@/lib/function-lib";
import { useChangeModal, useLoaderModal, useModal } from "@/hooks/use-modals-store";

import { ProgressCircle } from "@tremor/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Banknote, Landmark } from "lucide-react";
import SavingsSideDash from "@/components/savings/savings-side-dash";
import { ISavingsGoal } from "@/lib/types";

export default function Debt() {
  const [savings, setSavings] = useState<ISavingsGoal[]>([]);
  const [filteredData, setFilteredData] = useState<ISavingsGoal[]>([]);
  const [loaderOn, setLoaderOn] = useState(true);
  const { change } = useChangeModal();

  const { onOpen, setSavingId } = useModal();
  const { setIsLoaderOn } = useLoaderModal();

  useEffect(() => {
    const fetchSavings = async () => {
      setLoaderOn(true);
      const data = await savingsData();
      if (data) data.savings[0].source = "Cash";
      setSavings(data?.savings);
      setFilteredData(data?.savings);
    };

    fetchSavings();
    setLoaderOn(false);
  }, [change]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const filtered = savings.filter((item) => {
      return (
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.description.toLowerCase().includes(value.toLowerCase())
      );
    });
    setFilteredData(filtered);
  };

  return (
    <>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search for transaction..."
          onChange={(event) => handleSearch(event)}
          className=" max-w-60 md:max-w-sm dark:bg-neutral-950"
        />
      </div>

      <div className="grid items-start gap-4 md:gap-8 xl:grid-cols-[minmax(320px,7fr)_minmax(200px,2fr)] lg:grid-cols-[minmax(320px,4fr)_minmax(200px,2fr)]">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Savings</CardTitle>
                <CardDescription>Track your saving goals and transactions.</CardDescription>
              </div>
              <Button className=" bg-blue-700 text-white hover:bg-blue-800" onClick={() => onOpen("AddSavings")}>
                Add new
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md grid gap-4 grid-cols-[repeat(auto-fill,minmax(320px,1fr))] grid-flow-row justify-items-center items-center">
              {loaderOn ? (
                <>
                  <Skeleton className="min-w-80 w-full max-w-[400px] h-[201px]" />
                  <Skeleton className="min-w-80 w-full max-w-[400px] h-[201px]" />
                  <Skeleton className="min-w-80 w-full max-w-[400px] h-[201px]" />
                  <Skeleton className="min-w-80 w-full max-w-[400px] h-[201px]" />
                  <Skeleton className="min-w-80 w-full max-w-[400px] h-[201px]" />
                  <Skeleton className="min-w-80 w-full max-w-[400px] h-[201px]" />
                  <Skeleton className="min-w-80 w-full max-w-[400px] h-[201px]" />
                  <Skeleton className="min-w-80 w-full max-w-[400px] h-[201px]" />
                </>
              ) : (
                filteredData.map((saving) => (
                  <Card
                    key={saving._id.toString()}
                    className=" min-w-80 w-full max-w-[400px] cursor-pointer"
                    onClick={() => {
                      onOpen("SavingsTransactions");
                      setSavingId(saving._id.toString());
                      setIsLoaderOn(true);
                    }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className=" text-xl">{saving.name}</CardTitle>
                      <CardDescription>{saving.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-end justify-between pb-2">
                      <div>
                        <p>
                          Achieved: <span className="font-bold text-lg">₹ {formatNum(Number(saving.achieved))}</span>
                        </p>
                        <p>Goal: ₹ {formatNum(Number(saving.targetAmount))}</p>
                      </div>
                      <div>
                        <ProgressCircle
                          value={Math.floor((Number(saving.achieved) / Number(saving.targetAmount)) * 100)}
                          size="md"
                          showAnimation
                          color={
                            Math.floor((Number(saving.achieved) / Number(saving.targetAmount)) * 100) >= 70
                              ? "green"
                              : Math.floor((Number(saving.achieved) / Number(saving.targetAmount)) * 100) >= 50
                              ? "amber"
                              : "red"
                          }
                        >
                          <span
                            className={`${
                              Math.floor((Number(saving.achieved) / Number(saving.targetAmount)) * 100) >= 70
                                ? "text-green-500"
                                : Math.floor((Number(saving.achieved) / Number(saving.targetAmount)) * 100) >= 50
                                ? "text-orange-400"
                                : "text-red-400"
                            } text-sm font-bold`}
                          >
                            {Math.floor((Number(saving.achieved) / Number(saving.targetAmount)) * 100)}%
                          </span>
                        </ProgressCircle>
                      </div>
                    </CardContent>
                    <CardFooter className="text-xs py-1 bg-neutral-100 dark:bg-neutral-600 rounded-[0px_0px_5px_5px] flex items-center justify-center gap-1">
                      {saving.source != "Cash" ? (
                        <Landmark className=" h-3.5 w-3.5" />
                      ) : (
                        <Banknote className=" h-4 w-4" />
                      )}{" "}
                      <span className="mt-[2px]">{saving.source}</span>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Side Dashboard for savings */}
        <SavingsSideDash savings={savings} />
      </div>
    </>
  );
}
