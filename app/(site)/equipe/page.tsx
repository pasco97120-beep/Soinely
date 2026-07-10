import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getIdelUser } from "@/lib/idel-session";
import CabinetFichesList from "@/components/CabinetFichesList";
import { Users2, KeyRound } from "lucide-react";

export default async function EquipePage() {
  const idelUser = await getIdelUser();
  if (!idelUser) redirect("/connexion");
  if (!idelUser.cabinetId) redirect("/cabinet");

  const [membres, partages] = await Promise.all([
    prisma.idelUser.findMany({ where: { cabinetId: idelUser.cabinetId }, orderBy: { prenom: "asc" } }),
    prisma.cabinetFiche.findMany({
      where: { cabinetId: idelUser.cabinetId },
      orderBy: { createdAt: "desc" },
      include: { fiche: { include: { hub: true } } },
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-primary-600">Mon Équipe</p>
      <h1 className="mt-2 text-3xl font-semibold text-navy-900">{idelUser.cabinet?.nom}</h1>

      {idelUser.cabinetRole === "proprietaire" && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm">
          <KeyRound className="h-4 w-4 text-primary-500" />
          Code d'invitation : <span className="font-mono font-semibold text-navy-900">{idelUser.cabinet?.codeInvitation}</span>
        </div>
      )}

      <div className="mt-8">
        <p className="mb-3 flex items-center gap-2 text-sm font-medium text-navy-900">
          <Users2 className="h-4 w-4" />
          Membres ({membres.length})
        </p>
        <div className="flex flex-wrap gap-2">
          {membres.map((m) => (
            <span key={m.id} className="rounded-full border border-border px-3 py-1.5 text-sm text-navy-900">
              {m.prenom} {m.nom}
              {m.cabinetRole === "proprietaire" && <span className="ml-1 text-xs text-primary-600">(propriétaire)</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <p className="mb-3 text-sm font-medium text-navy-900">Ressources partagées par l'équipe</p>
        <CabinetFichesList items={partages} />
      </div>
    </div>
  );
}
