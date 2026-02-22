"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já aceitou os cookies anteriormente
    const cookieConsent = localStorage.getItem("cookie-consent-paroquia");
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent-paroquia", "accepted");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] animate-in slide-in-from-bottom-10 duration-700">
      {/* Container Principal: w-full e sem arredondamentos para atingir as bordas */}
      <div className="w-full bg-[#23140c] border-t border-[#C4A45F]/30 shadow-2xl backdrop-blur-md bg-opacity-95">
        
        {/* Conteúdo Interno: Centralizado com o grid do site mas com fundo total */}
        <div className="container mx-auto px-6 py-5 md:py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Texto - Mobile First: Centralizado no celular, esquerda no desktop */}
          <div className="text-center md:text-left">
            <p className="text-white/90 text-sm md:text-base leading-relaxed">
              Coletamos dados para melhorar o desempenho e segurança do site, além de personalizar conteúdos. 
              Verifique mais informações em nossa{" "}
              <Link 
                href="/privacidade" 
                className="text-[#C4A45F] font-semibold hover:underline underline-offset-4 transition-colors"
              >
                Política de Privacidade
              </Link>.
            </p>
          </div>

          {/* Botão de Aceite */}
          <button
            onClick={acceptCookies}
            className="w-full md:w-auto bg-[#C4A45F] hover:bg-[#a3864d] text-white font-bold py-3 px-10 rounded-full transition-all active:scale-95 shadow-lg whitespace-nowrap text-sm uppercase tracking-widest"
          >
            Concordar e fechar
          </button>
        </div>
      </div>
    </div>
  );
}