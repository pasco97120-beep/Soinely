"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HeartPulse } from "lucide-react";

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("idel-credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    router.push("/accueil");
    router.refresh();
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/30 px-4 py-16">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500">
            <HeartPulse className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-navy-900">SOINELY</h1>
          <p className="text-sm text-muted-foreground">Connexion IDEL</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm text-navy-900">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sophie.durand@idel.fr"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-navy-900">Mot de passe</label>
            <input
              type="password"
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-primary-500 px-3 py-2 font-medium text-white transition hover:bg-primary-600 disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="font-medium text-primary-600 hover:underline">
            S'inscrire
          </Link>
        </p>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Démo — email <span className="text-navy-900">sophie.durand@idel.fr</span>, mot de passe{" "}
          <span className="text-navy-900">soinely2026</span>
        </p>
      </div>
    </div>
  );
}
