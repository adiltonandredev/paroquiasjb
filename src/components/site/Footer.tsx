import {
  Instagram,
  Phone,
  MapPin,
  Clock,
  Church,
  Smartphone,
  Heart,
  Copy,
} from "lucide-react";
import { siteSettings } from "@/config/settings";
import { FooterCopyright } from "./FooterCopyright"; // <--- Importando a parte de baixo
import Link from "next/link";

export function Footer() {
  // Cores da Identidade
  const goldColor = "#C4A45F";
  const darkBrown = "#23140c"; // Café bem escuro

  return (
    <footer className="relative text-gray-300 font-sans border-t border-[#C4A45F]/30">
      {/* --- ÁREA SUPERIOR (COM TEXTURA E COLUNAS) --- */}
      <div className="relative overflow-hidden bg-[#23140c]">
        {/* Textura de Fundo Suave */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-10 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/cubes.png')",
          }}
        />

        {/* Luz Dourada Decorativa no Topo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[100px] bg-[#C4A45F] blur-[100px] opacity-10 pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* COLUNA 1: Identidade */}
            <div className="space-y-6 flex flex-col items-start">
              {/* LOGO DINÂMICA: Removido o texto ao lado para evitar duplicidade */}
              <Link href="/" className="group">
                <img
                  src={siteSettings.general.logo}
                  alt={siteSettings.general.name}
                  className="h-20 w-auto brightness-0 invert opacity-90 group-hover:opacity-100 transition-all duration-300"
                />
              </Link>

              {/* SLOGAN DINÂMICO: Buscando diretamente de settings */}
              <p className="text-sm opacity-70 text-justify leading-relaxed max-w-xs text-gray-300">
                "{siteSettings.general.footerSlogan}"
              </p>

              {/* REDES SOCIAIS: Alinhadas à esquerda sob o slogan */}
              <div className="flex items-center gap-4 pt-2">
                <a
                  href="#"
                  className="p-2 rounded-full bg-white/5 hover:bg-[#C4A45F] hover:text-white transition-all text-gray-400"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-white/5 hover:bg-[#C4A45F] hover:text-white transition-all text-gray-400"
                >
                  <Smartphone size={18} />
                </a>
              </div>
            </div>

            {/* COLUNA 2: Contato */}
            <div>
              <h3 className="text-white font-bold mb-6 text-lg flex items-center gap-2">
                <span className="w-1 h-6 rounded bg-[#C4A45F]"></span>
                Contato
              </h3>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex gap-4 items-start group">
                  <MapPin
                    size={20}
                    className="shrink-0 mt-1 group-hover:text-[#C4A45F] transition-colors"
                    style={{ color: goldColor }}
                  />
                  <span className="group-hover:text-white transition-colors">
                    {siteSettings.contact.address}
                  </span>
                </li>
                <li className="flex gap-4 items-center group">
                  <Phone
                    size={20}
                    className="shrink-0 group-hover:text-[#C4A45F] transition-colors"
                    style={{ color: goldColor }}
                  />
                  <span className="group-hover:text-white transition-colors">
                    {siteSettings.contact.phone}
                  </span>
                </li>
              </ul>
            </div>

            {/* COLUNA 3: Secretaria */}
            <div>
              <h3 className="text-white font-bold mb-6 text-lg flex items-center gap-2">
                <span className="w-1 h-6 rounded bg-[#C4A45F]"></span>
                Secretaria
              </h3>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex gap-4 items-start">
                  <Clock
                    size={20}
                    className="shrink-0 mt-1"
                    style={{ color: goldColor }}
                  />
                  <div className="space-y-1">
                    <span className="block text-white font-medium">
                      Segunda à Sexta
                    </span>
                    <span className="opacity-70">08h às 12h / 14h às 18h</span>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <Clock
                    size={20}
                    className="shrink-0 mt-1"
                    style={{ color: goldColor }}
                  />
                  <div className="space-y-1">
                    <span className="block text-white font-medium">Sábado</span>
                    <span className="opacity-70">08h às 12h</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* COLUNA 4: Dízimo (CARD DESTAQUE) */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C4A45F] to-[#754D25] rounded-xl opacity-30 group-hover:opacity-60 blur transition duration-500"></div>
              <div className="relative bg-[#2e1c14] p-6 rounded-xl border border-[#C4A45F]/20 shadow-xl">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Heart size={18} className="text-red-500 fill-red-500" />
                  Faça sua Oferta
                </h3>

                <p className="text-xs text-gray-400 mb-4">
                  Sua contribuição ajuda a manter nossas obras de evangelização.
                </p>

                <div className="bg-black/40 p-3 rounded-lg border border-dashed border-[#C4A45F]/40 flex items-center justify-between group-hover:border-[#C4A45F] transition-colors cursor-pointer">
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-[#C4A45F] uppercase tracking-wider font-bold">
                      Chave Pix
                    </p>
                    <p className="text-sm font-mono text-white truncate">
                      00.000.000/0001-00
                    </p>
                  </div>
                  <Copy
                    size={16}
                    className="text-gray-500 hover:text-white transition-colors"
                  />
                </div>

                <div className="mt-4 text-center">
                  <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded-full">
                    Banco Sicredi (748)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- ÁREA INFERIOR (SEPARADA) --- */}
      <FooterCopyright />
    </footer>
  );
}
