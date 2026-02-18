"use client";

import React, { useState } from "react";
import {
  Save,
  ArrowLeft,
  Calendar,
  Share2,
  Facebook,
  Instagram,
  Linkedin,
  X,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Textarea } from "@/components/admin/ui/textarea";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/admin/ui/rich-text-editor";
import { savePost } from "@/actions/posts";

export default function NewPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // --- ESTADOS ---
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("noticias");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isHighlight, setIsHighlight] = useState(false);
  const [highlightExpiry, setHighlightExpiry] = useState("");

  const handleSave = async () => {
    if (!title || !content) {
      toast.error("Preencha pelo menos o Título e o Conteúdo.");
      return;
    }

    setSaving(true);

    try {
      const result = await savePost(null, {
        title,
        slug: title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-"),
        summary,
        category,
        content,
        coverImage,
        isHighlight,
        highlightExpiresAt: highlightExpiry ? new Date(highlightExpiry) : null,
        status: "published",
      });

      if (result.success) {
        toast.success("Post publicado com sucesso!");
        router.push("/admin/posts");
      } else {
        toast.error(result.error || "Erro ao publicar.");
        setSaving(false);
      }
    } catch (error: any) {
      toast.error("Erro de conexão com o servidor.");
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("A imagem é muito grande! Escolha um arquivo de até 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => setCoverImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* CABEÇALHO */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-2 md:px-0">
        <div>
          <Link
            href="/admin/posts"
            className="text-xs font-medium text-slate-500 hover:text-primary flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3 h-3" /> Voltar para lista
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Novo Post
          </h1>
          <p className="text-sm text-slate-500">
            Crie notícias, eventos ou formações para o site.
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <Link href="/admin/posts">
            <Button variant="outline" className="bg-white">
              Cancelar
            </Button>
          </Link>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 font-bold"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Publicar Post
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start px-2 md:px-0">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title=":: Conteúdo Principal">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold">
                  Título da Postagem <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Ex: Festa do Padroeiro atrai multidão..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Resumo / Subtítulo</Label>
                <Textarea
                  placeholder="Breve texto para os cards..."
                  className="h-20 resize-none"
                  maxLength={160}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
                <div className="text-[10px] text-right text-slate-400">
                  {summary.length}/160 caracteres
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Categoria</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="noticias">Notícias</option>
                  <option value="eventos">Eventos</option>
                  <option value="formacoes">Formações</option>
                  <option value="avisos">Avisos Paroquiais</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Conteúdo Completo</Label>
                <RichTextEditor content={content} onChange={setContent} />
              </div>
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title=":: Imagem de Destaque (Capa)">
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors bg-white min-h-[200px]">
                {coverImage ? (
                  <div className="relative w-full">
                    <img
                      src={coverImage}
                      alt="Capa"
                      className="w-full h-auto object-cover rounded-lg shadow-sm"
                    />
                    <button
                      onClick={() => setCoverImage(null)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer w-full h-full text-center py-4">
                    <div className="p-4 bg-slate-100 rounded-full mb-3 text-slate-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      Enviar imagem de capa
                    </span>
                    <p className="text-[10px] text-slate-500 mt-2 px-4 leading-relaxed">
                      Recomendado: **1200x675px** (Proporção 16:9) <br />
                      Formatos: **JPG, PNG ou WEBP** (Máx: 2MB)
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* BLOCO DE DESTAQUE PERSONALIZADO */}
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between p-3 bg-slate-600 rounded-lg shadow-sm border border-slate-500">
                <span className="text-sm font-bold text-white uppercase tracking-tight">
                  Destacar na Capa?
                </span>
                <div
                  className={cn(
                    "cursor-pointer w-10 h-5 rounded-full relative transition-colors duration-300",
                    isHighlight ? "bg-amber-500" : "bg-slate-400",
                  )}
                  onClick={() => setIsHighlight(!isHighlight)}
                >
                  <div
                    className={cn(
                      "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                      isHighlight ? "left-5.5" : "left-0.5",
                    )}
                  />
                </div>
              </div>
              {isHighlight && (
                <div className="animate-in slide-in-from-top-2 space-y-2 pt-2 border-t border-slate-100">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Expira do destaque em (Opcional):
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="datetime-local"
                      className="pl-9 text-xs border-slate-200 focus:ring-primary"
                      value={highlightExpiry}
                      onChange={(e) => setHighlightExpiry(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </AdminCard>

          <AdminCard title=":: Divulgação">
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Compartilhamento rápido:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {/* Botões com as cores e ícones padrão PMM */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-blue-600 border-blue-100 bg-blue-50/50 hover:bg-blue-500 transition-colors"
                  onClick={() =>
                    toast.info("Salve o evento para habilitar o link.")
                  }
                >
                  <Facebook className="w-3.5 h-3.5 mr-2" /> Facebook
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-green-600 border-green-100 bg-green-50/50 hover:bg-green-500 transition-colors"
                  onClick={() =>
                    toast.info("Salve o evento para habilitar o link.")
                  }
                >
                  <Share2 className="w-3.5 h-3.5 mr-2" /> WhatsApp
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-pink-600 border-pink-100 bg-pink-50/50 hover:bg-pink-500 transition-colors"
                  onClick={() =>
                    toast.info("Salve o evento para habilitar o link.")
                  }
                >
                  <Instagram className="w-3.5 h-3.5 mr-2" /> Instagram
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-slate-700 border-slate-100 bg-slate-50/50 hover:bg-slate-500 transition-colors"
                  onClick={() =>
                    toast.info("Salve o evento para habilitar o link.")
                  }
                >
                  <X className="w-3.5 h-3.5 mr-2" /> Twitter/X
                </Button>
              </div>
              <p className="text-[9px] text-slate-400 italic">
                * O link de compartilhamento é gerado automaticamente após a
                publicação.
              </p>
            </div>
          </AdminCard>
        </div>
      </div>

      {/* BOTÃO MOBILE FIXO */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-50 shadow-lg">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-12 text-base font-bold bg-primary shadow-xl"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Save className="w-5 h-5 mr-2" />
          )}
          Publicar Postagem
        </Button>
      </div>
    </div>
  );
}
