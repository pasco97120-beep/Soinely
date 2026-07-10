import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getHubIcon } from "@/lib/hub-icons";
import { ArrowLeft, Clock } from "lucide-react";

export default async function MissionDetailPage({ params }: { params: { slug: string } }) {
  const mission = await prisma.mission.findUnique({
    where: { slug: params.slug },
    include: {
      fiches: {
        orderBy: { ordre: "asc" },
        include: { fiche: { include: { hub: true } } },
      },
    },
  });

  if (!mission) notFound();

  const Icon = getHubIcon(mission.icone);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/missions" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy-900">
        <ArrowLeft className="h-4 w-4" />
        Toutes les missions
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary-500/10 text-primary-600">
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-navy-900">{mission.titre}</h1>
          <p className="mt-1 text-muted-foreground">{mission.description}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {mission.fiches.map(({ fiche }) => (
          <Link
            key={fiche.id}
            href={`/hubs/${fiche.hub.slug}/${fiche.slug}`}
            className="rounded-lg border border-border bg-card p-5 transition hover:border-primary-500 hover:shadow-md"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-primary-600">{fiche.hub.nom}</p>
            <p className="mt-1 font-medium text-navy-900">{fiche.titre}</p>
            <p className="mt-1 text-sm text-muted-foreground">{fiche.resume}</p>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {fiche.dureeLecture} min de lecture
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
