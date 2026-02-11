"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/admin/ui/dialog";

// 1. DEFINIÇÃO DO TIPO DE DADOS (O que o banco vai retornar)
interface Page {
  id: number;
  title: string;
  slug: string;
  type: "menu" | "submenu" | "footer"; // Tipos possíveis
  status: "published" | "draft";        // Status possíveis
  content?: string;                     // Conteúdo HTML (opcional na lista)
}

export default function PagesList() {
  // 2. ESTADO PARA GUARDAR OS DADOS (Começa vazio)
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 3. SIMULAÇÃO DE BUSCA NO BANCO DE DADOS (API)
  useEffect(() => {
    // Aqui você substituirá por: fetch('/api/pages').then(...)
    const fetchPages = () => {
      setTimeout(() => {
        const mockDbData: Page[] = [
          {
            id: 1,
            title: "História da Paróquia",
            slug: "/historia",
            type: "menu",
            status: "published",
            content: "<h2>História</h2><p>Conteúdo vindo do banco...</p>"
          },
          {
            id: 2,
            title: "Horários de Missa",
            slug: "/horarios",
            type: "submenu",
            status: "draft",
            content: "<h2>Horários</h2><p>Conteúdo vindo do banco...</p>"
          },
          {
            id: 3,
            title: "Fale Conosco",
            slug: "/contato",
            type: "footer",
            status: "published",
            content: "<h2>Contato</h2><p>Conteúdo vindo do banco...</p>"
          }
        ];
        setPages(mockDbData);
        setIsLoading(false);
      }, 500); // Delay artificial
    };

    fetchPages();
  }, []);

  // Filtro de busca simples (Frontend)
  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função auxiliar para deletar (Simulação)
  const handleDelete = (id: number) => {
    // Aqui viria: await fetch(`/api/pages/${id}`, { method: 'DELETE' })
    setPages(current => current.filter(page => page.id !== id));
    alert("Item excluído com sucesso (Simulação)");
  };

  return (
    <div className="space-y-6 pb-24">
      {/* CABEÇALHO */}
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

      {/* FILTROS */}
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

      {/* TABELA DE LISTAGEM */}
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
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Carregando dados...
                  </td>
                </tr>
              ) : filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Nenhuma página encontrada.
                  </td>
                </tr>
              ) : (
                // 4. RENDERIZAÇÃO DINÂMICA (MAP)
                filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-slate-50 transition-colors group">
                    
                    {/* TÍTULO */}
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {page.type === "submenu" ? (
                         <div className="pl-6 border-l-2 border-slate-200 flex items-center gap-2">
                            <span className="text-slate-400">↳</span> {page.title}
                         </div>
                      ) : (
                        page.title
                      )}
                    </td>

                    {/* SLUG */}
                    <td className="px-6 py-4 text-slate-500 hidden md:table-cell">
                      {page.slug}
                    </td>

                    {/* TIPO */}
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

                    {/* STATUS */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                        ${page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
                      `}>
                        {page.status === 'published' ? <CheckCircle2 className="w-3 h-3"/> : <AlertCircle className="w-3 h-3"/>}
                        {page.status === 'published' ? 'Ativo' : 'Rascunho'}
                      </span>
                    </td>

                    {/* AÇÕES */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end">
                        
                        {/* VISUALIZAR */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/20" title="Visualizar">
                              <Eye className="w-4 h-4" />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2 text-xl">
                                {page.title}
                                <a href="#" className="text-xs font-normal text-blue-600 hover:underline flex items-center gap-1 ml-2">
                                    <ExternalLink className="w-3 h-3" /> Ver no site
                                </a>
                              </DialogTitle>
                              <DialogDescription>
                                Pré-visualização do conteúdo.
                              </DialogDescription>
                            </DialogHeader>
                            {/* Renderiza o HTML do item específico */}
                            <div className="mt-4 prose prose-slate max-w-none border-t border-slate-100 pt-6" dangerouslySetInnerHTML={{ __html: page.content || '<p>Sem conteúdo...</p>' }} />
                          </DialogContent>
                        </Dialog>

                        {/* EDITAR */}
                        <Link href={`/admin/web-pages/${page.id}`}>
                          <button className="flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20" title="Editar">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>

                        {/* EXCLUIR */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20" title="Excluir">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir "{page.title}"?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação é irreversível e removerá o item do banco de dados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700 text-white border-0"
                                onClick={() => handleDelete(page.id)}
                              >
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

      {/* MOBILE BTN */}
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