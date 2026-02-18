import { Hero } from "@/components/site/Hero";
import { EventsSection } from "@/components/site/EventsSection";
import { FeatureSection } from "@/components/site/FeatureSection";
import { NewsSection } from "@/components/site/NewsSection";
import { LocationSection } from "@/components/site/LocationSection";
import { MassBanner } from "@/components/site/MassBanner"; // Importado

export default function Home() {
  return (
    // Mantendo o creme editorial que você definiu
    <div className="bg-[#fcfbf9] min-h-screen">
      
      {/* 1. Banner Principal */}
      <Hero />

      {/* 2. Banner de Horários Semanais - Encaixe ideal aqui */}
      <MassBanner />

      {/* 3. Eventos - Já com lógica de auto-ocultar */}
      <EventsSection />

      {/* 4. Cards de Destaque */}
      <FeatureSection />

      {/* 5. Últimas Notícias */}
      <NewsSection />

      {/* 6. Localização e Missa de Hoje (Lógica dinâmica integrada) */}
      <LocationSection />
      
    </div>
  );
}