import React from "react"
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Ubuntu as V0_Font_Ubuntu } from 'next/font/google'
import { AuthProvider } from "@/components/auth/AuthProvider"
import { Providers } from "@/components/providers"
import { NavigationProgress } from "@/components/ui/navigation-progress"
import { Toaster } from "sonner"

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
        <Providers>
          <AuthProvider>
            <NavigationProgress />
            {children}
          </AuthProvider>
        </Providers>
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#132925",
              border: "1px solid #243F39",
              color: "#E8EDEB",
            },
          }}
        />
      </body>
    </html>
  );
}