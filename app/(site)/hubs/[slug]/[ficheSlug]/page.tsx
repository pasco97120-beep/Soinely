import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getHubIcon } from "@/lib/hub-icons";
import { getIdelUser } from "@/lib/idel-session";
import { parseFicheContenu } from "@/lib/fiche-content";
import { toNiveauPriorite } from "@/lib/priorite";
import { isModeTournee } from "@/lib/mode-tournee";
import { toStatutFiche } from "@/lib/statut";
import { cn } from "@/lib/utils";
import FicheActions from "@/components/FicheActions";
import ParcoursClinique from "@/components/ParcoursClinique";
import TrustCenter from "@/components/TrustCenter";
import { Card } from "@/components/Card";
import { PrioriteBadge } from "@/components/Badge";
import {
  ArrowLeft,
  Clock,
  ShieldAlert,
  Target,
  AlertTriangle,
  Stethoscope,
  Receipt,
  FileStack,
  Sparkles,
  ArrowRight,
} from "lucide-react";

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

  // Historique de consultation — alimente "Reprendre mon activité" (accueil) et
  // "Historique" (profil). Best-effort : une erreur ici ne doit jamais casser la page.
  if (idelUser) {
    try {
      await prisma.consultation.upsert({
        where: { idelUserId_ficheId: { idelUserId: idelUser.id, ficheId: fiche.id } },
        update: { consultedAt: new Date() },
        create: { idelUserId: idelUser.id, ficheId: fiche.id },
      });
    } catch {
      // silencieux : la consultation ne doit jamais empêcher l'affichage de la fiche.
    }
  }

  const Icon = getHubIcon(hub.icone);
  const tags = fiche.tags.split(",").map((t) => t.trim()).filter(Boolean);
  const parcours = parseFicheContenu(fiche.contenu);
  const priorite = toNiveauPriorite(fiche.priorite);
  const tournee = isModeTournee();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
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
      <h1 className="mt-2 font-heading text-3xl font-bold text-navy-900">{fiche.titre}</h1>
      <p className="mt-2 text-muted-foreground">{fiche.resume}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <PrioriteBadge niveau={priorite} />
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {fiche.dureeLecture} min de lecture
        </span>
        {tags.map((tag) => (
          <span key={tag} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-navy-900">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <p>
          Contenu d'exemple à but pédagogique, généré pour illustrer SOINELY. À valider par un
          professionnel de santé avant tout usage clinique réel.
        </p>
      </div>

      <ParcoursClinique
        defaultStep={tournee ? "realiser" : "comprendre"}
        tournee={tournee}
        content={{
          comprendre: (
            <div className="flex flex-col gap-4">
              <Card accent="primary">
                <p className="flex items-center gap-2 font-heading text-sm font-bold text-navy-900">
                  <Target className="h-4 w-4 text-primary-600" />
                  Objectif
                </p>
                <p className="mt-2 text-sm leading-relaxed text-navy-900">
                  {parcours.objectif || fiche.resume}
                </p>
              </Card>
              {/* Carte : icône, titre, sous-titre, action (implicite) — Design System™ Ch.8.
                  Les tags ne sont pas répétés ici : déjà visibles dans l'en-tête de la fiche. */}
              <Link href={`/hubs/${hub.slug}`} className="block">
                <Card className="flex items-center gap-3 transition hover:border-primary-500">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-950 text-primary-400">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Situé dans
                    </span>
                    <span className="block text-sm font-medium text-navy-900">{hub.nom}</span>
                  </span>
                </Card>
              </Link>
            </div>
          ),
          realiser: (
            <Card accent="primary">
              <p className={cn("flex items-center gap-2 font-heading font-bold text-navy-900", tournee ? "text-base" : "text-sm")}>
                <Stethoscope className="h-4 w-4 text-primary-600" />
                Procédure
              </p>
              {parcours.pointsCles.length > 0 ? (
                <ol className="mt-3 flex flex-col gap-3">
                  {parcours.pointsCles.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500/15 text-xs font-semibold text-primary-600">
                        {i + 1}
                      </span>
                      <span className={cn("leading-relaxed text-navy-900", tournee ? "text-base" : "text-sm")}>{item}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-navy-900">
                  {parcours.reste || "Aucune procédure détaillée pour cette fiche."}
                </p>
              )}
            </Card>
          ),
          securiser: (
            <div className="flex flex-col gap-4">
              <Card accent="action">
                <p className="flex items-center gap-2 font-heading text-sm font-bold text-navy-900">
                  <AlertTriangle className="h-4 w-4 text-priorite-action" />
                  Points de vigilance
                </p>
                {parcours.quandAlerter.length > 0 ? (
                  <ul className="mt-3 flex flex-col gap-2.5">
                    {parcours.quandAlerter.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-navy-900">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-priorite-action" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Aucun point de vigilance spécifique renseigné pour cette fiche.
                  </p>
                )}
              </Card>
              <Card accent="critique" className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-priorite-critique" />
                <p className="text-sm text-navy-900">
                  En cas de doute ou de signe de gravité, contactez le médecin traitant ou orientez
                  vers une prise en charge urgente sans délai.
                </p>
              </Card>
            </div>
          ),
          tracer: (
            <div className="flex flex-col gap-4">
              <Card>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Traçabilité et favoris
                </p>
                <div className="mt-3">
                  <FicheActions
                    ficheId={fiche.id}
                    canAct={canAct}
                    initialFavori={!!favori}
                    hasCabinet={!!cabinetId}
                    initialShared={!!shared}
                  />
                </div>
              </Card>

              <Card>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ressources</p>
                <div className="mt-3 flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Receipt className="h-4 w-4 shrink-0" />
                    <p className="text-sm">
                      <span className="font-medium text-navy-900">Cotation NGAP</span> — non renseignée
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <FileStack className="h-4 w-4 shrink-0" />
                    <p className="text-sm">
                      <span className="font-medium text-navy-900">Documents officiels</span> — aucun lié
                    </p>
                  </div>
                </div>
              </Card>

              <Link
                href={`/assistant?q=${encodeURIComponent(fiche.titre)}`}
                className="flex items-center justify-between rounded-lg border border-primary-200 bg-primary-50 p-4 transition hover:border-primary-500"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-primary-700">
                  <Sparkles className="h-4 w-4 text-gold-500" />
                  Demander au Copilote sur « {fiche.titre} »
                </span>
                <ArrowRight className="h-4 w-4 text-primary-600" />
              </Link>
            </div>
          ),
        }}
      />

      {/* Trust Center™ : information secondaire, masquée en Mode Tournée (SCR-001) */}
      {!tournee && (
        <TrustCenter
          ficheId={fiche.id}
          canAct={canAct}
          statut={toStatutFiche(fiche.statut)}
          createdAt={fiche.createdAt}
          updatedAt={fiche.updatedAt}
        />
      )}
    </div>
  );
}
