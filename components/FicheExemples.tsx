"use client";

import { useState } from "react";
import { Copy, Check, FileText } from "lucide-react";
import { Card } from "@/components/Card";
import type { FicheExemple } from "@/lib/fiche-content";

export default function FicheExemples({ exemples }: { exemples: FicheExemple[] }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function copy(i: number, corps: string) {
    try {
      await navigator.clipboard.writeText(corps);
      setCopiedIndex(i);
      setTimeout(() => setCopiedIndex((cur) => (cur === i ? null : cur)), 2000);
    } catch {
      // Presse-papiers indisponible (permissions navigateur) : pas de fallback silencieux
      // nécessaire, le texte reste sélectionnable/copiable manuellement.
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {exemples.map((ex, i) => (
        <Card key={i} accent="primary">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 font-heading text-sm font-bold text-navy-900">
              <FileText className="h-4 w-4 text-primary-600" />
              {ex.titre}
            </p>
            <button
              type="button"
              onClick={() => copy(i, ex.corps)}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-navy-900 transition hover:border-primary-500 hover:text-primary-600"
            >
              {copiedIndex === i ? (
                <>
                  <Check className="h-3.5 w-3.5 text-success" />
                  Copié
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copier
                </>
              )}
            </button>
          </div>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-navy-900">
            {ex.corps}
          </pre>
        </Card>
      ))}
    </div>
  );
}
