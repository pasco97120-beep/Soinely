import { isModeTournee } from "@/lib/mode-tournee";
import { getIdelUser } from "@/lib/idel-session";
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
  const user = await getIdelUser();
  const idelUser = user ? { prenom: user.prenom, nom: user.nom, photoUrl: user.photoUrl } : null;

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
