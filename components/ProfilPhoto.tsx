"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { Avatar } from "@/components/Avatar";

function compressImage(file: File, maxSize = 400, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("lecture impossible"));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("image invalide"));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("canvas indisponible"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProfilPhoto({
  photoUrl,
  prenom,
  nom,
}: {
  photoUrl: string | null;
  prenom: string;
  nom: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [current, setCurrent] = useState(photoUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError("");
    setLoading(true);
    try {
      const dataUrl = await compressImage(file);
      const res = await fetch("/api/profil/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      });
      if (!res.ok) throw new Error();
      setCurrent(dataUrl);
      router.refresh();
    } catch {
      setError("La photo n'a pas pu être enregistrée, réessayez.");
    } finally {
      setLoading(false);
    }
  }

  async function onRemove() {
    setLoading(true);
    setError("");
    try {
      await fetch("/api/profil/photo", { method: "DELETE" });
      setCurrent(null);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileSelected} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="relative shrink-0 disabled:opacity-60"
        title="Changer la photo de profil"
      >
        <Avatar photoUrl={current} prenom={prenom} nom={nom} size="lg" />
        <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-white shadow-md">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
        </span>
      </button>
      <div>
        <p className="font-heading font-bold text-navy-900">
          {prenom} {nom}
        </p>
        <div className="mt-1 flex items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="text-xs font-medium text-primary-600 hover:underline disabled:opacity-60"
          >
            Changer la photo
          </button>
          {current && (
            <button
              type="button"
              onClick={onRemove}
              disabled={loading}
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-danger disabled:opacity-60"
            >
              <Trash2 className="h-3 w-3" />
              Retirer
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>
    </div>
  );
}
