"use client";

import { Trash2 } from "lucide-react";
import { ConfirmModal } from "../modals/confirm-modal"; 
import { cn } from "@/lib/utils";

interface DeleteButtonProps {
  // Alterado para aceitar funções assíncronas (Promise) ou normais
  onDelete: () => void | Promise<void>; 
  itemName?: string;
  className?: string;
}

export function DeleteButton({ onDelete, itemName, className }: DeleteButtonProps) {
  return (
    <ConfirmModal 
      onConfirm={onDelete}
      title="Confirmar Exclusão"
      description={`Tem certeza que deseja remover ${itemName || "este item"}? Esta ação é permanente e não poderá ser desfeita.`}
    >
      <button 
        type="button"
        className={cn(
          "p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group",
          className
        )}
        aria-label="Excluir Registro" // Melhor para acessibilidade que 'title'
      >
        <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
      </button>
    </ConfirmModal>
  );
}