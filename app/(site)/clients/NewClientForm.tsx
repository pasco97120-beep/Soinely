"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Plus } from "lucide-react";

export default function NewClientForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nom.trim() || !prenom.trim() || saving) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, prenom }),
      });
      if (!res.ok) throw new Error();
      const { client } = await res.json();
      router.push(`/clients/${client.id}`);
    } catch {
      setError("Impossible de créer le dossier, réessayez.");
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-600"
      >
        <Plus className="h-4 w-4" />
        Nouveau client
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-border bg-card p-5">
      <p className="flex items-center gap-1.5 text-sm font-medium text-navy-900">
        <UserPlus className="h-4 w-4 text-primary-600" />
        Nouveau dossier client
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          placeholder="Prénom"
          autoFocus
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary-500"
        />
        <input
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary-500"
        />
      </div>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-60"
        >
          {saving ? "Création…" : "Créer le dossier"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-navy-900 hover:border-primary-500"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
