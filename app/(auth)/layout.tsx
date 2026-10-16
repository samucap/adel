import { Suspense } from "react";

import { SeeDemoButton } from "@/components/auth/SeeDemoButton";
import { ParticleNetwork } from "@/components/ui/particle-network";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <ParticleNetwork />

      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both">
        <Suspense fallback={null}>
          <SeeDemoButton />
        </Suspense>
        {children}
      </div>
    </div>
  );
}
