"use client";

import Dashboard from "@/components/dashboard/dashboard";

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
