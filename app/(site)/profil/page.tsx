import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getIdelUser } from "@/lib/idel-session";
import { isModeTournee } from "@/lib/mode-tournee";
import { formatDateTime } from "@/lib/utils";
import { Card, PageHeader } from "@/components/Card";
import FavorisList from "@/components/FavorisList";
import ModeTourneeToggle from "@/components/ModeTourneeToggle";
import ProfilPhoto from "@/components/ProfilPhoto";
import { Heart, SlidersHorizontal, History } from "lucide-react";

export default async function ProfilPage() {
  const idelUser = await getIdelUser();
  if (!idelUser) redirect("/connexion");

  const [favoris, historique] = await Promise.all([
    prisma.favori.findMany({
      where: { idelUserId: idelUser.id },
      orderBy: { createdAt: "desc" },
      include: { fiche: { include: { hub: true } } },
    }),
    prisma.consultation.findMany({
      where: { idelUserId: idelUser.id },
      orderBy: { consultedAt: "desc" },
      take: 10,
      include: { fiche: { include: { hub: true } } },
    }),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
      <PageHeader title="Profil" subtitle="Votre identité, vos préférences et vos favoris." />

      <div className="flex flex-col gap-6">
        <Card>
          <ProfilPhoto photoUrl={idelUser.photoUrl} prenom={idelUser.prenom} nom={idelUser.nom} />
          <p className="mt-3 text-sm text-muted-foreground">{idelUser.email}</p>
        </Card>

        <Card>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Préférences
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-navy-900">Mode Tournée™</p>
              <p className="text-xs text-muted-foreground">
                Affichage simplifié — gros boutons, moins de texte, une seule main.
              </p>
            </div>
            <ModeTourneeToggle active={isModeTournee()} />
          </div>
        </Card>

        <section>
          <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-navy-900">
            <Heart className="h-4 w-4 text-primary-600" />
            Mes favoris ({favoris.length})
          </p>
          <FavorisList favoris={favoris} />
        </section>

        <section>
          <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-navy-900">
            <History className="h-4 w-4 text-primary-600" />
            Historique
          </p>
          {historique.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune fiche consultée pour l'instant.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {historique.map(({ id, fiche, consultedAt }) => (
                <Link
                  key={id}
                  href={`/hubs/${fiche.hub.slug}/${fiche.slug}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 transition hover:border-primary-500"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-navy-900">{fiche.titre}</span>
                    <span className="block text-xs text-muted-foreground">{fiche.hub.nom}</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(consultedAt)}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
