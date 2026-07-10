import { cn } from "@/lib/utils";

const accentBorders = {
  info: "border-l-4 border-l-priorite-info",
  vigilance: "border-l-4 border-l-priorite-vigilance",
  action: "border-l-4 border-l-priorite-action",
  critique: "border-l-4 border-l-priorite-critique",
  primary: "border-l-4 border-l-primary-500",
} as const;

export function Card({
  children,
  className,
  accent,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: keyof typeof accentBorders;
}) {
  return (
    <div
      className={cn(
        // rounded-lg est piloté par --radius (16px, Design System™ Ch.4)
        "rounded-lg border border-border bg-card p-5 shadow-sm",
        accent && accentBorders[accent],
        className
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
