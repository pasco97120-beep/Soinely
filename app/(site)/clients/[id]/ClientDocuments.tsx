"use client";

import { useRef, useState } from "react";
import { Camera, FileText, CreditCard, ImagePlus, Loader2, Trash2, X } from "lucide-react";

type Document = {
  id: number;
  type: string;
  label: string | null;
  dataUrl: string;
  createdAt: string;
};

const TYPE_LABELS: Record<string, string> = {
  prescription: "Ordonnance",
  carte_vitale: "Carte Vitale",
  autre: "Autre document",
};

// Redimensionne et compresse la photo côté navigateur avant envoi : un cliché de
// téléphone récent pèse plusieurs Mo, largement au-dessus de la limite de la route API
// et inutile pour relire une ordonnance à l'écran.
function compressImage(file: File, maxWidth = 1400, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("lecture impossible"));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("image invalide"));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
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

export default function ClientDocuments({
  clientId,
  initialDocuments,
}: {
  clientId: number;
  initialDocuments: Document[];
}) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<Document | null>(null);
  const inputRefs = {
    prescription: useRef<HTMLInputElement>(null),
    carte_vitale: useRef<HTMLInputElement>(null),
    autre: useRef<HTMLInputElement>(null),
  };

  async function onFileSelected(type: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError("");
    setUploadingType(type);
    try {
      const dataUrl = await compressImage(file);
      const res = await fetch(`/api/clients/${clientId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, dataUrl }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Échec de l'envoi");
      }
      const { document } = await res.json();
      setDocuments((prev) => [document, ...prev]);
    } catch (err: any) {
      setError(err?.message || "La photo n'a pas pu être enregistrée, réessayez.");
    } finally {
      setUploadingType(null);
    }
  }

  async function onDelete(docId: number) {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    setPreview(null);
    await fetch(`/api/clients/${clientId}/documents/${docId}`, { method: "DELETE" });
  }

  const captureButtons = [
    { type: "prescription", label: "Photographier une ordonnance", icon: FileText },
    { type: "carte_vitale", label: "Photographier la carte Vitale", icon: CreditCard },
    { type: "autre", label: "Autre document", icon: ImagePlus },
  ] as const;

  return (
    <div className="mt-8">
      <p className="text-sm font-semibold text-navy-900">Ajouter un document</p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {captureButtons.map(({ type, label, icon: Icon }) => (
          <div key={type}>
            <input
              ref={inputRefs[type]}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => onFileSelected(type, e)}
            />
            <button
              type="button"
              onClick={() => inputRefs[type].current?.click()}
              disabled={uploadingType !== null}
              className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-primary-300 bg-primary-50 px-4 py-5 text-center transition hover:border-primary-500 disabled:opacity-60"
            >
              {uploadingType === type ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
              ) : (
                <Camera className="h-5 w-5 text-primary-600" />
              )}
              <span className="text-xs font-medium text-navy-900">{label}</span>
            </button>
          </div>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}

      <p className="mt-8 text-sm font-semibold text-navy-900">
        Documents ({documents.length})
      </p>
      {documents.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Aucun document pour l'instant. Photographiez une ordonnance ou une carte Vitale ci-dessus.
        </p>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {documents.map((doc) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => setPreview(doc)}
              className="group relative overflow-hidden rounded-lg border border-border bg-card text-left"
            >
              <img src={doc.dataUrl} alt={TYPE_LABELS[doc.type] ?? doc.type} className="aspect-[3/4] w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-navy-950/80 px-2 py-1.5">
                <p className="truncate text-[11px] font-medium text-white">{TYPE_LABELS[doc.type] ?? doc.type}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/90 p-6"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-h-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <img src={preview.dataUrl} alt={TYPE_LABELS[preview.type] ?? preview.type} className="max-h-[80vh] rounded-lg object-contain" />
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm font-medium text-white">{TYPE_LABELS[preview.type] ?? preview.type}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onDelete(preview.id)}
                  className="flex items-center gap-1.5 rounded-full bg-danger/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-danger"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Supprimer
                </button>
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
