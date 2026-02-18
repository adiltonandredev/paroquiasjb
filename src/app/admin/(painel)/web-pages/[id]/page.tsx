"use client";

import React, { useState, useEffect } from "react";
import { Save, ArrowLeft, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation"; 
import { toast } from "sonner";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/admin/ui/button"; 
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/admin/ui/rich-text-editor";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/admin/ui/alert-dialog";
import { getPageById, updatePage, deletePage, getParentPages } from "@/actions/pages"; // Adicionado getParentPages

export default function EditPage() {
  const params = useParams(); 
  const router = useRouter();
  const pageId = parseInt(params.id as string);
  
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // ESTADOS DO FORMULÁRIO
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("menu"); 
  const [parentId, setParentId] = useState(""); // Estado para o Menu Pai
  const [isActive, setIsActive] = useState(true);
  const [content, setContent] = useState("");
  const [parents, setParents] = useState<{id: number, title: string}[]>([]); // Lista de menus disponíveis

  // CARREGAR DADOS
  useEffect(() => {
    async function loadData() {
        // Busca a página atual e a lista de possíveis pais ao mesmo tempo
        const [pageResult, parentsResult] = await Promise.all([
            getPageById(pageId),
            getParentPages()
        ]);

        if (pageResult.success && pageResult.data) {
            const data = pageResult.data;
            setTitle(data.title);
            setSlug(data.slug);
            setType(data.type);
            setParentId(data.parentId ? data.parentId.toString() : "");
            setIsActive(data.status === "published");
            setContent(data.content || "");
        } else {
            toast.error("Página não encontrada.");
            router.push("/admin/web-pages");
        }

        if (parentsResult.success) {
            // Filtra para a própria página não aparecer como pai dela mesma
            setParents(parentsResult.data.filter((p: any) => p.id !== pageId));
        }

        setIsLoading(false);
    }
    loadData();
  }, [pageId, router]);

  const handleSave = async () => {
    if (!title) return toast.error("Título é obrigatório.");
    if (type === "submenu" && !parentId) return toast.error("Selecione um Menu Pai.");
    
    setSaving(true);
    // Enviamos o parentId convertido para número
    const result = await updatePage(pageId, { 
        title, 
        slug, 
        type, 
        parentId: type === "submenu" ? parentId : null, 
        isActive, 
        content 
    });
    
    if (result.success) {
        toast.success(result.message);
        router.push("/admin/web-pages"); 
    } else {
        toast.error(result.error);
        setSaving(false);
    }
  };

  const handleDelete = async () => {
      const result = await deletePage(pageId);
      if (result.success) {
          toast.success("Página excluída.");
          router.push("/admin/web-pages");
      } else {
          toast.error("Erro ao excluir.");
      }
  };

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin"/></div>;
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <Link href="/admin/web-pages" className="text-xs font-medium text-slate-500 hover:text-primary flex items-center gap-1 mb-2">
                <ArrowLeft className="w-3 h-3" /> Voltar para lista
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Editar Página</h1>
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
                        <Label>Título da Página</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Slug (URL)</Label>
                        <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
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

                    {/* MOSTRA O SELECT DE PAI SE FOR SUBMENU */}
                    {type === "submenu" && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <Label className="text-primary font-bold">Vincular ao Menu Pai:</Label>
                            <select 
                                className="flex h-10 w-full rounded-md border border-primary/30 bg-blue-50/50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                                value={parentId}
                                onChange={(e) => setParentId(e.target.value)}
                            >
                                <option value="">Selecione o pai...</option>
                                {parents.map((p) => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </AdminCard>

            <div className="pt-4 border-t border-slate-200">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors">
                            <Trash2 className="w-4 h-4 mr-2" /> Excluir Página
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>Esta ação excluirá permanentemente a página <strong>{title}</strong>.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white border-0">Sim, excluir</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
      </div>
      
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-50 shadow-lg">
        <Button onClick={handleSave} disabled={saving} className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 shadow-lg">
          {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
}