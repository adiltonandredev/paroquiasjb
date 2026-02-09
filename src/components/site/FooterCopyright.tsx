import { Heart, Shield, Github, Linkedin, Instagram, MessageCircle } from "lucide-react";
import Link from "next/link";
import { siteSettings } from "@/config/settings";

export function FooterCopyright() {
    const currentYear = new Date().getFullYear();
    
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

                {/* LINHA 1: Copyright e Links Legais */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium mb-6">
                    <p className="text-center md:text-left">
                        © {currentYear} <strong className="text-gray-400">{siteSettings.general.name}</strong>. Todos os direitos reservados.
                    </p>

                    <div className="flex items-center gap-6">
                        <Link href="/privacidade" className="hover:text-[#C4A45F] transition-colors">Privacidade</Link>
                        <Link href="/termos" className="hover:text-[#C4A45F] transition-colors">Termos de Uso</Link>
                        <Link href="/admin/login" className="flex items-center gap-1 hover:text-[#C4A45F] transition-colors text-gray-600 group">
                            <Shield size={12} className="group-hover:text-[#C4A45F] transition-colors" />
                            <span>Área Administrativo</span>
                        </Link>
                    </div>
                </div>

                {/* Divisor Fino */}
                <div className="w-full h-px bg-white/5 mb-6"></div>

                {/* LINHA 2: Desenvolvedor + ÍCONES NA FRENTE */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-[11px] text-gray-600 tracking-wide">

                    {/* Texto do Desenvolvedor */}
                    <span className="flex items-center gap-1.5">
                        Desenvolvido por <strong className="text-gray-500">Adilton Andre</strong>
                    </span>

                    {/* Divisor Vertical (visível apenas em telas maiores que mobile) */}
                    <div className="hidden md:block w-px h-3 bg-white/10 mx-2"></div>

                    {/* ÍCONES NA FRENTE */}
                    <div className="flex items-center gap-4">
                        {developerSocials.map((social, index) => (
                            <a
                                key={index}
                                href={social.url} // <--- AQUI: Use a URL do objeto
                                target={social.target} // <--- AQUI: Abre em nova aba
                                rel="noopener noreferrer" // Boa prática de segurança
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