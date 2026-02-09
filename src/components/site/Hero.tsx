"use client";

import { useState, useEffect } from "react";
import { HeroService } from "@/services/hero-service";
import { HeroSlide } from "@/types";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    HeroService.getSlides().then(setSlides);
  }, []);

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

  if (slides.length === 0) return <div className="h-[600px] bg-muted animate-pulse" />;

  const slide = slides[current];

  return (
    <section className="relative h-[100vh] md:h-[100vh] min-h-[600px] w-full overflow-hidden bg-black group">
      
      {/* --- CARROSSEL DE FUNDO --- */}
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
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[8000ms] ease-linear"
            style={{ 
              backgroundImage: `url('${item.backgroundImageUrl}')`,
              transform: index === current ? "scale(110%)" : "scale(100%)"
            }}
          />
          
          {/* --- O DEGRADÊ MARROM (RESTORED) --- */}
          {/* Começa Marrom (#754D25) na esquerda e fica transparente na direita */}
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to right, rgba(117, 77, 37, 0.95) 0%, rgba(117, 77, 37, 0.8) 40%, transparent 100%)"
            }}
          />

          {/* Sombra extra no rodapé para destacar os controles */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      ))}

      {/* --- CONTEÚDO (TEXTOS) --- */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-6 md:px-12">
          
          <div key={current} className="max-w-3xl flex flex-col items-start text-left animate-in fade-in slide-in-from-left-8 duration-700">
            
            {/* Badge Dourada */}
            <span 
                className="inline-flex items-center py-1 px-3 rounded-full border font-bold tracking-wider uppercase text-xs mb-6 backdrop-blur-md"
                style={{ 
                    backgroundColor: "rgba(196, 164, 95, 0.2)", // Dourado transparente
                    borderColor: "#C4A45F", 
                    color: "#C4A45F" 
                }}
            >
              <span className="w-2 h-2 rounded-full bg-[#C4A45F] mr-2 animate-pulse"/>
              {slide.subtitle}
            </span>

            {/* Título Principal */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif text-white leading-tight drop-shadow-lg mb-6">
              {slide.titleRest} <br/>
              <span className="italic" style={{ color: "#C4A45F" }}> {/* Dourado */}
                {slide.titleHighlight}
              </span>
            </h1>

            {/* Descrição (Branca sobre o degradê marrom = Leitura Perfeita) */}
            <p className="text-lg text-white/95 max-w-xl leading-relaxed mb-8 font-light drop-shadow-sm">
              {slide.description}
            </p>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              
              {/* Botão Marrom Sólido + Texto Branco */}
              <Link href={slide.primaryButton.url}>
                <Button 
                    size="lg" 
                    className="h-14 px-8 text-base font-bold shadow-lg shadow-black/20 w-full sm:w-auto border border-white/10"
                    style={{ backgroundColor: "#754D25", color: "#FFFFFF" }}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  {slide.primaryButton.text}
                </Button>
              </Link>
              
              {/* Botão Transparente */}
              <Link href={slide.secondaryButton.url}>
                <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-14 px-8 text-base bg-transparent border-white/40 text-white hover:bg-white hover:text-[#754D25] w-full sm:w-auto backdrop-blur-sm"
                >
                  {slide.secondaryButton.text}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* --- SETAS DE NAVEGAÇÃO --- */}
      <div className="absolute bottom-8 right-8 z-30 flex gap-2">
        <button 
          onClick={prevSlide}
          className="p-3 rounded-full bg-black/20 text-white border border-white/20 hover:bg-[#C4A45F] hover:border-[#C4A45F] transition-all backdrop-blur-sm"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="p-3 rounded-full bg-black/20 text-white border border-white/20 hover:bg-[#C4A45F] hover:border-[#C4A45F] transition-all backdrop-blur-sm"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* --- BARRA DE PROGRESSO --- */}
      <div className="absolute bottom-0 left-0 w-full flex z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={cn(
              "h-1.5 flex-1 transition-all duration-500 ease-out",
              idx === current ? "bg-[#C4A45F]" : "bg-white/20 hover:bg-white/40"
            )}
          />
        ))}
      </div>

    </section>
  );
}