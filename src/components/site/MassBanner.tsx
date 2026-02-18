"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Navigation, Clock, Loader2 } from "lucide-react";

interface MassData {
  id: number;
  title?: string | null;
  dayOfWeek: number;
  time: string;
  location: string;
}

export function MassBanner() {
  const [massesToday, setMassesToday] = useState<MassData[]>([]);
  const [massesTomorrow, setMassesTomorrow] = useState<MassData[]>([]);
  const [isTomorrow, setIsTomorrow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    async function fetchMasses() {
      try {
        const res = await fetch("/api/masses");
        if (res.ok) {
          const allMasses: MassData[] = await res.json();
          const agora = new Date();
          const horaAtual = agora.getHours() * 60 + agora.getMinutes();
          const diaHoje = agora.getDay();
          const diaAmanha = (diaHoje + 1) % 7;

          const hojeFiltradas = allMasses.filter(m => {
            if (Number(m.dayOfWeek) !== diaHoje) return false;
            const [hora, minuto] = m.time.split(':').map(Number);
            const horaMissa = hora * 60 + minuto;
            return horaMissa > horaAtual; 
          });

          setMassesToday(hojeFiltradas);
          setMassesTomorrow(allMasses.filter(m => Number(m.dayOfWeek) === diaAmanha));
        }
      } catch (error) {
        console.error("Erro ao buscar missas:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMasses();
    const intervalCheck = setInterval(fetchMasses, 60000); 
    return () => clearInterval(intervalCheck);
  }, []);

  useEffect(() => {
    if (massesToday.length === 0) {
      setIsTomorrow(true);
      return;
    }

    if (massesTomorrow.length > 0) {
      const interval = setInterval(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsTomorrow((prev) => !prev);
          setIsExiting(false);
        }, 500); 
      }, 9000);
      return () => clearInterval(interval);
    }
  }, [massesTomorrow, massesToday]);

  const currentMasses = isTomorrow ? massesTomorrow : massesToday;
  const label = isTomorrow ? "Amanhã" : "Hoje";

  return (
    <section className="container mx-auto px-6 mb-10 mt-6">
      <div className="bg-[#23140c] rounded-[3rem] p-4 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/5 relative overflow-hidden group">
        
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#C4A45F]/10 blur-[100px] rounded-full opacity-50"></div>

        {/* 1. Título do Bloco */}
        <div className="flex items-center gap-6 shrink-0 z-10 px-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#C4A45F] to-[#754D25] rounded-2xl flex items-center justify-center text-[#23140c] shadow-lg shadow-[#C4A45F]/20 transition-transform group-hover:rotate-3">
            <CalendarDays size={28} />
          </div>
          <div>
            <span className="text-[#C4A45F] text-[10px] font-black uppercase tracking-[0.4em] opacity-80">Próxima</span>
            <h2 className="text-3xl font-serif font-bold italic tracking-tight">Celebração</h2>
          </div>
        </div>

        {/* 2. Conteúdo Central (Slide Direita -> Esquerda) */}
        <div className="flex-1 w-full flex flex-col items-center md:items-start justify-center py-4 border-y md:border-y-0 md:border-x border-white/10 px-4 md:px-12 min-h-[130px] z-10 overflow-hidden">
          {isLoading ? (
            <Loader2 className="animate-spin text-[#C4A45F]" size={24} />
          ) : (
            <div 
              className={`transition-all duration-500 ease-out transform w-full ${
                isExiting 
                  ? "opacity-0 -translate-x-full" 
                  : "opacity-100 translate-x-0"   
              } ${isExiting ? "" : "animate-in slide-in-from-right-full"}`}
            >
              <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors duration-500 ${
                  isTomorrow ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' : 'border-[#C4A45F]/30 text-[#C4A45F] bg-[#C4A45F]/5'
                }`}>
                  {label}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isTomorrow ? 'bg-blue-400' : 'bg-[#C4A45F]'}`}></span>
              </div>
              
              <div className="space-y-1">
                {currentMasses.length > 0 ? (
                  currentMasses.slice(0, 1).map((missa) => (
                    <div key={missa.id} className="flex flex-col items-center md:items-start group/item">
                      
                      {/* TÍTULO DA CELEBRAÇÃO (EX: MISSA DE CINZAS) */}
                      <p className="text-[11px] font-serif italic text-gray-400 mb-1">
                        {missa.title || "Santa Missa"}
                      </p>

                      <div className="flex items-center gap-3 text-4xl font-serif font-bold text-white leading-none tracking-tight">
                        <Clock size={22} className="text-[#C4A45F] opacity-70" />
                        {missa.time}
                      </div>

                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=$${encodeURIComponent(missa.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-gray-400 hover:text-[#C4A45F] uppercase tracking-[0.2em] mt-3 flex items-center gap-2 transition-all"
                      >
                        <Navigation size={12} className="text-[#C4A45F] animate-bounce" /> 
                        {missa.location} <span className="underline decoration-[#C4A45F]/30 underline-offset-4 ml-1 italic font-normal">Traçar Rota</span>
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic text-sm font-serif">Nenhuma celebração próxima.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3. Botão de Agenda */}
        <div className="shrink-0 z-10 px-4">
          <Link href="/missas">
            <button className="group relative flex items-center gap-4 bg-white/5 hover:bg-[#C4A45F] px-8 py-4 rounded-[2rem] border border-white/10 transition-all duration-500">
              <span className="font-bold text-[10px] uppercase tracking-widest group-hover:text-[#23140c]">
                Agenda Completa
              </span>
              <ArrowRight size={16} className="group-hover:translate-x-1 group-hover:text-[#23140c] transition-all" />
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}