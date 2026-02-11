"use client";

import React, { useState, useEffect } from "react";
import { Save, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation"; 
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/admin/ui/button"; 
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/admin/ui/rich-text-editor";

// 1. IMPORTS DO ALERT DIALOG (Que você já tinha adicionado)
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/admin/ui/alert-dialog";

export default function EditPage() {
  const params = useParams(); 
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("menu"); 
  const [isActive, setIsActive] = useState(true);
  const [content, setContent] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setTitle("História da Paróquia");
      setSlug("historia-da-paroquia");
      setType("menu");
      setIsActive(true);
      setContent(`
        <h2>Nossa História</h2>
        <p>A paróquia foi fundada em <strong>1950</strong> e desde então tem sido um pilar na comunidade.</p>
        <p>Aqui você pode editar este texto livremente.</p>
      `);
      setIsLoading(false);
    }, 600);
  }, [params.id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSave = () => {
    console.log("Atualizando página ID:", params.id, { title, slug, content });
    alert("Página salva com sucesso!"); 
    router.push("/admin/web-pages"); 
  };

  // 2. FUNÇÃO DE EXCLUIR (Chamada pelo Modal)
  const handleDelete = () => {
      console.log("Excluindo item:", params.id);
      alert("Página excluída com sucesso!");
      router.push("/admin/web-pages");
  };

  if (isLoading) {
    return (
        <div className="flex h-[50vh] items-center justify-center">
            <div className="text-slate-500 animate-pulse">Carregando dados da página...</div>
        </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <Link href="/admin/web-pages" className="text-xs font-medium text-slate-500 hover:text-primary flex items-center gap-1 mb-2">
                <ArrowLeft className="w-3 h-3" /> Voltar para lista
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Editar Página</h1>
            <p className="text-sm text-slate-500">Editando o item: <span className="font-mono text-xs bg-slate-100 px-1 rounded text-slate-700">ID #{params.id}</span></p>
        </div>
        <div className="hidden md:flex gap-2">
            <Link href="/admin/web-pages">
                <Button variant="outline">Cancelar</Button>
            </Link>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" /> Salvar Alterações
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* COLUNA ESQUERDA (2/3) */}
        <div className="lg:col-span-2 space-y-6">
            
            <AdminCard title=":: Informações Básicas">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Título da Página <span className="text-red-500">*</span></Label>
                        <Input 
                            value={title}
                            onChange={handleTitleChange}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Slug (URL)</Label>
                        <div className="flex items-center">
                            <span className="bg-slate-100 border border-r-0 border-slate-200 text-slate-500 text-xs px-3 py-2.5 rounded-l-md hidden md:flex">
                                paroquiasjb.org.br/
                            </span>
                            <Input 
                                className="md:rounded-l-none" 
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </AdminCard>

            <AdminCard title=":: Conteúdo da Página">
                <RichTextEditor 
                    content={content} 
                    onChange={setContent} 
                />
            </AdminCard>
        </div>

        {/* COLUNA DIREITA (1/3) */}
        <div className="space-y-6">
            <AdminCard title=":: Publicação">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 mb-4">
                    <span className="text-sm font-medium text-slate-700">Status</span>
                    <div 
                        className={cn(
                            "cursor-pointer w-10 h-5 rounded-full relative transition-colors duration-300",
                            isActive ? "bg-green-500" : "bg-slate-300"
                        )}
                        onClick={() => setIsActive(!isActive)}
                    >
                        <div className={cn(
                            "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300",
                            isActive ? "left-5.5" : "left-0.5"
                        )} />
                    </div>
                </div>
                {isActive ? (
                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Visível no Site
                    </p>
                ) : (
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                         <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Oculta (Rascunho)
                    </p>
                )}
            </AdminCard>

            <AdminCard title=":: Estrutura do Menu">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Tipo de Item</Label>
                        <select 
                            className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="menu">Item do Menu Principal</option>
                            <option value="submenu">Item de Submenu</option>
                        </select>
                    </div>
                </div>
            </AdminCard>

            {/* 3. AQUI ESTÁ A MÁGICA DO MODAL DE EXCLUSÃO */}
            <div className="pt-4 border-t border-slate-200">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors">
                            <Trash2 className="w-4 h-4 mr-2" /> Excluir Página
                        </button>
                    </AlertDialogTrigger>
                    
                    <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso excluirá permanentemente a página <strong>{title}</strong> e removerá os dados do servidor.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white border-0"
                            >
                                Sim, excluir
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

        </div>
      </div>

      {/* BARRA MOBILE */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-50 shadow-lg">
        <Button onClick={handleSave} className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 shadow-lg">
          <Save className="w-5 h-5 mr-2" /> Salvar Alterações
        </Button>
      </div>

    </div>
  );
}