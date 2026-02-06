// Aqui definimos como os dados saem do banco
export interface HeroSlide {
  id: number;
  subtitle: string;
  titleHighlight: string;
  titleRest: string;
  description: string;
  backgroundImageUrl: string;
  primaryButton: { text: string; url: string };
  secondaryButton: { text: string; url: string };
}

export interface InfoCard {
  id: number;
  title: string;
  description: string;
  icon: "calendar" | "users" | "heart" | "map"; // Ícones permitidos
  linkText: string;
  linkUrl: string;
  highlight?: boolean; // Se for true, ganha cor de destaque
}

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;    // Um resumo curto
  date: string;       // Data de publicação
  imageUrl: string;   // Foto da capa
  slug: string;       // O link da notícia (ex: /noticias/festa-padroeiro)
  category: string;   // Ex: Eventos, Avisos, Espiritualidade
}

