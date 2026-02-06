import { HeroSlide } from "@/types";

const FAKE_HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    subtitle: "Seja Bem-vindo",
    titleHighlight: "Fé, Esperança e Amor",
    titleRest: "Uma comunidade de",
    description: "Junte-se a nós nas celebrações e faça parte dessa família. Caminhando juntos para construir o Reino de Deus.",
    // Igreja Iluminada
    backgroundImageUrl: "https://images.unsplash.com/photo-1548625361-98774e50878a?q=80&w=2070&auto=format&fit=crop",
    primaryButton: { text: "Horários de Missa", url: "/horarios" },
    secondaryButton: { text: "Dízimo", url: "/dizimo" }
  },
  {
    id: 2,
    subtitle: "Vida de Oração",
    titleHighlight: "Encontro com Deus",
    titleRest: "Venha viver um",
    description: "Participe dos nossos grupos de oração e adoração ao Santíssimo Sacramento. Toda quinta-feira às 19h30.",
    // Pessoas Orando / Mãos
    backgroundImageUrl: "https://images.unsplash.com/photo-1490129374994-d2e854897f1f?q=80&w=2070&auto=format&fit=crop",
    primaryButton: { text: "Ver Grupos", url: "/grupos" },
    secondaryButton: { text: "Pedidos de Oração", url: "/pedidos" }
  },
  {
    id: 3,
    subtitle: "Ação Social",
    titleHighlight: "Amor ao Próximo",
    titleRest: "A fé se traduz em",
    description: "Nossa paróquia mantém obras sociais que ajudam dezenas de famílias. Sua ajuda faz toda a diferença.",
    // Mãos segurando planta ou alimento
    backgroundImageUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop",
    primaryButton: { text: "Como Ajudar", url: "/social" },
    secondaryButton: { text: "Doar Agora", url: "/doar" }
  }
];

export const HeroService = {
  getSlides: async (): Promise<HeroSlide[]> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return FAKE_HERO_SLIDES;
  }
};