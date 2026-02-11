"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Save, Lock, User as UserIcon } from "lucide-react";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { PageHeader } from "@/components/admin/ui/page-header";

// Server action simulada (na real você criaria uma API route para isso)
async function updateProfile(data: Record<string, unknown>) {
  // Aqui você faria o fetch('/api/profile/update', ...)
  console.log("Atualizando perfil:", data);
  return { success: true };
}

export default function ProfilePage() {
  const { data: session } = useSession();
  
  const [name, setName] = useState(session?.user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      alert("A nova senha e a confirmação não coincidem!");
      return;
    }
    
    // Lógica de envio...
    alert("Perfil atualizado com sucesso! (Simulação)");
  };

  return (
    <div className="space-y-6 pb-24">
      <PageHeader 
        title="Meu Perfil" 
        subtitle="Gerencie seus dados de acesso e senha."
        icon={UserIcon}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title=":: Dados Pessoais">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>E-mail (Login)</Label>
              <Input value={session?.user?.email || ""} disabled className="bg-slate-100 text-slate-500 cursor-not-allowed" />
              <p className="text-[10px] text-slate-400">O e-mail não pode ser alterado.</p>
            </div>
            <div className="space-y-2">
                <Label>Função / Cargo</Label>
                <div className="px-3 py-2 bg-slate-100 rounded-md text-sm font-medium text-slate-700 capitalize border border-slate-200">
                    {session?.user?.role}
                </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard title=":: Segurança (Trocar Senha)">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Senha Atual</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input type="password" placeholder="Digite sua senha atual" className="pl-9" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </div>
            </div>
            
            <div className="border-t border-slate-100 my-2 pt-2">
                <div className="space-y-2 mb-4">
                <Label>Nova Senha</Label>
                <Input type="password" placeholder="Mínimo 6 caracteres" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                <Label>Repetir Nova Senha</Label>
                <Input type="password" placeholder="Confirme a nova senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
            </div>
          </div>
        </AdminCard>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 w-full md:w-auto">
            <Save className="w-4 h-4 mr-2" /> Salvar Alterações
        </Button>
      </div>
    </div>
  );
}