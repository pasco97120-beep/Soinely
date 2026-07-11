"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Mic, MicOff } from "lucide-react";

// Champ de recherche icône gauche / micro droite — SOINELY Design System™ Vol. II,
// Chapitre 3. Input non contrôlé (ref) : la dictée écrit directement dans le champ,
// le formulaire GET parent (natif) gère la soumission comme avant.
export default function SearchField({
  name,
  defaultValue,
  placeholder,
  autoFocus,
}: {
  name: string;
  defaultValue?: string;
  placeholder: string;
  autoFocus?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const [listening, setListening] = useState(false);
  const [micSupported, setMicSupported] = useState(false);

  useEffect(() => {
    const SpeechRecognitionCtor = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    setMicSupported(Boolean(SpeechRecognitionCtor));
  }, []);

  function toggleDictation() {
    const SpeechRecognitionCtor = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results as any)
        .map((r: any) => r[0].transcript)
        .join(" ");
      if (inputRef.current) {
        inputRef.current.value = inputRef.current.value ? `${inputRef.current.value} ${transcript}` : transcript;
        inputRef.current.focus();
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  return (
    <>
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        ref={inputRef}
        name={name}
        defaultValue={defaultValue}
        placeholder={listening ? "Je vous écoute…" : placeholder}
        autoFocus={autoFocus}
        className="flex-1 bg-transparent text-sm outline-none"
      />
      {micSupported && (
        <button
          type="button"
          onClick={toggleDictation}
          title={listening ? "Arrêter la dictée" : "Dicter ma recherche au micro"}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${
            listening ? "animate-pulse bg-red-500 text-white" : "text-muted-foreground hover:text-primary-600"
          }`}
        >
          {listening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
        </button>
      )}
    </>
  );
}
