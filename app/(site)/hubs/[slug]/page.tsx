import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getHubIcon } from "@/lib/hub-icons";
import { Clock, ArrowLeft } from "lucide-react";

export default async function HubDetailPage({ params }: { params: { slug: string } }) {
  const hub = await prisma.hub.findUnique({
    where: { slug: params.slug },
    include: { fiches: { orderBy: { titre: "asc" } } },
  });

  if (!hub) notFound();

  const Icon = getHubIcon(hub.icone);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/hubs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy-900">
        <ArrowLeft className="h-4 w-4" />
        Tous les HUBS
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-navy-950 text-primary-400">
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-navy-900">{hub.nom}</h1>
          <p className="mt-1 text-muted-foreground">{hub.description}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {hub.fiches.map((fiche) => (
          <Link
            key={fiche.id}
            href={`/hubs/${hub.slug}/${fiche.slug}`}
            className="rounded-xl border border-border bg-card p-5 transition hover:border-primary-500 hover:shadow-md"
          >
            <p className="font-medium text-navy-900">{fiche.titre}</p>
            <p className="mt-1 text-sm text-muted-foreground">{fiche.resume}</p>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {fiche.dureeLecture} min de lecture
            </p>
          </Link>
        ))}
        {hub.fiches.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucune fiche dans ce hub pour le moment.</p>
        )}
      </div>
    </div>
  );
}
