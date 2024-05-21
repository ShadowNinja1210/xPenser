"use client";
import { useLoaderModal } from "@/hooks/use-modals-store";

export default function LineLoader() {
  const { isLoaderOn } = useLoaderModal();
  return isLoaderOn ? <div className="loading-line"></div> : null;
}
