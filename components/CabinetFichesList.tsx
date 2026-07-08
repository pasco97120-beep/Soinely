"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Share2, Clock } from "lucide-react";

type CabinetFiche = {
  id: number;
  fiche: {
    id: number;
    titre: string;
    resume: string;
    slug: string;
    dureeLecture: number;
    hub: { nom: string; slug: string };
  };
};

export default function CabinetFichesList({ items }: { items: CabinetFiche[] }) {
  const router = useRouter();
  const [removing, setRemoving] = useState<number | null>(null);

  async function remove(ficheId: number) {
    setRemoving(ficheId);
    await fetch("/api/cabinet/fiches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ficheId }),
    });
    setRemoving(null);
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucune fiche partagée pour l'instant. Depuis une fiche, cliquez sur « Partager avec mon équipe ».
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map(({ fiche }) => (
        <div key={fiche.id} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4">
          <Link href={`/hubs/${fiche.hub.slug}/${fiche.slug}`} className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-primary-600">{fiche.hub.nom}</p>
            <p className="mt-1 font-medium text-navy-900">{fiche.titre}</p>
            <p className="mt-1 text-sm text-muted-foreground">{fiche.resume}</p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {fiche.dureeLecture} min de lecture
            </p>
          </Link>
          <button
            onClick={() => remove(fiche.id)}
            disabled={removing === fiche.id}
            className="shrink-0 rounded-full p-2 text-navy-900 hover:bg-muted"
            aria-label="Retirer du partage"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
