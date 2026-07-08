import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader } from "@/components/Card";
import { Badge, statutTone } from "@/components/Badge";
import { formatDate } from "@/lib/utils";

export default async function TourneesPage() {
  const tournees = await prisma.tournee.findMany({
    orderBy: { dateTournee: "desc" },
    include: { service: true, infirmier: true, patients: true },
  });

  return (
    <div>
      <PageHeader title="Tournées" subtitle="Tournées planifiées et en cours" />

      <div className="flex flex-col gap-3">
        {tournees.map((t) => {
          const visites = t.patients.filter((p) => p.statutVisite === "visite").length;
          return (
            <Link key={t.id} href={`/tournees/${t.id}`}>
              <Card className="transition hover:border-primary-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {t.service.nom} · {t.quart.replace("_", "-")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(t.dateTournee)} · {t.infirmier.prenom} {t.infirmier.nom} · {visites}/
                      {t.patients.length} patient(s) visité(s)
                    </p>
                  </div>
                  <Badge tone={statutTone(t.statut)}>{t.statut}</Badge>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
