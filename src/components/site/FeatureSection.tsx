import { HomeService } from "@/services/home-service";
import { Calendar, Users, Heart, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mapa de ícones (string do banco -> Componente React)
const iconMap = {
  calendar: Calendar,
  users: Users,
  heart: Heart,
  map: MapPin,
};

export async function FeatureSection() {
  const cards = await HomeService.getCards();

  return (
    <section className="py-16 bg-gray-50 container mx-auto px-4">
      {/* Grid de Cards Flutuantes (sobe um pouco sobre o banner) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {cards.map((card) => {
          const IconComponent = iconMap[card.icon];

          return (
            <div
              key={card.id}
              className={cn(
                "p-8 rounded-xl shadow-xl border transition-all duration-300 hover:-translate-y-2 group",
                card.highlight 
                  ? "bg-primary text-white border-primary" 
                  : "bg-white text-gray-800 border-gray-100"
              )}
            >
              {/* Ícone */}
              <div className={cn(
                "h-12 w-12 rounded-lg flex items-center justify-center mb-6 text-2xl",
                card.highlight ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
              )}>
                <IconComponent className="h-6 w-6" />
              </div>

              {/* Texto */}
              <h3 className="text-xl font-bold font-serif mb-3">{card.title}</h3>
              <p className={cn(
                "text-sm leading-relaxed mb-6 min-h-[48px] whitespace-pre-line",
                card.highlight ? "text-blue-100" : "text-gray-600"
              )}>
                {card.description}
              </p>

              {/* Botão Link */}
              <Link 
                href={card.linkUrl} 
                className={cn(
                  "inline-flex items-center gap-2 font-semibold text-sm group-hover:gap-3 transition-all",
                  card.highlight ? "text-white" : "text-primary"
                )}
              >
                {card.linkText} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          );
        })}

      </div>
    </section>
  );
}