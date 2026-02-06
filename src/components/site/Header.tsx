"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Church } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteSettings } from "@/config/settings"; // Buscando da config centralizada

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Efeito para detectar rolagem
  useEffect(() => {
    const handleScroll = () => {
      // Se rolar mais de 50px, ativa o modo "Scrolled"
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Lista de Links (Futuramente virá da API/Admin)
  const navLinks = [
    { name: "Início", href: "/" },
    { name: "História", href: "/historia" },
    { name: "Horários", href: "/horarios" },
    { name: "Fale Conosco", href: "/contato" },
  ];

  // Definição de Cores baseada no estado do Scroll
  // Topo: Texto Branco | Rolou: Texto Escuro/Primary
  const textColorClass = isScrolled ? "text-gray-700 hover:text-primary" : "text-white hover:text-gray-200 drop-shadow-md";
  const logoColorClass = isScrolled ? "text-primary" : "text-white drop-shadow-md";
  const buttonVariant = isScrolled ? "primary" : "outline"; // Botão muda de estilo também

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-md py-2" // ROLAGEM: Branco quase sólido (10% transp)
          : "bg-transparent py-4"                           // TOPO: 100% Transparente (90% transp visual)
      )}
    >
      <div className="container mx-auto max-w-7xl flex items-center justify-between px-6 h-20">
        
        {/* 1. Logo (Buscando de settings) */}
        <Link href="/" className={cn("flex items-center gap-2 font-bold text-xl font-serif transition-colors", logoColorClass)}>
          <Church className="h-6 w-6" />
          <span>{siteSettings.general.logoText}</span>
        </Link>

        {/* 2. Menu Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn("text-sm font-medium transition-colors", textColorClass)}
            >
              {link.name}
            </Link>
          ))}
          
          <Link href="/design-system">
             {/* O botão muda de 'borda branca' para 'azul sólido' ao rolar */}
             <Button 
                size="sm" 
                variant={isScrolled ? "primary" : "outline"} 
                className={!isScrolled ? "border-white text-white hover:bg-white hover:text-primary" : ""}
             >
                Área Restrita
             </Button>
          </Link>
        </nav>

        {/* 3. Botão Menu Mobile */}
        <button 
          className={cn("md:hidden p-2 transition-colors", isScrolled ? "text-gray-600" : "text-white")} 
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* 4. Menu Mobile (Gaveta) */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t shadow-lg animate-in slide-in-from-top-5">
          <nav className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-base font-medium text-gray-700 hover:text-primary p-2 rounded-md hover:bg-gray-50"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 border-t">
              <Link href="/design-system" onClick={() => setIsMenuOpen(false)}>
                 <Button className="w-full">Área Restrita</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}