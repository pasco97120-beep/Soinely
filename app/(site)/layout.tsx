import { auth } from "@/auth";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user as any;
  const idelUser = user?.accountType === "idel" ? { prenom: user.name?.split(" ")[0] ?? "" } : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header idelUser={idelUser} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
