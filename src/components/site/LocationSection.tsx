"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/admin/ui/button";
import { siteSettings } from "@/config/settings";
import { ArrowRight, MapPin, Navigation, Loader2 } from "lucide-react";

interface SiteSettingsData {
  nome_paroquia?: string | null;
  endereco?: string | null;
  cidade?: string | null;
  estado?: string | null;
}

export function LocationSection() {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const goldColor = "#C4A45F";
  const midBrown = "#754D25";

  useEffect(() => {
    async function fetchData() {
      try {
        const settingsRes = await fetch("/api/settings", { cache: 'no-store' });
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings(settingsData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados na localização:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const nomeParoquia = settings?.nome_paroquia || siteSettings.general.name;
  const enderecoCompleto = settings?.endereco 
    ? `${settings.endereco}${settings.cidade ? `, ${settings.cidade}` : ''}${settings.estado ? ` - ${settings.estado}` : ''}`
    : siteSettings.contact.address;

  const mapQuery = encodeURIComponent(`${nomeParoquia}, ${enderecoCompleto}`);
  const simpleMapUrl = `https://www.google.com/maps/embed/v1/place?key=SUA_CHAVE_AQUI&q=${mapQuery}`; 
  // Nota: Para o iframe funcionar 100% sem erros de política de segurança, 
  // o ideal é usar a URL de embed padrão ou manter a sua lógica de query anterior.
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section 
        className="relative py-24 overflow-hidden text-white border-t border-white/5"
        style={{ backgroundColor: "#23140c" }} 
    >
      <div 
        className="absolute inset-0 z-0 opacity-20 mix-blend-overlay pointer-events-none"
        style={{ 
            backgroundImage: "url('/images/bg_church.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed"
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8" style={{ backgroundColor: goldColor }}></span>
                <span className="uppercase tracking-[0.2em] text-xs font-bold" style={{ color: goldColor }}>
                    Localização da Matriz
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
                Um lugar de <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5C2] to-[#C4A45F]">
                  Encontro e Fé.
                </span>
              </h2>
            </div>

            <div className="flex flex-col gap-6 pt-4">
              {/* INFO: Endereço Dinâmico */}
              <div className="flex items-start gap-4 text-gray-300">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                  <MapPin size={20} style={{ color: goldColor }} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Endereço Principal</p>
                  <p className="font-medium text-lg text-white leading-snug">
                    {isLoading ? "Carregando endereço..." : enderecoCompleto}
                  </p>
                </div>
              </div>
            </div>

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
          <div className="relative group h-[500px] w-full rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
            {isLoading ? (
              <div className="w-full h-full bg-[#1a0f09] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#C4A45F] animate-spin" />
              </div>
            ) : (
              <iframe 
                width="100%" 
                height="100%" 
                src={mapEmbedUrl}
                style={{ border: 0, filter: "grayscale(100%) invert(90%) contrast(1.2) opacity(0.6)" }} 
                allowFullScreen 
                loading="lazy" 
                className="relative z-10 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 group-hover:filter-none"
              />
            )}
            
            <div className="absolute bottom-8 left-8 right-8 z-20 bg-[#23140c]/80 backdrop-blur-xl p-5 rounded-2xl border border-[#C4A45F]/30 flex items-center justify-between shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
              <div>
                <p className="text-white text-base font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  {nomeParoquia}
                </p>
                <p className="text-gray-400 text-xs pl-4">Abra no Maps para navegar</p>
              </div>
              <div className="bg-[#C4A45F] p-3 rounded-xl text-white shadow-lg">
                <Navigation size={20} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}