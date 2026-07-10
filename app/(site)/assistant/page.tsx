import AssistantChat from "./AssistantChat";
import { Sparkles, ShieldAlert } from "lucide-react";

export default function AssistantPage({ searchParams }: { searchParams: { q?: string } }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600">
          <Sparkles className="h-3.5 w-3.5 text-gold-500" />
          Copilote Clinique™
        </span>
        <h1 className="mt-3 font-heading text-3xl font-bold text-navy-900">Posez votre question</h1>
        <p className="mt-2 text-muted-foreground">
          L'assistant retrouve, explique et relie le contenu des fiches SOINELY — il n'invente rien.
        </p>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-navy-900">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <p>
          Les réponses sont générées par une IA à partir des fiches SOINELY. Elles peuvent contenir des
          erreurs — vérifiez toujours les informations importantes auprès d'un professionnel de santé.
        </p>
      </div>

      <AssistantChat initialQuestion={searchParams.q} />
    </div>
  );
}
