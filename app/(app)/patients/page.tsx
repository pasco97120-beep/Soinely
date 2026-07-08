import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { age } from "@/lib/utils";

export default async function PatientsPage() {
  const admissions = await prisma.admission.findMany({
    where: { statut: "en_cours" },
    include: { patient: true, service: true, lit: { include: { chambre: true } } },
    orderBy: { dateAdmission: "desc" },
  });

  return (
    <div>
      <PageHeader title="Patients" subtitle={`${admissions.length} patient(s) actuellement hospitalisé(s)`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {admissions.map((a) => (
          <Link key={a.id} href={`/patients/${a.patient.id}`}>
            <Card className="h-full transition hover:border-primary-500">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">
                    {a.patient.prenom} {a.patient.nom}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {age(a.patient.dateNaissance)} ans · {a.patient.sexe} · {a.patient.groupeSanguin}
                  </p>
                </div>
                <Badge tone="info">{a.service.nom}</Badge>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                <p>
                  Chambre {a.lit?.chambre.numero ?? "?"} · Lit {a.lit?.numeroLit ?? "?"}
                </p>
                <p className="mt-1 truncate">{a.diagnosticPrincipal ?? a.motifAdmission}</p>
              </div>
              {a.patient.allergies && (
                <p className="mt-3 text-xs font-medium text-danger">⚠ Allergies : {a.patient.allergies}</p>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
