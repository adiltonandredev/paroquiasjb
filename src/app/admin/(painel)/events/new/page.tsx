"use client";

import React, { useState } from "react";
import {
  Save,
  ArrowLeft,
  Facebook,
  Instagram,
  Share2,
  Calendar,
  MapPin,
  Clock,
  Image as ImageIcon,
  X,
  Ticket,
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
import { saveEvent } from "@/actions/events";

export default function NewEventPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // --- ESTADOS ---
  const [name, setName] = useState("");
  const [category, setCategory] = useState("evento");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  // Estados do Destaque (Padrão PMM)
  const [isHighlight, setIsHighlight] = useState(false);
  const [highlightExpiry, setHighlightExpiry] = useState("");

  const handleSave = async () => {
    if (!name || !date || !time) {
      toast.error("Por favor, preencha pelo menos Nome, Data e Horário.");
      return;
    }

    setSaving(true);

    try {
      const result = await saveEvent(null, {
        name,
        category,
        date,
        time,
        location,
        summary,
        description,
        coverImage,
        hero: {
          active: isHighlight,
          expires_at: isHighlight ? highlightExpiry : null,
        },
      });

      if (result.success) {
        toast.success("Evento cadastrado com sucesso!");
        router.push("/admin/events");
      } else {
        toast.error(result.error || "Erro ao cadastrar.");
        setSaving(false);
      }
    } catch (error) {
      toast.error("Erro de conexão com o banco.");
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Imagem muito grande (Máx 2MB)");
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
            href="/admin/events"
            className="text-xs font-medium text-slate-500 hover:text-primary flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3 h-3" /> Voltar para lista
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Novo Evento
          </h1>
          <p className="text-sm text-slate-500">
            Agende missas, retiros, festas e formações.
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <Link href="/admin/events">
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
            Salvar Evento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start px-2 md:px-0">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title=":: Detalhes do Evento">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold">
                  Nome do Evento <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Ex: Acampamento de Jovens 2026"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold">
                    Data do Evento <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="date"
                      className="pl-9"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">
                    Horário <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="time"
                      className="pl-9"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold">Local / Endereço</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    className="pl-9"
                    placeholder="Ex: Salão Paroquial ou Capela São José..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </AdminCard>

          <AdminCard title=":: Descrição e Conteúdo">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold">
                  Breve Resumo (Para listagem)
                </Label>
                <Textarea
                  className="h-20 resize-none"
                  placeholder="Descrição curta que aparece no card..."
                  maxLength={150}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
                <div className="text-[10px] text-right text-slate-400">
                  {summary.length}/150 caracteres
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Informações Completas</Label>
                <RichTextEditor
                  content={description}
                  onChange={setDescription}
                />
              </div>
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title=":: Classificação">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 uppercase">
                Categoria
              </Label>
              <div className="relative">
                <Ticket className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <select
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 pl-9 text-sm focus:ring-2 focus:ring-primary outline-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="evento">Evento Geral</option>
                  <option value="acampamento">Acampamento</option>
                  <option value="missa">Santa Missa</option>
                  <option value="formacao">Formação</option>
                  <option value="retiro">Retiro</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
            </div>
          </AdminCard>

          <AdminCard title=":: Banner do Evento">
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors bg-white min-h-[180px]">
                {coverImage ? (
                  <div className="relative w-full group">
                    <img
                      src={coverImage}
                      alt="Banner"
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
                  <label className="flex flex-col items-center cursor-pointer w-full text-center py-4">
                    <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
                    <span className="text-sm font-bold text-slate-700">
                      Enviar Banner
                    </span>
                    <p className="text-[10px] text-slate-500 mt-2 px-4 leading-relaxed">
                      Ideal: **1920x600px** (Panorâmico) <br /> Formatos: **JPG
                      ou WEBP** (Máx: 2MB)
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
            <div className="space-y-4 mt-4">
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
                  <Label className="text-[10px] font-bold text-slate-400 uppercase">
                    Remover destaque em:
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="datetime-local"
                      className="pl-9 text-xs border-slate-200"
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

      {/* MOBILE FIXO */}
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
          Publicar Evento
        </Button>
      </div>
    </div>
  );
}
