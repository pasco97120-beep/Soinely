import { auth, signOut } from "@/auth";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  MessageSquareWarning,
  Bell,
  HeartPulse,
  LogOut,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/tournees", label: "Tournées", icon: ClipboardList },
  { href: "/transmissions", label: "Transmissions", icon: MessageSquareWarning },
  { href: "/alertes", label: "Alertes", icon: Bell },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user as any;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="flex w-64 flex-col border-r border-border bg-navy-950 text-white">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500">
            <HeartPulse className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">SOINELY</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-navy-200 transition hover:bg-white/5 hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <p className="truncate text-sm font-medium">{user?.name ?? "Utilisateur"}</p>
          <p className="truncate text-xs text-navy-300">{user?.role}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button className="mt-3 flex items-center gap-2 text-xs text-navy-300 hover:text-white">
              <LogOut className="h-3.5 w-3.5" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
