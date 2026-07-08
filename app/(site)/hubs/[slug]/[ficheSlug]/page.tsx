import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getHubIcon } from "@/lib/hub-icons";
import { getIdelUser } from "@/lib/idel-session";
import FicheActions from "@/components/FicheActions";
import { ArrowLeft, Clock, ShieldAlert } from "lucide-react";

export default async function FicheDetailPage({
  params,
}: {
  params: { slug: string; ficheSlug: string };
}) {
  const hub = await prisma.hub.findUnique({ where: { slug: params.slug } });
  if (!hub) notFound();

  const fiche = await prisma.fiche.findUnique({
    where: { hubId_slug: { hubId: hub.id, slug: params.ficheSlug } },
  });
  if (!fiche) notFound();

  const idelUser = await getIdelUser();
  const canAct = !!idelUser;
  const cabinetId = idelUser?.cabinetId ?? undefined;

  const [favori, shared] = await Promise.all([
    idelUser
      ? prisma.favori.findUnique({ where: { idelUserId_ficheId: { idelUserId: idelUser.id, ficheId: fiche.id } } })
      : null,
    cabinetId
      ? prisma.cabinetFiche.findUnique({ where: { cabinetId_ficheId: { cabinetId, ficheId: fiche.id } } })
      : null,
  ]);

  const Icon = getHubIcon(hub.icone);
  const tags = fiche.tags.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href={`/hubs/${hub.slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy-900"
      >
        <ArrowLeft className="h-4 w-4" />
        {hub.nom}
      </Link>

      <div className="mt-4 flex items-center gap-2 text-sm text-primary-600">
        <Icon className="h-4 w-4" />
        {hub.nom}
      </div>
      <h1 className="mt-2 text-3xl font-semibold text-navy-900">{fiche.titre}</h1>
      <p className="mt-2 text-muted-foreground">{fiche.resume}</p>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {fiche.dureeLecture} min de lecture
        </span>
        {tags.map((tag) => (
          <span key={tag} className="rounded-full border border-border px-2.5 py-0.5">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-navy-900">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <p>
          Contenu d'exemple à but pédagogique, généré pour illustrer SOINELY. À valider par un
          professionnel de santé avant tout usage clinique réel.
        </p>
      </div>

      <div className="mt-6">
        <FicheActions
          ficheId={fiche.id}
          canAct={canAct}
          initialFavori={!!favori}
          hasCabinet={!!cabinetId}
          initialShared={!!shared}
        />
      </div>

      <div className="mt-8 whitespace-pre-line leading-relaxed text-navy-900">{fiche.contenu}</div>
    </div>
  );
}
