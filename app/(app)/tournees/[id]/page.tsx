import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/Card";
import { formatDate } from "@/lib/utils";
import TourneeBoard from "./TourneeBoard";

export default async function TourneeDetailPage({ params }: { params: { id: string } }) {
  const tournee = await prisma.tournee.findUnique({
    where: { id: Number(params.id) },
    include: {
      service: true,
      infirmier: true,
      patients: {
        orderBy: { ordreVisite: "asc" },
        include: {
          admission: {
            include: {
              patient: true,
              lit: { include: { chambre: true } },
              prescriptions: { include: { medicaments: true } },
            },
          },
          soins: { include: { infirmier: true }, orderBy: { heureRealisation: "asc" } },
        },
      },
    },
  });

  if (!tournee) notFound();

  return (
    <div>
      <PageHeader
        title={`${tournee.service.nom} — ${tournee.quart.replace("_", "-")}`}
        subtitle={`${formatDate(tournee.dateTournee)} · ${tournee.infirmier.prenom} ${tournee.infirmier.nom}`}
      />
      <TourneeBoard tournee={JSON.parse(JSON.stringify(tournee))} />
    </div>
  );
}
