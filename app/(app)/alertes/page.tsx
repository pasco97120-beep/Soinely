import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/Card";
import AlertList from "./AlertList";

export default async function AlertesPage() {
  const alertes = await prisma.alerte.findMany({
    orderBy: [{ statut: "asc" }, { dateAlerte: "desc" }],
    include: {
      admission: { include: { patient: true, lit: { include: { chambre: true } } } },
      infirmier: true,
    },
  });

  return (
    <div>
      <PageHeader title="Alertes" subtitle={`${alertes.filter((a) => a.statut === "non_lue").length} alerte(s) non lue(s)`} />
      <AlertList alertes={JSON.parse(JSON.stringify(alertes))} />
    </div>
  );
}
