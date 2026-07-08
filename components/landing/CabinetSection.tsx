import Link from "next/link";
import { Bookmark, FileCheck2, ListChecks, Zap, Users2, Share2, Bell, Building, ArrowRight } from "lucide-react";

const cabinet = [
  { icon: Bookmark, label: "Son matériel favori" },
  { icon: FileCheck2, label: "Ses protocoles favoris" },
  { icon: ListChecks, label: "Ses check-lists" },
  { icon: Zap, label: "Ses raccourcis" },
];

const equipe = [
  { icon: Share2, label: "Protocoles internes partagés" },
  { icon: FileCheck2, label: "Documents communs" },
  { icon: ListChecks, label: "Check-lists d'équipe" },
  { icon: Bell, label: "Rappels partagés" },
];

export default function CabinetSection() {
  return (
    <section id="cabinet" className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600">
            <Building className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-navy-900">Mon Cabinet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Chaque IDEL peut enregistrer ce qui compte pour elle : SOINELY devient personnel.
          </p>
          <ul className="mt-5 flex flex-col gap-3">
            {cabinet.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-navy-900">
                <Icon className="h-4 w-4 text-primary-500" />
                {label}
              </li>
            ))}
          </ul>
          <Link
            href="/cabinet"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline"
          >
            Ouvrir mon cabinet
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-navy-950 p-8 text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
            <Users2 className="h-5 w-5 text-primary-400" />
          </div>
          <h3 className="mt-4 text-xl font-semibold">Mon Équipe</h3>
          <p className="mt-2 text-sm text-navy-200">
            Pour les cabinets : imaginez six infirmières travaillant avec les mêmes ressources, à jour
            pour tout le monde.
          </p>
          <ul className="mt-5 flex flex-col gap-3">
            {equipe.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-navy-100">
                <Icon className="h-4 w-4 text-primary-400" />
                {label}
              </li>
            ))}
          </ul>
          <Link
            href="/equipe"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-400 hover:underline"
          >
            Ouvrir mon équipe
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
