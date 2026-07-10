"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InscriptionPage() {
  const router = useRouter();
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cabinetMode, setCabinetMode] = useState<"aucun" | "creer" | "rejoindre">("aucun");
  const [cabinetNom, setCabinetNom] = useState("");
  const [codeInvitation, setCodeInvitation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/idel/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prenom, nom, email, password, cabinetMode, cabinetNom, codeInvitation }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Une erreur est survenue.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("idel-credentials", { email, password, redirect: false });
    setLoading(false);
    if (signInRes?.error) {
      router.push("/connexion");
      return;
    }
    router.push("/accueil");
    router.refresh();
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/30 px-4 py-16">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500">
            <HeartPulse className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-navy-900">Rejoindre SOINELY</h1>
          <p className="text-sm text-muted-foreground">Créez votre compte IDEL</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm text-navy-900">Prénom</label>
              <input
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary-500"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-navy-900">Nom</label>
              <input
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary-500"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-navy-900">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-navy-900">Mot de passe</label>
            <input
              type="password"
              minLength={8}
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="mt-1 text-xs text-muted-foreground">8 caractères minimum</p>
          </div>

          <div>
            <label className="mb-2 block text-sm text-navy-900">Cabinet</label>
            <div className="flex flex-col gap-2">
              {(
                [
                  { value: "aucun", label: "Je suis seul(e), pas de cabinet pour l'instant" },
                  { value: "creer", label: "Créer un cabinet (Mon Équipe)" },
                  { value: "rejoindre", label: "Rejoindre un cabinet existant avec un code" },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                    cabinetMode === opt.value ? "border-primary-500 bg-primary-50" : "border-border"
                  )}
                >
                  <input
                    type="radio"
                    name="cabinetMode"
                    checked={cabinetMode === opt.value}
                    onChange={() => setCabinetMode(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {cabinetMode === "creer" && (
            <div>
              <label className="mb-1 block text-sm text-navy-900">Nom du cabinet</label>
              <input
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary-500"
                value={cabinetNom}
                onChange={(e) => setCabinetNom(e.target.value)}
                placeholder="Cabinet Durand & Associés"
                required
              />
            </div>
          )}

          {cabinetMode === "rejoindre" && (
            <div>
              <label className="mb-1 block text-sm text-navy-900">Code d'invitation</label>
              <input
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm uppercase outline-none focus:border-primary-500"
                value={codeInvitation}
                onChange={(e) => setCodeInvitation(e.target.value)}
                placeholder="IDEL-DEMO"
                required
              />
            </div>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-primary-500 px-3 py-2 font-medium text-white transition hover:bg-primary-600 disabled:opacity-60"
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link href="/connexion" className="font-medium text-primary-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
