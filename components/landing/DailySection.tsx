import Link from "next/link";
import { BookOpen, Brain, Clock, ArrowRight } from "lucide-react";

export default function DailySection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid grid-cols-1 items-center gap-10 rounded-lg border border-border bg-card p-8 sm:p-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary-600">SOINELY Daily</p>
          <h2 className="mt-2 text-3xl font-semibold text-navy-900">Chaque matin, un petit rappel.</h2>
          <p className="mt-3 text-muted-foreground">
            Une notification, une lecture de 30 secondes. Pas plus. De quoi rester à jour sans y penser —
            et prendre l'habitude d'ouvrir SOINELY chaque jour.
          </p>
          <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary-600">
            <Clock className="h-4 w-4" />
            30 secondes de lecture, pas plus
          </div>
          <Link
            href="/daily"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline"
          >
            Voir le rappel du jour
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <BookOpen className="mt-0.5 h-5 w-5 text-primary-500" />
            <div>
              <p className="text-sm font-medium text-navy-900">La recommandation du jour</p>
              <p className="text-sm text-muted-foreground">
                Un rappel pratique tiré des 20 HUBS SOINELY.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <Brain className="mt-0.5 h-5 w-5 text-primary-500" />
            <div>
              <p className="text-sm font-medium text-navy-900">Le saviez-vous ?</p>
              <p className="text-sm text-muted-foreground">
                Une notion clé du métier, expliquée simplement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
