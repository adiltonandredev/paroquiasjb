"use client";

import { useEffect, useState } from "react";
import { Calendar, MapPin, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  slug: string;
  coverImage?: string;
}

export function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/events?limit=3");
        if (res.ok) {
          const data = await res.json();
          setEvents(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  // REGRA DE OURO: Se não estiver carregando e não houver eventos, OCULTA a seção
  if (!loading && events.length === 0) return null;

  return (
    <section className="py-24 bg-[#fcfbf9]">
      <div className="container mx-auto px-6">
        
        {/* Cabeçalho Editorial */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-[#C4A45F] text-xs font-black uppercase tracking-[0.4em] block mb-4">
              Programe-se
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#23140c]">
              Próximos <span className="italic font-normal">Eventos</span>
            </h2>
          </div>
          <Link 
            href="/eventos" className="text-[#754D25] font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            Ver Agenda Completa 
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#C4A45F] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Link 
                key={event.id}
                href={`/eventos/${event.slug}`}
                className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* Data Flutuante Estilizada */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.coverImage || "/images/event-placeholder.jpg"} 
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-white rounded-2xl p-3 shadow-lg text-center min-w-[60px]">
                    <span className="block text-lg font-bold text-[#23140c] leading-none">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="block text-[10px] font-black text-[#C4A45F] uppercase">
                      {new Date(event.date).toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                    <MapPin size={14} className="text-[#C4A45F]" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#23140c] mb-4 group-hover:text-[#C4A45F] transition-colors">
                    {event.title}
                  </h3>
                  <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-[#754D25]">
                    Detalhes do Evento
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}