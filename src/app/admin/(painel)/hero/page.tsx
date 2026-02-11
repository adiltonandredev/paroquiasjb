"use client";

import { HeroFormModal } from "@/components/admin/modals/hero-form-modal";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/admin/ui/button";
import { DeleteButton } from "@/components/admin/ui/delete-button";
import { PageHeader } from "@/components/admin/ui/page-header";
import { ImageIcon, Plus } from "lucide-react";
import { useState } from "react";

export default function HeroPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Exemplo de dados para a tabela
  const slides = [
    { id: 1, title: "Missa de Sétimo Dia", status: "Ativo" },
    { id: 2, title: "Campanha da Fraternidade", status: "Inativo" },
  ];

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página com Ação de Inserção */}
      <PageHeader 
        title="Hero Slides" 
        subtitle="Gerencie as imagens e textos que aparecem no topo do site" 
        icon={ImageIcon}
        action={
          <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> Novo Slide
          </Button>
        }
      />

      <AdminCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th className="px-6 py-3">Slide</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {slides.map((slide) => (
                <tr key={slide.id} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{slide.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${slide.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {slide.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    {/* Botão de exclusão seguro com Portal */}
                    <DeleteButton 
                      itemName={slide.title} 
                      onDelete={() => console.log("Excluir", slide.id)} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* Modal de Cadastro padronizado */}
      <HeroFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}