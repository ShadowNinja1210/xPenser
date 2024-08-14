"use client";

import { useEffect, useState } from "react";

import { debtData } from "@/lib/fetch-data";
import { useChangeModal, useLoaderModal, useModal } from "@/hooks/use-modals-store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { IDebtAccount } from "@/lib/types";
import { DebtAccountCards } from "./debt-account-cards";
import Link from "next/link";

export default function Debt() {
  const [savings, setSavings] = useState<IDebtAccount[]>([]);
  const [filteredData, setFilteredData] = useState<IDebtAccount[]>([]);
  const [transactions, setTransactions] = useState<{ debtAccId: string; totalPaid: number }[]>([]); // [Debt Transactions]
  const [loaderOn, setLoaderOn] = useState(true);
  const { change } = useChangeModal();

  const { onOpen, setSavingId } = useModal();
  const { setIsLoaderOn } = useLoaderModal();

  useEffect(() => {
    const fetchSavings = async () => {
      setLoaderOn(true);
      const data = await debtData();
      setSavings(data);
      setFilteredData(data);
    };

    fetchSavings();
    setLoaderOn(false);
  }, [change]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const filtered = savings.filter((item) => {
      return (
        item.debtorName.toLowerCase().includes(value.toLowerCase()) ||
        item.source.toLowerCase().includes(value.toLowerCase()) ||
        item.status.toLowerCase().includes(value.toLowerCase()) ||
        item.reason.toLowerCase().includes(value.toLowerCase())
      );
    });
    setFilteredData(filtered);
  };

  return (
    <>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search for debt accounts..."
          onChange={(event) => handleSearch(event)}
          className=" max-w-60 md:max-w-sm dark:bg-neutral-950"
        />
      </div>

      <div className="grid items-start gap-4 md:gap-8 xl:grid-cols-[minmax(320px,7fr)_minmax(200px,2fr)] lg:grid-cols-[minmax(320px,4fr)_minmax(200px,2fr)]">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Debts</CardTitle>
                <CardDescription>Track your debt accounts and transactions.</CardDescription>
              </div>
              <Button className=" bg-blue-700 text-white hover:bg-blue-800" onClick={() => onOpen("AddDebt")}>
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
                filteredData.map((debt) => (
                  <Link key={debt._id.toString()} href={`/debts/${debt._id}`} className="w-full">
                    <DebtAccountCards debt={debt} />
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Side Dashboard for savings */}
        {/* <SavingsSideDash savings={savings} /> */}
      </div>
    </>
  );
}
