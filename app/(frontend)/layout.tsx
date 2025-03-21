import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project Management System",
  description: "A comprehensive project management system",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <BusinessFunctionContextProvider>
            {children}
          </BusinessFunctionContextProvider>
        </Providers>
      </body>
    </html>
  );
}

import "./globals.css";
import { BusinessFunctionContextProvider } from "@/providers/bussiness-function";
import Providers from "@/providers";
