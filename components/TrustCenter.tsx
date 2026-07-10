import { ShieldCheck } from "lucide-react";
import { STATUTS_FICHE, type StatutFiche } from "@/lib/statut";
import { formatDate, cn } from "@/lib/utils";
import SignalementForm from "@/components/SignalementForm";

// Trust Center™ — Master Book Vol.6 Ch.2 : "Ne jamais demander à l'utilisateur de faire
// confiance aveuglément. Lui donner les moyens de vérifier."
export default function TrustCenter({
  ficheId,
  canAct,
  statut,
  createdAt,
  updatedAt,
}: {
  ficheId: number;
  canAct: boolean;
  statut: StatutFiche;
  createdAt: Date;
  updatedAt: Date;
}) {
  const { label, description, dot } = STATUTS_FICHE[statut];

  return (
    <div className="mt-8 rounded-lg border border-border bg-card p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        Trust Center™
      </p>
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 shrink-0 rounded-full", dot)} />
          <span className="text-sm font-medium text-navy-900">{label}</span>
          <span className="text-xs text-muted-foreground">— {description}</span>
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>Créée le {formatDate(createdAt)}</span>
          <span>Mise à jour le {formatDate(updatedAt)}</span>
        </div>
      </div>

      <SignalementForm ficheId={ficheId} canAct={canAct} />
    </div>
  );
}
