import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getIdelUser } from "@/lib/idel-session";
import ClientDocuments from "./ClientDocuments";
import { ArrowLeft, UserCircle } from "lucide-react";

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const idelUser = await getIdelUser();
  if (!idelUser) redirect("/connexion");

  const client = await prisma.client.findUnique({
    where: { id: Number(params.id) },
    include: { documents: { orderBy: { createdAt: "desc" } } },
  });

  if (!client || client.idelUserId !== idelUser.id) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/clients" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy-900">
        <ArrowLeft className="h-4 w-4" />
        Mes clients
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-950 text-primary-400">
          <UserCircle className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy-900">
            {client.prenom} {client.nom}
          </h1>
          {client.dateNaissance && (
            <p className="text-sm text-muted-foreground">
              Né(e) le {new Intl.DateTimeFormat("fr-FR").format(client.dateNaissance)}
            </p>
          )}
        </div>
      </div>

      <ClientDocuments
        clientId={client.id}
        initialDocuments={client.documents.map((d) => ({
          id: d.id,
          type: d.type,
          label: d.label,
          dataUrl: d.dataUrl,
          createdAt: d.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
