"use client";

import { useEffect, useState } from "react";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/admin/ui/button";
import { PageHeader } from "@/components/admin/ui/page-header";
import { ImageIcon, Plus, Loader2 } from "lucide-react";
import { getHeroSlides, deleteHeroSlide, updateSlidesOrder } from "@/actions/hero";
import { toast } from "sonner";
import { SortableRow } from "./sortable-row";
import { HeroFormModal, HeroSlide } from "@/components/admin/modals/hero-form-modal";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

export default function HeroPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlide, setSelectedSlide] = useState<HeroSlide | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  // 1. Definição ÚNICA de sensores (Mantenha apenas esta)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor)
  );

  useEffect(() => {
    async function loadSlides() {
      const res = await getHeroSlides();
      if (res.success) {
        setSlides((res.data as HeroSlide[]) || []);
      }
      setLoading(false);
    }
    void loadSlides();
  }, []);

  // 2. A SEGUNDA DEFINIÇÃO QUE ESTAVA AQUI FOI REMOVIDA PARA LIMPAR O ERRO

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex((s) => s.id === active.id);
      const newIndex = slides.findIndex((s) => s.id === over.id);

      const newOrder = arrayMove(slides, oldIndex, newIndex);
      setSlides(newOrder);

      const res = await updateSlidesOrder(newOrder.map(s => s.id));
      if (res.success) {
        toast.success("Ordem atualizada!");
      } else {
        toast.error("Erro ao salvar ordem no servidor.");
      }
    }
  };

  const handleDelete = async (id: number) => {
    const res = await deleteHeroSlide(id);
    if (res.success) {
      setSlides(prev => prev.filter(s => s.id !== id));
      toast.success("Destaque removido!");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 px-2 md:px-0 pb-24">
      <PageHeader
        title="Hero Slides"
        subtitle="Destaques na resolução 1920x600px"
        icon={ImageIcon}
        action={
          <Button onClick={() => {
            setSelectedSlide(null);
            setIsViewMode(false);
            setIsModalOpen(true);
          }} className="bg-primary font-bold">
            <Plus className="w-4 h-4 mr-2" /> Novo Slide
          </Button>
        }
      />

      <AdminCard>
        <div className="overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                <tr>
                  <th className="px-6 py-3">Miniatura</th>
                  <th className="px-6 py-3">Título</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <SortableContext items={slides.map(s => s.id)} strategy={verticalListSortingStrategy}>
                <tbody className="divide-y divide-slate-100">
                  {slides.map((slide) => (
                    <SortableRow
                      key={slide.id}
                      slide={slide}
                      onView={(s) => { setSelectedSlide(s); setIsViewMode(true); setIsModalOpen(true); }}
                      onEdit={(s) => { setSelectedSlide(s); setIsViewMode(false); setIsModalOpen(true); }}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </SortableContext>
            </table>
          </DndContext>
        </div>
      </AdminCard>

      <HeroFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedSlide(null); }}
        initialData={selectedSlide}
        isViewOnly={isViewMode}
      />
    </div>
  );
}