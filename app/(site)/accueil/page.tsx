import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getIdelUser } from "@/lib/idel-session";
import { getHubIcon } from "@/lib/hub-icons";
import { isModeTournee } from "@/lib/mode-tournee";
import { cn } from "@/lib/utils";
import SearchField from "@/components/SearchField";
import {
  Heart,
  Sparkles,
  Building,
  ArrowRight,
  Clock,
  Brain,
  BookOpen,
  LayoutGrid,
  History,
  Users,
} from "lucide-react";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}

export default async function AccueilPage() {
  const idelUser = await getIdelUser();
  if (!idelUser) redirect("/connexion");
  const tournee = isModeTournee();

  const [favoris, hubs, dailyTip, derniereConsultation, clientsCount] = await Promise.all([
    prisma.favori.findMany({
      where: { idelUserId: idelUser.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { fiche: { include: { hub: true } } },
    }),
    prisma.hub.findMany({ orderBy: { ordre: "asc" }, take: 6 }),
    prisma.dailyTip.findFirst({ orderBy: { ordre: "asc" }, include: { fiche: { include: { hub: true } } } }),
    prisma.consultation.findFirst({
      where: { idelUserId: idelUser.id },
      orderBy: { consultedAt: "desc" },
      include: { fiche: { include: { hub: true } } },
    }),
    prisma.client.count({ where: { idelUserId: idelUser.id } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      {/* Bandeau d'accueil */}
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary-600">Tableau de Bord</p>
          <h1 className="mt-1 font-heading text-2xl font-bold text-navy-900 sm:text-3xl">
            {greeting()}, {idelUser.prenom} 👋
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}
        </p>
      </div>

      {/* Recherche universelle */}
      <form action="/recherche" method="GET" className="mt-6">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3.5 shadow-sm transition focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/30">
          <SearchField name="q" placeholder="Rechercher un protocole, une situation clinique..." />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
          >
            Rechercher
          </button>
        </div>
      </form>

      {/* Reprendre mon activité — la "signature" de SOINELY (SCR-001, Vol.2 Ch.5 §4) */}
      {derniereConsultation && (
        <Link
          href={`/hubs/${derniereConsultation.fiche.hub.slug}/${derniereConsultation.fiche.slug}`}
          className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition hover:border-primary-500 hover:shadow-md"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-950 text-primary-400">
            <History className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Reprendre mon activité
            </span>
            <span className="block truncate text-sm font-medium text-navy-900">
              {derniereConsultation.fiche.hub.nom} — {derniereConsultation.fiche.titre}
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-primary-600" />
        </Link>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Colonne principale */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* HUB */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                <LayoutGrid className="h-4 w-4 text-primary-600" />
                Mes HUB
              </p>
              <Link href="/hubs" className="text-xs font-medium text-primary-600 hover:underline">
                Voir tous les HUB
              </Link>
            </div>
            {/* Mode Tournée™ : cartes plus grandes, 2 colonnes max (SCR-001) */}
            <div className={cn("grid grid-cols-2 gap-3", !tournee && "sm:grid-cols-3")}>
              {hubs.map((hub) => {
                const Icon = getHubIcon(hub.icone);
                return (
                  <Link
                    key={hub.id}
                    href={`/hubs/${hub.slug}`}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-lg border border-border bg-card transition hover:-translate-y-0.5 hover:border-primary-500 hover:shadow-md",
                      tournee ? "p-5" : "p-4"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center rounded-lg bg-navy-950 text-primary-400",
                        tournee ? "h-12 w-12" : "h-9 w-9"
                      )}
                    >
                      <Icon className={tournee ? "h-6 w-6" : "h-4 w-4"} />
                    </div>
                    <p className={cn("font-medium leading-tight text-navy-900", tournee ? "text-base" : "text-sm")}>
                      {hub.nom}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Favoris — action fréquente, priorisée en Mode Tournée (SCR-001) */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                <Heart className="h-4 w-4 text-primary-600" />
                Mes favoris
              </p>
              <Link href="/profil" className="text-xs font-medium text-primary-600 hover:underline">
                Voir tout
              </Link>
            </div>
            {favoris.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
                Aucune fiche enregistrée pour l'instant. Parcourez les{" "}
                <Link href="/hubs" className="text-primary-600 hover:underline">HUB</Link> et ajoutez vos favoris.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {favoris.map(({ fiche }) => (
                  <Link
                    key={fiche.id}
                    href={`/hubs/${fiche.hub.slug}/${fiche.slug}`}
                    className={cn(
                      "rounded-lg border border-border bg-card transition hover:border-primary-500 hover:shadow-md",
                      tournee ? "p-5" : "p-4"
                    )}
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-primary-600">{fiche.hub.nom}</p>
                    <p className={cn("mt-1 font-medium text-navy-900", tournee ? "text-base" : "text-sm")}>
                      {fiche.titre}
                    </p>
                    {!tournee && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {fiche.dureeLecture} min de lecture
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Colonne latérale */}
        <div className="flex flex-col gap-4">
          {/* Copilote */}
          <Link
            href="/assistant"
            className="rounded-lg border border-primary-200 bg-gradient-to-br from-primary-50 to-white p-5 transition hover:border-primary-500 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <p className="mt-3 font-heading font-bold text-navy-900">Copilote Clinique™</p>
            {!tournee && (
              <p className="mt-1 text-sm text-muted-foreground">
                Posez une question, obtenez une réponse sourcée depuis le Référentiel.
              </p>
            )}
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600">
              Demander au Copilote
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          {/* Mes clients — dossiers de la tournée (ordonnances, carte Vitale) */}
          <Link
            href="/clients"
            className="rounded-lg border border-border bg-card p-5 transition hover:border-primary-500 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-950 text-primary-400">
              <Users className="h-5 w-5" />
            </div>
            <p className="mt-3 font-heading font-bold text-navy-900">Mes clients</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {clientsCount > 0
                ? `${clientsCount} dossier${clientsCount > 1 ? "s" : ""} — ordonnances, carte Vitale`
                : "Créez un dossier et photographiez vos documents"}
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600">
              Accéder
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          {/* Mon Cabinet */}
          <Link
            href={idelUser.cabinet ? "/equipe" : "/cabinet"}
            className="rounded-lg border border-border bg-card p-5 transition hover:border-primary-500 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-950 text-primary-400">
              <Building className="h-5 w-5" />
            </div>
            <p className="mt-3 font-heading font-bold text-navy-900">
              {idelUser.cabinet ? idelUser.cabinet.nom : "Mon Cabinet"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {idelUser.cabinet
                ? idelUser.cabinetRole === "proprietaire" ? "Propriétaire — gérer l'équipe" : "Membre — voir l'équipe"
                : "Créer ou rejoindre un cabinet"}
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600">
              Accéder
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          {/* SOINELY Daily — information secondaire, masquée en Mode Tournée (SCR-001) */}
          {!tournee && dailyTip && (
            <Link
              href={dailyTip.fiche ? `/hubs/${dailyTip.fiche.hub.slug}/${dailyTip.fiche.slug}` : "/daily"}
              className="rounded-lg border border-border bg-card p-5 transition hover:border-primary-500 hover:shadow-md"
            >
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-600">
                {dailyTip.type === "le_saviez_vous" ? <Brain className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
                SOINELY Daily
              </p>
              <p className="mt-2 font-medium text-navy-900">{dailyTip.titre}</p>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{dailyTip.contenu}</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
