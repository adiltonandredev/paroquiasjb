"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/admin/ui/dialog";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { UploadCloud, X, Loader2, ImageIcon, Eye, Link as LinkIcon, Globe } from "lucide-react";
import { toast } from "sonner";
import { saveHeroSlide, updateHeroSlide } from "@/actions/hero";

export interface HeroSlide {
  id: number;
  title: string;
  coverImage: string;
  slug?: string; // Adicionado na interface
  primaryButtonText?: string;
  primaryButtonUrl?: string;
}

interface HeroFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: HeroSlide | null;
  isViewOnly?: boolean;
}

export function HeroFormModal({ 
  isOpen, 
  onClose, 
  initialData = null, 
  isViewOnly = false 
}: HeroFormModalProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState(""); // Estado do slug
  const [image, setImage] = useState<string | null>(null);
  const [btnText, setBtnText] = useState("");
  const [btnUrl, setBtnUrl] = useState("");  
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSlug(initialData.slug || ""); // Carrega o slug existente
      setImage(initialData.coverImage || null);
      setBtnText(initialData.primaryButtonText || "");
      setBtnUrl(initialData.primaryButtonUrl || "");
    } else {
      setTitle("");
      setSlug("");
      setImage(null);
      setBtnText("");
      setBtnUrl("");
    }
  }, [initialData, isOpen]);

  // Função para formatar o título em slug automaticamente
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!initialData) { // Só gera automático se for um slide novo
      const generatedSlug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      setSlug(generatedSlug);
    }
  };

  const handleSave = async () => {
    if (!title || !image) return toast.error("Preencha título e imagem.");
    setIsUploading(true);

    try {
      const payload = { 
        title, 
        slug, // AGORA O SLUG ESTÁ SENDO ENVIADO
        base64: image,
        primaryButtonText: btnText,
        primaryButtonUrl: btnUrl
      };

      const result = initialData 
        ? await updateHeroSlide(initialData.id, payload)
        : await saveHeroSlide(payload);

      if (result.success) {
        toast.success(initialData ? "Slide atualizado!" : "Slide criado!");
        onClose();
        window.location.reload();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro técnico ao salvar.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white p-6 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {isViewOnly ? <Eye className="w-5 h-5" /> : <ImageIcon className="w-5 h-5 text-primary" />}
            {isViewOnly ? "Visualizar Slide" : initialData ? "Editar Slide" : "Novo Slide"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* CAMPO: TÍTULO */}
          <div className="space-y-2">
            <Label className="font-bold">Título do Slide</Label>
            <Input 
              value={title} 
              onChange={(e) => handleTitleChange(e.target.value)} 
              disabled={isViewOnly || isUploading}
              placeholder="Digite o título do destaque..."
            />
          </div>

          {/* NOVO CAMPO: SLUG */}
          <div className="space-y-2">
            <Label className="font-bold flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              Slug da URL (Link amigável)
            </Label>
            <Input 
              value={slug} 
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))} 
              disabled={isViewOnly || isUploading}
              placeholder="ex: terco-dos-homens"
              className="bg-slate-50 font-mono text-xs"
            />
            <p className="text-[10px] text-slate-400">O link será: /noticias/{slug || '...'}</p>
          </div>

          {/* BOTÕES */}
          <div className="grid grid-cols-2 gap-4 border-l-4 border-primary/20 pl-4 py-2 bg-slate-50/50 rounded-r-lg">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">Texto do Botão</Label>
              <Input 
                value={btnText} 
                onChange={(e) => setBtnText(e.target.value)} 
                disabled={isViewOnly || isUploading}
                placeholder="Ex: Saiba Mais"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">Link do Botão (URL)</Label>
              <div className="relative">
                <Input 
                  value={btnUrl} 
                  onChange={(e) => setBtnUrl(e.target.value)} 
                  disabled={isViewOnly || isUploading}
                  placeholder="Ex: /noticias/slug"
                  className="bg-white pl-8"
                />
                <LinkIcon className="w-3 h-3 absolute left-3 top-3 text-slate-400" />
              </div>
            </div>
          </div>

          {/* IMAGEM */}
          <div className="space-y-2">
            <Label className="font-bold">Imagem do Banner</Label>
            <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 min-h-[160px] flex items-center justify-center bg-slate-50">
              {image ? (
                <div className="relative w-full aspect-[3/1] rounded-lg overflow-hidden border">
                  <img src={image} className="w-full h-full object-cover" alt="Banner" />
                  {!isViewOnly && (
                    <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"><X className="w-3 h-3" /></button>
                  )}
                </div>
              ) : (
                !isViewOnly && (
                  <label className="cursor-pointer flex flex-col items-center">
                    <UploadCloud className="w-8 h-8 text-blue-600 mb-2" />
                    <span className="text-sm font-bold">Clique para enviar</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setImage(ev.target?.result as string);
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </label>
                )
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose}>Fechar</Button>
          {!isViewOnly && (
            <Button onClick={handleSave} disabled={isUploading} className="bg-primary hover:bg-primary/90 font-bold min-w-[140px]">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Salvar Alterações"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}