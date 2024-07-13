"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "@react-hook/media-query";
import dynamic from "next/dynamic";

const DataCard = dynamic(() => import("@/components/transactions/data-cards").then((module) => module.DataCard), {
  ssr: false,
  loading: () => <Loader />,
});
const DataTable = dynamic(() => import("@/components/transactions/data-table").then((module) => module.DataTable), {
  ssr: false,
  loading: () => <Loader />,
});

import { Loader } from "@/components/loaders/loader";
import { useLoaderModal } from "@/hooks/use-modals-store";

export default function TransactionPage() {
  const isMobileOrTablet = useMediaQuery("(max-width: 768px)");
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setIsLoaderOn, isLoaderOn } = useLoaderModal();

  useEffect(() => {
    if (isLoaderOn) {
      setIsLoaderOn(false);
    }
  }, [isLoaderOn, setIsLoaderOn]);

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <main className="flex justify-center items-center w-full h-screen">
        <title>Transactions - xPenser</title>
        <Loader />
      </main>
    );
  }

  return (
    <main className="md:px-10 px-4" suppressHydrationWarning>
      <title>Transactions</title>
      {isClient && (isMobileOrTablet ? <DataCard /> : <DataTable />)}
    </main>
  );
}
