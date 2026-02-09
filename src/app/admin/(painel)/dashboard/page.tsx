"use client";

import { AdminCard } from "@/components/admin/ui/admin-card";
import { PageHeader } from "@/components/admin/ui/page-header";
import { siteSettings } from "@/config/settings";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Calendar, ImageIcon, LayoutDashboard, Users } from "lucide-react";



export default function DashboardPage() {
  // Dados fictícios para o modelo inicial
  const stats = [
    { label: "Slides Ativos", value: "4", icon: ImageIcon, color: "text-blue-600" },
    { label: "Próximos Eventos", value: "12", icon: Calendar, color: "text-amber-600" },
    { label: "Mensagens Recentes", value: "8", icon: Users, color: "text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Cabeçalho Padronizado */}
      <PageHeader 
        title={`Paz e Bem, Admin!`} 
        subtitle={`Gestão da ${siteSettings.general.name}`} 
        icon={LayoutDashboard}
      />

      {/* Grid de Estatísticas Rápidas (Mobile First) */}
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
        {/* Card de Atalhos Rápidos */}
        <AdminCard title="Ações Frequentes">
          <div className="grid grid-cols-1 gap-3">
            <button className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-primary/20 transition-all group">
              <span className="text-sm font-medium text-slate-700">Atualizar Carrossel (Hero)</span>
              <ArrowUpRight size={18} className="text-slate-400 group-hover:text-primary" />
            </button>
            <button className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-primary/20 transition-all group">
              <span className="text-sm font-medium text-slate-700">Alterar Horários de Missa</span>
              <ArrowUpRight size={18} className="text-slate-400 group-hover:text-primary" />
            </button>
          </div>
        </AdminCard>

        {/* Card de Status do Sistema */}
        <AdminCard title="Identidade Atual">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-primary flex items-center justify-center">
              <img src={siteSettings.general.logo} className="h-10 w-auto brightness-0 invert" alt="Logo" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{siteSettings.general.name}</p>
              <p className="text-xs text-slate-500 truncate max-w-[200px]">{siteSettings.general.footerSlogan}</p>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}