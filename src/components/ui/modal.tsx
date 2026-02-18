"use client";

import { X, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  type?: "default" | "danger" | "success";
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, type = "default", children }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen || !mounted) return null;

  // Configuração Visual baseada no Tipo
  const styles = {
    default: {
      icon: <Info className="w-6 h-6 text-primary" />,
      titleColor: "text-primary",
      borderColor: "border-secondary/40", // Borda Dourada
    },
    success: {
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />, // Verde
      titleColor: "text-emerald-700",
      borderColor: "border-emerald-200",
    },
    danger: {
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />, // Vermelho
      titleColor: "text-red-700",
      borderColor: "border-red-200",
    },
  };

  const currentStyle = styles[type];

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div 
        className={cn(
          "relative w-full max-w-lg overflow-hidden rounded-xl bg-background shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-5 duration-300",
          "border-2", 
          currentStyle.borderColor
        )}
      >
        {/* Cabeçalho Limpo e Elegante */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-background rounded-full shadow-sm border border-muted">
              {currentStyle.icon}
            </div>
            <h3 className={cn("text-xl font-serif font-bold tracking-tight", currentStyle.titleColor)}>
              {title}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-muted-foreground/50 hover:text-primary transition-colors hover:bg-secondary/10 rounded-full p-2"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="px-6 py-4 text-muted-foreground leading-relaxed">
          {children}
        </div>
        
        {/* Barra decorativa inferior (opcional, dá um charme) */}
        <div className={cn("h-1 w-full opacity-30", 
          type === 'success' ? "bg-emerald-500" : 
          type === 'danger' ? "bg-red-500" : 
          "bg-secondary"
        )} />
      </div>
    </div>,
    document.body
  );
}