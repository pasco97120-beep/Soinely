import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BookOpen, Brain, ArrowRight } from "lucide-react";

function dayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default async function DailyPage() {
  const tips = await prisma.dailyTip.findMany({
    orderBy: { ordre: "asc" },
    include: { fiche: { include: { hub: true } } },
  });

  if (tips.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center text-muted-foreground">
        Aucun rappel disponible pour le moment.
      </div>
    );
  }

  const todayIndex = dayOfYear(new Date()) % tips.length;
  const today = tips[todayIndex];
  const others = tips.filter((_, i) => i !== todayIndex);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-primary-600">SOINELY Daily</p>
        <h1 className="mt-2 text-3xl font-semibold text-navy-900">Le rappel du jour</h1>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-500/10 text-primary-600">
            {today.type === "le_saviez_vous" ? <Brain className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
          </div>
          <p className="text-sm font-medium text-primary-600">
            {today.type === "le_saviez_vous" ? "Le saviez-vous ?" : "La recommandation du jour"}
          </p>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-navy-900">{today.titre}</h2>
        <p className="mt-2 text-muted-foreground">{today.contenu}</p>
        {today.fiche && (
          <Link
            href={`/hubs/${today.fiche.hub.slug}/${today.fiche.slug}`}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline"
          >
            Consulter la fiche associée
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="mt-10">
        <p className="mb-3 text-sm font-medium text-navy-900">Les autres rappels</p>
        <div className="flex flex-col gap-2">
          {others.map((tip) => (
            <div key={tip.id} className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-medium text-primary-600">
                {tip.type === "le_saviez_vous" ? "Le saviez-vous ?" : "Recommandation"}
              </p>
              <p className="mt-1 text-sm font-medium text-navy-900">{tip.titre}</p>
              <p className="mt-1 text-sm text-muted-foreground">{tip.contenu}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
