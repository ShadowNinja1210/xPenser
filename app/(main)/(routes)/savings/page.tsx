"use client";

import Savings from "@/components/savings/savings";
import { useLoaderModal } from "@/hooks/use-modals-store";

export default function SavingsPage() {
  const { setIsLoaderOn, isLoaderOn } = useLoaderModal();

  isLoaderOn && setIsLoaderOn(false);
  return (
    <main className="md:px-10 px-4">
      <title>Saving - xPenser</title>
      <Savings />
    </main>
  );
}
