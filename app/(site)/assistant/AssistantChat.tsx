"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import Link from "next/link";
import { Send, Link2, Mic, MicOff } from "lucide-react";

// Dictée vocale via l'API Web Speech du navigateur (aucune donnée envoyée à un
// service tiers : la reconnaissance tourne côté navigateur). Support limité à
// Chrome/Edge (webkitSpeechRecognition) ; le bouton reste masqué ailleurs.
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type Turn = {
  question: string;
  answer: string;
  sources: { titre: string; hub: string; href: string }[];
};

export default function AssistantChat({ initialQuestion }: { initialQuestion?: string }) {
  const [question, setQuestion] = useState(initialQuestion ?? "");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    setMicSupported(Boolean(SpeechRecognitionCtor));
  }, []);

  function toggleDictation() {
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition: SpeechRecognitionLike = new SpeechRecognitionCtor();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results as any)
        .map((r: any) => r[0].transcript)
        .join(" ");
      setQuestion((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

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
            <div className="self-end rounded-lg rounded-br-sm bg-navy-900 px-4 py-2.5 text-sm text-white">
              {turn.question}
            </div>
            <div className="self-start rounded-lg rounded-bl-sm border border-border bg-card px-4 py-3 text-sm text-navy-900">
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
          placeholder={listening ? "Je vous écoute…" : "Exemple : que faire en cas d'hypoglycémie ?"}
          className="flex-1 bg-transparent px-3 text-sm outline-none"
        />
        {micSupported && (
          <button
            type="button"
            onClick={toggleDictation}
            title={listening ? "Arrêter la dictée" : "Dicter ma question au micro"}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
              listening
                ? "animate-pulse border-red-500 bg-red-500 text-white"
                : "border-border text-muted-foreground hover:border-primary-500 hover:text-primary-600"
            }`}
          >
            {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
        )}
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
