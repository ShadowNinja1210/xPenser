"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import mongoose from "mongoose";

import { savingsData } from "@/lib/fetch-data";
import { formatNum } from "@/lib/function-lib";
import { useLoaderModal, useModal } from "@/hooks/use-modals-store";

import { ProgressCircle } from "@tremor/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Landmark } from "lucide-react";
import SavingsSideDash from "@/components/savings/savings-side-dash";

// const savings = [
//   {
//     _id: "1",
//     userId: "user_2fKNMoxnyz3O5XJB4r1tdKBnNhG",
//     name: "Bike Downpayment",
//     description: "New Raider bike downpayment.",
//     targetAmount: "20000",
//     achieved: "5000",
//     source: "HDFC Bank",
//   },
//   {
//     _id: "2",
//     userId: "user_2fKNMoxnyz3O5XJB4r1tdKBnNhG",
//     name: "Shifting to Pune",
//     description: "Moving expenses & deposits.",
//     targetAmount: "40000",
//     achieved: "30000",
//     source: "PF Account",
//   },
//   {
//     _id: "3",
//     userId: "user_2fKNMoxnyz3O5XJB4r1tdKBnNhG",
//     name: "House Shifting (Indore)",
//     description: "Deposits and shifting charges.",
//     targetAmount: "30000",
//     achieved: "12000",
//     source: "PF Account",
//   },
//   {
//     _id: "4",
//     userId: "user_2fKNMoxnyz3O5XJB4r1tdKBnNhG",
//     name: "Gold Chain for Mom",
//     description: "Gold chain as investment for Mom.",
//     targetAmount: "50000",
//     achieved: "11111",
//     source: "Phone Pe Gold Purchase",
//   },
//   {
//     _id: "5",
//     userId: "user_2fKNMoxnyz3O5XJB4r1tdKBnNhG",
//     name: "Items for kitchen (Indore)",
//     description: "New utensils and kitchen items.",
//     targetAmount: "10000",
//     achieved: "2000",
//     source: "HDFC Account",
//   },
//   {
//     _id: "6",
//     userId: "user_2fKNMoxnyz3O5XJB4r1tdKBnNhG",
//     name: "Trip with Shweta",
//     description: "Planning a trip with Shweta.",
//     targetAmount: "50000",
//     achieved: "6000",
//     source: "ICICI Account",
//   },
//   {
//     _id: "7",
//     userId: "user_2fKNMoxnyz3O5XJB4r1tdKBnNhG",
//     name: "New Watch",
//     description: "For a new fastrack watch.",
//     targetAmount: "8000",
//     achieved: "2000",
//     source: "Cash in Black Wallet",
//   },
//   {
//     _id: "8",
//     userId: "user_2fKNMoxnyz3O5XJB4r1tdKBnNhG",
//     name: "Headphones for Shweta",
//     description: "Buying headphones for Shweta.",
//     targetAmount: "15000",
//     achieved: "7000",
//     source: "ICICI Account",
//   },
//   {
//     _id: "9",
//     userId: "user_2fKNMoxnyz3O5XJB4r1tdKBnNhG",
//     name: "New TV for Home",
//     description: "A new TV for home.",
//     targetAmount: "25000",
//     achieved: "3000",
//     source: "SBI Account",
//   },
// ];

interface ISavingsGoal extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  name: string;
  targetAmount: number;
  achieved: number;
  source: string;
  description: string;
}

export default function Savings() {
  const [savings, setSavings] = useState<ISavingsGoal[]>([]);
  const [filteredData, setFilteredData] = useState<ISavingsGoal[]>([]);
  const [loaderOn, setLoaderOn] = useState(true);

  const { onOpen } = useModal();
  const { setIsLoaderOn } = useLoaderModal();

  useEffect(() => {
    const fetchSavings = async () => {
      setLoaderOn(true);
      const data = await savingsData();
      setSavings(data?.savings);
      setFilteredData(data?.savings);
    };

    fetchSavings();
    setLoaderOn(false);
  }, []);

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
    <section className=" w-full">
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
                filteredData.map((saving, index) => (
                  <Link key={index} href={`/savings/${saving._id.toString()}`} onClick={() => setIsLoaderOn(true)}>
                    <Card className=" min-w-80 w-full max-w-[400px] cursor-pointer">
                      <CardHeader className="pb-2">
                        <CardTitle className=" text-xl">{saving.name}</CardTitle>
                        <CardDescription>{saving.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-end justify-between pb-2">
                        <div>
                          <p>Goal: ₹ {formatNum(Number(saving.targetAmount))}</p>
                          <p>Achieved: ₹ {formatNum(Number(saving.achieved))}</p>
                        </div>
                        <div>
                          <ProgressCircle
                            value={Math.floor((Number(saving.achieved) / Number(saving.targetAmount)) * 100)}
                            size="md"
                            showAnimation
                          >
                            <span className="text-sm font-medium dark:text-white">
                              {Math.floor((Number(saving.achieved) / Number(saving.targetAmount)) * 100)}%
                            </span>
                          </ProgressCircle>
                        </div>
                      </CardContent>
                      <CardFooter className="text-xs py-1 bg-neutral-100 dark:bg-neutral-600 rounded-[0px_0px_5px_5px] flex items-center justify-center gap-1">
                        <Landmark className=" h-3.5 w-3.5" /> <span className="mt-[2px]">{saving.source}</span>
                      </CardFooter>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Side Dashboard for savings */}
        <SavingsSideDash savings={savings} />
      </div>
    </section>
  );
}
