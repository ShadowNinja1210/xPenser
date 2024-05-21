"use client";

import { useModal, useLoaderModal } from "@/hooks/use-modals-store";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ExternalLink } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Help() {
  const { onOpen } = useModal();
  const { setIsLoaderOn } = useLoaderModal();
  const url = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <p className="cursor-pointer text-center py-0 px-0 text-neutral-900 rounded hover:bg-neutral-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-neutral-700 dark:hover:text-white md:dark:hover:bg-transparent">
          Help
        </p>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link
            href="/guide"
            prefetch={false}
            onClick={() => {
              url != "/guide" && setIsLoaderOn(true);
            }}
            className={`${
              url === "/guide" ? "text-blue-700 dark:text-blue-500" : "text-neutral-900 dark:text-white"
            } flex items-center justify-between w-full`}
          >
            Guide <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onOpen("Feedback")} className="cursor-pointer">
          Feedback
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
