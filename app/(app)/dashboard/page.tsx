import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader } from "@/components/Card";
import { Badge, prioriteTone } from "@/components/Badge";
import { formatDateTime } from "@/lib/utils";
import { Users, ClipboardList, Bell, AlertTriangle } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const infirmierId = (session?.user as any)?.infirmierId as number | undefined;

  const [patientsActifs, soinsAujourdhui, alertesNonLues, tourneesDuJour, alertes, transmissionsRecentes] =
    await Promise.all([
      prisma.admission.count({ where: { statut: "en_cours" } }),
      prisma.soin.count({
        where: { heureRealisation: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      }),
      prisma.alerte.count({ where: { statut: "non_lue" } }),
      prisma.tournee.findMany({
        where: infirmierId ? { infirmierId } : undefined,
        orderBy: { dateTournee: "desc" },
        take: 3,
        include: { service: true, patients: true },
      }),
      prisma.alerte.findMany({
        where: { statut: "non_lue" },
        orderBy: { dateAlerte: "desc" },
        take: 5,
      }),
      prisma.transmission.findMany({
        orderBy: { dateTransmission: "desc" },
        take: 5,
        include: { admission: { include: { patient: true } }, infirmier: true },
      }),
    ]);

  const stats = [
    { label: "Patients actifs", value: patientsActifs, icon: Users, tone: "text-info" },
    { label: "Soins réalisés (24h)", value: soinsAujourdhui, icon: ClipboardList, tone: "text-success" },
    { label: "Alertes non lues", value: alertesNonLues, icon: Bell, tone: "text-danger" },
  ];

  return (
    <div>
      <PageHeader
        title={`Bonjour, ${(session?.user as any)?.name?.split(" ")[0] ?? ""}`}
        subtitle="Vue d'ensemble de l'activité du service"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <Card key={label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-1 text-3xl font-semibold">{value}</p>
              </div>
              <Icon className={`h-8 w-8 ${tone}`} />
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Alertes actives</h2>
            <Link href="/alertes" className="text-sm text-primary-600 hover:underline">
              Voir tout
            </Link>
          </div>
          {alertes.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucune alerte non lue.</p>
          )}
          <ul className="flex flex-col gap-3">
            {alertes.map((a) => (
              <li key={a.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge tone={prioriteTone(a.priorite)}>{a.priorite}</Badge>
                    <span className="text-xs text-muted-foreground">{formatDateTime(a.dateAlerte)}</span>
                  </div>
                  <p className="mt-1 text-sm">{a.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Tournées récentes</h2>
            <Link href="/tournees" className="text-sm text-primary-600 hover:underline">
              Voir tout
            </Link>
          </div>
          <ul className="flex flex-col gap-3">
            {tourneesDuJour.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/tournees/${t.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-3 hover:border-primary-500"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {t.service.nom} — {t.quart.replace("_", "-")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(t.dateTournee).toLocaleDateString("fr-FR")} · {t.patients.length} patient(s)
                    </p>
                  </div>
                  <Badge tone={t.statut === "en_cours" ? "success" : "neutral"}>{t.statut}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Dernières transmissions</h2>
          <Link href="/transmissions" className="text-sm text-primary-600 hover:underline">
            Voir tout
          </Link>
        </div>
        <ul className="flex flex-col gap-3">
          {transmissionsRecentes.map((t) => (
            <li key={t.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2">
                <Badge tone={prioriteTone(t.priorite)}>{t.priorite}</Badge>
                <span className="text-sm font-medium">
                  {t.admission.patient.prenom} {t.admission.patient.nom}
                </span>
                <span className="text-xs text-muted-foreground">
                  · {t.infirmier.prenom} {t.infirmier.nom} · {formatDateTime(t.dateTransmission)}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{t.contenu}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
