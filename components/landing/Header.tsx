import Link from "next/link";
import { HeartPulse, LogOut } from "lucide-react";
import ModeTourneeToggle from "@/components/ModeTourneeToggle";
import { Avatar } from "@/components/Avatar";
import { signOut } from "@/auth";

const links = [
  { href: "/missions", label: "Missions" },
  { href: "/hubs", label: "Thématiques" },
  { href: "/daily", label: "SOINELY Daily" },
  { href: "/assistant", label: "Assistant IA" },
];

export default function Header({
  idelUser,
  modeTournee,
}: {
  idelUser: { prenom: string; nom: string; photoUrl: string | null } | null;
  modeTournee: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-navy-900 to-primary-600">
            <HeartPulse className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="font-heading font-bold text-navy-900">SOINELY</p>
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
          {idelUser ? (
            <>
              <div className="hidden sm:block">
                <ModeTourneeToggle active={modeTournee} />
              </div>
              <Link
                href="/profil"
                title="Profil"
                className="hidden overflow-hidden rounded-full ring-1 ring-border transition hover:ring-primary-500 sm:block"
              >
                <Avatar photoUrl={idelUser.photoUrl} prenom={idelUser.prenom} nom={idelUser.nom} size="sm" />
              </Link>
              <Link
                href="/accueil"
                className="rounded-full bg-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800"
              >
                Bonjour, {idelUser.prenom}
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  title="Déconnexion"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-danger hover:text-danger"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </>
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
