import { isModeTournee } from "@/lib/mode-tournee";
import { getIdelUser } from "@/lib/idel-session";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const user = await getIdelUser();
  const idelUser = user ? { prenom: user.prenom, nom: user.nom, photoUrl: user.photoUrl } : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header idelUser={idelUser} modeTournee={isModeTournee()} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
