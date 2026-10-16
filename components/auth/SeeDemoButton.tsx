"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { useAuthStore } from "@/stores/authStore";
import { formatAuthError } from "@/lib/auth-service";
import { sanitizeRedirectPath } from "@/lib/safe-redirect";
import { Button } from "@/components/ui/button";

export function SeeDemoButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const enterDemo = useAuthStore((s) => s.enterDemo);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = sanitizeRedirectPath(searchParams.get("from"), "/");

  async function onClick() {
    setIsSubmitting(true);
    try {
      await enterDemo();
      toast.success("Welcome to the demo", {
        description: "You're browsing a view-only account.",
      });
      router.replace(redirectTo);
    } catch (err) {
      toast.error("Demo unavailable", { description: formatAuthError(err) });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mb-4 space-y-2">
      {isSubmitting ? (
        <div className="flex h-12 w-full items-center justify-center rounded-lg border border-border bg-card">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-12 w-full rounded-lg text-base"
          onClick={onClick}
        >
          See that Demo
        </Button>
      )}
      <p className="text-center text-sm text-muted-foreground">
        View-only account
      </p>
    </div>
  );
}
