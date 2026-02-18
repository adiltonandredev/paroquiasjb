"use client";

import React, { useState, useEffect } from "react";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/admin/ui/rich-text-editor";
import { createPage, getParentPages } from "@/actions/pages"; // Importa getParentPages

export default function NewPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("menu"); 
  const [parentId, setParentId] = useState(""); // Novo estado para o Pai
  const [isActive, setIsActive] = useState(true);
  const [content, setContent] = useState("");
  const [parents, setParents] = useState<{id: number, title: string}[]>([]); // Lista de pais

  // Carrega a lista de possíveis pais (menus principais)
  useEffect(() => {
    async function loadParents() {
        const result = await getParentPages();
        if (result.success && result.data) setParents(result.data);
    }
    loadParents();
  }, []);

  const generateSlug = (value: string) => {
    return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  const handleSave = async () => {
    if (!title) return toast.error("O título é obrigatório.");
    if (type === "submenu" && !parentId) return toast.error("Selecione um Menu Pai para o submenu.");

    setSaving(true);
    const result = await createPage({ title, slug, type, parentId, isActive, content });

    if (result.success) {
        toast.success(result.message);
        router.push("/admin/web-pages");
    } else {
        toast.error(result.error);
        setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <Link href="/admin/web-pages" className="text-xs font-medium text-slate-500 hover:text-primary flex items-center gap-1 mb-2">
                <ArrowLeft className="w-3 h-3" /> Voltar para lista
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Nova Página</h1>
        </div>
        <div className="hidden md:flex gap-2">
            <Link href="/admin/web-pages"><Button variant="outline">Cancelar</Button></Link>
            <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Save className="w-4 h-4 mr-2" />} Salvar
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
            <AdminCard title=":: Informações Básicas">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Título da Página <span className="text-red-500">*</span></Label>
                        <Input placeholder="Ex: Horários de Missa" value={title} onChange={handleTitleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label>Slug (URL)</Label>
                        <div className="flex items-center">
                            <span className="bg-slate-100 border border-r-0 border-slate-200 text-slate-500 text-xs px-3 py-2.5 rounded-l-md hidden md:flex">paroquiasjb.org.br/</span>
                            <Input className="md:rounded-l-none" value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} />
                        </div>
                    </div>
                </div>
            </AdminCard>
            <AdminCard title=":: Conteúdo da Página">
                <RichTextEditor content={content} onChange={setContent} />
            </AdminCard>
        </div>

        <div className="space-y-6">
            <AdminCard title=":: Publicação">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 mb-4">
                    <span className="text-sm font-medium text-slate-700">Status</span>
                    <div className={cn("cursor-pointer w-10 h-5 rounded-full relative transition-colors duration-300", isActive ? "bg-green-500" : "bg-slate-300")} onClick={() => setIsActive(!isActive)}>
                        <div className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300", isActive ? "left-5.5" : "left-0.5")} />
                    </div>
                </div>
                {isActive ? <p className="text-xs text-green-600 font-medium">Visível no Site</p> : <p className="text-xs text-slate-500">Oculta (Rascunho)</p>}
            </AdminCard>

            <AdminCard title=":: Estrutura do Menu">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Tipo de Item</Label>
                        <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="menu">Item do Menu Principal</option>
                            <option value="submenu">Item de Submenu (Filho)</option>
                            <option value="footer">Apenas Rodapé</option>
                        </select>
                    </div>

                    {/* MOSTRA DROPDOWN SE FOR SUBMENU */}
                    {type === "submenu" && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <Label className="text-primary">Vincular ao Menu Pai:</Label>
                            <select 
                                className="flex h-10 w-full items-center justify-between rounded-md border border-primary/30 bg-blue-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                value={parentId}
                                onChange={(e) => setParentId(e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                {parents.map((p) => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                            <p className="text-[10px] text-slate-500">Esta página aparecerá quando o usuário passar o mouse sobre o menu escolhido.</p>
                        </div>
                    )}
                </div>
            </AdminCard>
        </div>
      </div>
      
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-50 shadow-lg">
        <Button onClick={handleSave} disabled={saving} className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 shadow-lg">
          {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin"/> : <Save className="w-5 h-5 mr-2" />} Salvar
        </Button>
      </div>
    </div>
  );
}