"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function CabinetJoinCreate() {
  const router = useRouter();
  const [mode, setMode] = useState<"creer" | "rejoindre">("creer");
  const [nom, setNom] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch(mode === "creer" ? "/api/cabinet" : "/api/cabinet/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mode === "creer" ? { nom } : { code }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Une erreur est survenue.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm font-medium text-navy-900">Vous n'appartenez à aucun cabinet</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Créez votre cabinet pour partager des ressources avec votre équipe, ou rejoignez-en un existant.
      </p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setMode("creer")}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium",
            mode === "creer" ? "border-primary-500 bg-primary-50 text-primary-600" : "border-border text-muted-foreground"
          )}
        >
          Créer un cabinet
        </button>
        <button
          onClick={() => setMode("rejoindre")}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium",
            mode === "rejoindre" ? "border-primary-500 bg-primary-50 text-primary-600" : "border-border text-muted-foreground"
          )}
        >
          Rejoindre avec un code
        </button>
      </div>

      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        {mode === "creer" ? (
          <input
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Nom du cabinet"
            className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary-500"
            required
          />
        ) : (
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Code d'invitation"
            className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2 text-sm uppercase outline-none focus:border-primary-500"
            required
          />
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-60"
        >
          {loading ? "..." : mode === "creer" ? "Créer" : "Rejoindre"}
        </button>
      </form>

      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}
