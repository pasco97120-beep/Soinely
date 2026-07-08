"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { Badge, prioriteTone, statutTone } from "@/components/Badge";
import { formatDateTime, cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

type Alerte = {
  id: number;
  typeAlerte: string;
  message: string;
  priorite: string;
  statut: string;
  dateAlerte: string;
  admission: {
    patient: { prenom: string; nom: string };
    lit: { numeroLit: string; chambre: { numero: string } } | null;
  } | null;
  infirmier: { prenom: string; nom: string } | null;
};

export default function AlertList({ alertes }: { alertes: Alerte[] }) {
  return (
    <div className="flex flex-col gap-3">
      {alertes.map((a) => (
        <AlertRow key={a.id} alerte={a} />
      ))}
      {alertes.length === 0 && <p className="text-sm text-muted-foreground">Aucune alerte.</p>}
    </div>
  );
}

function AlertRow({ alerte }: { alerte: Alerte }) {
  const router = useRouter();
  const [statut, setStatut] = useState(alerte.statut);
  const [saving, setSaving] = useState(false);

  async function setStatutValue(next: string) {
    setSaving(true);
    setStatut(next);
    await fetch(`/api/alertes/${alerte.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: next }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <Card className={cn(statut === "non_lue" && "border-l-4 border-l-danger")}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={prioriteTone(alerte.priorite)}>{alerte.priorite}</Badge>
              <Badge tone={statutTone(statut)}>{statut.replace("_", " ")}</Badge>
              <span className="text-xs text-muted-foreground capitalize">
                {alerte.typeAlerte.replace(/_/g, " ")}
              </span>
            </div>
            <p className="mt-1 text-sm">{alerte.message}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {alerte.admission && (
                <>
                  {alerte.admission.patient.prenom} {alerte.admission.patient.nom}
                  {alerte.admission.lit &&
                    ` · Ch. ${alerte.admission.lit.chambre.numero}-${alerte.admission.lit.numeroLit}`}
                  {" · "}
                </>
              )}
              {formatDateTime(alerte.dateAlerte)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          {statut !== "lue" && statut !== "traitee" && (
            <button
              disabled={saving}
              onClick={() => setStatutValue("lue")}
              className="rounded-lg border border-border px-3 py-1.5 text-xs hover:border-primary-500"
            >
              Marquer lue
            </button>
          )}
          {statut !== "traitee" && (
            <button
              disabled={saving}
              onClick={() => setStatutValue("traitee")}
              className="rounded-lg bg-primary-500 px-3 py-1.5 text-xs text-white hover:bg-primary-600"
            >
              Traiter
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
