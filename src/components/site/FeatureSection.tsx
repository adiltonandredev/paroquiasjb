import { prisma } from "@/lib/prisma";
import { Calendar, Users, Heart, MapPin, ArrowRight, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mapa de ícones (Garante que se o banco mandar "calendar", renderizamos o componente)
const iconMap: Record<string, any> = {
  calendar: Calendar,
  users: Users,
  heart: Heart,
  map: MapPin,
  info: Info,
};

export async function FeatureSection() {
  // Buscamos os cards direto do banco (Hostinger)
  // Usamos categoria 'feature-card' para filtrar
  const cardsData = await prisma.post.findMany({
    where: {
      category: "feature-card",
      status: "published",
    },
    orderBy: { order: "asc" },
    take: 3, // Limita aos 3 principais
  });

  // Se não houver nada no banco, não renderizamos a seção ou mostramos cards vazios
  if (cardsData.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50 container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-24 relative z-30">
        
        {cardsData.map((card) => {
          // Resolve o ícone: Se o sumário do post for "heart", usamos o ícone Heart. 
          // Se não existir no mapa, usamos o "Info" como padrão.
          const IconComponent = iconMap[card.summary?.toLowerCase() || "info"] || Info;
          
          // Usamos o campo 'isHighlight' do seu schema para definir a cor
          const isHighlighted = card.isHighlight;

          return (
            <div
              key={card.id}
              className={cn(
                "p-8 rounded-xl shadow-xl border transition-all duration-300 hover:-translate-y-2 group",
                isHighlighted 
                  ? "bg-[#754D25] text-white border-[#754D25]" 
                  : "bg-white text-gray-800 border-gray-100"
              )}
            >
              {/* Ícone */}
              <div className={cn(
                "h-12 w-12 rounded-lg flex items-center justify-center mb-6",
                isHighlighted ? "bg-white/20 text-white" : "bg-[#C4A45F]/10 text-[#C4A45F]"
              )}>
                <IconComponent className="h-6 w-6" />
              </div>

              {/* Texto */}
              <h3 className="text-xl font-bold font-serif mb-3">{card.title}</h3>
              
              <div className={cn(
                "text-sm leading-relaxed mb-6 min-h-[48px] line-clamp-3",
                isHighlighted ? "text-gray-100" : "text-gray-600"
              )}>
                {/* Removemos tags HTML do conteúdo para a descrição curta */}
                {card.content?.replace(/<[^>]*>?/gm, '')}
              </div>

              {/* Botão Link */}
              <Link 
                href={`/posts/${card.slug}`} 
                className={cn(
                  "inline-flex items-center gap-2 font-semibold text-sm group-hover:gap-3 transition-all",
                  isHighlighted ? "text-white" : "text-[#C4A45F]"
                )}
              >
                Saiba Mais <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          );
        })}

      </div>
    </section>
  );
}