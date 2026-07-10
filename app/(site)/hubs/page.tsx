import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getHubIcon } from "@/lib/hub-icons";

export default async function HubsPage() {
  const hubs = await prisma.hub.findMany({
    orderBy: { ordre: "asc" },
    include: { _count: { select: { fiches: true } } },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-primary-600">Les fondations</p>
        <h1 className="mt-2 text-3xl font-semibold text-navy-900">Les 20 HUBS thématiques</h1>
        <p className="mt-3 text-muted-foreground">
          Chaque HUB regroupe les fiches pratiques d'un même thème du quotidien de l'IDEL.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hubs.map((hub, i) => {
          const Icon = getHubIcon(hub.icone);
          return (
            <Link
              key={hub.id}
              href={`/hubs/${hub.slug}`}
              className="rounded-lg border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary-500 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy-950 text-primary-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Hub {String(i + 1).padStart(2, "0")}</p>
                  <p className="font-medium text-navy-900">{hub.nom}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{hub.description}</p>
              <p className="mt-3 text-xs font-medium text-primary-600">{hub._count.fiches} fiche(s)</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
