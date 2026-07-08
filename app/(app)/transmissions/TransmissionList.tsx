"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { Badge, prioriteTone } from "@/components/Badge";
import { formatDateTime } from "@/lib/utils";
import { Plus } from "lucide-react";

type Transmission = {
  id: number;
  contenu: string;
  priorite: string;
  quart: string;
  dateTransmission: string;
  admission: { patient: { prenom: string; nom: string } };
  infirmier: { prenom: string; nom: string };
};

export default function TransmissionList({
  transmissions,
  admissions,
}: {
  transmissions: Transmission[];
  admissions: { id: number; label: string }[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [admissionId, setAdmissionId] = useState(admissions[0]?.id ?? "");
  const [contenu, setContenu] = useState("");
  const [priorite, setPriorite] = useState("normale");
  const [quart, setQuart] = useState("matin");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!contenu.trim() || !admissionId) return;
    setSubmitting(true);
    await fetch("/api/transmissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admissionId, contenu, priorite, quart }),
    });
    setSubmitting(false);
    setContenu("");
    setShowForm(false);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-lg bg-primary-500 px-3 py-2 text-sm text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          Nouvelle transmission
        </button>
      </div>

      {showForm && (
        <Card className="mb-4">
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <select
                className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
                value={admissionId}
                onChange={(e) => setAdmissionId(Number(e.target.value))}
              >
                {admissions.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
              <select
                className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
                value={quart}
                onChange={(e) => setQuart(e.target.value)}
              >
                <option value="matin">Matin</option>
                <option value="apres_midi">Après-midi</option>
                <option value="nuit">Nuit</option>
              </select>
              <select
                className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
                value={priorite}
                onChange={(e) => setPriorite(e.target.value)}
              >
                <option value="normale">Normale</option>
                <option value="importante">Importante</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
            <textarea
              className="min-h-24 rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
              placeholder="Contenu de la transmission..."
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="self-start rounded-lg bg-primary-500 px-4 py-2 text-sm text-white hover:bg-primary-600 disabled:opacity-60"
            >
              {submitting ? "Envoi..." : "Envoyer"}
            </button>
          </form>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {transmissions.map((t) => (
          <Card key={t.id}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={prioriteTone(t.priorite)}>{t.priorite}</Badge>
              <span className="text-sm font-medium">
                {t.admission.patient.prenom} {t.admission.patient.nom}
              </span>
              <span className="text-xs text-muted-foreground">
                · {t.infirmier.prenom} {t.infirmier.nom} · {t.quart.replace("_", "-")} ·{" "}
                {formatDateTime(t.dateTransmission)}
              </span>
            </div>
            <p className="mt-2 text-sm">{t.contenu}</p>
          </Card>
        ))}
        {transmissions.length === 0 && <p className="text-sm text-muted-foreground">Aucune transmission.</p>}
      </div>
    </div>
  );
}
