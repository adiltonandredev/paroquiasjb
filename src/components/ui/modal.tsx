"use client"; // Necessário pois usa interações de tela

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  type?: "default" | "danger" | "success"; // Define a cor do topo
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, type = "default", children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Fecha ao apertar ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  // Lógica de Cores do Cabeçalho
  const headerColors = {
    default: "bg-white text-gray-900 border-b",
    danger: "bg-destructive text-destructive-foreground", // Vermelho
    success: "bg-success text-success-foreground", // Verde
  };

  // O Portal joga esse HTML direto no final do <body>, evitando problemas de z-index
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div 
        ref={overlayRef}
        className="relative w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-xl animate-in zoom-in-95"
      >
        {/* Cabeçalho do Modal */}
        <div className={cn("flex items-center justify-between px-6 py-4", headerColors[type])}>
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
            <X size={24} />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}