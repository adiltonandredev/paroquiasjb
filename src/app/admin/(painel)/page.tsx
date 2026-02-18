"use client";

import { useEffect, useState } from "react";
import { 
  FileText, Users, MousePointer2, TrendingUp, 
  ImageIcon, Loader2, UserCheck, Clock 
} from "lucide-react";
import { getDashboardStats, getRecentActivity } from "@/actions/dashboard";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { PageHeader } from "@/components/admin/ui/page-header"; // Importação que faltava
import { toast } from "sonner";

// 1. Defina a interface corretamente
interface DashboardStats {
  posts: number;
  users: number;
  slides: number;
  visits: string;
}
// Interface para a atividade recente para evitar o 'any'
interface Activity {
  id: number;
  name: string;
  role: string;
  sector: string;
}

export default function AdminDashboard() {
  // 2. Use o nome correto da interface aqui (Stats)
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const [statsRes, activityRes] = await Promise.all([
        getDashboardStats(),
        getRecentActivity()
      ]);

      // 3. Adicione o 'as Stats' para garantir a tipagem do retorno
      if (statsRes.success) setStats(statsRes.data as DashboardStats);
      if (activityRes.success) setActivities(activityRes.data as Activity[]);
      
      setLoading(false);
    }
    loadDashboard();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-primary opacity-20" />
    </div>
  );

  return (
    <div className="space-y-6 pb-10 px-2 md:px-0">
      {/* 4. Renderizando o Header que estava comentado */}
      <PageHeader 
        title="Painel de Controle" 
        subtitle="Estatísticas em tempo real do seu portal."
        icon={TrendingUp}
      />

      {/* Grid de StatCards (Adicionado para completar seu layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Postagens" value={stats?.posts || 0} icon={FileText} color="blue" />
        <StatCard label="Equipe" value={stats?.users || 0} icon={Users} color="purple" />
        <StatCard label="Slides" value={stats?.slides || 0} icon={ImageIcon} color="orange" />
        <StatCard label="Visitas" value={stats?.visits || "---"} icon={MousePointer2} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdminCard title=":: Equipe Recente">
            <div className="divide-y divide-slate-50">
              {activities.map((user) => (
                <div key={user.id} className="py-3 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{user.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-tighter">
                        {user.sector} • <span className="text-primary/70">{user.role}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-slate-300">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title=":: Info do Sistema">
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                      <Clock className="w-3 h-3" /> Último Backup
                   </span>
                   <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Hoje, 04:00</span>
                </div>
                <div className="pt-4 border-t border-slate-50">
                   <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed italic">
                      * Sistema operando em ambiente de alta performance.]
                   </p>
                </div>
             </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}

// Sub-componente de Card auxiliar
function StatCard({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50",
    purple: "text-purple-600 bg-purple-50",
    green: "text-green-600 bg-green-50",
    orange: "text-orange-600 bg-orange-50",
  };
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-xl font-black text-slate-800 tracking-tight">{value}</h3>
      <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
    </div>
  );
}