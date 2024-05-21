"use client";

import { useEffect, useState } from "react";
import { Feedback } from "@/components/modals/feedback-form";
import AddTransactions from "@/components/modals/add-transactions";
import Savings from "@/components/modals/add-savings";
import Debt from "@/components/modals/add-debt";
import AddSavingTransactions from "../modals/saving-transactions-modal";

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
      <Feedback />
      <AddTransactions />
      <Savings />
      <Debt />
      <AddSavingTransactions />
    </>
  );
};
