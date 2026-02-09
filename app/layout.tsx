import React from "react"
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Ubuntu as V0_Font_Ubuntu } from 'next/font/google'

// Initialize fonts
const _ubuntu = V0_Font_Ubuntu({ subsets: ['latin'], weight: ["300", "400", "500", "700"] })

const fontSans = JetBrains_Mono({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Notable Dough",
  description: "Notable Dough",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontSans.variable} dark`} suppressHydrationWarning>
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
