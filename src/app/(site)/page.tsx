import { Hero, type HeroSlide } from "@/components/site/Hero"; // Importamos o tipo daqui!
import { EventsSection } from "@/components/site/EventsSection";
import { FeatureSection } from "@/components/site/FeatureSection";
import { NewsSection } from "@/components/site/NewsSection";
import { LocationSection } from "@/components/site/LocationSection";
import { MassBanner } from "@/components/site/MassBanner";
import { prisma } from "@/lib/prisma";

async function getHeroData(): Promise<HeroSlide[]> {
  try {
    const banners = await prisma.post.findMany({
      where: {
        isHighlight: true,
        status: "published",
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // O segredo está aqui: forçar cada valor a ser uma string, mesmo que venha nulo
    return banners.map((b) => ({
      id: String(b.id),
      titleRest: b.title || "",
      titleHighlight: "",
      subtitle: b.category || "Destaque",
      description: "",
      backgroundImageUrl: b.coverImage || "/placeholder.jpg", // Nunca deixa ser null
      primaryButtonText: "Ler Mais",
      primaryButtonUrl: `/noticias/${b.slug || ""}`,
    }));
  } catch (error) {
    console.error("Erro ao buscar dados do Hero:", error);
    return [];
  }
}

export default async function Home() {
  const slides = await getHeroData();

  return (
    <div className="bg-[#fcfbf9] min-h-screen">
      <Hero initialSlides={slides} />
      <MassBanner />
      <EventsSection />
      <FeatureSection />
      <NewsSection />
      <LocationSection />
    </div>
  );
}