import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/Card";
import TransmissionList from "./TransmissionList";

export default async function TransmissionsPage() {
  const [transmissions, admissions] = await Promise.all([
    prisma.transmission.findMany({
      orderBy: { dateTransmission: "desc" },
      include: { admission: { include: { patient: true } }, infirmier: true },
    }),
    prisma.admission.findMany({
      where: { statut: "en_cours" },
      include: { patient: true },
      orderBy: { patient: { nom: "asc" } },
    }),
  ]);

  return (
    <div>
      <PageHeader title="Transmissions" subtitle="Communication entre équipes soignantes" />
      <TransmissionList
        transmissions={JSON.parse(JSON.stringify(transmissions))}
        admissions={JSON.parse(
          JSON.stringify(admissions.map((a) => ({ id: a.id, label: `${a.patient.prenom} ${a.patient.nom}` })))
        )}
      />
    </div>
  );
}
