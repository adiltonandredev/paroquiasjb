"use client"; // Obrigatório para animações e interatividade

import { useState, useEffect } from "react";
import { HeroService } from "@/services/hero-service";
import { HeroSlide } from "@/types";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [current, setCurrent] = useState(0);

  // 1. Busca os dados ao carregar
  useEffect(() => {
    HeroService.getSlides().then(setSlides);
  }, []);

  // 2. Rotação Automática (a cada 6 segundos)
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [current, slides.length]);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Se ainda não carregou os dados, mostra um esqueleto simples
  if (slides.length === 0) return <div className="h-[92vh] bg-black animate-pulse" />;

  const slide = slides[current];

  return (
    <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden bg-black group">
      
      {/* --- CARROSSEL DE IMAGENS --- */}
      {slides.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out",
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          {/* Imagem de Fundo */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[6000ms] ease-linear scale-105"
            style={{ 
              backgroundImage: `url('${item.backgroundImageUrl}')`,
              transform: index === current ? "scale(110%)" : "scale(100%)" // Efeito Zoom lento
            }}
          />
          {/* Película Escura */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/80" />
        </div>
      ))}

      {/* --- CONTEÚDO DO TEXTO --- */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center flex flex-col items-center">
          
          {/* O texto muda com key={current} para reiniciar a animação */}
          <div key={current} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium tracking-wider uppercase text-sm mb-6">
              {slide.subtitle}
            </span>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif text-white leading-tight drop-shadow-2xl max-w-4xl">
              {slide.titleRest} <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                {slide.titleHighlight}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed mt-6 mb-10 opacity-90">
              {slide.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={slide.primaryButton.url}>
                <Button size="lg" className="h-14 px-8 text-lg gap-3 font-semibold shadow-lg hover:scale-105 transition-all">
                  <Calendar className="w-5 h-5" />
                  {slide.primaryButton.text}
                </Button>
              </Link>
              
              <Link href={slide.secondaryButton.url}>
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg gap-3 font-semibold border-white/50 text-white hover:bg-white hover:text-gray-900 hover:scale-105 transition-all">
                  <Heart className="w-5 h-5" />
                  {slide.secondaryButton.text}
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* --- CONTROLES (Setas) --- */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 text-white backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary"
      >
        <ChevronLeft size={32} />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 text-white backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary"
      >
        <ChevronRight size={32} />
      </button>

      {/* --- INDICADORES (Bolinhas) --- */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              idx === current ? "bg-primary w-8" : "bg-white/50 hover:bg-white"
            )}
          />
        ))}
      </div>

      {/* Degradê Inferior Suave (Mantenha o mesmo que você gostou) */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 via-gray-50/60 to-transparent z-10 pointer-events-none" />

    </section>
  );
}