"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  User,
  ShieldCheck,
  Save,
  Loader2,
  Mail,
  BadgeCheck,
  Lock,
} from "lucide-react";
import { PageHeader } from "@/components/admin/ui/page-header";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { updateProfile } from "@/actions/profile";
import { toast } from "sonner";

interface ProfileFormData {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const data = Object.fromEntries(formData) as unknown as ProfileFormData;
    const res = await updateProfile(data);

    if (res.success) {
      toast.success("Perfil atualizado com sucesso!");
      await update();
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <PageHeader
        title="Meu Perfil"
        subtitle="Gerencie suas informações e segurança de acesso."
        icon={User}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CARD DE AVATAR (3 colunas) */}
        <div className="lg:col-span-4 space-y-6">
          <AdminCard className="flex flex-col items-center py-12 bg-white shadow-xl border-none">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 text-5xl font-black border-4 border-white shadow-2xl overflow-hidden">
                {session?.user?.name?.charAt(0) || "U"}
              </div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="font-black text-slate-800 text-xl tracking-tight">
                {session?.user?.name}
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                {session?.user?.role}
              </p>
            </div>
          </AdminCard>
        </div>

        {/* FORMULÁRIO (8 colunas) */}
        <form action={handleSubmit} className="lg:col-span-8 space-y-6">
          <AdminCard title=":: Dados de Acesso">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Nome Completo
                </Label>
                <Input
                  name="name"
                  defaultValue={session?.user?.name || ""}
                  required
                  className="bg-slate-50 border-none h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  E-mail de Login
                </Label>
                <div className="relative">
                  <Input
                    name="email"
                    defaultValue={session?.user?.email || ""}
                    required
                    className="bg-slate-50 border-none h-12 pl-12"
                  />
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-300" />
                </div>
              </div>
            </div>
          </AdminCard>

          <AdminCard title=":: Alterar Senha">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Nova Senha
                </Label>
                <div className="relative">
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-slate-50 border-none h-12 pl-12"
                  />
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-300" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Repetir Senha
                </Label>
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="bg-slate-50 border-none h-12 pl-12"
                  />
                  <ShieldCheck className="absolute left-4 top-3.5 w-5 h-5 text-slate-300" />
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 italic mt-4">
              * Deixe os campos de senha vazios se não desejar alterá-la.
            </p>
          </AdminCard>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto h-14 px-12 font-black shadow-2xl bg-primary hover:bg-primary/90 text-white uppercase tracking-widest text-xs transition-all hover:scale-[1.02]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
