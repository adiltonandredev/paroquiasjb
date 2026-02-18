import { prisma } from "@/lib/prisma";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

// 1. ADICIONE ESTA INTERFACE (Isso mata os sublinhados no map)
interface EventData {
  id: number;
  name: string;
  slug?: string | null;
  title?: string | null;
  date: Date | string;
  location: string;
  coverImage?: string | null;
  description?: string | null;
}

export default async function AgendaCompletaPage() {
  // 2. BUSCA OS DADOS (Forçamos o tipo para EventData[])
  const events = await prisma.event.findMany({
    where: {
      date: { gte: new Date() }
    },
    orderBy: { date: 'asc' }
  }) as EventData[]; // <--- O SEGREDO ESTÁ AQUI

  return (
    <main className="min-h-screen bg-[#fcfbf9] pt-32 pb-20">
      <div className="container mx-auto px-6">

        {/* Cabeçalho no Padrão Editorial */}
        <div className="mb-16 border-l-4 border-[#C4A45F] pl-6">
          <span className="text-[#C4A45F] text-xs font-black uppercase tracking-[0.4em] block mb-2">
            Programação Paroquial
          </span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#23140c]">
            Agenda <span className="italic font-normal text-gray-400 text-4xl md:text-5xl">Completa</span>
          </h1>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
            <p className="text-gray-400 font-serif italic text-xl">Não há eventos agendados para os próximos dias.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/eventos/${event.slug || event.name || event.id}`}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
              >
                {/* Imagem com Data Flutuante */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={event.coverImage || "/images/event-placeholder.jpg"}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6 bg-white rounded-2xl p-3 shadow-xl text-center min-w-[65px] border border-gray-50">
                    <span className="block text-xl font-black text-[#23140c] leading-none">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="block text-[10px] font-black text-[#C4A45F] uppercase tracking-tighter">
                      {new Date(event.date).toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}
                    </span>
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-10 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">
                    <MapPin size={14} className="text-[#C4A45F]" />
                    <span className="font-bold uppercase tracking-wider truncate">{event.location}</span>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-[#23140c] mb-6 group-hover:text-[#C4A45F] transition-colors leading-tight">
                    {event.name || event.title}
                  </h3>

                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#754D25]">
                      Ver Detalhes
                    </span>
                    <ArrowRight size={18} className="text-[#C4A45F] transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}