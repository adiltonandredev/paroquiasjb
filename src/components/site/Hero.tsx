"use client";

import { Button } from "@/components/admin/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface HeroSlide {
  id: number;
  titleRest: string;
  titleHighlight: string;
  subtitle: string;
  description: string;
  backgroundImageUrl: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
}

export function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. RESTAURADA: Lógica de carregamento de dados
  useEffect(() => {
    async function loadBanners() {
      try {
        const res = await fetch("/api/hero", { 
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (res.ok) {
          const data = await res.json();
          setSlides(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Erro ao carregar banners:", error);
      } finally {
        setLoading(false);
      }
    }
    loadBanners();
  }, []);

  // 2. RESTAURADA: Lógica do Timer automático
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(timer);
  }, [current, slides.length]);

  const handleNext = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const handlePrev = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#23140c] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#C4A45F] animate-spin" />
      </div>
    );
  }

  if (slides.length === 0) return null;
  const slide = slides[current];

  return (
    <section className="relative h-screen lg:h-[85vh] w-full overflow-hidden bg-black">

      {/* IMAGENS DE FUNDO */}
      {slides.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-1000",
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms]"
            style={{
              backgroundImage: `url('${item.backgroundImageUrl}')`,
              transform: index === current ? "scale(1.1)" : "scale(1)"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#23140c]/90 via-[#23140c]/40 to-transparent" />
        </div>
      ))}

      {/* CONTEÚDO */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 animate-in fade-in slide-in-from-left-10 duration-1000">
            <span className="inline-flex items-center py-1 px-4 rounded-full border border-[#C4A45F]/50 text-[#C4A45F] text-[10px] font-bold uppercase mb-6 bg-black/20 backdrop-blur-sm tracking-[0.2em]">
              {slide.subtitle}
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              {slide.titleRest}
              {slide.titleHighlight && (
                <span className="italic block text-[#C4A45F] font-normal">
                  {slide.titleHighlight}
                </span>
              )}
            </h1>

            <p className="text-lg text-white/70 max-w-xl mb-10 leading-relaxed font-light">
              {slide.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href={slide.primaryButtonUrl}>
                <Button className="bg-[#C4A45F] hover:bg-[#a3864d] text-white h-14 px-10 rounded-full transition-all shadow-xl font-bold uppercase text-xs tracking-widest border-none">
                  {slide.primaryButtonText}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLES (NEXT/PREV) */}
      <div className="absolute bottom-10 right-10 z-30 flex items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#C4A45F] hover:border-[#C4A45F] transition-all group"
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#C4A45F] hover:border-[#C4A45F] transition-all group"
          >
            <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="h-12 flex items-center px-6 rounded-full border border-white/10 bg-black/20 backdrop-blur-md text-white font-mono text-sm">
          <span className="text-[#C4A45F] font-bold">{String(current + 1).padStart(2, '0')}</span>
          <span className="mx-2 opacity-30">/</span>
          <span className="opacity-50">{String(slides.length).padStart(2, '0')}</span>
        </div>
      </div>

      {/* BARRA DE PROGRESSO */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-30">
        <div
          className="h-full bg-[#C4A45F] transition-all duration-[8000ms] ease-linear"
          style={{ width: `${((current + 1) / slides.length) * 100}%` }}
        />
      </div>
    </section>
  );
}