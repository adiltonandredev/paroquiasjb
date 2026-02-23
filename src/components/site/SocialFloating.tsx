"use client";

import { useEffect, useState } from "react";
import { Instagram, Facebook, Youtube, MessageCircle } from "lucide-react";

export function SocialFloating() {
  const [links, setLinks] = useState<any>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data && Object.keys(data).length > 0) {
          setLinks(data);
        }
      } catch (err) {
        console.error("Erro ao carregar redes sociais:", err);
      }
    }
    fetchSettings();
  }, []);

  if (!links) return null;

  // Lógica para tratar o WhatsApp e evitar erro 404
  const formatWhatsapp = (val: string) => {
    if (!val) return null;
    const clean = val.trim();
    // Se for apenas números, gera o link oficial
    if (/^\d+$/.test(clean.replace(/\D/g, ""))) {
      return `https://wa.me/${clean.replace(/\D/g, "")}`;
    }
    // Se não começar com http, adiciona para não dar 404
    if (!clean.startsWith("http")) {
      return `https://${clean}`;
    }
    return clean;
  };

  const whatsapp = formatWhatsapp(links.whatsappUrl || links.whatsapp);
  
  // Garantir que os outros links também tenham https://
  const formatUrl = (url: string) => {
    if (!url) return null;
    return url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`;
  };

  const instagram = formatUrl(links.instagramUrl || links.instagram);
  const facebook = formatUrl(links.facebookUrl || links.facebook);
  const youtube = formatUrl(links.youtubeUrl || links.youtube);

  return (
    <>
      {/* --- DESKTOP: Apenas WhatsApp --- */}
      {whatsapp && (
        <div className="hidden md:block fixed right-6 bottom-12 z-[100]">
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 group"
          >
            <MessageCircle size={32} fill="currentColor" strokeWidth={1.5} />
            <span className="absolute right-20 bg-white text-slate-800 px-3 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md border whitespace-nowrap pointer-events-none">
              Fale conosco
            </span>
          </a>
        </div>
      )}

      {/* --- MOBILE: Vertical no meio do lado direito --- */}
      <div className="flex md:hidden fixed right-0 top-1/2 -translate-y-1/2 z-[100] flex-col gap-1">
        {instagram && (
          <a href={instagram} target="_blank" rel="noopener noreferrer" className="bg-[#E1306C] text-white p-3 rounded-l-xl shadow-lg active:scale-95">
            <Instagram size={20} />
          </a>
        )}

        {facebook && (
          <a href={facebook} target="_blank" rel="noopener noreferrer" className="bg-[#1877F2] text-white p-3 rounded-l-xl shadow-lg active:scale-95">
            <Facebook size={20} />
          </a>
        )}

        {youtube && (
          <a href={youtube} target="_blank" rel="noopener noreferrer" className="bg-[#FF0000] text-white p-3 rounded-l-xl shadow-lg active:scale-95">
            <Youtube size={20} />
          </a>
        )}

        {whatsapp && (
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white p-3 rounded-l-xl shadow-lg active:scale-95">
            <MessageCircle size={20} fill="currentColor" />
          </a>
        )}
      </div>
    </>
  );
}