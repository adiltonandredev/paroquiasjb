"use client";

import { Button } from "@/components/admin/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

// Tipagem exata para garantir sincronia com o servidor
export interface HeroSlide {
  id: string;
  titleRest: string;
  titleHighlight: string;
  subtitle: string;
  description: string;
  backgroundImageUrl: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
}

export function Hero({ initialSlides }: { initialSlides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  // 1. Hook para evitar Hydration Error: Garante que o cliente só renderize após montar
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Hook para o Timer do Carrossel
  useEffect(() => {
    if (!mounted || !initialSlides || initialSlides.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === initialSlides.length - 1 ? 0 : prev + 1));
    }, 8000);
    
    return () => clearInterval(timer);
  }, [current, initialSlides?.length, mounted]);

  const handleNext = () => setCurrent((prev) => (prev === initialSlides.length - 1 ? 0 : prev + 1));
  const handlePrev = () => setCurrent((prev) => (prev === 0 ? initialSlides.length - 1 : prev - 1));

  // Enquanto o React não "montar" no navegador, retornamos um esqueleto com a mesma altura
  // Isso evita o erro de "HTML mismatch" entre servidor e cliente
  if (!mounted) {
    return <section className="relative h-screen lg:h-[85vh] w-full bg-[#23140c]" />;
  }

  if (!initialSlides || initialSlides.length === 0) return null;
  
  const slide = initialSlides[current];

  return (
    <section className="relative h-screen lg:h-[85vh] w-full overflow-hidden bg-black">
      {/* IMAGENS DE FUNDO */}
      {initialSlides.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-1000",
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          <Image
            src={item.backgroundImageUrl || "/placeholder.jpg"}
            alt={item.titleRest}
            fill
            priority={index === 0}
            className={cn(
                "object-cover transition-transform duration-[10000ms]",
                index === current ? "scale(1.1)" : "scale(1)"
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#23140c]/90 via-[#23140c]/40 to-transparent" />
        </div>
      ))}

      {/* CONTEÚDO DINÂMICO */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 animate-in fade-in slide-in-from-left-10 duration-1000">
            <span className="inline-flex items-center py-1 px-4 rounded-full border border-[#C4A45F]/50 text-[#C4A45F] text-[10px] font-bold uppercase mb-6 bg-black/20 backdrop-blur-sm tracking-[0.2em]">
              {slide.subtitle}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight text-balance">
              {slide.titleRest}
            </h1>
            <div className="flex flex-wrap gap-4 mt-8">
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

      {/* CONTROLES NAVEGAÇÃO */}
      <div className="absolute bottom-10 right-10 z-30 flex items-center gap-4">
        <div className="flex gap-2">
          <button onClick={handlePrev} className="w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#C4A45F] transition-all group">
            <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button onClick={handleNext} className="w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#C4A45F] transition-all group">
            <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}