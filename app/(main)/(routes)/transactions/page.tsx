"use client";

import { useMediaQuery } from "@react-hook/media-query";
import { useState, useEffect } from "react";

import { DataCard } from "@/components/transactions/data-cards";
import { DataTable } from "@/components/transactions/data-table";
import { Loader } from "@/components/loaders/loader";
import { useLoaderModal } from "@/hooks/use-modals-store";

export default function TransactionPage() {
  const isMobileOrTablet = useMediaQuery("(max-width: 768px)");
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setIsLoaderOn, isLoaderOn } = useLoaderModal();

  isLoaderOn && setIsLoaderOn(false);

  useEffect(() => {
    setIsClient(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return isLoading ? (
    <main className="flex justify-center items-center w-full h-screen">
      <title>Transactions</title>
      <Loader />
    </main>
  ) : (
    <main className="md:px-10 px-4" suppressHydrationWarning>
      <title>Transactions</title>
      {isClient && (isMobileOrTablet ? <DataCard /> : <DataTable />)}
    </main>
  );
}
