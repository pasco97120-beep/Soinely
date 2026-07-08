import Link from "next/link";
import { HeartPulse, Sparkles } from "lucide-react";

const links = [
  { href: "/missions", label: "Missions" },
  { href: "/hubs", label: "Thématiques" },
  { href: "/daily", label: "SOINELY Daily" },
  { href: "/assistant", label: "Assistant IA" },
];

export default function Header({ idelUser }: { idelUser: { prenom: string } | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500">
            <HeartPulse className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-navy-900">SOINELY</p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              La bibliothèque des IDEL
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-navy-900">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/assistant"
            className="hidden items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-600 sm:flex"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Assistant IA
          </Link>

          {idelUser ? (
            <Link
              href="/cabinet"
              className="rounded-full bg-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800"
            >
              Bonjour, {idelUser.prenom}
            </Link>
          ) : (
            <>
              <Link
                href="/inscription"
                className="hidden rounded-full border border-border px-4 py-2 text-sm font-medium text-navy-900 hover:border-primary-500 sm:block"
              >
                S'inscrire
              </Link>
              <Link
                href="/connexion"
                className="rounded-full bg-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800"
              >
                Se connecter
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
