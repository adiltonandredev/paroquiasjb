"use client";

import React, { useState, useEffect, use } from "react";
import {
  Save,
  ArrowLeft,
  Calendar,
  Share2,
  Facebook,
  Instagram,
  X,
  Image as ImageIcon,
  Loader2,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Textarea } from "@/components/admin/ui/textarea";
import RichTextEditor from "@/components/admin/ui/rich-text-editor";
import { getPostById, savePost } from "@/actions/posts";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const postId = parseInt(id);

  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- ESTADOS ATUALIZADOS ---
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("noticias");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isHighlight, setIsHighlight] = useState(false);
  const [highlightExpiresAt, setHighlightExpiresAt] = useState("");

  useEffect(() => {
    async function loadData() {
      const result = await getPostById(postId);
      if (result.success && result.data) {
        const p = result.data;
        setTitle(p.title);
        setSummary(p.summary || "");
        setCategory(p.category || "noticias");
        setContent(p.content || "");
        setCoverImage(p.coverImage || null);
        setIsHighlight(p.isHighlight || false);
        // Formata a data para o input datetime-local
        setHighlightExpiresAt(
          p.highlightExpiresAt
            ? new Date(p.highlightExpiresAt).toISOString().slice(0, 16)
            : "",
        );
        setIsLoading(false);
      } else {
        toast.error("Postagem não encontrada.");
        router.push("/admin/posts");
      }
    }
    loadData();
  }, [postId, router]);

  const generateSlug = (val: string) =>
    val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const handleSave = async () => {
    if (!title || !content) {
      toast.error("Preencha o Título e o Conteúdo.");
      return;
    }

    setSaving(true);
    const result = await savePost(postId, {
      title,
      slug: generateSlug(title),
      summary,
      category,
      content,
      coverImage,
      isHighlight,
      highlightExpiresAt: highlightExpiresAt
        ? new Date(highlightExpiresAt)
        : null,
      status: "published",
    });

    if (result.success) {
      toast.success("Postagem atualizada!");
      router.refresh();
      router.push("/admin/posts");
    } else {
      toast.error(result.error || "Erro ao salvar.");
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Máx 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => setCoverImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (isLoading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/admin/posts"
            className="text-xs font-medium text-slate-500 hover:text-primary flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3 h-3" /> Voltar para lista
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Editar Post
          </h1>
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
            Salvar Alterações
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title=":: Conteúdo Principal">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold">
                  Título da Postagem <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Resumo / Subtítulo</Label>
                <Textarea
                  className="h-20 resize-none"
                  maxLength={160}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase">
                  Categoria
                </Label>
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
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 bg-white min-h-[200px] flex items-center justify-center">
              {coverImage ? (
                <div className="relative w-full">
                  <img
                    src={coverImage}
                    alt="Capa"
                    className="w-full h-auto rounded-lg shadow-sm"
                  />
                  <button
                    onClick={() => setCoverImage(null)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer py-4 w-full h-full text-center">
                  <div className="p-4 bg-slate-100 rounded-full mb-3 text-slate-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    Alterar imagem de capa
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
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between p-3 bg-slate-600 rounded-lg text-white shadow-sm border border-slate-500">
                <span className="text-sm font-bold uppercase tracking-tight">
                  Destacar na Capa?
                </span>
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-primary cursor-pointer"
                  checked={isHighlight}
                  onChange={(e) => setIsHighlight(e.target.checked)}
                />
              </div>

              {isHighlight && (
                <div className="space-y-2 pt-2 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Expira em (Opcional):
                  </Label>
                  <Input
                    type="datetime-local"
                    value={highlightExpiresAt}
                    onChange={(e) => setHighlightExpiresAt(e.target.value)}
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
              )}
            </div>
          </AdminCard>

          <AdminCard title=":: Divulgação">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-blue-600 border-blue-100 bg-blue-50/50 hover:bg-blue-500 hover:text-white transition-all"
                >
                  <Facebook className="w-3.5 h-3.5 mr-2" /> Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-green-600 border-green-100 bg-green-50/50 hover:bg-green-500 hover:text-white transition-all"
                >
                  <Share2 className="w-3.5 h-3.5 mr-2" /> WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-pink-600 border-pink-100 bg-pink-50/50 hover:bg-pink-500 hover:text-white transition-all"
                >
                  <Instagram className="w-3.5 h-3.5 mr-2" /> Instagram
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-slate-700 border-slate-100 bg-slate-50/50 hover:bg-slate-500 hover:text-white transition-all"
                >
                  <X className="w-3.5 h-3.5 mr-2" /> Twitter/X
                </Button>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>

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
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
