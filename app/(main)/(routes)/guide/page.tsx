"use client";

import { useLoaderModal } from "@/hooks/use-modals-store";

export default function GuidePage() {
  const { setIsLoaderOn, isLoaderOn } = useLoaderModal();

  isLoaderOn && setIsLoaderOn(false);
  return (
    <div>
      <title>Guide - xPenser</title>
      <h1>Guide</h1>
    </div>
  );
}
