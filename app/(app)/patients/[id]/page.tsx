import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader } from "@/components/Card";
import { Badge, prioriteTone } from "@/components/Badge";
import { age, formatDate, formatDateTime } from "@/lib/utils";

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = await prisma.patient.findUnique({
    where: { id: Number(params.id) },
    include: {
      admissions: {
        orderBy: { dateAdmission: "desc" },
        include: {
          service: true,
          lit: { include: { chambre: true } },
          prescriptions: { include: { medicaments: true } },
          constantesVitales: { orderBy: { dateMesure: "desc" }, take: 5 },
          transmissions: {
            orderBy: { dateTransmission: "desc" },
            include: { infirmier: true },
          },
        },
      },
    },
  });

  if (!patient) notFound();

  const admission = patient.admissions.find((a) => a.statut === "en_cours") ?? patient.admissions[0];

  return (
    <div>
      <PageHeader
        title={`${patient.prenom} ${patient.nom}`}
        subtitle={`Dossier ${patient.numeroDossier} · ${age(patient.dateNaissance)} ans · ${patient.sexe}`}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <h2 className="mb-3 font-semibold">Informations</h2>
          <dl className="flex flex-col gap-2 text-sm">
            <Row label="Groupe sanguin" value={patient.groupeSanguin} />
            <Row label="Naissance" value={formatDate(patient.dateNaissance)} />
            <Row label="Téléphone" value={patient.telephone ?? "—"} />
            <Row label="Allergies" value={patient.allergies ?? "Aucune connue"} danger={!!patient.allergies} />
            <Row label="Antécédents" value={patient.antecedents ?? "—"} />
            <Row label="Contact urgence" value={patient.contactUrgenceNom ?? "—"} />
            <Row label="Tél. urgence" value={patient.contactUrgenceTel ?? "—"} />
          </dl>
        </Card>

        {admission && (
          <Card className="lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Admission en cours</h2>
              <Badge tone={admission.statut === "en_cours" ? "success" : "neutral"}>{admission.statut}</Badge>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Row label="Service" value={admission.service.nom} />
              <Row
                label="Chambre / Lit"
                value={`${admission.lit?.chambre.numero ?? "?"} / ${admission.lit?.numeroLit ?? "?"}`}
              />
              <Row label="Médecin" value={admission.medecinResponsable ?? "—"} />
              <Row label="Admis le" value={formatDateTime(admission.dateAdmission)} />
              <Row label="Motif" value={admission.motifAdmission} />
              <Row label="Diagnostic" value={admission.diagnosticPrincipal ?? "—"} />
            </dl>
          </Card>
        )}
      </div>

      {admission && (
        <>
          <Card className="mt-6">
            <h2 className="mb-3 font-semibold">Constantes vitales récentes</h2>
            {admission.constantesVitales.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune mesure enregistrée.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">TA</th>
                      <th className="py-2 pr-4">FC</th>
                      <th className="py-2 pr-4">FR</th>
                      <th className="py-2 pr-4">Temp.</th>
                      <th className="py-2 pr-4">SpO2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admission.constantesVitales.map((c) => (
                      <tr key={c.id} className="border-t border-border">
                        <td className="py-2 pr-4">{formatDateTime(c.dateMesure)}</td>
                        <td className="py-2 pr-4">
                          {c.tensionSystolique}/{c.tensionDiastolique}
                        </td>
                        <td className="py-2 pr-4">{c.frequenceCardiaque}</td>
                        <td className="py-2 pr-4">{c.frequenceRespiratoire}</td>
                        <td className="py-2 pr-4">{c.temperature}°C</td>
                        <td className="py-2 pr-4">{c.saturationO2}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card className="mt-6">
            <h2 className="mb-3 font-semibold">Prescriptions</h2>
            {admission.prescriptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune prescription active.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {admission.prescriptions.map((p) => (
                  <div key={p.id}>
                    <p className="text-sm font-medium">
                      Dr. {p.medecin} <Badge tone={p.statut === "active" ? "success" : "neutral"}>{p.statut}</Badge>
                    </p>
                    <ul className="mt-2 flex flex-col gap-1">
                      {p.medicaments.map((m) => (
                        <li key={m.id} className="text-sm text-muted-foreground">
                          {m.medicamentNom} {m.dosage} — {m.frequence} ({m.voieAdministration})
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="mt-6">
            <h2 className="mb-3 font-semibold">Transmissions</h2>
            {admission.transmissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune transmission.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {admission.transmissions.map((t) => (
                  <li key={t.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-2">
                      <Badge tone={prioriteTone(t.priorite)}>{t.priorite}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {t.infirmier.prenom} {t.infirmier.nom} · {formatDateTime(t.dateTransmission)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">{t.contenu}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

function Row({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={danger ? "text-right font-medium text-danger" : "text-right"}>{value}</dd>
    </div>
  );
}
