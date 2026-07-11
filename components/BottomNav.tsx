import Link from "next/link";
import { Home, Search, LayoutGrid, Sparkles, Calculator, UserCircle } from "lucide-react";

// Navigation basse — SOINELY Design System™ Vol. II, Chapitre 6 : "Navigation basse. Toujours.
// Accueil / Recherche / HUB / Copilote / Outils / Profil. Jamais plus." Visible uniquement sur
// mobile (Loi n°6 — une seule main, en tournée) ; le header en haut reste la navigation desktop.
const items = [
  { href: "/accueil", label: "Accueil", icon: Home },
  { href: "/recherche", label: "Recherche", icon: Search },
  { href: "/hubs", label: "HUB", icon: LayoutGrid },
  { href: "/assistant", label: "Copilote", icon: Sparkles },
  { href: "/hubs/calculateurs-et-echelles", label: "Outils", icon: Calculator },
  { href: "/profil", label: "Profil", icon: UserCircle },
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-between border-t border-border bg-background/95 backdrop-blur sm:hidden">
      {items.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex flex-1 flex-col items-center gap-0.5 py-2 text-muted-foreground transition hover:text-primary-600"
        >
          <Icon className="h-5 w-5" />
          <span className="text-[10px] font-medium">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
