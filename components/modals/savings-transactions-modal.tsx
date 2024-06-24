"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { useModal } from "@/hooks/use-modals-store";
import type { SavingsTransactions } from "@/lib/types";
import { savingsTransactionsData } from "@/lib/fetch-data";

// Components
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader } from "@/components/loaders/loader";
import { Button } from "@/components/ui/button";

// Dynamic Components (For Lazy Loading)
const SavingTransactions = dynamic(() => import("@/components/savings/savings-transactions-table"));

export default function SavingTransactionsModal() {
  // States
  const [data, setData] = useState<SavingsTransactions[]>([]);
  const [loaderOn, setLoaderOn] = useState(true);
  const [savingGoalName, setSavingGoalName] = useState("");
  const [target, setTarget] = useState({
    achieved: 0,
    target: 0,
  });

  // Hooks
  const { isOpen, onOpen, onClose, type, savingId } = useModal();
  const isModalOpen = isOpen && type === "SavingsTransactions";

  // Fetch Data
  useEffect(() => {
    setLoaderOn(true);
    const fetchData = async () => {
      console.log(savingId);
      const data = await savingsTransactionsData(savingId);
      setData(data?.transactions);
      setSavingGoalName(data?.saving?.name);
      setTarget({
        achieved: data?.saving?.achieved,
        target: data?.saving?.targetAmount,
      });
      setLoaderOn(false);
    };
    if (savingId != "") fetchData();
  }, [savingId]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[385px]">
        {loaderOn ? (
          <Loader />
        ) : (
          <>
            <DialogHeader>
              <div className="flex justify-between">
                <div>
                  <DialogTitle>{savingGoalName}</DialogTitle>
                  <DialogDescription className=" mt-1">
                    Saved:{" "}
                    <span
                      className={`${
                        Math.floor((target?.achieved / target?.target) * 100) >= 75
                          ? "text-green-500"
                          : Math.floor((target?.achieved / target?.target) * 100) >= 50
                          ? "text-orange-400"
                          : "text-red-500"
                      } font-bold`}
                    >
                      {target?.achieved}
                    </span>{" "}
                    / <span className="font-bold text-white">{target?.target}</span>
                  </DialogDescription>
                </div>
                <Button
                  className=" mr-5 bg-blue-700 text-white hover:bg-blue-800"
                  onClick={() => onOpen("AddSavingTransaction")}
                >
                  Add new
                </Button>
              </div>
            </DialogHeader>
            {data && <SavingTransactions data={data} />}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
