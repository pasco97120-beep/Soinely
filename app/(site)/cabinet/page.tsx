import Link from "next/link";
import { redirect } from "next/navigation";
import { getIdelUser } from "@/lib/idel-session";
import CabinetJoinCreate from "@/components/CabinetJoinCreate";
import { Building, ArrowRight, UserCircle } from "lucide-react";

export default async function CabinetPage() {
  const idelUser = await getIdelUser();
  if (!idelUser) redirect("/connexion");

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-primary-600">Mon Cabinet</p>
      <h1 className="mt-2 font-heading text-3xl font-bold text-navy-900">
        Bonjour, {idelUser.prenom} 👋
      </h1>
      <p className="mt-2 text-muted-foreground">Créez ou rejoignez un cabinet pour partager des fiches avec votre équipe.</p>

      <div className="mt-8">
        {idelUser.cabinet ? (
          <div className="flex items-center justify-between rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-950 text-primary-400">
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

      <Link
        href="/profil"
        className="mt-4 flex items-center justify-between rounded-lg border border-border bg-card p-4 transition hover:border-primary-500"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-navy-900">
          <UserCircle className="h-4 w-4 text-primary-600" />
          Vos favoris et préférences se trouvent maintenant dans votre Profil
        </span>
        <ArrowRight className="h-4 w-4 text-primary-600" />
      </Link>
    </div>
  );
}
