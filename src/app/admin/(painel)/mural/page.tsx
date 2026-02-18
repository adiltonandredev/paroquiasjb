"use client";

import React, { useEffect, useState } from "react";
import { 
  Bell, Plus, Trash2, Edit, Loader2, Save, 
  Image as ImageIcon, Calendar, CheckCircle2, XCircle 
} from "lucide-react";
import { toast } from "sonner";

// Componentes da UI PMM
import { PageHeader } from "@/components/admin/ui/page-header";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/admin/ui/dialog";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle 
} from "@/components/admin/ui/alert-dialog";

// Server Actions
import { getNotices, saveNotice, deleteNotice } from "@/actions/notices";

interface Notice {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  expiresAt?: string;
  active: boolean;
}

export default function MuralPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const fetchNotices = async () => {
    const res = await getNotices();
    if (res.success) setNotices(res.data as unknown as Notice[]);
    setLoading(false);
  };

  useEffect(() => { fetchNotices(); }, []);

  return (
    <div className="space-y-6 pb-24 px-2 md:px-0">
      <PageHeader 
        title="Mural de Avisos" 
        subtitle="Gerencie os avisos paroquiais e eventos em destaque."
        icon={Bell}
        action={
          <Button onClick={() => { setSelectedNotice(null); setIsModalOpen(true); }} className="font-bold">
            <Plus className="w-4 h-4 mr-2" /> Novo Aviso
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex justify-center">
            <Loader2 className="animate-spin text-primary opacity-20 w-10 h-10" />
          </div>
        ) : (
          notices.map((notice) => (
            <AdminCard key={notice.id} className={!notice.active ? 'opacity-60' : ''}>
              <div className="space-y-4">
                {notice.imageUrl && (
                  <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 border">
                    <img src={notice.imageUrl} alt={notice.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-slate-900 line-clamp-1">{notice.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{notice.description}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[10px] font-bold uppercase tracking-wider">
                  <span className={`flex items-center gap-1 ${notice.active ? 'text-green-600' : 'text-slate-400'}`}>
                    {notice.active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {notice.active ? 'Ativo' : 'Inativo'}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedNotice(notice); setIsModalOpen(true); }}>
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedNotice(notice); setIsDeleteOpen(true); }}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </AdminCard>
          ))
        )}
      </div>

      {/* MODAL DE CADASTRO */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedNotice ? "Editar Aviso" : "Novo Aviso no Mural"}</DialogTitle>
          </DialogHeader>

          <form action={async (formData: FormData) => {
            setIsPending(true);
            const data = Object.fromEntries(formData);
            const res = await saveNotice({ ...data, id: selectedNotice?.id, active: formData.get('active') === 'on' });
            
            if (res.success) {
              toast.success("Aviso salvo com sucesso!");
              setIsModalOpen(false);
              fetchNotices();
            }
            setIsPending(false);
          }} className="space-y-4">
            <div className="space-y-2">
              <Label className="font-bold text-[11px] uppercase">Título do Aviso</Label>
              <Input name="title" defaultValue={selectedNotice?.title} required />
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-[11px] uppercase">Descrição / Conteúdo</Label>
              <textarea 
                name="description" 
                defaultValue={selectedNotice?.description}
                className="w-full min-h-[100px] rounded-md border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold text-[11px] uppercase">URL da Imagem</Label>
                <Input name="imageUrl" defaultValue={selectedNotice?.imageUrl} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-[11px] uppercase">Expira em (Opcional)</Label>
                <Input name="expiresAt" type="date" defaultValue={selectedNotice?.expiresAt?.split('T')[0]} />
              </div>
            </div>

            <div className="flex items-center gap-2 py-2">
              <input type="checkbox" name="active" defaultChecked={selectedNotice?.active ?? true} id="active" className="rounded border-slate-300 text-primary focus:ring-primary" />
              <Label htmlFor="active" className="text-xs font-bold uppercase cursor-pointer">Aviso Ativo no Site</Label>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isPending} className="w-full h-12 font-bold shadow-lg uppercase">
                {isPending ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                Salvar Aviso
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ALERT DE EXCLUSÃO */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Excluir este aviso?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={async () => {
              if (selectedNotice) {
                await deleteNotice(selectedNotice.id);
                toast.success("Aviso removido.");
                fetchNotices();
              }
            }} className="bg-red-600 font-bold">Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}