"use client";

import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("@/components/dashboard/dashboard"));

import { useLoaderModal } from "@/hooks/use-modals-store";

export default function Home() {
  const { setIsLoaderOn, isLoaderOn } = useLoaderModal();

  isLoaderOn && setIsLoaderOn(false);

  return (
    <>
      <title>Dashboard - xPenser</title>
      <Dashboard />
    </>
  );
}
