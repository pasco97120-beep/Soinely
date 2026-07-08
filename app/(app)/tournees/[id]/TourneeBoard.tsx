"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { Badge, statutTone } from "@/components/Badge";
import { ChevronDown, Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type Soin = {
  id: number;
  typeSoin: string;
  categorie: string;
  realise: boolean;
  observations: string | null;
  infirmier: { prenom: string; nom: string };
};

type TourneePatient = {
  id: number;
  ordreVisite: number | null;
  statutVisite: string;
  admission: {
    patient: { id: number; prenom: string; nom: string; allergies: string | null };
    lit: { numeroLit: string; chambre: { numero: string } } | null;
    motifAdmission: string;
  };
  soins: Soin[];
};

export default function TourneeBoard({
  tournee,
}: {
  tournee: { id: number; patients: TourneePatient[] };
}) {
  const [openId, setOpenId] = useState<number | null>(tournee.patients[0]?.id ?? null);

  return (
    <div className="flex flex-col gap-4">
      {tournee.patients.map((tp) => (
        <PatientVisitCard
          key={tp.id}
          tp={tp}
          open={openId === tp.id}
          onToggleOpen={() => setOpenId(openId === tp.id ? null : tp.id)}
        />
      ))}
    </div>
  );
}

function PatientVisitCard({
  tp,
  open,
  onToggleOpen,
}: {
  tp: TourneePatient;
  open: boolean;
  onToggleOpen: () => void;
}) {
  const router = useRouter();
  const [statut, setStatut] = useState(tp.statutVisite);
  const [saving, setSaving] = useState(false);

  async function updateStatut(next: string) {
    setSaving(true);
    setStatut(next);
    await fetch(`/api/tournee-patients/${tp.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statutVisite: next }),
    });
    setSaving(false);
    router.refresh();
  }

  const doneCount = tp.soins.filter((s) => s.realise).length;

  return (
    <Card>
      <button className="flex w-full items-center justify-between text-left" onClick={onToggleOpen}>
        <div>
          <p className="font-medium">
            {tp.admission.patient.prenom} {tp.admission.patient.nom}
          </p>
          <p className="text-sm text-muted-foreground">
            Chambre {tp.admission.lit?.chambre.numero ?? "?"}-{tp.admission.lit?.numeroLit ?? "?"} ·{" "}
            {tp.admission.motifAdmission} · {doneCount}/{tp.soins.length} soins réalisés
          </p>
          {tp.admission.patient.allergies && (
            <p className="mt-1 text-xs font-medium text-danger">⚠ Allergies : {tp.admission.patient.allergies}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={statutTone(statut)}>{statut.replace("_", " ")}</Badge>
          <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
        </div>
      </button>

      {open && (
        <div className="mt-4 border-t border-border pt-4">
          <div className="mb-4 flex flex-wrap gap-2">
            {["en_attente", "visite", "reporte", "absent"].map((s) => (
              <button
                key={s}
                disabled={saving}
                onClick={() => updateStatut(s)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs capitalize",
                  statut === s
                    ? "border-primary-500 bg-primary-500/10 text-primary-600"
                    : "border-border text-muted-foreground hover:border-primary-500"
                )}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>

          <ul className="flex flex-col gap-2">
            {tp.soins.map((soin) => (
              <SoinRow key={soin.id} soin={soin} />
            ))}
            {tp.soins.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucun soin planifié pour cette visite.</p>
            )}
          </ul>
        </div>
      )}
    </Card>
  );
}

function SoinRow({ soin }: { soin: Soin }) {
  const router = useRouter();
  const [realise, setRealise] = useState(soin.realise);
  const [saving, setSaving] = useState(false);

  async function toggle() {
    setSaving(true);
    const next = !realise;
    setRealise(next);
    await fetch(`/api/soins/${soin.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ realise: next }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <li className="flex items-start gap-3 rounded-lg border border-border p-3">
      <button onClick={toggle} disabled={saving} className="mt-0.5 shrink-0">
        {realise ? (
          <Check className="h-4 w-4 rounded-full bg-success text-white" />
        ) : (
          <Circle className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      <div className="flex-1">
        <p className={cn("text-sm", realise && "text-muted-foreground line-through")}>{soin.typeSoin}</p>
        <p className="text-xs text-muted-foreground capitalize">{soin.categorie.replace("_", " ")}</p>
        {soin.observations && <p className="mt-1 text-xs text-muted-foreground">{soin.observations}</p>}
      </div>
    </li>
  );
}
