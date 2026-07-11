import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { normalizeSearch, cn } from "@/lib/utils";
import { toNiveauPriorite } from "@/lib/priorite";
import { getHubIcon } from "@/lib/hub-icons";
import { isModeTournee } from "@/lib/mode-tournee";
import { parseFicheContenu } from "@/lib/fiche-content";
import { PrioriteBadge } from "@/components/Badge";
import SearchField from "@/components/SearchField";
import { Clock, BookOpen, Sparkles, ChevronRight, AlertTriangle, Zap } from "lucide-react";

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
  const results = fiches
    .map((f) => {
      const haystack = normalizeSearch(`${f.titre} ${f.resume} ${f.tags} ${f.hub.nom}`);
      let score = 0;
      if (normalizeSearch(f.titre).includes(needle)) score += 3;
      if (normalizeSearch(f.tags).includes(needle)) score += 2;
      if (normalizeSearch(f.resume).includes(needle)) score += 1;
      if (normalizeSearch(f.hub.nom).includes(needle)) score += 1;
      return { fiche: f, score, match: haystack.includes(needle) };
    })
    .filter((r) => r.match)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.fiche);

  const [recommandee, ...autres] = results;
  const tournee = isModeTournee();
  const vigilance = tournee && recommandee ? parseFicheContenu(recommandee.contenu).quandAlerter : [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <p className="font-heading text-xs font-bold uppercase tracking-wider text-primary-600">
        Résultats Intelligents™
      </p>
      <h1 className="mt-1 font-heading text-2xl font-bold text-navy-900">Recherche</h1>

      <form action="/recherche" method="GET" className="mt-5 flex items-center gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 focus-within:ring-2 focus-within:ring-primary-500">
          <SearchField
            name="q"
            defaultValue={q}
            placeholder="Ex : perfusion douloureuse, hypoglycémie, AMI 4..."
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-primary-500 px-5 py-3 text-sm font-medium text-white hover:bg-primary-600"
        >
          Rechercher
        </button>
      </form>

      <div className="mt-8">
        {!q && (
          <p className="text-sm text-muted-foreground">
            Tapez une situation clinique, un mot-clé ou une question. SOINELY organise les
            résultats par pertinence, pas par simple correspondance de mots-clés.
          </p>
        )}

        {q && results.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Rien de précis dans le Référentiel pour « {q} ».
            </p>
            <Link
              href={`/assistant?q=${encodeURIComponent(q)}`}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline"
            >
              <Sparkles className="h-4 w-4" />
              Demander au Copilote
            </Link>
          </div>
        )}

        {recommandee && (() => {
          const HubIcon = getHubIcon(recommandee.hub.icone);
          return (
            <section className="flex flex-col gap-2">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                ✅ Réponse recommandée
              </p>
              {/* Carte : icône, titre, sous-titre, badge, action — Design System™ Ch.8.
                  En Mode Tournée™ : cible tactile agrandie, texte plus lisible (SCR-001/SCR-003). */}
              <Link
                href={`/hubs/${recommandee.hub.slug}/${recommandee.slug}`}
                className={cn(
                  "group flex items-start gap-4 rounded-lg border border-border bg-card shadow-sm transition hover:border-primary-500 hover:shadow-md",
                  tournee ? "p-7" : "p-6"
                )}
                style={{ borderLeftWidth: 4, borderLeftColor: "hsl(var(--ring))" }}
              >
                <span
                  className={cn(
                    "flex shrink-0 items-center justify-center rounded-lg bg-navy-950 text-primary-400",
                    tournee ? "h-14 w-14" : "h-11 w-11"
                  )}
                >
                  <HubIcon className={tournee ? "h-6 w-6" : "h-5 w-5"} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-primary-600">
                    {recommandee.hub.nom} · {recommandee.dureeLecture} min de lecture
                  </p>
                  <h2
                    className={cn(
                      "mt-1 font-heading font-bold text-navy-900 group-hover:text-primary-600",
                      tournee ? "text-2xl" : "text-lg"
                    )}
                  >
                    {recommandee.titre}
                  </h2>
                  {!tournee && <p className="mt-1.5 text-sm text-muted-foreground">{recommandee.resume}</p>}

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <PrioriteBadge niveau={toNiveauPriorite(recommandee.priorite)} />
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 font-medium text-primary-600",
                        tournee ? "rounded-lg bg-primary-50 px-4 py-2 text-base" : "text-sm"
                      )}
                    >
                      <BookOpen className="h-4 w-4" />
                      Procédure
                      <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>

              {tournee && vigilance.length > 0 && (
                <div className="rounded-lg border border-priorite-action/30 bg-priorite-action/10 p-4">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-priorite-action">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Points de vigilance
                  </p>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {vigilance.map((item, i) => (
                      <li key={i} className="text-sm text-navy-900">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          );
        })()}

        {tournee && autres.length > 0 && (
          <p className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Zap className="h-3.5 w-3.5" />
            Mode Tournée actif — {autres.length} autre(s) résultat(s) masqué(s). Désactivez-le pour tout voir.
          </p>
        )}

        {!tournee && autres.length > 0 && (
          <section className="mt-8 flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              📚 Autres résultats ({autres.length})
            </p>
            <div className="flex flex-col gap-3">
              {autres.map((fiche) => (
                <Link
                  key={fiche.id}
                  href={`/hubs/${fiche.hub.slug}/${fiche.slug}`}
                  className="rounded-lg border border-border bg-card p-4 transition hover:border-primary-500 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-primary-600">{fiche.hub.nom}</p>
                      <p className="mt-0.5 font-medium text-navy-900">{fiche.titre}</p>
                    </div>
                    <PrioriteBadge niveau={toNiveauPriorite(fiche.priorite)} className="shrink-0" />
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{fiche.resume}</p>
                  <p className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {fiche.dureeLecture} min de lecture
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {!tournee && q && results.length > 0 && (
          <Link
            href={`/assistant?q=${encodeURIComponent(q)}`}
            className="mt-8 flex items-center justify-between rounded-lg border border-primary-200 bg-primary-50 p-4 transition hover:border-primary-500"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-primary-700">
              <Sparkles className="h-4 w-4 text-gold-500" />
              Approfondir avec le Copilote Clinique
            </span>
            <ChevronRight className="h-4 w-4 text-primary-600" />
          </Link>
        )}
      </div>
    </div>
  );
}
