import { InfoCard } from "@/types";
import { NewsItem } from "@/types";

// SIMULAÇÃO DO BANCO DE DADOS
// No futuro, isso será substituído por: await db.cards.findMany()
const FAKE_DB_CARDS: InfoCard[] = [
  {
    id: 1,
    title: "Horários de Missa",
    description: "Domingo: 08h e 19h30\nQuarta-feira: 19h30 (Missa da Família)",
    icon: "calendar",
    linkText: "Ver todos",
    linkUrl: "/horarios",
    highlight: true, // Esse card será azul
  },
  {
    id: 2,
    title: "Secretaria Paroquial",
    description: "Atendimento de Seg. a Sex.\ndas 08h às 12h e 14h às 18h.",
    icon: "users",
    linkText: "Fale Conosco",
    linkUrl: "/contato",
  },
  {
    id: 3,
    title: "Seja Dizimista",
    description: "Ajude a manter nossa evangelização. Faça seu cadastro online.",
    icon: "heart",
    linkText: "Contribuir",
    linkUrl: "/dizimo",
  },
];

export const HomeService = {
  // Simula uma chamada assíncrona (como se fosse na internet)
  getCards: async (): Promise<InfoCard[]> => {
    // Um pequeno delay artificial para parecer real (opcional)
    await new Promise((resolve) => setTimeout(resolve, 100)); 
    return FAKE_DB_CARDS;
  },
};

