"use client";

import { Button } from "@/components/admin/ui/button";
import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "error" | "warning" | "info";
}

export function AlertModal({ isOpen, onClose, title, message, type = "error" }: AlertModalProps) {
  // Configuração visual baseada no tipo de alerta
  const configs = {
    error: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
    warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    info: { icon: Info, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" }
  };

  const config = configs[type];

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        {/* Overlay com desfoque padrão do projeto */}
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]" />
        
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-sm bg-white rounded-2xl shadow-2xl z-[201] overflow-hidden animate-in zoom-in-95 duration-200">
          
          <div className={cn("p-6 flex flex-col items-center text-center", config.bg)}>
            <div className={cn("p-3 rounded-full bg-white shadow-sm mb-4", config.color)}>
              <config.icon size={32} />
            </div>
            <Dialog.Title className="text-lg font-bold text-slate-900 leading-tight">
              {title}
            </Dialog.Title>
          </div>

          <div className="p-6">
            <Dialog.Description className="text-sm text-slate-600 leading-relaxed">
              {message}
            </Dialog.Description>
            
            <div className="mt-6">
              <Button 
                onClick={onClose} 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-6"
              >
                Entendi
              </Button>
            </div>
          </div>

          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={20} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}