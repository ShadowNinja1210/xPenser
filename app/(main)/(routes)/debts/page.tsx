"use client";

import dynamic from "next/dynamic";
const Debt = dynamic(() => import("@/components/debt/debt"));
import { useLoaderModal } from "@/hooks/use-modals-store";

export default function DebtsPage() {
  const { setIsLoaderOn, isLoaderOn } = useLoaderModal();

  isLoaderOn && setIsLoaderOn(false);
  return (
    <main className="md:px-10 px-4">
      <title>Debts - xPenser</title>
      <Debt />
    </main>
  );
}
