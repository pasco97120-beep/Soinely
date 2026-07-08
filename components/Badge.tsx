import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  info: "bg-info/15 text-info",
  primary: "bg-primary-500/15 text-primary-600",
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
