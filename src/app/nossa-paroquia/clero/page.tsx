"use client";

import { useState, useEffect } from "react";
import { Users, ArrowLeft, Loader2, ShieldCheck, Heart, BookOpen } from "lucide-react";
import Link from "next/link";

interface SiteSettingsData {
  paroco?: string | null;
  paroco_foto?: string | null;
  paroco_bio?: string | null;
  vigarios?: string | null; // Ajustado para o nome usado no seu painel
  religiosos?: string | null; // Adicionado campo dos Irmãos
  nome_paroquia?: string | null;
}

export default function CleroPage() {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const goldColor = "#C4A45F";

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do clero:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#23140c] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#C4A45F]" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#23140c] text-white">
      {/* SEÇÃO HEADER */}
      <section className="relative py-24 overflow-hidden border-b border-white/5">
        <div 
          className="absolute inset-0 z-0 opacity-10 mix-blend-overlay pointer-events-none"
          style={{ 
            backgroundImage: "url('/images/bg_church.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[#C4A45F] hover:text-white transition-all mb-12 text-xs uppercase font-bold tracking-[0.2em] group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Voltar ao Início
          </Link>

          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8" style={{ backgroundColor: goldColor }}></span>
              <span className="uppercase tracking-[0.2em] text-xs font-bold" style={{ color: goldColor }}>
                Vida Consagrada
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-8">
              Nossa <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5C2] to-[#C4A45F]">Equipe de Fé.</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl">
              Conheça os sacerdotes e irmãos da Copiosa Redenção que dedicam suas vidas ao pastoreio da {settings?.nome_paroquia || "nossa comunidade"}.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO CONTEÚDO */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* LADO ESQUERDO: Foto do Pároco */}
            <div className="lg:col-span-5">
              <div className="sticky top-24">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-b from-[#C4A45F] to-transparent rounded-[2rem] blur opacity-20 transition duration-1000"></div>
                  <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-[#1a0f09]">
                    {settings?.paroco_foto ? (
                      <img 
                        src={settings.paroco_foto} 
                        alt={settings.paroco || "Pároco"} 
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-700">
                        <Users size={80} strokeWidth={1} />
                        <p className="mt-4 text-[10px] uppercase tracking-widest font-bold">Foto em atualização</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-10 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <h2 className="text-3xl font-serif font-bold text-white mb-2">
                    {settings?.paroco || "Pe. Sergio Kalizak, CR"}
                  </h2>
                  <div className="flex items-center gap-2 text-[#C4A45F] font-bold text-xs uppercase tracking-widest">
                    <ShieldCheck size={16} />
                    Pároco Responsável
                  </div>
                </div>
              </div>
            </div>

            {/* LADO DIREITO: Biografia e Equipe */}
            <div className="lg:col-span-7 space-y-20">
              
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <Heart size={20} style={{ color: goldColor }} />
                  <h3 className="text-2xl font-serif font-bold text-white">Nossa História</h3>
                </div>
                <div className="text-gray-300 text-lg leading-relaxed space-y-6 text-justify font-light whitespace-pre-line">
                  {settings?.paroco_bio || (
                    "Informações sobre a caminhada vocacional e administrativa de nosso pároco estão sendo preparadas para melhor acolher o fiel."
                  )}
                </div>
              </div>

              {/* GRUPO DE CARDS: VIGÁRIOS E IRMÃOS */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <Users size={20} style={{ color: goldColor }} />
                  <h3 className="text-2xl font-serif font-bold text-white">Comunidade Religiosa</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* CARD: Vigários */}
                  <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 relative overflow-hidden group">
                    <h4 className="text-[#C4A45F] font-bold text-xs uppercase tracking-[0.2em] mb-4">Vigários Auxiliares</h4>
                    <p className="text-white text-lg font-serif leading-relaxed whitespace-pre-line">
                      {settings?.vigarios || "Pe. Luis Cezar, CR\nPe. Higor, CR"}
                    </p>
                  </div>

                  {/* CARD: Irmãos (Campo Religiosos) */}
                  <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                      <BookOpen size={60} style={{ color: goldColor }} />
                    </div>
                    <h4 className="text-[#C4A45F] font-bold text-xs uppercase tracking-[0.2em] mb-4">Irmãos Consagrados</h4>
                    <p className="text-white text-lg font-serif leading-relaxed whitespace-pre-line">
                      {settings?.religiosos || "Irmãos da Copiosa Redenção"}
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD: Congregação */}
              <div 
                className="p-8 rounded-[2rem] bg-[#C4A45F]/10 border border-[#C4A45F]/20 cursor-pointer hover:bg-[#C4A45F]/20 transition-all duration-500"
                onClick={() => window.open('https://copiosaredencao.org.br/', '_blank')}
              >
                <h4 className="text-[#C4A45F] font-bold text-xs uppercase tracking-[0.2em] mb-6">Site Oficial</h4>
                <img 
                  src="/images/logotipo_oficial_horizontal.png" 
                  alt="Copiosa Redenção" 
                  className="h-12 w-auto brightness-0 invert opacity-80 mb-4"
                />
                <p className="text-xs text-gray-400 italic">Clique aqui para conhecer mais sobre o carisma da Copiosa Redenção.</p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}