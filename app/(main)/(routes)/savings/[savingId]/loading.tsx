"use client";
import { useLoaderModal } from "@/hooks/use-modals-store";
import { useEffect } from "react";

export default function Loading() {
  const { setIsLoaderOn, isLoaderOn } = useLoaderModal();
  useEffect(() => {
    setIsLoaderOn(false);
  }, [isLoaderOn]);
  return <div className="loading-line"></div>;
}
