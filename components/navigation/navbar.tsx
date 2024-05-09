"use client";

import Image from "next/image";
import Logo from "@/public/Logo.svg";
import { SquarePlus } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Separator } from "@radix-ui/react-separator";
import { Help } from "./help-item";
import { useModal } from "@/hooks/use-modals-store";
import { Skeleton } from "../ui/skeleton";

export default function Navbar() {
  const { onOpen } = useModal();

  return (
    <nav className=" dark:bg-neutral-950 bg-neutral-200 md:px-10 py-4 px-4 flex justify-between relative z-10">
      <button
        data-collapse-toggle="navbar-default"
        type="button"
        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-neutral-500 rounded-lg md:hidden hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:ring-neutral-600"
        aria-controls="navbar-default"
        aria-expanded="false"
        onClick={() => {
          const navbarDefault = document.getElementById("navbar-default");
          if (navbarDefault) {
            navbarDefault.classList.toggle("hidden");
          }
        }}
      >
        <span className="sr-only">Open main menu</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>

      {/* Left */}
      <div>
        <Link href="/">
          <Image className="dark:mix-blend-normal mix-blend-multiply" src={Logo} width={150} alt="xPenser Logo" />
        </Link>
      </div>

      <div className="flex md:gap-8 gap-4 items-center">
        <div
          className="hidden dark:bg-neutral-950 bg-neutral-200 px-8 md:py-0 pb-4 pt-2 w-full md:block md:w-auto md:static absolute top-full left-0 right-0"
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col gap-2 md:gap-0 items-center p-4 md:p-0 border-2 border-neutral-200 rounded-lg bg-white md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-200 dark:bg-neutral-800 md:dark:bg-neutral-950 dark:border-neutral-700">
            <li>
              <Link
                href="/dashboard"
                className="text-center py-2 px-3 text-neutral-900 rounded hover:bg-neutral-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-neutral-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/transactions"
                className="text-center py-2 px-3 text-neutral-900 rounded hover:bg-neutral-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-neutral-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Transactions
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-center py-2 px-3 text-neutral-900 rounded hover:bg-neutral-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-neutral-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Calendar
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-center py-2 px-3 text-neutral-900 rounded hover:bg-neutral-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-neutral-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Reports
              </Link>
            </li>
            <li>
              <Help />
            </li>
          </ul>
        </div>

        <button
          className="p-1 text-white bg-blue-700 hover:bg-blue-800 rounded max-h-9"
          aria-current="page"
          onClick={() => onOpen("AddTransaction")}
        >
          <SquarePlus size={28} />
        </button>

        <div className="flex items-center">
          <ModeToggle />
          <Separator
            orientation="vertical"
            className="h-[36px] w-[2px] md:mx-4 mx-2 bg-neutral-300 dark:bg-neutral-700 "
          />
          {
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-[40px] w-[40px] border-2 border-neutral-800 ",
                },
              }}
            />
          }
        </div>
      </div>
    </nav>
  );
}
