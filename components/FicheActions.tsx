"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FicheActions({
  ficheId,
  canAct,
  initialFavori,
  hasCabinet,
  initialShared,
}: {
  ficheId: number;
  canAct: boolean;
  initialFavori: boolean;
  hasCabinet: boolean;
  initialShared: boolean;
}) {
  const router = useRouter();
  const [favori, setFavori] = useState(initialFavori);
  const [shared, setShared] = useState(initialShared);
  const [saving, setSaving] = useState(false);

  async function toggleFavori() {
    if (!canAct) return router.push("/connexion");
    setSaving(true);
    const res = await fetch("/api/favoris", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ficheId }),
    });
    const data = await res.json();
    setFavori(data.favori);
    setSaving(false);
    router.refresh();
  }

  async function toggleShared() {
    if (!canAct || !hasCabinet) return;
    setSaving(true);
    const res = await fetch("/api/cabinet/fiches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ficheId }),
    });
    const data = await res.json();
    setShared(data.shared);
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={toggleFavori}
        disabled={saving}
        className={cn(
          "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
          favori
            ? "border-primary-500 bg-primary-50 text-primary-600"
            : "border-border text-muted-foreground hover:border-primary-500"
        )}
      >
        <Heart className={cn("h-4 w-4", favori && "fill-primary-500 text-primary-500")} />
        {favori ? "Dans mon cabinet" : "Ajouter à mon cabinet"}
      </button>

      {canAct && hasCabinet && (
        <button
          onClick={toggleShared}
          disabled={saving}
          className={cn(
            "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
            shared
              ? "border-navy-900 bg-navy-900 text-white"
              : "border-border text-muted-foreground hover:border-navy-900"
          )}
        >
          <Users2 className="h-4 w-4" />
          {shared ? "Partagée avec mon équipe" : "Partager avec mon équipe"}
        </button>
      )}
    </div>
  );
}
