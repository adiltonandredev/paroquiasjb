import { prisma } from "@/lib/prisma";
import { Clock, MapPin } from "lucide-react";

interface MassData {
    id: number;
    dayOfWeek: number;
    time: string;
    location: string;
}

export async function DailyMass() {
    const hoje = new Date().getDay(); // 0-6 (Domingo a Sábado)
    
    // Busca apenas as missas/cultos do dia atual
    const missasHoje = await prisma.massSchedule.findMany({
        where: { dayOfWeek: hoje },
        orderBy: { time: 'asc' }
    }) as MassData[];

    if (missasHoje.length === 0) return null;

    // Local para o mapa (usa o local da primeira missa do dia)
    const localMapa = encodeURIComponent(missasHoje[0].location + " Igreja");

    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                    Missa de Hoje
                </span>
            </div>

            <div className="space-y-6 mb-8">
                {missasHoje.map((missa) => (
                    <div key={missa.id} className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-[#fcfbf9] rounded-2xl flex items-center justify-center text-[#C4A45F] group-hover:bg-[#C4A45F] group-hover:text-white transition-all">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-serif font-bold text-[#23140c]">{missa.time}</p>
                            <p className="text-gray-400 text-xs flex items-center gap-1 font-bold uppercase tracking-wider">
                                <MapPin size={12} className="text-[#C4A45F]" /> {missa.location}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mapa Integrado */}
            <div className="relative h-48 w-full rounded-[2rem] overflow-hidden border-4 border-[#fcfbf9]">
                <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(0.1)' }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps/embed/v1/place?key=SUA_CHAVE_AQUI&q=${localMapa}`}
                    // Nota: Se não tiver chave API, use o link embed padrão do Google Maps
                ></iframe>
            </div>
        </div>
    );
}