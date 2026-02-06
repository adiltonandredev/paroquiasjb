import { Hero } from "@/components/site/Hero";
import { FeatureSection } from "@/components/site/FeatureSection";
import { NewsSection } from "@/components/site/NewsSection";
import { LocationSection } from "@/components/site/LocationSection";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 1. Banner Principal */}
      <Hero />

      {/* 2. Cards de Destaque */}
      <FeatureSection />

      {/* 3. Últimas Notícias (NOVO) */}
      <NewsSection />

      {/* Última seção antes do rodapé */}
      <LocationSection />
    </div>
  );
}