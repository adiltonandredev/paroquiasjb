"use client";

import React, { useState, useEffect } from "react";
import { 
  Save, ArrowLeft, Calendar, Image as ImageIcon, 
  UploadCloud, X, Share2, Instagram, Facebook, Download, Loader2 
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/admin/ui/dialog";

// Interface da Foto
interface Photo {
  id: number;
  url: string;
  filename: string;
}

export default function EditAlbumPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Estados do Álbum
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);

  // 1. SIMULAÇÃO: CARREGAR DADOS
  useEffect(() => {
    // Se for "new", não carrega nada
    if (params.id === "new") {
        setIsLoading(false);
        return;
    }

    // Carregar dados existentes (Simulação)
    setTimeout(() => {
      setName("Acampamento FAC 2026");
      setDate("2026-02-15");
      setPhotos([
        { id: 1, filename: "foto_01.jpg", url: "https://placehold.co/600x400/EEE/31343C?text=Foto+01" },
        { id: 2, filename: "foto_02.jpg", url: "https://placehold.co/600x400/EEE/31343C?text=Foto+02" },
        { id: 3, filename: "foto_03.jpg", url: "https://placehold.co/600x400/EEE/31343C?text=Foto+03" },
      ]);
      setIsLoading(false);
    }, 600);
  }, [params.id]);

  // Função para gerar "Slug" da pasta (padronização de arquivos)
  const getFolderSlug = () => {
      return name ? name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") : "sem-nome";
  };

  // Simulação de Upload Múltiplo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newPhotos: Photo[] = Array.from(files).map((file, index) => ({
        id: Date.now() + index,
        filename: file.name,
        // Aqui simulamos o caminho final: public/uploads/gallery/nome-album/arquivo
        url: URL.createObjectURL(file) 
      }));
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (id: number) => {
    setPhotos(photos.filter(p => p.id !== id));
  };

  const handleSave = () => {
    if (!name) return alert("O nome do álbum é obrigatório.");

    // Caminho Simulado onde os arquivos ficariam
    const storagePath = `src/public/uploads/gallery/${getFolderSlug()}/`;
    
    console.log("Salvando Álbum:", { 
        name, 
        date, 
        storagePath, // <-- Aqui está sua regra de pastas
        photos_count: photos.length 
    });
    
    alert(`Álbum salvo!\nArquivos organizados em: ${storagePath}`);
    router.push("/admin/gallery");
  };

  // Função Social (Simulação)
  const handleSocialShare = (network: string, photoUrl: string) => {
    // Em produção, isso abriria a API da rede social ou baixaria a imagem formatada
    alert(`Preparando imagem para ${network}...\nOrigem: ${photoUrl}`);
  };

  if (isLoading) {
    return (
        <div className="flex h-[50vh] items-center justify-center text-slate-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Carregando álbum...
        </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* CABEÇALHO */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <Link href="/admin/gallery" className="text-xs font-medium text-slate-500 hover:text-primary flex items-center gap-1 mb-2">
                <ArrowLeft className="w-3 h-3" /> Voltar para galeria
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {params.id === "new" ? "Novo Álbum" : "Editar Álbum"}
            </h1>
            <p className="text-sm text-slate-500">
                {params.id === "new" ? "Crie uma coleção de fotos." : `Gerenciando fotos de: ${name}`}
            </p>
        </div>
        <div className="hidden md:flex gap-2">
            <Link href="/admin/gallery">
                <Button variant="outline">Cancelar</Button>
            </Link>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" /> Salvar Álbum
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* COLUNA ESQUERDA (CONFIGURAÇÕES) */}
        <div className="space-y-6">
             <AdminCard title=":: Informações do Álbum">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Nome do Álbum / Evento <span className="text-red-500">*</span></Label>
                        <Input 
                            placeholder="Ex: Acampamento FAC 2026" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <p className="text-[10px] text-slate-400">
                            Isso criará a pasta: <span className="font-mono text-slate-600">/uploads/gallery/{getFolderSlug()}/</span>
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Data (Opcional)</Label>
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
                </div>
            </AdminCard>

            <AdminCard title=":: Capa do Álbum">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                    {photos.length > 0 ? (
                        <div className="space-y-2">
                             <img src={photos[0].url} className="w-full h-32 object-cover rounded-md" alt="Capa" />
                             <p className="text-xs text-slate-500">A primeira foto será usada como capa.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-4 text-slate-400">
                            <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                            <span className="text-xs">Adicione fotos para definir a capa</span>
                        </div>
                    )}
                </div>
            </AdminCard>
        </div>

        {/* COLUNA DIREITA (GRID DE FOTOS) */}
        <div className="lg:col-span-2 space-y-6">
            <AdminCard title={`:: Fotos do Álbum (${photos.length})`}>
                <div className="space-y-6">
                    
                    {/* ÁREA DE UPLOAD */}
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 hover:bg-slate-50 transition-colors text-center cursor-pointer relative">
                        <input 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handlePhotoUpload}
                        />
                        <div className="flex flex-col items-center justify-center pointer-events-none">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3">
                                <UploadCloud className="w-6 h-6" />
                            </div>
                            <span className="font-medium text-slate-700">Clique ou arraste para enviar fotos</span>
                            <span className="text-xs text-slate-400 mt-1">Múltiplos arquivos permitidos (JPG, PNG)</span>
                        </div>
                    </div>

                    {/* GRID DE FOTOS */}
                    {photos.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {photos.map((photo) => (
                                <div key={photo.id} className="group relative bg-slate-100 rounded-lg overflow-hidden border border-slate-200 aspect-square">
                                    <img src={photo.url} alt="Foto" className="w-full h-full object-cover" />
                                    
                                    {/* OVERLAY DE AÇÕES */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                        
                                        {/* Botão Remover */}
                                        <button 
                                            onClick={() => removePhoto(photo.id)}
                                            className="absolute top-2 right-2 text-white/80 hover:text-red-400"
                                            title="Remover foto"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>

                                        {/* Botão Social (Modal) */}
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="secondary" className="h-7 text-xs w-full bg-white/90 hover:bg-white text-slate-900">
                                                    <Share2 className="w-3 h-3 mr-1" /> Postar
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-sm bg-white">
                                                <DialogHeader>
                                                    <DialogTitle>Postar nas Redes</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="aspect-video w-full rounded-md overflow-hidden bg-slate-100 mb-4">
                                                        <img src={photo.url} className="w-full h-full object-contain" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Button variant="outline" onClick={() => handleSocialShare("Instagram Stories", photo.url)} className="flex items-center gap-2">
                                                            <Instagram className="w-4 h-4 text-pink-600" /> Stories
                                                        </Button>
                                                        <Button variant="outline" onClick={() => handleSocialShare("Instagram Feed", photo.url)} className="flex items-center gap-2">
                                                            <Instagram className="w-4 h-4 text-purple-600" /> Feed
                                                        </Button>
                                                        <Button variant="outline" onClick={() => handleSocialShare("Facebook", photo.url)} className="flex items-center gap-2">
                                                            <Facebook className="w-4 h-4 text-blue-600" /> Facebook
                                                        </Button>
                                                        <Button variant="outline" onClick={() => handleSocialShare("Download", photo.url)} className="flex items-center gap-2">
                                                            <Download className="w-4 h-4 text-slate-600" /> Baixar
                                                        </Button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                    </div>
                                    
                                    {/* Nome do arquivo (Rodapé da foto) */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[9px] p-1 truncate px-2">
                                        {photo.filename}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </AdminCard>
        </div>
      </div>

      {/* BARRA MOBILE */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-50 shadow-lg">
        <Button onClick={handleSave} className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 shadow-lg">
          <Save className="w-5 h-5 mr-2" /> Salvar Álbum
        </Button>
      </div>

    </div>
  );
}