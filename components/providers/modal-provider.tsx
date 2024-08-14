"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Feedback = dynamic(() => import("@/components/modals/feedback-form"));
const AddTransactions = dynamic(() => import("@/components/modals/add-transactions"));
const AddSavingTransactions = dynamic(() => import("@/components/modals/add-saving-transactions-modal"));
const EditTransaction = dynamic(() => import("@/components/modals/edit-transaction"));
const AddSavings = dynamic(() => import("@/components/modals/add-savings"));
const EditSavings = dynamic(() => import("@/components/modals/edit-saving"));
const AddDebt = dynamic(() => import("@/components/modals/add-debt"));
const SavingTransactionsModal = dynamic(() => import("@/components/modals/savings-transactions-modal"));

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AddDebt />
      <AddSavings />
      <AddSavingTransactions />
      <AddTransactions />
      <EditSavings />
      <EditTransaction />
      <Feedback />
      <SavingTransactionsModal />
    </>
  );
};
