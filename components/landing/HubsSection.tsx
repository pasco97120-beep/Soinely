import Link from "next/link";
import {
  Droplet,
  Cross,
  Droplets,
  Cable,
  TestTube,
  Utensils,
  CircleDot,
  Siren,
  HeartHandshake,
  FileText,
  ShieldCheck,
  TestTubes,
  Syringe,
  Waves,
  Home,
  SprayCan,
  GraduationCap,
  Briefcase,
  FileStack,
  Calculator,
  ArrowRight,
} from "lucide-react";

const hubs = [
  { icon: Droplet, label: "Diabète", slug: "diabete" },
  { icon: Cross, label: "Plaies et cicatrisation", slug: "plaies-et-cicatrisation" },
  { icon: Droplets, label: "Perfusions", slug: "perfusions" },
  { icon: Cable, label: "PICC Line / Midline / PAC", slug: "picc-line-midline-pac" },
  { icon: TestTube, label: "Sonde urinaire", slug: "sonde-urinaire" },
  { icon: Utensils, label: "Gastrostomie / Jéjunostomie", slug: "gastrostomie-jejunostomie" },
  { icon: CircleDot, label: "Stomies", slug: "stomies" },
  { icon: Siren, label: "Urgences", slug: "urgences" },
  { icon: HeartHandshake, label: "Soins palliatifs", slug: "soins-palliatifs" },
  { icon: FileText, label: "NGAP", slug: "ngap" },
  { icon: ShieldCheck, label: "BSI", slug: "bsi" },
  { icon: TestTubes, label: "Prélèvements", slug: "prelevements" },
  { icon: Syringe, label: "Médicaments injectables", slug: "medicaments-injectables" },
  { icon: Waves, label: "Anticoagulants", slug: "anticoagulants" },
  { icon: Home, label: "Retour d'hospitalisation", slug: "retour-hospitalisation" },
  { icon: SprayCan, label: "Hygiène et prévention", slug: "hygiene-et-prevention" },
  { icon: GraduationCap, label: "Éducation thérapeutique", slug: "education-therapeutique" },
  { icon: Briefcase, label: "Gestion du cabinet IDEL", slug: "gestion-du-cabinet-idel" },
  { icon: FileStack, label: "Documents professionnels", slug: "documents-professionnels" },
  { icon: Calculator, label: "Calculateurs et échelles", slug: "calculateurs-et-echelles" },
];

export default function HubsSection() {
  return (
    <section id="hubs" className="bg-muted/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-primary-600">Les fondations</p>
          <h2 className="mt-2 text-3xl font-semibold text-navy-900">Les 20 HUBS thématiques</h2>
          <p className="mt-3 text-muted-foreground">
            Une plateforme pensée pour répondre à 80 % des questions du quotidien des IDEL — déjà
            plusieurs centaines de ressources.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {hubs.map(({ icon: Icon, label, slug }, i) => (
            <Link
              key={label}
              href={`/hubs/${slug}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-primary-500 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-950 text-primary-400">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Hub {String(i + 1).padStart(2, "0")}</p>
                <p className="text-sm font-medium text-navy-900">{label}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/hubs"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline"
          >
            Voir tous les HUBS
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
