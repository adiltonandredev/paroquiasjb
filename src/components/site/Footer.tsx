"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Instagram,
  Phone,
  MapPin,
  Smartphone,
  MessageCircle,
  Mail,
  Clock,
  Facebook,
  Youtube,
  Users,
  ChevronRight
} from "lucide-react";
import { siteSettings } from "@/config/settings";
import { FooterCopyright } from "./FooterCopyright";

interface SiteSettingsData {
  nome_paroquia?: string | null;
  endereco?: string | null;
  cidade?: string | null;
  estado?: string | null;
  telefone_fixo?: string | null;
  whatsapp?: string | null;
  email_secretaria?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  youtube?: string | null;
  logo_url?: string | null;
  texto_sobre?: string | null;
  horario_semana?: string | null;
  horario_sabado?: string | null;
  // Campos Dinâmicos do Clero
  paroco?: string | null; 
  paroco_foto?: string | null; 
  clero_auxiliar?: string | null;
}

export function Footer() {
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
        console.error("Erro ao carregar footer:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  return (
    <footer className="bg-[#23140c] text-gray-300 border-t border-[#C4A45F]/20 font-sans">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* COLUNA 1: Identidade */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <img
                src={settings?.logo_url || siteSettings.general.logo}
                alt="Logo"
                className="h-20 w-auto brightness-0 invert opacity-90 object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed italic opacity-70 text-justify">
              {settings?.texto_sobre || "Comunidade de fé a serviço da Diocese de Ji-Paraná."}
            </p>
            <div className="flex items-center gap-3">
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-[#C4A45F] hover:text-[#23140c] transition-all">
                  <Instagram size={18} />
                </a>
              )}
              {settings?.facebook && (
                <a href={settings.facebook} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-[#C4A45F] hover:text-[#23140c] transition-all">
                  <Facebook size={18} />
                </a>
              )}
              {settings?.youtube && (
                <a href={settings.youtube} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-[#C4A45F] hover:text-[#23140c] transition-all">
                  <Youtube size={18} />
                </a>
              )}
            </div>
          </div>

          {/* COLUNA 2: Atendimento */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Clock size={20} style={{ color: goldColor }} /> Atendimento
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-white/5 p-3 rounded-lg border-l-2 border-[#C4A45F]">
                <p className="text-[#C4A45F] text-[10px] font-bold uppercase tracking-widest">Segunda a Sexta</p>
                <p className="text-white font-medium">{settings?.horario_semana || "08h às 18h"}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border-l-2 border-[#C4A45F]">
                <p className="text-[#C4A45F] text-[10px] font-bold uppercase tracking-widest">Sábado</p>
                <p className="text-white font-medium">{settings?.horario_sabado || "08h às 12h"}</p>
              </div>
            </div>
          </div>

          {/* COLUNA 3: Contatos */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Phone size={20} style={{ color: goldColor }} /> Contato
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} style={{ color: goldColor }} className="mt-1 shrink-0" />
                <span>
                    {settings?.endereco || "Av. São João Batista, 1626"}<br/>
                    {settings?.cidade || "Presidente Médici"} - {settings?.estado || "RO"}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} style={{ color: goldColor }} />
                <span className="text-white font-medium">{settings?.telefone_fixo || "(69) 93198-0321"}</span>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={18} style={{ color: goldColor }} />
                <span className="text-white font-medium">{settings?.whatsapp || "(69) 93300-5360"}</span>
              </li>
              <li className="flex items-center gap-3 italic">
                <Mail size={18} style={{ color: goldColor }} />
                <span className="truncate">{settings?.email_secretaria || "secretaria@paroquiasjb.org.br"}</span>
              </li>
            </ul>
          </div>

          {/* COLUNA 4: Administrativo */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Users size={20} style={{ color: goldColor }} /> Administrativo
            </h3>
            <div className="space-y-4 text-sm">
              <Link href="/nossa-paroquia/clero" className="block group">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 group-hover:border-[#C4A45F]/50 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    {settings?.paroco_foto ? (
                        <img src={settings.paroco_foto} className="w-10 h-10 rounded-full object-cover border border-[#C4A45F]" alt="Pároco" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-[#C4A45F]/20 flex items-center justify-center text-[#C4A45F]"><Users size={16}/></div>
                    )}
                    <div>
                        <p className="text-[#C4A45F] font-bold uppercase text-[9px] tracking-widest leading-tight">Pároco</p>
                        <p className="text-white font-serif text-base leading-tight">{settings?.paroco || "Pe. Sergio Kalizak"}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1 group-hover:text-white transition-colors">
                    Conheça nossa história <ChevronRight size={12} />
                  </p>
                </div>
              </Link>
              
              <div className="mt-1">
                <div className="rounded-lg hover:border-[#C4A45F]/30 transition-all">
                    <a 
                      href="https://copiosaredencao.org.br/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <img 
                          src="/images/logotipo_oficial_horizontal.png" 
                          alt="Copiosa Redenção" 
                          className="h-15 w-auto brightness-0 invert"
                      />
                    </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <FooterCopyright />
    </footer>
  );
}