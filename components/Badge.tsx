import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  info: "bg-info/15 text-info",
  primary: "bg-primary-500/15 text-primary-600",
  "priorite-info": "bg-priorite-info/15 text-priorite-info",
  "priorite-vigilance": "bg-priorite-vigilance/15 text-priorite-vigilance",
  "priorite-action": "bg-priorite-action/15 text-priorite-action",
  "priorite-critique": "bg-priorite-critique/15 text-priorite-critique",
} as const;

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function prioriteTone(priorite: string): keyof typeof tones {
  switch (priorite) {
    case "critique":
    case "urgente":
      return "danger";
    case "haute":
    case "importante":
      return "warning";
    case "basse":
      return "info";
    default:
      return "neutral";
  }
}

// Système de priorité SOINELY (SCR-003) : Information / Vigilance / Action recommandée / Situation urgente
export const NIVEAUX_PRIORITE = {
  information: { label: "Information", tone: "priorite-info", dot: "bg-priorite-info" },
  vigilance: { label: "Vigilance", tone: "priorite-vigilance", dot: "bg-priorite-vigilance" },
  action: { label: "Action recommandée", tone: "priorite-action", dot: "bg-priorite-action" },
  urgente: { label: "Situation urgente", tone: "priorite-critique", dot: "bg-priorite-critique" },
} as const satisfies Record<string, { label: string; tone: keyof typeof tones; dot: string }>;

export type NiveauPriorite = keyof typeof NIVEAUX_PRIORITE;

export function PrioriteBadge({ niveau, className }: { niveau: NiveauPriorite; className?: string }) {
  const { label, dot } = NIVEAUX_PRIORITE[niveau];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground",
        className
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", dot)} />
      {label}
    </span>
  );
}

export function statutTone(statut: string): keyof typeof tones {
  switch (statut) {
    case "en_cours":
    case "visite":
    case "confirme":
    case "terminee":
    case "traitee":
    case "lue":
      return "success";
    case "non_lue":
    case "en_attente":
    case "planifiee":
      return "neutral";
    case "annulee":
    case "absent":
    case "ignoree":
    case "sorti":
      return "danger";
    default:
      return "neutral";
  }
}
