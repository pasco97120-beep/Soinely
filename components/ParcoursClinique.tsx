"use client";

import { useState, type ReactNode } from "react";
import { BookOpen, ClipboardList, ShieldAlert, ClipboardCheck, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ParcoursStepKey = "comprendre" | "realiser" | "securiser" | "tracer";

const STEPS: { key: ParcoursStepKey; label: string; icon: LucideIcon }[] = [
  { key: "comprendre", label: "Comprendre", icon: BookOpen },
  { key: "realiser", label: "Réaliser", icon: ClipboardList },
  { key: "securiser", label: "Sécuriser", icon: ShieldAlert },
  { key: "tracer", label: "Tracer", icon: ClipboardCheck },
];

export default function ParcoursClinique({
  content,
  defaultStep = "comprendre",
  tournee = false,
}: {
  content: Record<ParcoursStepKey, ReactNode>;
  defaultStep?: ParcoursStepKey;
  tournee?: boolean;
}) {
  const [active, setActive] = useState<ParcoursStepKey>(defaultStep);

  return (
    <div className="mt-8">
      <div className="sticky top-16 z-10 -mx-6 border-b border-border bg-background/95 px-6 py-2 backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:px-2">
        <div className="flex gap-1 overflow-x-auto">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = active === step.key;
            return (
              <button
                key={step.key}
                type="button"
                onClick={() => setActive(step.key)}
                className={cn(
                  // Mode Tournée™ : cible tactile agrandie, une seule main (Design Book Loi n°6)
                  "flex shrink-0 items-center gap-2 rounded-lg font-medium transition",
                  tournee ? "px-4 py-3.5 text-base" : "px-3.5 py-2.5 text-sm",
                  isActive ? "bg-primary-500 text-white" : "text-muted-foreground hover:bg-muted"
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full font-semibold",
                    tournee ? "h-6 w-6 text-xs" : "h-5 w-5 text-[11px]",
                    isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  )}
                >
                  {i + 1}
                </span>
                <Icon className={tournee ? "h-5 w-5" : "h-4 w-4"} />
                {step.label}
              </button>
            );
          })}
        </div>
      </div>

      <div key={active} className="mt-5 animate-fade-in">
        {content[active]}
      </div>
    </div>
  );
}
