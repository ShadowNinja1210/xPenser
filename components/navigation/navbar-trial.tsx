"use client";

import Image from "next/image";
import Logo from "@/public/Logo.svg";
import { SquarePlus } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <nav className="bg-white border-neutral-200 dark:bg-neutral-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image src={Logo} width={115} className="h-8" alt="xPenser Logo" />
        </a>

        <div className="flex gap-10 items-center">
          <button className="p-1 text-white bg-blue-700 rounded max-h-8" aria-current="page">
            <SquarePlus size={24} />
          </button>
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
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
