"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Clock } from "lucide-react";

type Favori = {
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

export default function FavorisList({ favoris }: { favoris: Favori[] }) {
  const router = useRouter();
  const [removing, setRemoving] = useState<number | null>(null);

  async function remove(ficheId: number) {
    setRemoving(ficheId);
    await fetch("/api/favoris", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ficheId }),
    });
    setRemoving(null);
    router.refresh();
  }

  if (favoris.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucune fiche enregistrée. Parcourez les{" "}
        <Link href="/hubs" className="text-primary-600 hover:underline">
          HUBS
        </Link>{" "}
        et ajoutez vos favoris.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {favoris.map(({ fiche }) => (
        <div key={fiche.id} className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card p-4">
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
            className="shrink-0 rounded-full p-2 text-primary-500 hover:bg-primary-50"
            aria-label="Retirer des favoris"
          >
            <Heart className="h-4 w-4 fill-primary-500" />
          </button>
        </div>
      ))}
    </div>
  );
}
