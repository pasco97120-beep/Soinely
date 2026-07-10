import { auth } from "@/auth";
import { isModeTournee } from "@/lib/mode-tournee";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import SearchSection from "@/components/landing/SearchSection";
import ConceptSection from "@/components/landing/ConceptSection";
import MissionsSection from "@/components/landing/MissionsSection";
import HubsSection from "@/components/landing/HubsSection";
import CabinetSection from "@/components/landing/CabinetSection";
import AISection from "@/components/landing/AISection";
import DailySection from "@/components/landing/DailySection";
import StatsSection from "@/components/landing/StatsSection";
import CommencerSection from "@/components/landing/CommencerSection";
import Footer from "@/components/landing/Footer";

export default async function Home() {
  const session = await auth();
  const user = session?.user as any;
  const idelUser = user?.accountType === "idel" ? { prenom: user.name?.split(" ")[0] ?? "" } : null;

  return (
    <div>
      <Header idelUser={idelUser} modeTournee={isModeTournee()} />
      <Hero />
      <SearchSection />
      <ConceptSection />
      <MissionsSection />
      <HubsSection />
      <CabinetSection />
      <AISection />
      <DailySection />
      <StatsSection />
      <CommencerSection />
      <Footer />
    </div>
  );
}
