import { prisma } from "@/lib/prisma";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

// 1. Criamos a interface para o TypeScript parar de reclamar dos campos
interface EventItem {
  id: string | number;
  title: string;
  slug: string;
  date: Date | string;
  location: string;
  coverImage?: string | null;
}

export async function EventsSection() {
  // 2. Buscamos os dados e forçamos o tipo (as any) para contornar a dúvida do Prisma
  // Use 'event' ou 'events' conforme o seu schema.prisma
  const data = await prisma.event.findMany({
    where: {
      date: {
        gte: new Date(),
      },
    },
    orderBy: { date: 'asc' },
    take: 3,
  }) as unknown as EventItem[]; 

  const events = data || [];

  if (events.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#fcfbf9]">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-[#C4A45F] text-[10px] md:text-xs font-black uppercase tracking-[0.4em] block mb-4">
              Programe-se
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#23140c]">
              Próximos <span className="italic font-normal">Eventos</span>
            </h2>
          </div>
          <Link 
            href="/eventos" 
            className="group text-[#754D25] font-bold text-sm flex items-center gap-2 hover:text-[#C4A45F] transition-all"
          >
            Ver Agenda Completa 
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Link 
              key={String(event.id)}
              href={`/eventos/${event.slug}`}
              className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
            >
              <div className="relative h-56 overflow-hidden">
                <Image 
                  src={event.coverImage || "/images/event-placeholder.jpg"} 
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg text-center min-w-[65px] border border-[#C4A45F]/20">
                  <span className="block text-xl font-black text-[#23140c] leading-none">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="block text-[10px] font-black text-[#C4A45F] uppercase mt-1">
                    {new Date(event.date).toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-4">
                  <MapPin size={14} className="text-[#C4A45F]" />
                  <span className="truncate font-medium">{event.location}</span>
                </div>
                
                <h3 className="text-xl font-serif font-bold text-[#23140c] mb-6 group-hover:text-[#754D25] transition-colors line-clamp-2 leading-tight flex-1">
                  {event.title}
                </h3>
                
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#754D25]">
                    Detalhes do Evento
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#fcfbf9] flex items-center justify-center group-hover:bg-[#C4A45F] group-hover:text-white transition-all">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}