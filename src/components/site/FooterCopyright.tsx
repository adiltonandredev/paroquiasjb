"use client";

import { useState, useEffect } from "react";
import { Shield, Github, Linkedin, Instagram, MessageCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { siteSettings } from "@/config/settings";

// Interface para os dados do banco
interface SiteSettingsData {
  nome_paroquia?: string | null;
}

export function FooterCopyright() {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  // Busca as informações no banco ao carregar o componente
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings", { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Erro ao carregar settings no copyright:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const developerSocials = [
    {
      icon: MessageCircle,
      label: "Whatsapp",
      url: "https://wa.me/5569999772514",
      target: "_blank",
      hoverColor: "hover:text-green-500 hover:scale-110 transition-all"
    },
    {
      icon: Instagram,
      label: "Instagram",
      url: "https://instagram.com/adiltonandremcs",
      target: "_blank",
      hoverColor: "hover:text-pink-500 hover:scale-110 transition-all"
    },
    {
      icon: Linkedin,
      label: "Linkedin",
      url: "https://linkedin.com/in/adiltonandre",
      target: "_blank",
      hoverColor: "hover:text-blue-500 hover:scale-110 transition-all"
    },
    {
      icon: Github,
      label: "Github",
      url: "https://github.com/adiltonandredev",
      target: "_blank",
      hoverColor: "hover:text-white hover:scale-110 transition-all"
    },
  ];

  return (
    <div className="relative z-20 border-t border-white/5 bg-[#1a0f09] text-sm font-sans">
      <div className="container mx-auto px-6 py-6">

        {/* LINHA 1: Copyright dinâmico */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium mb-6">
          <p className="text-center md:text-left">
            © {currentYear} 
            <strong className="text-gray-400 ml-1">
              {isLoading ? (
                <span className="animate-pulse">Carregando...</span>
              ) : (
                // Prioriza o nome do banco, senão usa o arquivo de config
                settings?.nome_paroquia || siteSettings.general.name
              )}
            </strong>. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/privacidade" className="hover:text-[#C4A45F] transition-colors">Privacidade</Link>
            <Link href="/termos" className="hover:text-[#C4A45F] transition-colors">Termos de Uso</Link>
            <Link href="/login" className="flex items-center gap-1 hover:text-[#C4A45F] transition-colors text-gray-600 group">
              <Shield size={12} className="group-hover:text-[#C4A45F] transition-colors" />
              <span>Área Administrativa</span>
            </Link>
          </div>
        </div>

        {/* Divisor Fino */}
        <div className="w-full h-px bg-white/5 mb-6"></div>

        {/* LINHA 2: Desenvolvedor */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-[11px] text-gray-600 tracking-wide">
          <span className="flex items-center gap-1.5">
            Desenvolvido por <strong className="text-gray-500">Adilton Andre</strong>
          </span>

          <div className="hidden md:block w-px h-3 bg-white/10 mx-2"></div>

          <div className="flex items-center gap-4">
            {developerSocials.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target={social.target}
                rel="noopener noreferrer"
                title={social.label}
                className={`transition-all duration-300 ${social.hoverColor}`}
              >
                <social.icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}