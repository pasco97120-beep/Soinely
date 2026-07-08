import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { normalizeSearch } from "@/lib/utils";
import { Search, Clock } from "lucide-react";

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const fiches = q
    ? await prisma.fiche.findMany({ include: { hub: true }, orderBy: { titre: "asc" } })
    : [];

  const needle = normalizeSearch(q);
  const results = fiches.filter(
    (f) =>
      normalizeSearch(f.titre).includes(needle) ||
      normalizeSearch(f.resume).includes(needle) ||
      normalizeSearch(f.tags).includes(needle) ||
      normalizeSearch(f.hub.nom).includes(needle)
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <form action="/recherche" method="GET" className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Rechercher une fiche, un thème..."
            className="flex-1 bg-transparent text-sm outline-none"
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-primary-500 px-5 py-3 text-sm font-medium text-white hover:bg-primary-600"
        >
          Rechercher
        </button>
      </form>

      <div className="mt-6">
        {!q && <p className="text-sm text-muted-foreground">Tapez un mot-clé pour lancer la recherche.</p>}

        {q && (
          <p className="mb-4 text-sm text-muted-foreground">
            {results.length} résultat(s) pour « {q} »
          </p>
        )}

        <div className="flex flex-col gap-3">
          {results.map((fiche) => (
            <Link
              key={fiche.id}
              href={`/hubs/${fiche.hub.slug}/${fiche.slug}`}
              className="rounded-xl border border-border bg-card p-5 transition hover:border-primary-500 hover:shadow-md"
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
    </div>
  );
}
