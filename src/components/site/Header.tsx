"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Importado
import { Menu, X, Search, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSettings } from "@/actions/settings";

interface WebPage {
  id: number;
  title: string;
  slug: string;
  children?: WebPage[];
}

interface SiteData {
  nome_paroquia: string;
  logo_url: string;
}

export function Header() {
  const pathname = usePathname(); // Identifica a página atual
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [pages, setPages] = useState<WebPage[]>([]);
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se é a página principal (Home)
  const isHome = pathname === "/" || pathname === "/site";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const resPages = await fetch("/api/web-pages");
        if (resPages.ok) {
          const dataPages = await resPages.json();
          setPages(dataPages);
        }

        const resSettings = await getSettings();
        if (resSettings.success) {
          setSiteData(resSettings.data);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do Header:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Lógica de transparência: 
  // Se for Home: depende do scroll.
  // Se NÃO for Home: sempre branco/sólido.
  const isTransparent = isHome && !isScrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        isTransparent
          ? "bg-transparent"
          : "bg-white/90 backdrop-blur-md shadow-md"
      )}
    >
      <div className="container mx-auto px-6 flex items-center h-16">
        {/* LOGO DINÂMICA */}
        <Link href="/" className="shrink-0">
          {siteData?.logo_url ? (
            <img
              src={siteData.logo_url}
              alt={siteData.nome_paroquia || "Logo"}
              className={cn(
                "h-12 w-auto transition-all object-contain",
                // Só aplica o filtro se estiver transparente
                isTransparent && "brightness-0 invert"
              )}
            />
          ) : (
            <span className={cn(
              "font-black text-xl tracking-tighter",
              isTransparent ? "text-white" : "text-primary"
            )}>
              {siteData?.nome_paroquia?.split(' ')[0] || ""}
            </span>
          )}
        </Link>

        {/* NAVEGAÇÃO DINÂMICA */}
        <nav className="hidden md:flex items-center ml-10 flex-grow gap-2">
          <Link
            href="/"
            className={cn(
              "text-sm font-bold tracking-widest px-4 transition-colors",
              isTransparent ? "text-white hover:text-gray-200" : "text-primary hover:text-secondary"
            )}
          >
            Home
          </Link>

          {pages.map((page) => {
            const hasChildren = page.children && page.children.length > 0;

            return (
              <div key={page.id} className="relative group">
                {hasChildren ? (
                  <div
                    className={cn(
                      "text-sm font-bold tracking-widest px-4 py-6 cursor-default flex items-center gap-1",
                      isTransparent ? "text-white" : "text-primary"
                    )}
                  >
                    {page.title}
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </div>
                ) : (
                  <Link
                    href={`/${page.slug}`}
                    className={cn(
                      "text-sm font-bold tracking-widest px-4 py-6 transition-colors flex items-center gap-1",
                      isTransparent
                        ? "text-white hover:text-gray-200"
                        : "text-primary hover:text-secondary"
                    )}
                  >
                    {page.title}
                  </Link>
                )}

                {hasChildren && (
                  <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-b-lg border-t-2 border-secondary opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2">
                    {page.children?.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/${sub.slug}`}
                        className="block px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-secondary transition-colors"
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* PESQUISA */}
        <div className="hidden md:flex items-center ml-auto">
          <form className="relative flex items-center">
            <input
              type="text"
              placeholder="Buscar..."
              className={cn(
                "px-4 py-1.5 rounded-full border text-sm outline-none transition-all w-48 focus:w-64",
                isTransparent
                  ? "bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                  : "bg-white border-gray-300 text-primary"
              )}
            />
            <button type="submit" className="absolute right-3">
              <Search
                className={cn(
                  "h-4 w-4",
                  isTransparent ? "text-white" : "text-secondary"
                )}
              />
            </button>
          </form>
        </div>

        {/* MOBILE */}
        <button
          className="md:hidden ml-auto p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X size={28} className="text-primary" />
          ) : (
            <Menu
              size={28}
              className={isTransparent ? "text-white" : "text-primary"}
            />
          )}
        </button>
      </div>

      {/* MENU MOBILE EXPANDIDO */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t animate-in slide-in-from-top duration-300">
           <nav className="flex flex-col p-6 gap-4">
              <Link href="/" className="text-sm font-bold uppercase text-primary" onClick={() => setIsMenuOpen(false)}>Home</Link>
              {pages.map(page => (
                <Link key={page.id} href={`/${page.slug}`} className="text-sm font-bold uppercase text-slate-600" onClick={() => setIsMenuOpen(false)}>
                  {page.title}
                </Link>
              ))}
           </nav>
        </div>
      )}
    </header>
  );
}