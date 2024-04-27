"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modals-store";
import Link from "next/link";

export function Help() {
  const { onOpen } = useModal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <p className="cursor-pointer text-center py-2 px-3 text-neutral-900 rounded hover:bg-neutral-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-neutral-700 dark:hover:text-white md:dark:hover:bg-transparent">
          Help
        </p>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link href="/guide">Guide</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onOpen("Feedback")} className="cursor-pointer">
          Feedback
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
