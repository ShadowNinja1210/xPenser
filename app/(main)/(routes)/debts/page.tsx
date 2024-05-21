"use client";

import { useLoaderModal } from "@/hooks/use-modals-store";

export default function DebtsPage() {
  const { setIsLoaderOn, isLoaderOn } = useLoaderModal();

  isLoaderOn && setIsLoaderOn(false);
  return (
    <div>
      <title>Debts</title>
      <h1>Debts</h1>
    </div>
  );
}
