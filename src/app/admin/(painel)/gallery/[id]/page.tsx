"use client";

import React, { useState, useEffect, use } from "react";
import {
  Save,
  ArrowLeft,
  Calendar,
  Image as ImageIcon,
  Star,
  CheckCircle2,
  UploadCloud,
  X,
  Share2,
  Instagram,
  Facebook,
  Download,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/admin/ui/dialog";
import { cn } from "@/lib/utils";
import {
  saveAlbum,
  getAlbumById,
  uploadSinglePhoto,
  deletePhoto,
} from "@/actions/gallery";
import { DeleteButton } from "@/components/admin/ui/delete-button";

interface Photo {
  id: string | number;
  url: string;
  filename: string;
}

export default function EditAlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const isNew = id === "new";

  const [isLoading, setIsLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) return;

    async function loadAlbum() {
      const result = await getAlbumById(parseInt(id));
      if (result.success && result.data) {
        setName(result.data.name);
        setDate(
          result.data.date
            ? new Date(result.data.date).toISOString().split("T")[0]
            : "",
        );
        setPhotos(result.data.photos || []);
        setCoverUrl(result.data.cover || null);
      } else {
        toast.error("Álbum não encontrado.");
        router.push("/admin/gallery");
      }
      setIsLoading(false);
    }
    void loadAlbum();
  }, [id, isNew, router]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSizeInMB = 2;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Formato não permitido (Use JPG, PNG ou WEBP).`);
        return;
      }
      if (file.size > maxSizeInMB * 1024 * 1024) {
        errors.push(`${file.name}: Arquivo muito pesado (Máximo ${maxSizeInMB}MB).`);
        return;
      }
      validFiles.push(file);
    });

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
    }

    if (validFiles.length === 0) return;

    const newPhotos = await Promise.all(
      validFiles.map(async (file) => {
        return new Promise<Photo>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve({
              id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              filename: file.name,
              url: event.target?.result as string,
            });
          };
          reader.readAsDataURL(file);
        });
      }),
    );

    const updatedPhotos = [...photos, ...newPhotos];
    setPhotos(updatedPhotos);

    if (!coverUrl && updatedPhotos.length > 0) {
      setCoverUrl(updatedPhotos[0].url);
    }
  };

  const removePhoto = async (id: string | number) => {
    if (typeof id === "number") {
      const result = await deletePhoto(id);
      if (!result.success) {
        toast.error(result.error || "Erro ao excluir do servidor.");
        return;
      }
    }

    const photoToRemove = photos.find((p) => p.id === id);
    const newPhotos = photos.filter((p) => p.id !== id);
    setPhotos(newPhotos);

    if (photoToRemove?.url === coverUrl) {
      setCoverUrl(newPhotos.length > 0 ? newPhotos[0].url : null);
    }
    toast.success("Foto removida.");
  };

  const handleSave = async () => {
    if (!name) return toast.error("Nome obrigatório");

    setSaving(true);

    // Salva dados básicos primeiro
    const result = await saveAlbum(isNew ? null : parseInt(id), { name, date, coverUrl });

    if (result.success && result.data) {
      const newPhotos = photos.filter((p) => String(p.id).startsWith("temp-"));

      if (newPhotos.length > 0) {
        toast.info(`Processando ${newPhotos.length} fotos...`);

        // LOOP UM POR UM: Resolve o erro de conexão interrompida
        for (const p of newPhotos) {
          const uploadRes = await uploadSinglePhoto(result.data.id, {
            filename: p.filename,
            base64: p.url,
          });

          if (!uploadRes.success) {
            toast.error(`Erro ao subir: ${p.filename}`);
          }
        }
      }

      toast.success("Álbum salvo com sucesso!");
      router.push("/admin/gallery");
      router.refresh();
    } else {
      toast.error(result.error || "Erro ao salvar álbum.");
    }
    setSaving(false);
  };

  if (isLoading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <div className="space-y-6 pb-24 px-2 md:px-0">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/admin/gallery"
            className="text-xs font-medium text-slate-500 hover:text-primary flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3 h-3" /> Voltar para galeria
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {isNew ? "Novo Álbum" : "Editar Álbum"}
          </h1>
        </div>
        <div className="hidden md:flex gap-2">
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
            Salvar Álbum
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="space-y-6">
          <AdminCard title=":: Informações do Álbum">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold">Nome do Álbum <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="Ex: Entrega de certificados"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Data do Evento</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard title=":: Capa do Álbum">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
              {coverUrl ? (
                <div className="space-y-2">
                  <div className="relative group">
                    <img
                      src={coverUrl}
                      className="w-full h-40 object-cover rounded-md ring-2 ring-primary ring-offset-2"
                      alt="Capa"
                    />
                    <div className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                      <Star className="w-2 h-2 fill-white" /> CAPA SELECIONADA
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 text-slate-400">
                  <ImageIcon className="w-10 h-10 mb-2 opacity-20" />
                  <span className="text-xs font-medium">Nenhuma foto selecionada</span>
                </div>
              )}
            </div>
          </AdminCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <AdminCard title={`:: Fotos do Álbum (${photos.length})`}>
            <div className="space-y-6">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 hover:bg-slate-50 transition-colors text-center cursor-pointer relative bg-white">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handlePhotoUpload}
                />
                <div className="flex flex-col items-center justify-center pointer-events-none">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3 shadow-sm">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-700">Clique ou arraste para enviar fotos</span>
                  <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-tight leading-relaxed">
                    Proporção Ideal: **1200x800px** <br />
                    Formatos: **JPG, PNG ou WEBP** (Máx: 2MB por foto)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {photos.map((photo) => {
                  const isCurrentCover = photo.url === coverUrl;
                  return (
                    <div
                      key={photo.id}
                      className={cn(
                        "group relative bg-slate-100 rounded-lg overflow-hidden border transition-all aspect-square cursor-pointer",
                        isCurrentCover ? "ring-2 ring-primary border-transparent shadow-md" : "border-slate-200 hover:border-primary/50"
                      )}
                      onClick={() => setCoverUrl(photo.url)}
                    >
                      <img src={photo.url} alt="Foto" className="w-full h-full object-cover" />

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                        <div className="absolute top-1 right-1" onClick={(e) => e.stopPropagation()}>
                          <DeleteButton
                            onDelete={() => { void removePhoto(photo.id); }}
                            itemName={`esta foto (${photo.filename})`}
                            className="bg-white/20 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                          />
                        </div>
                        <span className="text-white text-[9px] font-bold bg-primary/80 px-2 py-1 rounded-full">
                          {isCurrentCover ? "Capa Atual" : "Usar como Capa"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </AdminCard>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-50 shadow-lg">
        <Button onClick={handleSave} disabled={saving} className="w-full h-12 text-base font-bold bg-primary shadow-xl">
          {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          Salvar Álbum
        </Button>
      </div>
    </div>
  );
}