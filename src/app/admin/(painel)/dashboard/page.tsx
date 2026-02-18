"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { PageHeader } from "@/components/admin/ui/page-header";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Calendar, ImageIcon, LayoutDashboard, Users, Loader2 } from "lucide-react";
import { getSettings } from "@/actions/settings";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [dbSettings, setDbSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Busca os dados reais da Hostinger para o Dashboard
  useEffect(() => {
    async function loadDashboardData() {
      const result = await getSettings();
      if (result.success) {
        setDbSettings(result.data);
      }
      setLoading(false);
    }
    loadDashboardData();
  }, []);

  const stats = [
    { label: "Slides Ativos", value: "4", icon: ImageIcon, color: "text-blue-600" },
    { label: "Próximos Eventos", value: "12", icon: Calendar, color: "text-amber-600" },
    { label: "Mensagens Recentes", value: "8", icon: Users, color: "text-emerald-600" },
  ];

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho Dinâmico: Agora saúda o usuário logado */}
      <PageHeader 
        title={`Paz e Bem, ${session?.user?.name?.split(' ')[0] || 'Admin'}!`} 
        subtitle={`Gestão da ${dbSettings?.nome_paroquia || "Paróquia São João Batista"}`} 
        icon={LayoutDashboard}
      />

      {/* Grid de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
            <div className={cn("p-3 rounded-xl bg-slate-50", stat.color)}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card de Atalhos Rápidos com Links Reais */}
        <AdminCard title="Ações Frequentes">
          <div className="grid grid-cols-1 gap-3">
            <Link href="/admin/hero" className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-primary/20 transition-all group">
              <span className="text-sm font-medium text-slate-700">Atualizar Carrossel (Hero)</span>
              <ArrowUpRight size={18} className="text-slate-400 group-hover:text-primary" />
            </Link>
            <Link href="/admin/settings" className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-primary/20 transition-all group">
              <span className="text-sm font-medium text-slate-700">Alterar Dados da Paróquia</span>
              <ArrowUpRight size={18} className="text-slate-400 group-hover:text-primary" />
            </Link>
          </div>
        </AdminCard>

        {/* Card de Identidade vindo do Banco da Hostinger */}
        <AdminCard title="Identidade Atual">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border">
              {dbSettings?.logo_url ? (
                <img src={dbSettings.logo_url} className="h-12 w-auto object-contain" alt="Logo" />
              ) : (
                <LayoutDashboard className="text-slate-300" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {dbSettings?.nome_paroquia || "Nome não configurado"}
              </p>
              <p className="text-xs text-slate-500 truncate max-w-[200px]">
                CNPJ: {dbSettings?.cnpj || "Não informado"}
              </p>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}