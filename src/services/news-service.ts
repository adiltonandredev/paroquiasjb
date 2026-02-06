import { NewsItem } from "@/types";

const FAKE_NEWS_DB: NewsItem[] = [
  {
    id: 1,
    title: "Inscrições abertas para a Catequese 2026",
    excerpt: "Pais e responsáveis já podem realizar a inscrição das crianças para as turmas de iniciação cristã na secretaria.",
    date: "05 Fev 2026",
    category: "Secretaria",
    slug: "inscricoes-catequese-2026",
    // Crianças estudando / Lendo a bíblia
    imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Missa Solene de Lava-pés nesta quinta-feira",
    excerpt: "Venha participar conosco deste momento de humildade e serviço, iniciando o Tríduo Pascal em nossa paróquia.",
    date: "02 Fev 2026",
    category: "Liturgia",
    slug: "missa-lava-pes",
    // Ritual religioso / Foco nas mãos/pés
    imageUrl: "https://images.unsplash.com/photo-1518176258769-f227c798150e?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Campanha do Quilo: Ajude quem precisa",
    excerpt: "Neste fim de semana estaremos arrecadando alimentos não perecíveis para as cestas básicas dos vicentinos.",
    date: "28 Jan 2026",
    category: "Social",
    slug: "campanha-do-quilo",
    // Doação de alimentos
    imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop"
  }
];

export const NewsService = {
  getLatestNews: async (): Promise<NewsItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return FAKE_NEWS_DB;
  }
};