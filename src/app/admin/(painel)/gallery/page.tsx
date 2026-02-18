"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Image as ImageIcon, Plus, Search, Edit, Trash2, Calendar, 
  MoreVertical, FolderOpen, Eye, AlertCircle, Ban, Loader2 
} from "lucide-react";
import { toast } from "sonner";

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
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/admin/ui/dialog";
import { DeleteButton } from "@/components/admin/ui/delete-button"; 
import { getAlbums, deleteAlbum } from "@/actions/gallery"; // Certifique-se de criar esta action

export default function GalleryList() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // BUSCA DADOS REAIS DO BANCO
  useEffect(() => {
    async function fetchAlbums() {
      try {
        const result = await getAlbums();
        if (result.success && result.data) {
          setAlbums(result.data);
        }
      } catch (error) {
        toast.error("Erro ao carregar galeria.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchAlbums();
  }, []);

  // FUNÇÃO DE EXCLUSÃO CORRIGIDA (SEM SUBLINHADO)
  const handleDelete = async (id: number) => {
    try {
      const result = await deleteAlbum(id);
      if (result.success) {
        setAlbums((current) => current.filter((a) => a.id !== id));
        toast.success("Álbum excluído com sucesso!");
      } else {
        toast.error(result.error || "Erro ao excluir álbum.");
      }
    } catch (error) {
      toast.error("Erro de conexão com o servidor.");
    }
  };

  const handleBlockDelete = () => {
    toast.warning("Bloqueado: Esvazie o álbum antes de apagar a pasta.");
  };

  const filteredAlbums = albums.filter(album => 
    album.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24 px-2 md:px-0">
      <PageHeader 
        title="Galeria de Fotos" 
        subtitle="Gerencie álbuns e coleções de imagens."
        icon={ImageIcon}
        action={
            <Link href="/admin/gallery/new">
                <Button className="bg-primary hover:bg-primary/90 font-bold">
                    <Plus className="w-4 h-4 mr-2" /> Criar Álbum
                </Button>
            </Link>
        }
      />

      <div className="flex gap-4 max-w-md">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Buscar álbum..." 
              className="pl-9 bg-white" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
          <p className="text-sm font-medium">Carregando álbuns...</p>
        </div>
      ) : filteredAlbums.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAlbums.map((album) => {
                // Lógica de proteção: só deleta se o contador for zero no banco
                const canDelete = album._count?.photos === 0 || album.count === 0;

                return (
                    <div key={album.id} className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                        <div className="relative h-48 bg-slate-100 overflow-hidden">
                            {album.cover ? (
                                <img src={album.cover} alt={album.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                  <ImageIcon size={40} className="opacity-20 mb-1" />
                                  <span className="text-[10px] uppercase font-bold">Sem Capa</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                            <div className="absolute bottom-3 left-3 text-white text-xs font-bold flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" /> {album._count?.photos || album.count || 0} fotos
                            </div>

                            <div className="absolute top-2 right-2 flex gap-1">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-colors focus:outline-none"><Eye className="w-4 h-4" /></button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md bg-white p-6 rounded-2xl shadow-2xl border-none">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2 font-bold text-xl"><FolderOpen className="w-5 h-5 text-primary" /> {album.name}</DialogTitle>
                                            <DialogDescription>Detalhes do Álbum Paroquial</DialogDescription>
                                        </DialogHeader>
                                        <div className="mt-4 space-y-4">
                                            <div className="w-full h-48 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
                                                {album.cover ? <img src={album.cover} className="w-full h-full object-cover" /> : 
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Recomendado: 1200x800px</span>}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] text-slate-400 uppercase font-bold">Data</span>
                                                    <span className="font-bold flex items-center gap-2 text-slate-700"><Calendar className="w-3.5 h-3.5"/> {album.date ? new Date(album.date).toLocaleDateString('pt-BR') : 'N/A'}</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[10px] text-slate-400 uppercase font-bold">Arquivos</span>
                                                    <span className="font-bold flex items-center gap-2 text-slate-700"><ImageIcon className="w-3.5 h-3.5"/> {album._count?.photos || album.count || 0} itens</span>
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-colors focus:outline-none"><MoreVertical className="w-4 h-4" /></button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 bg-white p-1 rounded-lg shadow-xl border-slate-100">
                                        <Link href={`/admin/gallery/${album.id}`}>
                                            <DropdownMenuItem className="cursor-pointer font-medium"><Edit className="w-4 h-4 mr-2" /> Gerenciar Fotos</DropdownMenuItem>
                                        </Link>
                                        
                                        <DropdownMenuItem className="p-0 focus:bg-transparent" onSelect={(e) => e.preventDefault()}>
                                          {canDelete ? (
                                            <div className="w-full flex items-center px-2 py-1.5 text-red-600">
                                              <DeleteButton 
                                                onDelete={() => { void handleDelete(album.id) }} 
                                                itemName={album.name}
                                                className="p-0 text-red-600 hover:bg-transparent"
                                              />
                                              <span className="text-sm ml-2 font-medium">Excluir Álbum</span>
                                            </div>
                                          ) : (
                                            <button onClick={handleBlockDelete} className="w-full flex items-center px-2 py-1.5 text-slate-300 cursor-not-allowed text-sm font-medium">
                                              <Ban size={16} className="mr-2" /> Excluir (Bloqueado)
                                            </button>
                                          )}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <h3 className="font-bold text-slate-800 truncate leading-tight mb-1" title={album.name}>{album.name}</h3>
                            <div className="flex items-center justify-between mt-auto">
                              <span className="text-[10px] text-slate-400 font-mono uppercase">ID: #{album.id}</span>
                              {!canDelete && (
                                <div className="flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded uppercase">
                                    <AlertCircle className="w-2.5 h-2.5" /> Protegido
                                </div>
                              )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
            <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm font-bold uppercase tracking-wider">Nenhum álbum encontrado</p>
        </div>
      )}
    </div>
  );
}