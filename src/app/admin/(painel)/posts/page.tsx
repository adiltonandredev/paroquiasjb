"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileText, Plus, Search, Edit, Trash2, Eye, 
  Calendar, Star, Filter, ExternalLink, ImageIcon 
} from "lucide-react";

import { PageHeader } from "@/components/admin/ui/page-header";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
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
// Importar o Dialog para visualização
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/admin/ui/dialog";

export default function PostsList() {
  // DADOS FALSOS PARA EXEMPLO
  const [posts, setPosts] = useState([
    { 
        id: 1, 
        title: "Festa do Padroeiro 2026", 
        category: "Eventos", 
        date: "10/06/2026", 
        highlight: true, 
        status: "Publicado",
        summary: "A tradicional festa reuniu milhares de fiéis...",
        content: "<p>Conteúdo completo do post...</p>" 
    },
    { 
        id: 2, 
        title: "Horários de Missa na Quaresma", 
        category: "Avisos", 
        date: "05/03/2026", 
        highlight: false, 
        status: "Publicado",
        summary: "Confira os novos horários...",
        content: "<p>Tabela de horários...</p>" 
    },
    { 
        id: 3, 
        title: "Inscrições para Catequese", 
        category: "Formação", 
        date: "01/02/2026", 
        highlight: true, 
        status: "Rascunho",
        summary: "Estão abertas as inscrições...",
        content: "<p>Formulário de inscrição...</p>" 
    },
  ]);

  const handleDelete = (id: number) => {
    setPosts(posts.filter(p => p.id !== id));
    alert("Post excluído!");
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Cabeçalho */}
      <PageHeader 
        title="Gerenciar Posts" 
        subtitle="Notícias, eventos e avisos da paróquia."
        icon={FileText}
        action={
            <Link href="/admin/posts/new">
                <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" /> Novo Post
                </Button>
            </Link>
        }
      />

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Buscar por título..." className="pl-9 bg-white" />
        </div>
        <div className="flex gap-2">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50">
                <Filter className="w-4 h-4" /> Filtrar Categoria
             </button>
        </div>
      </div>

      {/* Tabela */}
      <AdminCard title=":: Últimas Publicações">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                    <tr>
                        <th className="px-6 py-4">Título</th>
                        <th className="px-6 py-4 hidden md:table-cell">Categoria</th>
                        <th className="px-6 py-4 hidden md:table-cell">Data</th>
                        <th className="px-6 py-4 text-center">Destaque</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4 font-medium text-slate-700">
                                {post.title}
                                {post.status === "Rascunho" && (
                                    <span className="ml-2 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200">Rascunho</span>
                                )}
                            </td>
                            <td className="px-6 py-4 hidden md:table-cell">
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                                    {post.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 hidden md:table-cell text-slate-500">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {post.date}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                {post.highlight ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100" title="Exibido no Hero">
                                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Capa
                                    </span>
                                ) : (
                                    <span className="text-slate-300">-</span>
                                )}
                            </td>
                            
                            {/* Ações */}
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                    
                                    {/* 1. VISUALIZAR (MODAL) */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button className="flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors" title="Visualizar">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white">
                                            <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                                                    {post.title}
                                                    <a href="#" className="text-xs font-normal text-blue-600 hover:underline flex items-center gap-1 ml-2">
                                                        <ExternalLink className="w-3 h-3" /> Link público
                                                    </a>
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Categoria: <span className="font-semibold text-primary uppercase text-[10px] tracking-wider">{post.category}</span> • Postado em: {post.date}
                                                </DialogDescription>
                                            </DialogHeader>
                                            
                                            {/* CONTEÚDO SIMULADO DO POST */}
                                            <div className="mt-4 space-y-6">
                                                {/* Imagem de Capa Simulada */}
                                                <div className="w-full h-64 bg-slate-100 rounded-lg flex flex-col items-center justify-center text-slate-400 border border-slate-200">
                                                    <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                                                    <span className="text-sm">Imagem de Capa do Post</span>
                                                </div>
                                                
                                                {/* Texto Simulado */}
                                                <div className="prose prose-slate max-w-none">
                                                    <p className="text-lg text-slate-700 font-medium italic border-l-4 border-primary pl-4">
                                                        "{post.summary}"
                                                    </p>
                                                    <div className="mt-6 space-y-4 text-slate-600">
                                                        <p>Aqui seria exibido o conteúdo completo formatado que você inseriu no editor de texto.</p>
                                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    
                                    {/* 2. EDITAR (CORRIGIDO LINK) */}
                                    <Link href={`/admin/posts/${post.id}`}> 
                                        <button className="flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Editar">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </Link>

                                    {/* 3. EXCLUIR */}
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button className="flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors" title="Excluir">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-white">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Excluir Publicação?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Você está excluindo <strong>"{post.title}"</strong>. Esta ação não pode ser desfeita.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white border-0" onClick={() => handleDelete(post.id)}>
                                                    Sim, excluir
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </AdminCard>
    </div>
  );
}