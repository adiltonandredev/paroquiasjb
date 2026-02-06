import { Facebook, Instagram, Phone, MapPin, Clock, CreditCard, Church, Shield, Github, Linkedin, Smartphone } from "lucide-react";
import { siteSettings } from "@/config/settings";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] text-gray-300 border-t border-gray-800 font-sans">
      
      {/* --- PARTE SUPERIOR (Informações Úteis) --- */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Identidade */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-serif font-bold text-xl">
              <Church className="h-6 w-6 text-primary" />
              <span>{siteSettings.general.logoText}</span>
            </div>
            <p className="text-sm opacity-80 text-justify">
              Evangelizando e construindo o Reino de Deus em Presidente Médici - RO.
            </p>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-white font-bold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2"><MapPin size={16} className="text-primary"/> {siteSettings.contact.address}</li>
              <li className="flex gap-2"><Phone size={16} className="text-primary"/> {siteSettings.contact.phone}</li>
            </ul>
          </div>

          {/* Secretaria */}
          <div>
            <h3 className="text-white font-bold mb-4">Secretaria</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2"><Clock size={16} className="text-primary"/> Seg-Sex: 08h-12h / 14h-18h</li>
              <li className="flex gap-2"><Clock size={16} className="text-primary"/> Sábado: 08h-12h</li>
            </ul>
          </div>

          {/* Dízimo */}
          <div>
            <h3 className="text-white font-bold mb-4">Contribua</h3>
            <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
              <p className="text-xs text-gray-400">Pix Paroquial</p>
              <p className="text-sm font-mono text-white select-all">00.000.000/0001-00</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- PARTE INFERIOR (Modelo da Imagem) --- */}
      <div className="border-t border-gray-800 bg-[#111111]">
        <div className="container mx-auto px-6 py-6">
          
          {/* Linha 1: Copyright + Links Legais */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 mb-4">
            <p>
              © {currentYear} {siteSettings.general.name} de Presidente Médici/RO. Todos os direitos reservados.
            </p>
            
            <div className="flex items-center gap-6">
              <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
              <Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
              
              {/* Botão Admin Discreto com Ícone de Escudo */}
              <Link href="/design-system" className="flex items-center gap-1 hover:text-primary transition-colors">
                <Shield size={12} />
                <span>Admin</span>
              </Link>
            </div>
          </div>

          {/* Divisor Fino */}
          <div className="w-full h-px bg-gray-800/50 mb-4"></div>

          {/* Linha 2: Desenvolvedor */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-xs text-gray-500">
            <p className="flex items-center gap-1">
              Desenvolvido por <strong className="text-gray-300">Adilton Andre</strong>
            </p>
            
            <div className="flex items-center gap-3 border-l border-gray-700 pl-4">
              <a href="#" className="hover:text-green-500 transition-colors" title="Whatsapp"><Smartphone size={14} /></a>
              <a href="#" className="hover:text-pink-500 transition-colors" title="Instagram"><Instagram size={14} /></a>
              <a href="#" className="hover:text-blue-500 transition-colors" title="LinkedIn"><Linkedin size={14} /></a>
              <a href="#" className="hover:text-white transition-colors" title="GitHub"><Github size={14} /></a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}