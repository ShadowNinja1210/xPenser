"use client";

import { useLoaderModal } from "@/hooks/use-modals-store";

export default function ReportsPage() {
  const { setIsLoaderOn, isLoaderOn } = useLoaderModal();

  isLoaderOn && setIsLoaderOn(false);
  return (
    <div>
      <title>Report</title>
      <h1>Reports</h1>
    </div>
  );
}
