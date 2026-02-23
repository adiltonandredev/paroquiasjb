"use client";

import { Trash2 } from "lucide-react";
import { ConfirmModal } from "../modals/confirm-modal"; 
import { cn } from "@/lib/utils";

interface DeleteButtonProps {
  onDelete: () => void | Promise<void>; 
  itemName?: string;
  className?: string;
  disabled?: boolean; // <-- ADICIONADO PARA MATAR O ERRO
}

export function DeleteButton({ onDelete, itemName, className, disabled }: DeleteButtonProps) {
  return (
    <ConfirmModal 
      onConfirm={onDelete}
      title="Confirmar Exclusão"
      description={`Tem certeza que deseja remover ${itemName || "este item"}? Esta ação é permanente e não poderá ser desfeita.`}
      disabled={disabled} // Repassa para o modal (se ele suportar)
    >
      <button 
        type="button"
        disabled={disabled} // <-- OBRIGATÓRIO PARA O HTML
        className={cn(
          "p-2 rounded-lg transition-all duration-200 group",
          disabled 
            ? "opacity-20 cursor-not-allowed text-slate-300" 
            : "text-slate-400 hover:text-red-600 hover:bg-red-50",
          className
        )}
        aria-label="Excluir Registro"
      >
        <Trash2 size={18} className={cn(!disabled && "group-hover:scale-110 transition-transform")} />
      </button>
    </ConfirmModal>
  );
}