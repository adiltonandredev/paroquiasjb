"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Image as ImageIcon, Plus, Search, Edit, Trash2, Calendar, 
  MoreVertical, FolderOpen, Eye, AlertCircle, Ban 
} from "lucide-react";

import { PageHeader } from "@/components/admin/ui/page-header";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";
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
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/admin/ui/dialog";

export default function GalleryList() {
  // DADOS FALSOS
  const [albums, setAlbums] = useState([
    { 
        id: 1, 
        name: "Acampamento FAC 2026", 
        date: "2026-02-15", 
        cover: "https://placehold.co/600x400/EEE/31343C?text=FAC+2026",
        count: 124, // TEM ARQUIVOS (Não pode excluir)
        folder: "/uploads/gallery/acampamento-fac-2026"
    },
    { 
        id: 2, 
        name: "Posse do Novo Pároco", 
        date: "2026-01-20", 
        cover: "https://placehold.co/600x400/EEE/31343C?text=Posse",
        count: 45, // TEM ARQUIVOS
        folder: "/uploads/gallery/posse-padre"
    },
    { 
        id: 3, 
        name: "Álbum de Teste Vazio", 
        date: "2025-06-24", 
        cover: "https://placehold.co/600x400/EEE/31343C?text=Vazio",
        count: 0, // VAZIO (Pode excluir)
        folder: "/uploads/gallery/album-teste"
    },
  ]);

  const handleDelete = (id: number) => {
    setAlbums(albums.filter(a => a.id !== id));
    alert("Álbum vazio excluído com sucesso!");
  };

  const handleBlockDelete = () => {
    alert("Bloqueado: Você precisa excluir as fotos de dentro do álbum antes de apagar a pasta.");
  };

  return (
    <div className="space-y-6 pb-24">
      <PageHeader 
        title="Galeria de Fotos" 
        subtitle="Gerencie álbuns e coleções de imagens."
        icon={ImageIcon}
        action={
            <Link href="/admin/gallery/new">
                <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" /> Criar Álbum
                </Button>
            </Link>
        }
      />

      {/* Filtros */}
      <div className="flex gap-4 max-w-md">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Buscar álbum..." className="pl-9 bg-white" />
        </div>
      </div>

      {/* GRID DE ÁLBUNS */}
      {albums.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {albums.map((album) => {
                const canDelete = album.count === 0;

                return (
                    <div key={album.id} className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                        
                        {/* Imagem de Capa */}
                        <div className="relative h-48 bg-slate-100 overflow-hidden">
                            <img 
                                src={album.cover} 
                                alt={album.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                            
                            {/* Contador de Fotos */}
                            <div className="absolute bottom-3 left-3 text-white text-xs font-medium flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" /> {album.count} fotos
                            </div>

                            {/* Menu de Ações (Top Right) */}
                            <div className="absolute top-2 right-2 flex gap-1">
                                
                                {/* VISUALIZAR (MODAL) */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-colors focus:outline-none" title="Ver Detalhes">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md bg-white">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2">
                                                <FolderOpen className="w-5 h-5 text-primary" />
                                                {album.name}
                                            </DialogTitle>
                                            <DialogDescription>Detalhes do Álbum</DialogDescription>
                                        </DialogHeader>
                                        
                                        <div className="mt-4 space-y-4">
                                            {/* Capa Ampliada */}
                                            <div className="w-full h-48 rounded-lg overflow-hidden border border-slate-200">
                                                <img src={album.cover} className="w-full h-full object-cover" />
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                <div className="space-y-1">
                                                    <span className="text-xs text-slate-500 block">Data do Evento</span>
                                                    <span className="font-medium flex items-center gap-2">
                                                        <Calendar className="w-3 h-3"/> 
                                                        {album.date ? new Date(album.date).toLocaleDateString('pt-BR') : 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-xs text-slate-500 block">Total de Arquivos</span>
                                                    <span className="font-medium flex items-center gap-2">
                                                        <ImageIcon className="w-3 h-3"/> {album.count} fotos
                                                    </span>
                                                </div>
                                                <div className="col-span-2 space-y-1 pt-2 border-t border-slate-200 mt-2">
                                                    <span className="text-xs text-slate-500 block">Caminho da Pasta</span>
                                                    <code className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded block truncate font-mono">
                                                        {album.folder}
                                                    </code>
                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-end gap-2 pt-2">
                                                <Link href={`/admin/gallery/${album.id}`} className="w-full">
                                                    <Button className="w-full">
                                                        <Edit className="w-4 h-4 mr-2" /> Gerenciar Fotos
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {/* DROPDOWN MENU */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-colors focus:outline-none">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 bg-white">
                                        <Link href={`/admin/gallery/${album.id}`}>
                                            <DropdownMenuItem className="cursor-pointer">
                                                <Edit className="w-4 h-4 mr-2" /> Editar / Fotos
                                            </DropdownMenuItem>
                                        </Link>
                                        
                                        {/* LÓGICA DE PROTEÇÃO AO DELETAR */}
                                        {canDelete ? (
                                            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50" onSelect={(e) => e.preventDefault()}>
                                                <AlertDialog>
                                                    <AlertDialogTrigger className="flex items-center w-full">
                                                        <Trash2 className="w-4 h-4 mr-2" /> Excluir Pasta
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="bg-white">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Excluir Álbum?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Tem certeza que deseja apagar a pasta <strong>"{album.name}"</strong>?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white border-0" onClick={() => handleDelete(album.id)}>
                                                                Sim, excluir
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuItem>
                                        ) : (
                                            /* ITEM BLOQUEADO */
                                            <DropdownMenuItem 
                                                className="cursor-not-allowed text-slate-400 group/delete" 
                                                onClick={handleBlockDelete}
                                            >
                                                <Ban className="w-4 h-4 mr-2" /> Excluir (Bloqueado)
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Informações Rodapé do Card */}
                        <div className="p-4">
                            <h3 className="font-semibold text-slate-800 truncate" title={album.name}>
                                {album.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                {album.date ? (
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> 
                                        {new Date(album.date).toLocaleDateString('pt-BR')}
                                    </span>
                                ) : (
                                    <span>Sem data</span>
                                )}
                            </div>
                            
                            {/* Aviso visual se não puder excluir */}
                            {!canDelete && (
                                <div className="mt-3 pt-2 border-t border-slate-50 flex items-center gap-1 text-[10px] text-amber-600">
                                    <AlertCircle className="w-3 h-3" />
                                    Contém arquivos (Esvazie para excluir)
                                </div>
                            )}
                        </div>

                    </div>
                );
            })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-slate-400">
            <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
            <p className="text-sm">Nenhum álbum criado ainda.</p>
        </div>
      )}
    </div>
  );
}