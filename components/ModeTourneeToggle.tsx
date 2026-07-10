"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ModeTourneeToggle({ active }: { active: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState(active);

  async function toggle() {
    const next = !optimistic;
    setOptimistic(next);
    await fetch("/api/mode-tournee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: next }),
    });
    startTransition(() => router.refresh());
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={optimistic}
      title="Mode Tournée™ — affichage simplifié pour le terrain"
      className={cn(
        "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition disabled:opacity-60",
        optimistic
          ? "border-gold-500 bg-gold-50 text-gold-700"
          : "border-border text-muted-foreground hover:border-primary-500"
      )}
    >
      <Zap className={cn("h-3.5 w-3.5", optimistic && "fill-gold-500")} />
      Mode Tournée
    </button>
  );
}
