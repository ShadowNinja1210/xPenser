import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { dark } from "@clerk/themes";
import { cn } from "@/lib/utils";
import { MainLoader } from "@/components/loaders/main-loader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "xPenser",
  description: "Created by ShadowNinja",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={cn(inter.className, "bg-neutral-100 dark:bg-neutral-900 dark:text-gray-200")}>
          <ClerkLoading>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="xpenser-theme">
              <MainLoader />
            </ThemeProvider>
          </ClerkLoading>
          <ClerkLoaded>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="xpenser-theme">
              {children}
            </ThemeProvider>
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
