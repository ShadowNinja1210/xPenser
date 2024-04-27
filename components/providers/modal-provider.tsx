"use client";

import { useEffect, useState } from "react";
import { Feedback } from "@/components/modals/feedback-form";

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
    </>
  );
};
