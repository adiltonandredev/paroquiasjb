"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteSettings } from "@/config/settings";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "História", href: "/historia" },
    { name: "Horários", href: "/horarios" },
    { name: "Fale Conosco", href: "/contato" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-md py-2" 
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-6 flex items-center h-16">
        
        {/* 1. LOGO (Buscando das configurações) */}
        <Link href="/" className="shrink-0">
          <img 
            src="/images/logo.png" // No projeto real, usar logic do settings
            alt={siteSettings.general.name}
            className={cn(
              "h-12 w-auto transition-all",
              isScrolled ? "brightness-100" : "brightness-0 invert" // Inverte para branco se não rolou
            )}
          />
        </Link>

        {/* 2. MENU ALINHADO À ESQUERDA COM ESPAÇO (ml-10) */}
        <nav className="hidden md:flex items-center ml-10 flex-grow">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-bold tracking-widest px-4 transition-colors",
                isScrolled ? "text-primary hover:text-secondary" : "text-white hover:text-gray-200"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* 3. COMPONENTE DE PESQUISA (Igual ao print) */}
        <div className="hidden md:flex items-center ml-auto">
          <form className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Buscar..." 
              className={cn(
                "px-4 py-1.5 rounded-full border text-sm outline-none transition-all w-48 focus:w-64",
                isScrolled 
                  ? "bg-white border-gray-300 text-primary" 
                  : "bg-white/10 border-white/20 text-white placeholder:text-gray-300 backdrop-blur-sm"
              )}
            />
            <button type="submit" className="absolute right-3">
              <Search className={cn("h-4 w-4", isScrolled ? "text-secondary" : "text-white")} />
            </button>
          </form>
        </div>

        {/* Botão Mobile */}
        <button className="md:hidden ml-auto p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} className={isScrolled ? "text-primary" : "text-white"} />}
        </button>
      </div>

      {/* Menu Mobile Gaveta */}
      <div className={cn(
        "md:hidden absolute top-full left-0 w-full bg-white transition-all shadow-xl overflow-hidden",
        isMenuOpen ? "max-h-screen border-t" : "max-h-0"
      )}>
        <nav className="flex flex-col p-6 space-y-4">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-primary font-bold uppercase text-sm tracking-widest">
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}