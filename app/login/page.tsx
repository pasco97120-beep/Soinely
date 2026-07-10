"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HeartPulse } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Identifiant ou mot de passe incorrect.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-sm rounded-lg border border-white/10 bg-navy-900 p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500">
            <HeartPulse className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-white">SOINELY</h1>
          <p className="text-sm text-navy-300">Assistant infirmier — connexion</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm text-navy-200">Identifiant</label>
            <input
              className="w-full rounded-lg border border-white/10 bg-navy-800 px-3 py-2 text-white outline-none focus:border-primary-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="stremblay"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-navy-200">Mot de passe</label>
            <input
              type="password"
              className="w-full rounded-lg border border-white/10 bg-navy-800 px-3 py-2 text-white outline-none focus:border-primary-500"
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

        <p className="mt-6 text-center text-xs text-navy-400">
          Démo — identifiant <span className="text-navy-200">stremblay</span>, mot de passe{" "}
          <span className="text-navy-200">soinely2026</span>
        </p>
      </div>
    </div>
  );
}
