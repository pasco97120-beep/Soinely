import Link from "next/link";
import { Search, MessageCircle, Compass, FileText, Link2, Sparkles, ArrowRight } from "lucide-react";

const capabilities = [
  { icon: Search, label: "Retrouve", desc: "la bonne fiche, instantanément" },
  { icon: MessageCircle, label: "Explique", desc: "en langage clair, sans jargon inutile" },
  { icon: Compass, label: "Oriente", desc: "vers la conduite à tenir adaptée" },
  { icon: FileText, label: "Résume", desc: "les protocoles longs en l'essentiel" },
  { icon: Link2, label: "Relie", desc: "les contenus entre eux" },
];

export default function AISection() {
  return (
    <section id="ia" className="bg-navy-950 py-20 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-primary-300">
            <Sparkles className="h-3.5 w-3.5" />
            Assistant IA
          </span>
          <h2 className="mt-3 text-3xl font-semibold">Pas une IA qui invente.</h2>
          <p className="mt-3 text-navy-200">
            Une IA toujours transparente sur ses sources — elle s'appuie uniquement sur le contenu validé
            de SOINELY.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {capabilities.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/5 p-5">
              <Icon className="h-5 w-5 text-primary-400" />
              <p className="mt-3 font-medium">{label}</p>
              <p className="mt-1 text-sm text-navy-300">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/assistant"
            className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-medium text-white hover:bg-primary-600"
          >
            Essayer l'assistant
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
