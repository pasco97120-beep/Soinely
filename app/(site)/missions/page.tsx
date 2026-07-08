import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getHubIcon } from "@/lib/hub-icons";

export default async function MissionsPage() {
  const missions = await prisma.mission.findMany({
    orderBy: { ordre: "asc" },
    include: { _count: { select: { fiches: true } } },
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
          return (
            <Link
              key={mission.id}
              href={`/missions/${mission.slug}`}
              className="rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary-500 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Icon className="h-6 w-6" />
              </div>
              <p className="mt-4 font-medium text-navy-900">{mission.titre}</p>
              <p className="mt-1 text-sm text-muted-foreground">{mission.description}</p>
              <p className="mt-3 text-xs font-medium text-primary-600">{mission._count.fiches} fiche(s)</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
