import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function CommencerSection() {
  return (
    <section id="commencer" className="relative overflow-hidden bg-navy-950 py-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-500/25 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Commencez avec SOINELY</h2>
        <p className="mt-4 text-lg text-navy-200">
          Créez votre compte et accédez immédiatement aux fiches pratiques, protocoles et outils
          pensés pour votre exercice quotidien d'infirmier libéral.
        </p>

        <Link
          href="/inscription"
          className="mt-8 flex items-center gap-2 rounded-full bg-primary-500 px-8 py-4 text-base font-medium text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-600"
        >
          Créer mon compte
          <ArrowRight className="h-5 w-5" />
        </Link>

        <p className="mt-4 flex items-center gap-1.5 text-xs text-navy-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          Inscription immédiate, aucune carte requise
        </p>
      </div>
    </section>
  );
}
