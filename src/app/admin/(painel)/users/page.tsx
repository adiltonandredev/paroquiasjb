"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Users, Plus, Edit, Loader2, Save,
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
// Utilitários e Componentes PMM
import { cn } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/ui/delete-button";
import { saveUser, deleteUser } from "@/actions/users";

// Interfaces de Tipagem
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  sector: string;
  active: boolean;
}

type UserFormData = {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  sector: string;
  active: any;
};

export default function UsersPage() {
  const { data: session, status } = useSession();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Tratamento de tipos para o NextAuth
  const userRole = (session?.user as any)?.role?.toLowerCase();
  const isAdmin = userRole === 'admin';
  const currentUserId = (session?.user as any)?.id;

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

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const data = Object.fromEntries(formData.entries());

    const payload: UserFormData = {
      id: selectedUser?.id,
      name: data.name as string,
      email: data.email as string,
      password: (data.password as string) || undefined,
      role: data.role as string,
      sector: data.sector as string,
      active: data.active,
    };

    try {
      const res = await saveUser(payload);
      if (res.success) {
        toast.success("Dados salvos com sucesso!");
        setIsModalOpen(false);
        fetchUsers();
      } else {
        toast.error(res.error || "Erro ao processar.");
      }
    } catch {
      toast.error("Erro de conexão.");
    } finally {
      setIsPending(false);
    }
  }

  async function toggleStatus(user: User) {
    setIsPending(true);
    try {
      const res = await saveUser({
        ...user,
        active: !user.active
      } as UserFormData);

      if (res.success) {
        toast.success("Status alterado!");
        fetchUsers();
      }
    } catch {
      toast.error("Erro ao alterar status.");
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete(id: number) {
    if (String(id) === String(currentUserId)) {
      toast.error("Você não pode excluir sua própria conta.");
      return;
    }

    setIsPending(true);
    try {
      const res = await deleteUser(id);
      if (res.success) {
        toast.success("Usuário removido!");
        fetchUsers();
      } else {
        toast.error("Erro ao excluir.");
      }
    } catch {
      toast.error("Erro de rede.");
    } finally {
      setIsPending(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );
  }

  if (status === "unauthenticated" || (status === "authenticated" && !isAdmin)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 px-4 text-center">
        <ShieldCheck className="w-16 h-16 mb-4 opacity-20 text-red-500" />
        <h2 className="text-xl font-bold uppercase tracking-widest text-slate-600">Acesso Negado</h2>
        <p className="text-sm max-w-xs">Olá {session?.user?.name}, apenas administradores podem gerenciar a equipe.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 px-2 md:px-0">
      <PageHeader
        title="Equipe"
        subtitle="Controle de acessos do painel."
        icon={Users}
        action={
          <Button onClick={() => { setSelectedUser(null); setIsModalOpen(true); }} className="font-bold rounded-xl shadow-md">
            <Plus className="w-4 h-4 mr-2" /> Novo Usuário
          </Button>
        }
      />

      <AdminCard title=":: Integrantes Cadastrados">
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full text-sm text-left border-collapse min-w-[500px]">
            <thead className="bg-slate-50/50 border-y border-slate-100 uppercase text-[10px] tracking-widest text-slate-500 font-black">
              <tr>
                <th className="px-6 py-4">Usuário / Setor</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={3} className="py-20 text-center"><Loader2 className="animate-spin inline text-primary w-8 h-8" /></td></tr>
              ) : (
                users.map((u: any) => (
                  <tr key={u.id} className={cn(
                    "hover:bg-slate-50/50 transition-colors group",
                    !u.active && "opacity-50 grayscale"
                  )}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 uppercase">
                          {u.name.charAt(0)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-900 truncate">{u.name}</span>
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                            {u.sector} • <span className="text-primary/70">{u.role}</span>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        disabled={isPending}
                        onClick={() => toggleStatus(u)}
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase border transition-all",
                          u.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                        )}>
                        {u.active ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(u); setIsModalOpen(true); }} className="hover:bg-blue-50">
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        
                        <DeleteButton 
                          onDelete={() => handleDelete(u.id)}
                          itemName={u.name}
                          disabled={String(u.id) === String(currentUserId)}
                        />
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
        <DialogContent className="max-w-[95vw] md:max-w-md rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-primary p-6 text-white">
            <DialogTitle className="flex items-center gap-2 uppercase font-black tracking-tighter text-xl">
              <UserPlus className="w-6 h-6" />
              {selectedUser ? "Editar Acesso" : "Novo Integrante"}
            </DialogTitle>
          </div>

          <form action={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1">
              <Label className="font-bold text-slate-700 uppercase text-[10px]">Nome Completo</Label>
              <Input name="name" defaultValue={selectedUser?.name} placeholder="Nome do usuário" required className="h-11 rounded-xl" />
            </div>

            <div className="space-y-1">
              <Label className="font-bold text-slate-700 uppercase text-[10px]">E-mail (Login)</Label>
              <Input name="email" type="email" defaultValue={selectedUser?.email} placeholder="email@paroquia.com" required className="h-11 rounded-xl" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="font-bold text-slate-700 uppercase text-[10px]">Setor</Label>
                <Input name="sector" defaultValue={selectedUser?.sector} placeholder="Ex: Secretaria" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="font-bold text-slate-700 uppercase text-[10px]">Permissão</Label>
                <select
                  name="role"
                  defaultValue={selectedUser?.role?.toLowerCase() || "editor"}
                  className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="editor">Editor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="font-bold text-slate-700 uppercase text-[10px]">Status do Acesso</Label>
              <select
                name="active"
                defaultValue={selectedUser ? String(selectedUser.active) : "true"}
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>

            <div className="space-y-1 border-t pt-4">
              <Label className="font-bold text-slate-700 uppercase text-[10px]">
                {selectedUser ? "Trocar Senha (opcional)" : "Senha de Acesso"}
              </Label>
              <Input name="password" type="password" placeholder="Mínimo 6 dígitos" required={!selectedUser} className="h-11 rounded-xl" />
            </div>

            <DialogFooter className="pt-2">
              <Button type="submit" disabled={isPending} className="w-full h-12 font-black uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-lg rounded-xl">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {selectedUser ? "Salvar Alterações" : "Criar Acesso"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}