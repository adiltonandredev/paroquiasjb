"use client";

import React, { useState, useEffect } from "react";
import { FileText, Plus, Search, Edit, Trash2, Eye, ExternalLink, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/admin/ui/dialog";
import { getPages, deletePage } from "@/actions/pages"; // <--- Importando Actions

// Tipo vindo do Prisma
interface Page {
  id: number;
  title: string;
  slug: string;
  type: string;
  status: string;
  content: string | null;
}

export default function PagesList() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Busca dados reais
  useEffect(() => {
    async function fetchPages() {
      const result = await getPages();
      if (result.success && result.data) {
        setPages(result.data as Page[]);
      }
      setIsLoading(false);
    }
    fetchPages();
  }, []);

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Deleta de verdade
  const handleDelete = async (id: number) => {
    const result = await deletePage(id);
    if (result.success) {
        setPages(current => current.filter(page => page.id !== id));
        toast.success("Página excluída com sucesso!");
    } else {
        toast.error("Erro ao excluir página.");
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <PageHeader
        title="Gerenciar Páginas Estáticas"
        subtitle="Crie e edite as páginas institucionais, menus e submenus do site."
        icon={FileText}
        action={
          <Link href="/admin/web-pages/new">
            <Button className="hidden md:flex bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Nova Página
            </Button>
          </Link>
        }
      />

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Buscar por título..." 
            className="pl-9 bg-white" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <AdminCard title=":: Listagem de páginas e menus">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Título / Menu</th>
                <th className="px-6 py-4 hidden md:table-cell">Slug (URL)</th>
                <th className="px-6 py-4 hidden md:table-cell">Tipo</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto"/></td></tr>
              ) : filteredPages.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Nenhuma página encontrada.</td></tr>
              ) : (
                filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {page.type === "submenu" ? (
                          <div className="pl-6 border-l-2 border-slate-200 flex items-center gap-2">
                             <span className="text-slate-400">↳</span> {page.title}
                          </div>
                      ) : page.title}
                    </td>
                    <td className="px-6 py-4 text-slate-500 hidden md:table-cell">{page.slug}</td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border
                        ${page.type === 'menu' ? 'bg-blue-50 text-blue-700 border-blue-100' : ''}
                        ${page.type === 'submenu' ? 'bg-slate-100 text-slate-600 border-slate-200' : ''}
                        ${page.type === 'footer' ? 'bg-orange-50 text-orange-700 border-orange-100' : ''}
                      `}>
                        {page.type === 'menu' && 'Menu Principal'}
                        {page.type === 'submenu' && 'Submenu'}
                        {page.type === 'footer' && 'Rodapé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                        ${page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
                      `}>
                        {page.status === 'published' ? <CheckCircle2 className="w-3 h-3"/> : <AlertCircle className="w-3 h-3"/>}
                        {page.status === 'published' ? 'Ativo' : 'Rascunho'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* VISUALIZAR */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white">
                            <DialogHeader>
                              <DialogTitle>{page.title}</DialogTitle>
                              <DialogDescription>Pré-visualização do conteúdo.</DialogDescription>
                            </DialogHeader>
                            <div className="mt-4 prose prose-slate max-w-none border-t border-slate-100 pt-6" dangerouslySetInnerHTML={{ __html: page.content || '<p>Sem conteúdo...</p>' }} />
                          </DialogContent>
                        </Dialog>

                        {/* EDITAR */}
                        <Link href={`/admin/web-pages/${page.id}`}>
                          <button className="flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>

                        {/* EXCLUIR */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir "{page.title}"?</AlertDialogTitle>
                              <AlertDialogDescription>Essa ação é irreversível.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(page.id)} className="bg-red-600 hover:bg-red-700 text-white">
                                Confirmar Exclusão
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-50 shadow-lg">
        <Link href="/admin/web-pages/new">
          <Button className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 shadow-lg">
            <Plus className="w-5 h-5 mr-2" /> Nova Página
          </Button>
        </Link>
      </div>
    </div>
  );
}