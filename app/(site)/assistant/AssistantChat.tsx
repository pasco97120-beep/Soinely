"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Send, Link2 } from "lucide-react";

type Turn = {
  question: string;
  answer: string;
  sources: { titre: string; hub: string; href: string }[];
};

export default function AssistantChat() {
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const q = question.trim();
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setTurns((prev) => [...prev, { question: q, answer: data.answer, sources: data.sources ?? [] }]);
    } catch {
      setTurns((prev) => [
        ...prev,
        {
          question: q,
          answer: "Désolé, une erreur est survenue en contactant l'assistant. Réessayez dans un instant.",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4">
        {turns.map((turn, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="self-end rounded-2xl rounded-br-sm bg-navy-900 px-4 py-2.5 text-sm text-white">
              {turn.question}
            </div>
            <div className="self-start rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3 text-sm text-navy-900">
              <p className="whitespace-pre-line">{turn.answer}</p>
              {turn.sources.length > 0 && (
                <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Link2 className="h-3.5 w-3.5" />
                    Sources
                  </p>
                  {turn.sources.map((s) => (
                    <Link key={s.href} href={s.href} className="text-xs text-primary-600 hover:underline">
                      {s.hub} — {s.titre}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && <p className="text-sm text-muted-foreground">Recherche en cours…</p>}
      </div>

      <form onSubmit={onSubmit} className="sticky bottom-6 mt-6 flex items-center gap-2 rounded-full border border-border bg-card p-2 shadow-lg">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Exemple : que faire en cas d'hypoglycémie ?"
          className="flex-1 bg-transparent px-3 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
