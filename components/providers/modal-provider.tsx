"use client";

import { useEffect, useState } from "react";
import {
  Feedback,
  AddTransactions,
  AddSavingTransactions,
  EditTransaction,
  AddSavings,
  EditSavings,
  AddDebt,
  SavingTransactionsModal,
} from "@/components/modals";

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
