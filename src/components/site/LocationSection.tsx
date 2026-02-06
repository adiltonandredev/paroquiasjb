import { siteSettings } from "@/config/settings";
import { MapPin, Navigation, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LocationSection() {
  // CORREÇÃO: Removido o prefixo errado. Agora usa o link direto do Google Maps.
  const mapQuery = encodeURIComponent(`${siteSettings.general.name} ${siteSettings.contact.address}`);
  // Usando https seguro e o endpoint padrão de embed
  const mapUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section className="relative py-24 bg-zinc-950 overflow-hidden text-white border-t border-white/5">
      
      {/* --- EFEITOS DE FUNDO (AMBIENT LIGHTING) --- */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-900/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* 1. LADO ESQUERDO: Texto Impactante */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-amber-500/50"></span>
                <span className="text-amber-500 uppercase tracking-[0.2em] text-xs font-bold">Localização</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
                Um lugar de <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-500">
                  Encontro e Fé.
                </span>
              </h2>
            </div>

            <p className="text-zinc-400 text-lg leading-relaxed max-w-md border-l-2 border-zinc-800 pl-6">
              Nossa igreja está de portas abertas no coração da cidade. 
              Venha sentir a paz deste lugar sagrado.
            </p>

            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center gap-4 text-zinc-300">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <MapPin size={18} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Endereço</p>
                  <p className="font-medium">{siteSettings.contact.address}</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} 
                target="_blank" 
                rel="noreferrer"
              >
                <Button 
                  className="group relative h-14 px-8 bg-white text-zinc-950 font-bold text-base hover:bg-blue-50 transition-all duration-300 overflow-hidden border-none"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Traçar Rota Agora <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </a>
            </div>
          </div>

          {/* 2. LADO DIREITO: O Mapa "Janela" */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-amber-500 rounded-[2rem] opacity-20 blur group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative h-[400px] w-full bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
              <iframe 
                width="100%" 
                height="100%" 
                src={mapUrl}
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                className="grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-100 group-hover:scale-105"
              />
              
              <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/80 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center justify-between transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                <div>
                  <p className="text-white text-sm font-bold">Paróquia São João Batista</p>
                  <p className="text-zinc-400 text-xs">Presidente Médici - RO</p>
                </div>
                <div className="bg-white/10 p-2 rounded-full text-white">
                  <Navigation size={16} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}