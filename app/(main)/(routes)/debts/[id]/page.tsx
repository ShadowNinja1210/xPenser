"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const DebtTransactions = dynamic(() => import("@/components/debt/debt-transactions"));

export default function Debt() {
  const { id } = useParams();

  return (
    <main className="md:px-10 px-4">
      <DebtTransactions accountId={id.toString()} />
    </main>
  );
}
