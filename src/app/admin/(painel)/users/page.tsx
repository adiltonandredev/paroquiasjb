"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { 
  Users, Plus, Trash2, Edit, Shield, Loader2, Save, Power, CheckCircle2, XCircle 
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/admin/ui/page-header";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, 
} from "@/components/admin/ui/dialog";
// Importando o Alerta de Confirmação
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/admin/ui/alert-dialog";
import { CAN } from "@/lib/permissions"; 

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  sector: string;
  active: boolean; // Novo campo
}

export default function UsersPage() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || "editor";
  const isAdmin = userRole === 'admin';

  // Estados
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal Criar/Editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirm: "", role: "editor", sector: "", active: true
  });

  // Modal Deletar
  const [deleteId, setDeleteId] = useState<number | null>(null); // Guarda o ID de quem vai ser excluído
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // 1. Carregar Usuários
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      toast.error("Erro ao carregar usuários.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Abrir Modal Form
  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingId(user.id);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        sector: user.sector,
        active: user.active,
        password: "",
        confirm: ""
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", email: "", password: "", confirm: "", role: "editor", sector: "", active: true });
    }
    setIsModalOpen(true);
  };

  // 3. Salvar
  const handleSave = async () => {
    if (!formData.name || !formData.email) return toast.warning("Preencha os campos obrigatórios.");
    if (!editingId && !formData.password) return toast.warning("Senha obrigatória para novos usuários.");
    if (formData.password && formData.password !== formData.confirm) return toast.error("Senhas não conferem!");

    setIsSaving(true);
    try {
      const url = editingId ? `/api/users/${editingId}` : "/api/users";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erro ao salvar.");
      
      toast.success(editingId ? "Usuário atualizado!" : "Usuário criado!");
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error("Erro ao salvar dados.");
    } finally {
      setIsSaving(false);
    }
  };

  // 4. Preparar Exclusão (Abre o Modal)
  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  // 5. Executar Exclusão
  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/users/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Usuário excluído com sucesso.");
        fetchUsers();
      } else {
        toast.error("Erro ao excluir.");
      }
    } catch (error) {
      toast.error("Erro de conexão.");
    } finally {
      setIsDeleteOpen(false);
      setDeleteId(null);
    }
  };

  // 6. Alternar Status (Ativar/Desativar)
  const toggleStatus = async (user: User) => {
    if (!isAdmin) return; // Segurança extra no front
    
    // Atualização Otimista (Muda na tela antes de ir pro banco pra ser rápido)
    const newStatus = !user.active;
    setUsers(users.map(u => u.id === user.id ? { ...u, active: newStatus } : u));

    try {
        const res = await fetch(`/api/users/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ active: newStatus }) // Manda só o status
        });

        if (!res.ok) throw new Error();
        toast.success(`Usuário ${newStatus ? 'ativado' : 'desativado'}.`);
    } catch (error) {
        toast.error("Erro ao alterar status.");
        fetchUsers(); // Reverte se der erro
    }
  };

  if (!CAN.manageUsers(userRole)) return <div className="p-8 text-center text-slate-500">Acesso Restrito</div>;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gerenciar Usuários" 
        subtitle="Controle de acesso e equipe."
        icon={Users}
        action={
          <Button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> Novo Usuário
          </Button>
        }
      />

      {/* --- MODAL DE EXCLUSÃO (ALERT DIALOG) --- */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. O usuário será permanentemente removido do banco de dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete} className="bg-red-600 hover:bg-red-700">
              Sim, excluir usuário
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* --- MODAL DE FORMULÁRIO --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Usuário" : "Novo Cadastro"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
             {/* ... Inputs de Nome e Email (iguais ao anterior) ... */}
             <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>{editingId ? "Nova Senha (Opcional)" : "Senha"}</Label>
                    <Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label>Confirmar</Label>
                    <Input type="password" value={formData.confirm} onChange={e => setFormData({...formData, confirm: e.target.value})} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Setor</Label>
                <Input value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Permissão</Label>
                <select 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  value={formData.role}
                >
                  <option value="editor">Editor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            <Button onClick={handleSave} className="w-full mt-2" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AdminCard title=":: Equipe Cadastrada">
        {isLoading ? (
             <div className="text-center py-4 text-slate-500">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4">Setor</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4">Função</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${!u.active ? 'opacity-60 bg-slate-50' : ''}`}>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {u.name}
                      <div className="text-xs text-slate-400 font-normal">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{u.sector}</td>
                    
                    {/* COLUNA STATUS (ATIVAR/DESATIVAR) */}
                    <td className="px-6 py-4 text-center">
                        {isAdmin && u.email !== session?.user?.email ? (
                            <button 
                                onClick={() => toggleStatus(u)}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold transition-all border ${
                                    u.active 
                                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                                    : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                                }`}
                                title={u.active ? "Clique para desativar" : "Clique para ativar"}
                            >
                                {u.active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                {u.active ? "Ativo" : "Inativo"}
                            </button>
                        ) : (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${u.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                {u.active ? "Ativo" : "Inativo"}
                            </span>
                        )}
                    </td>

                    <td className="px-6 py-4">
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100 text-xs font-bold">
                          <Shield className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-medium">Editor</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(u)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all">
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Botão de Excluir chama o confirmDelete agora */}
                      {CAN.deleteUser(userRole) && u.email !== session?.user?.email && (
                        <button 
                            onClick={() => confirmDelete(u.id)} 
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}