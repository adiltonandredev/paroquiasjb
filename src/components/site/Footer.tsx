"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Instagram,
  Phone,
  MapPin,
  Smartphone,
  Heart,
  Copy,
  Loader2,
  Facebook,
  Youtube,
  ChevronDown, // Garante que está aqui
} from "lucide-react";
import { cn } from "@/lib/utils"; // Garante que o caminho @/lib/utils existe
import { siteSettings } from "@/config/settings";
import { FooterCopyright } from "./FooterCopyright";
import { toast } from "sonner";

// 1. INTERFACE PARA O MENU
interface WebPage {
  id: number;
  title: string;
  slug: string;
  children?: WebPage[];
}

// 2. INTERFACE COMPLETA PARA AS CONFIGURAÇÕES
interface SiteSettingsData {
  nome_paroquia?: string | null;
  cnpj?: string | null;
  endereco?: string | null;
  cidade?: string | null;
  estado?: string | null;
  telefone_fixo?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  youtube?: string | null;
  logo_url?: string | null;
  texto_sobre?: string | null;
}

export function Footer() {
  const [pages, setPages] = useState<WebPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const goldColor = "#C4A45F";

  const toggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const resSettings = await fetch("/api/settings", { cache: "no-store" });
        if (resSettings.ok) {
          const dataSettings = await resSettings.json();
          setSettings(dataSettings);
        }

        const resPages = await fetch("/api/web-pages", { cache: "no-store" });
        if (resPages.ok) {
          const dataPages = await resPages.json();
          setPages(dataPages);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do footer:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const copyPix = () => {
    const pixKey = settings?.cnpj || "";
    if (pixKey) {
      navigator.clipboard.writeText(pixKey);
      toast.success("Chave PIX copiada!");
    } else {
      toast.error("Chave PIX não configurada.");
    }
  };

  return (
    <footer className="relative text-gray-300 font-sans border-t border-[#C4A45F]/30">
      <div className="relative overflow-hidden bg-[#23140c]">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-10 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/cubes.png')",
          }}
        />

        <div className="relative z-10 container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* COLUNA 1: Identidade */}
            <div className="space-y-6">
              <Link href="/" className="group inline-block">
                <img
                  src={settings?.logo_url || siteSettings.general.logo}
                  alt={settings?.nome_paroquia || "Logo"}
                  className="h-20 w-auto opacity-90 group-hover:opacity-100 transition-all duration-300 object-contain brightness-0 invert"
                />
              </Link>
              <p className="text-sm opacity-70 text-justify leading-relaxed max-w-xs text-gray-300 italic">
                {settings?.texto_sobre || siteSettings.general.footerSlogan}
              </p>

              <div className="flex items-center gap-4 pt-2">
                {settings?.instagram && (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    className="p-2 rounded-full bg-white/5 hover:bg-[#C4A45F] hover:text-white transition-all text-gray-400"
                  >
                    <Instagram size={18} />
                  </a>
                )}
                {settings?.facebook && (
                  <a
                    href={settings.facebook}
                    target="_blank"
                    className="p-2 rounded-full bg-white/5 hover:bg-[#C4A45F] hover:text-white transition-all text-gray-400"
                  >
                    <Facebook size={18} />
                  </a>
                )}
              </div>
            </div>

            {/* COLUNA 2: Navegação com Acordeão */}
            <div>
              <h3 className="text-white font-bold mb-6 text-lg flex items-center gap-2">
                <span className="w-1 h-6 rounded bg-[#C4A45F]"></span>
                Navegação
              </h3>

              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/"
                    className="hover:text-[#C4A45F] transition-colors flex items-center gap-2 tracking-wider font-bold text-[11px]"
                  >
                    • Home
                  </Link>
                </li>

                {isLoading ? (
                  <Loader2 className="animate-spin w-4 h-4 text-white/20" />
                ) : (
                  pages.map((page) => {
                    const hasChildren =
                      page.children && page.children.length > 0;
                    const isOpen = openMenuId === page.id;

                    return (
                      <li key={page.id} className="flex flex-col">
                        <div className="flex items-center justify-between group">
                          {hasChildren ? (
                            /* Se tem filhos, o clique no texto TAMBÉM abre o menu */
                            <button
                              onClick={() => toggleMenu(page.id)}
                              className="hover:text-[#C4A45F] transition-colors flex items-center gap-2 text-[11px] font-bold tracking-wider flex-grow text-left"
                            >
                              • {page.title}
                            </button>
                          ) : (
                            /* Se NÃO tem filhos, navega direto */
                            <Link
                              href={`/${page.slug}`}
                              className="hover:text-[#C4A45F] transition-colors flex items-center gap-2 text-[11px] font-bold tracking-wider flex-grow"
                            >
                              • {page.title}
                            </Link>
                          )}

                          {hasChildren && (
                            <button
                              onClick={() => toggleMenu(page.id)}
                              className="p-1 hover:bg-white/5 rounded transition-colors"
                            >
                              <ChevronDown
                                size={14}
                                className={cn(
                                  "transition-transform duration-300 text-gray-500",
                                  isOpen ? "rotate-180 text-[#C4A45F]" : "",
                                )}
                              />
                            </button>
                          )}
                        </div>

                        {/* Submenus - Removida a animação complexa para testar a abertura bruta primeiro */}
                        {hasChildren && isOpen && (
                          <ul className="ml-4 mt-2 space-y-2 border-l border-[#C4A45F]/20 pl-3">
                            {page.children?.map((sub) => (
                              <li key={sub.id}>
                                <Link
                                  href={`/${sub.slug}`}
                                  className="text-gray-500 hover:text-[#C4A45F] transition-colors text-[10px] font-medium block py-1"
                                >
                                  {sub.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })
                )}

                <li>
                  <Link
                    href="/noticias"
                    className="hover:text-[#C4A45F] transition-colors flex items-center gap-2 text-[11px] font-bold tracking-wider"
                  >
                    • Notícias
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUNA 3: Contatos */}
            <div className="space-y-8">
              <div>
                <h3 className="text-white font-bold mb-4 text-lg flex items-center gap-2">
                  <span className="w-1 h-6 rounded bg-[#C4A45F]"></span>
                  Onde Estamos
                </h3>
                <div className="flex gap-3 text-sm group cursor-default">
                  <MapPin
                    size={18}
                    style={{ color: goldColor }}
                    className="shrink-0"
                  />
                  <span className="group-hover:text-white transition-colors">
                    {settings?.endereco
                      ? `${settings.endereco}${settings.cidade ? `, ${settings.cidade}` : ""}${settings.estado ? ` - ${settings.estado}` : ""}`
                      : siteSettings.contact.address}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold mb-4 text-lg flex items-center gap-2">
                  <span className="w-1 h-6 rounded bg-[#C4A45F]"></span>
                  Contato
                </h3>
                <div className="space-y-3">
                  {settings?.telefone_fixo && (
                    <div className="flex gap-3 text-sm text-white">
                      <Phone
                        size={18}
                        style={{ color: goldColor }}
                        className="shrink-0"
                      />
                      <span>{settings.telefone_fixo}</span>
                    </div>
                  )}
                  {settings?.whatsapp && (
                    <div className="flex gap-3 text-sm text-white">
                      <Smartphone
                        size={18}
                        style={{ color: goldColor }}
                        className="shrink-0"
                      />
                      <span>{settings.whatsapp}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* COLUNA 4: Dízimo */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C4A45F] to-[#754D25] rounded-xl opacity-30 group-hover:opacity-60 blur transition duration-500"></div>
              <div className="relative bg-[#2e1c14] p-6 rounded-xl border border-[#C4A45F]/20 shadow-xl">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Heart size={18} className="text-red-500 fill-red-500" />
                  Dízimo e Ofertas
                </h3>
                <div
                  onClick={copyPix}
                  className="bg-black/40 p-3 rounded-lg border border-dashed border-[#C4A45F]/40 flex items-center justify-between group-hover:border-[#C4A45F] transition-all cursor-pointer"
                >
                  <div className="overflow-hidden">
                    <p className="text-[9px] text-[#C4A45F] uppercase tracking-wider font-black">
                      Chave Pix (CNPJ)
                    </p>
                    <p className="text-sm font-mono text-white truncate">
                      {settings?.cnpj || "00.000.000/0001-00"}
                    </p>
                  </div>
                  <Copy
                    size={16}
                    className="text-gray-500 group-hover:text-white"
                  />
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
