"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit3, Eye, GripVertical } from "lucide-react";
import { DeleteButton } from "@/components/admin/ui/delete-button";
import { HeroSlide } from "@/components/admin/modals/hero-form-modal";

interface SortableRowProps {
  slide: HeroSlide; // Agora o sublinhado sumirá
  onView: (slide: HeroSlide) => void;
  onEdit: (slide: HeroSlide) => void;
  onDelete: (id: number) => void;
}

export function SortableRow({ slide, onView, onEdit, onDelete }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr 
      ref={setNodeRef} 
      style={style} 
      className="bg-white hover:bg-slate-50 transition-colors group"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Alça de Arrasto */}
          <button 
            {...attributes} 
            {...listeners} 
            className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-primary transition-colors"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <div className="w-32 h-12 bg-slate-100 rounded overflow-hidden border">
            <img src={slide.coverImage} className="w-full h-full object-cover" alt="Slide" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4 font-bold text-slate-900">{slide.title}</td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onView(slide)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={() => onEdit(slide)}
            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <DeleteButton
            itemName={slide.title}
            onDelete={() => { void onDelete(slide.id) }}
          />
        </div>
      </td>
    </tr>
  );
}