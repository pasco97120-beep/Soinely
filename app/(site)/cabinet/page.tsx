import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getIdelUser } from "@/lib/idel-session";
import FavorisList from "@/components/FavorisList";
import CabinetJoinCreate from "@/components/CabinetJoinCreate";
import { Building, ArrowRight } from "lucide-react";

export default async function CabinetPage() {
  const idelUser = await getIdelUser();
  if (!idelUser) redirect("/connexion");

  const favoris = await prisma.favori.findMany({
    where: { idelUserId: idelUser.id },
    orderBy: { createdAt: "desc" },
    include: { fiche: { include: { hub: true } } },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-primary-600">Mon Cabinet</p>
      <h1 className="mt-2 text-3xl font-semibold text-navy-900">
        Bonjour, {idelUser.prenom} 👋
      </h1>
      <p className="mt-2 text-muted-foreground">Votre espace personnel SOINELY.</p>

      <div className="mt-8">
        {idelUser.cabinet ? (
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-950 text-primary-400">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-navy-900">{idelUser.cabinet.nom}</p>
                <p className="text-sm text-muted-foreground">
                  {idelUser.cabinetRole === "proprietaire" ? "Propriétaire" : "Membre"}
                </p>
              </div>
            </div>
            <Link href="/equipe" className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline">
              Mon équipe
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <CabinetJoinCreate />
        )}
      </div>

      <div className="mt-10">
        <p className="mb-3 text-sm font-medium text-navy-900">Mes fiches favorites</p>
        <FavorisList favoris={favoris} />
      </div>
    </div>
  );
}
