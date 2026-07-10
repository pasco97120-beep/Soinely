import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getIdelUser } from "@/lib/idel-session";
import NewClientForm from "./NewClientForm";
import { Users, FileText, ChevronRight } from "lucide-react";

export default async function ClientsPage() {
  const idelUser = await getIdelUser();
  if (!idelUser) redirect("/connexion");

  const clients = await prisma.client.findMany({
    where: { idelUserId: idelUser.id },
    orderBy: { nom: "asc" },
    include: { _count: { select: { documents: true } } },
  });

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="flex items-center gap-1.5 text-sm font-medium uppercase tracking-wide text-primary-600">
        <Users className="h-4 w-4" />
        Mes clients
      </p>
      <h1 className="mt-2 font-heading text-3xl font-bold text-navy-900">Dossiers de la tournée</h1>
      <p className="mt-2 text-muted-foreground">
        Créez un dossier par patient et photographiez ses ordonnances et sa carte Vitale directement
        depuis votre téléphone.
      </p>

      <div className="mt-8">
        <NewClientForm />
      </div>

      <div className="mt-8 flex flex-col gap-2">
        {clients.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Aucun client pour l'instant. Ajoutez votre premier dossier ci-dessus.
          </div>
        ) : (
          clients.map((client) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 transition hover:border-primary-500 hover:shadow-md"
            >
              <div className="min-w-0">
                <p className="font-medium text-navy-900">
                  {client.prenom} {client.nom}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  {client._count.documents} document{client._count.documents > 1 ? "s" : ""}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
