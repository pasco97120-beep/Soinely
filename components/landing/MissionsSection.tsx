import Link from "next/link";
import { Cross, Syringe, Droplet, Droplets, Home, HeartHandshake, ArrowRight } from "lucide-react";

const missions = [
  { icon: Cross, label: "Faire des pansements", slug: "faire-des-pansements" },
  { icon: Syringe, label: "Faire des injections", slug: "faire-des-injections" },
  { icon: Droplet, label: "Gérer le diabète", slug: "gerer-le-diabete" },
  { icon: Droplets, label: "Poser des perfusions", slug: "poser-des-perfusions" },
  { icon: Home, label: "Faire des retours d'hospitalisation", slug: "faire-des-retours-hospitalisation" },
  { icon: HeartHandshake, label: "Accompagner des soins palliatifs", slug: "accompagner-soins-palliatifs" },
];

export default function MissionsSection() {
  return (
    <section id="missions" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-primary-600">Les missions</p>
        <h2 className="mt-2 text-3xl font-semibold text-navy-900">Aujourd'hui, je vais…</h2>
        <p className="mt-3 text-muted-foreground">
          Quand une IDEL ouvre SOINELY, elle ne cherche pas. Elle choisit simplement sa mission du jour,
          et toute l'application s'adapte.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {missions.map(({ icon: Icon, label, slug }) => (
          <Link
            key={label}
            href={`/missions/${slug}`}
            className="group flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 text-center transition hover:-translate-y-1 hover:border-primary-500 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-600 group-hover:bg-primary-500 group-hover:text-white">
              <Icon className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-navy-900">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/missions"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline"
        >
          Voir toutes les missions
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
