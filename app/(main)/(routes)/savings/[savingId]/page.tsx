"use client";

import { SavingTable } from "@/components/savings/savings-transactions-table";
import { useLoaderModal } from "@/hooks/use-modals-store";

export default function SavingsTransactions({ params }: { params: { savingId: string } }) {
  const { setIsLoaderOn, isLoaderOn } = useLoaderModal();

  isLoaderOn && setIsLoaderOn(false);
  return (
    <main className="md:px-10 px-4">
      <SavingTable savingId={params.savingId} />
    </main>
  );
}
