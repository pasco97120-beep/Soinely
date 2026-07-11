import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getHubIcon } from "@/lib/hub-icons";
import { toNiveauPriorite } from "@/lib/priorite";
import { PrioriteBadge, type NiveauPriorite } from "@/components/Badge";
import { Clock } from "lucide-react";

const RANG_PRIORITE: Record<NiveauPriorite, number> = {
  information: 0,
  vigilance: 1,
  action: 2,
  urgente: 3,
};

export default async function MissionsPage() {
  const missions = await prisma.mission.findMany({
    orderBy: { ordre: "asc" },
    include: {
      _count: { select: { fiches: true } },
      fiches: { include: { fiche: { select: { dureeLecture: true, priorite: true } } } },
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-primary-600">Les missions</p>
        <h1 className="mt-2 text-3xl font-semibold text-navy-900">Aujourd'hui, je vais…</h1>
        <p className="mt-3 text-muted-foreground">
          Choisissez votre mission du jour : SOINELY rassemble directement les fiches utiles.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {missions.map((mission) => {
          const Icon = getHubIcon(mission.icone);
          const dureeTotale = mission.fiches.reduce((sum, mf) => sum + mf.fiche.dureeLecture, 0);
          const prioriteMax = mission.fiches.reduce<NiveauPriorite>((max, mf) => {
            const niveau = toNiveauPriorite(mf.fiche.priorite);
            return RANG_PRIORITE[niveau] > RANG_PRIORITE[max] ? niveau : max;
          }, "information");
          return (
            <Link
              key={mission.id}
              href={`/missions/${mission.slug}`}
              className="rounded-lg border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary-500 hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <Icon className="h-6 w-6" />
                </div>
                {mission.fiches.length > 0 && <PrioriteBadge niveau={prioriteMax} />}
              </div>
              <p className="mt-4 font-medium text-navy-900">{mission.titre}</p>
              <p className="mt-1 text-sm text-muted-foreground">{mission.description}</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-primary-600">{mission._count.fiches} fiche(s)</p>
                {dureeTotale > 0 && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {dureeTotale} min
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
