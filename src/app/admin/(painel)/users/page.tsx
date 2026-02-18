"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Users, Plus, Trash2, Edit, Loader2, Save,
  Briefcase, ShieldCheck, UserPlus
} from "lucide-react";
import { toast } from "sonner";

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

import { saveUser, deleteUser, type UserFormData } from "@/actions/users";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  sector: string;
  active: boolean;
}

export default function UsersPage() {
  const { data: session, status } = useSession();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const isAdmin = session?.user?.role?.toLowerCase() === 'admin';

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch {
      toast.error("Erro ao carregar lista de usuários.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && isAdmin) {
      fetchUsers();
    }
  }, [status, isAdmin]);

  if (status === "loading") {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );
  }

  if (status === "unauthenticated" || (status === "authenticated" && !isAdmin)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <ShieldCheck className="w-16 h-16 mb-4 opacity-20" />
        <h2 className="text-xl font-bold uppercase tracking-widest text-slate-600">Acesso Negado</h2>
        <p className="text-sm">Olá {session?.user?.name}, você não tem permissão de Administrador.</p>
        <p className="text-[10px] mt-2 italic">Nível detectado: {session?.user?.role}</p>
      </div>
    );
  }

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const data = Object.fromEntries(formData.entries());

    const payload: UserFormData = {
      id: selectedUser?.id,
      name: data.name as string,
      email: data.email as string,
      password: data.password as string || undefined,
      role: data.role as string,
      sector: data.sector as string,
      // CAPTURAMOS O VALOR DO SELECT EXPLICITAMENTE
      active: data.active,
    };

    const res = await saveUser(payload);

    if (res.success) {
      toast.success("Dados salvos com sucesso!");
      setIsModalOpen(false);
      await fetchUsers(); // Atualiza a tabela
    } else {
      toast.error(res.error || "Erro ao processar.");
    }
    setIsPending(false);
  }

  async function toggleStatus(user: User) {
    setIsPending(true);
    // Inverte o status atual e envia
    const res = await saveUser({
      ...user,
      active: !user.active
    });

    if (res.success) {
      toast.success("Status alterado!");
      await fetchUsers();
    }
    setIsPending(false);
  }

  async function handleDelete() {
    if (!selectedUser) return;
    setIsPending(true);

    const res = await deleteUser(selectedUser.id);

    if (res.success) {
      toast.success("Usuário removido com sucesso!");
      setIsDeleteOpen(false);
      setSelectedUser(null);
      await fetchUsers();
    } else {
      toast.error("Erro ao excluir usuário do banco de dados.");
    }
    setIsPending(false);
  }

  return (
    <div className="space-y-6 pb-24 px-2 md:px-0">
      <PageHeader
        title="Gerenciar Equipe"
        subtitle="Controle de acessos e permissões do painel."
        icon={Users}
        action={
          <Button onClick={() => { setSelectedUser(null); setIsModalOpen(true); }} className="font-bold">
            <Plus className="w-4 h-4 mr-2" /> Novo Usuário
          </Button>
        }
      />

      <AdminCard title=":: Usuários Cadastrados">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 border-y border-slate-100 uppercase text-[10px] tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4">Usuário / Detalhes</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-20 text-center"><Loader2 className="animate-spin inline text-primary w-8 h-8" /></td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className={`hover:bg-slate-50/50 transition-colors ${!u.active ? 'opacity-50 grayscale' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 uppercase">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 uppercase font-semibold tracking-tighter">
                            <Briefcase className="w-3 h-3" /> {u.sector} • <span className="text-primary">{u.role}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        disabled={isPending}
                        onClick={() => toggleStatus(u)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border transition-all hover:scale-105 active:scale-95 ${u.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                        {u.active ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(u); setIsModalOpen(true); }}>
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(u); setIsDeleteOpen(true); }}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary uppercase font-black tracking-tighter">
              <UserPlus className="w-5 h-5" />
              {selectedUser ? "Editar Integrante" : "Novo Integrante"}
            </DialogTitle>
          </DialogHeader>

          <form action={handleSubmit} className="space-y-4 py-4 text-left">
            <div className="space-y-2">
              <Label className="font-bold text-slate-700 uppercase text-[11px]">Nome Completo</Label>
              <Input name="name" defaultValue={selectedUser?.name} placeholder="Nome do usuário" required className="h-11" />
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-slate-700 uppercase text-[11px]">E-mail (Login)</Label>
              <Input name="email" type="email" defaultValue={selectedUser?.email} placeholder="email@paroquia.com" required className="h-11" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold text-slate-700 uppercase text-[11px]">Setor</Label>
                <Input name="sector" defaultValue={selectedUser?.sector} placeholder="Ex: Secretaria" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-slate-700 uppercase text-[11px]">Permissão</Label>
                <select
                  name="role"
                  defaultValue={selectedUser?.role?.toLowerCase() || "editor"}
                  className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="editor">Editor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-slate-700 uppercase text-[11px]">Status do Acesso</Label>
              <select
                key={selectedUser ? `st-${selectedUser.id}-${selectedUser.active}` : 'st-new'}
                name="active"
                defaultValue={selectedUser ? String(selectedUser.active) : "true"}
                className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>

            <div className="space-y-2 border-t pt-4">
              <Label className="font-bold text-slate-700 uppercase text-[11px]">
                {selectedUser ? "Nova Senha (deixe em branco para manter)" : "Senha de Acesso"}
              </Label>
              <Input name="password" type="password" placeholder="Mínimo 6 dígitos" required={!selectedUser} className="h-11" />
            </div>

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isPending} className="w-full h-12 font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {selectedUser ? "Salvar Alterações" : "Criar Acesso"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="max-w-[90vw] md:max-w-md rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 font-black uppercase tracking-tight">Remover usuário?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              Isso excluirá <strong>{selectedUser?.name}</strong>. Ele perderá acesso imediato ao painel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={isPending} className="font-bold uppercase text-[11px]" onClick={() => setSelectedUser(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700 font-bold uppercase text-[11px]"
            >
              {isPending ? "Excluindo..." : "Confirmar Exclusão"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}