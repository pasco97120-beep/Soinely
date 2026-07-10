"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Flag, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPES = [
  { value: "erreur", label: "Signaler une erreur" },
  { value: "amelioration", label: "Suggérer une amélioration" },
  { value: "lien_inactif", label: "Signaler un lien inactif" },
  { value: "autre", label: "Autre" },
] as const;

export default function SignalementForm({ ficheId, canAct }: { ficheId: number; canAct: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<(typeof TYPES)[number]["value"]>("erreur");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!canAct) return null;

  if (trackingId) {
    return (
      <p className="mt-3 flex items-center gap-1.5 text-sm text-priorite-info">
        <CheckCircle2 className="h-4 w-4" />
        Merci — signalement enregistré (n° SIG-{trackingId}).
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary-600"
      >
        <Flag className="h-3.5 w-3.5" />
        Signaler un problème sur cette fiche
      </button>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!message.trim() || loading) return;
    setLoading(true);
    setError(null);

    const res = await fetch("/api/signalements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ficheId, type, message }),
    });

    setLoading(false);
    if (!res.ok) {
      setError("Une erreur est survenue. Réessayez.");
      return;
    }
    const data = await res.json();
    setTrackingId(data.id);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3">
      <select
        value={type}
        onChange={(e) => setType(e.target.value as typeof type)}
        className="rounded-lg border border-border bg-transparent px-2.5 py-1.5 text-sm outline-none focus:border-primary-500"
      >
        {TYPES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Décrivez le problème ou votre suggestion..."
        rows={3}
        maxLength={2000}
        required
        className="resize-none rounded-lg border border-border bg-transparent px-2.5 py-1.5 text-sm outline-none focus:border-primary-500"
      />
      {error && <p className="text-xs text-danger">{error}</p>}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-600 disabled:opacity-60"
          )}
        >
          {loading ? "Envoi..." : "Envoyer"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs font-medium text-muted-foreground hover:text-navy-900"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
