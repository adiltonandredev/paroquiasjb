import { prisma } from "@/lib/prisma";
import { Clock, MapPin, Calendar, Navigation } from "lucide-react";

interface MassData {
  id: number;
  dayOfWeek: number;
  time: string;
  location: string;
}

export default async function MissasPage() {
  // Busca todas as missas cadastradas no painel
  const allMasses = await prisma.massSchedule.findMany({
    orderBy: [
      { dayOfWeek: 'asc' },
      { time: 'asc' }
    ]
  }) as MassData[];

  const diasSemana = [
    "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
    "Quinta-feira", "Sexta-feira", "Sábado"
  ];

  return (
    <main className="min-h-screen bg-[#fcfbf9] pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">

        {/* Cabeçalho Editorial - Mantido igual */}
        <header className="mb-16 border-l-4 border-[#C4A45F] pl-6">
          <span className="text-[#C4A45F] text-xs font-black uppercase tracking-[0.4em] block mb-2">
            Horários das Celebrações
          </span>
          <h1 className="text-5xl font-serif font-bold text-[#23140c]">
            Agenda das <span className="italic font-normal text-gray-400">Celebrações</span>
          </h1>
        </header>

        <div className="space-y-12">
          {diasSemana.map((dia, index) => {
            const missasDoDia = allMasses.filter(m => Number(m.dayOfWeek) === index);
            if (missasDoDia.length === 0) return null;

            return (
              <section key={dia} className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8 border-b border-gray-50 pb-6">
                  <div className="w-12 h-12 bg-[#fcfbf9] rounded-2xl flex items-center justify-center text-[#C4A45F]">
                    <Calendar size={24} />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-[#23140c]">{dia}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {missasDoDia.map((missa) => (
                    /* ALTERAÇÃO AQUI: Envolvendo em um link dinâmico */
                    <a
                      key={missa.id}
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(missa.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-5 p-6 rounded-[2rem] bg-[#fcfbf9] border border-gray-50 hover:shadow-md hover:border-[#C4A45F]/30 transition-all group cursor-pointer"
                      title="Clique para ver no mapa"
                    >
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#23140c] shadow-sm group-hover:bg-[#C4A45F] group-hover:text-white transition-colors">
                        <Navigation size={22} className="group-hover:animate-pulse" />
                      </div>
                      <div>
                        <p className="text-2xl font-serif font-bold text-[#23140c]">
                          {missa.time}h
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C4A45F] flex items-center gap-1 mt-1">
                          <MapPin size={10} /> {missa.location}
                        </p>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter group-hover:text-[#754D25] transition-colors">
                          Ver como chegar →
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}