import { siteSettings } from "@/config/settings";
import { MapPin, Navigation, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LocationSection() {
  const mapQuery = encodeURIComponent(`${siteSettings.general.name} ${siteSettings.contact.address}`);
  const mapUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  
  const goldColor = "#C4A45F";
  const midBrown = "#754D25";

  return (
    <section 
        className="relative py-24 overflow-hidden text-white border-t border-white/5"
        style={{ backgroundColor: "#23140c" }} 
    >
      {/* 1. IMAGEM DE FUNDO FIXA (Efeito Parallax) */}
      <div 
        className="absolute inset-0 z-0 opacity-20 mix-blend-overlay pointer-events-none"
        style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed" // <--- O SEGREDO ESTÁ AQUI (Fixa a imagem)
        }}
      />
      
      {/* Luzes Ambientais */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] blur-[120px] rounded-full pointer-events-none opacity-20" style={{ backgroundColor: goldColor }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] blur-[100px] rounded-full pointer-events-none opacity-30" style={{ backgroundColor: midBrown }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LADO ESQUERDO: Texto */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8" style={{ backgroundColor: goldColor }}></span>
                <span className="uppercase tracking-[0.2em] text-xs font-bold" style={{ color: goldColor }}>
                    Localização
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
                Um lugar de <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5C2] to-[#C4A45F]">
                  Encontro e Fé.
                </span>
              </h2>
            </div>

            <p className="text-gray-400 text-lg leading-relaxed max-w-md border-l-2 border-white/10 pl-6">
              Nossa igreja está de portas abertas no coração da cidade. 
              Venha sentir a paz deste lugar sagrado.
            </p>

            {/* Informações */}
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center gap-4 text-gray-300">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                  <MapPin size={20} style={{ color: goldColor }} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Endereço</p>
                  <p className="font-medium text-white">{siteSettings.contact.address}</p>
                </div>
              </div>
            </div>

            {/* Botão */}
            <div className="pt-4">
              <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer">
                <Button 
                  className="group relative h-14 px-8 font-bold text-base transition-all duration-300 overflow-hidden border-none text-white shadow-lg shadow-black/30"
                  style={{ backgroundColor: midBrown }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Traçar Rota Agora <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C4A45F]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </a>
            </div>
          </div>

          {/* LADO DIREITO: Card do Mapa */}
          <div className="relative group h-[450px] w-full rounded-[2rem] shadow-2xl overflow-hidden border border-white/10">
            
            {/* Imagem de Fundo do Card (Também com zoom suave) */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-50"
                style={{ 
                    backgroundImage: "url('https://images.unsplash.com/photo-1548625361-ec8fdea2f16d?q=80&w=2500&auto=format&fit=crop')",
                }}
            />
            
            <div className="absolute inset-0 bg-[#23140c]/60 z-0" />

            <iframe 
              width="100%" 
              height="100%" 
              src={mapUrl}
              style={{ border: 0, filter: "grayscale(100%) invert(0%) contrast(1.2)" }} 
              allowFullScreen 
              loading="lazy" 
              className="relative z-10 opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700 scale-100"
            />
            
            <div className="absolute bottom-6 left-6 right-6 z-20 bg-[#23140c]/90 backdrop-blur-md p-4 rounded-xl border border-[#C4A45F]/30 flex items-center justify-between opacity-100 transition-all duration-500 shadow-xl">
              <div>
                <p className="text-white text-sm font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Paróquia São João Batista
                </p>
                <p className="text-gray-400 text-xs pl-4">Presidente Médici - RO</p>
              </div>
              <div className="bg-white/10 p-2 rounded-full text-[#C4A45F]">
                <Navigation size={18} />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}