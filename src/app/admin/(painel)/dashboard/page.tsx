import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Importamos o authOptions que o erro sugeriu
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui/page-header";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { cn } from "@/lib/utils";
import { 
  ArrowUpRight, 
  Calendar, 
  ImageIcon, 
  LayoutDashboard, 
  FileText, 
  Settings 
} from "lucide-react";
import Link from "next/link";
import { getSettings } from "@/actions/settings";

export default async function DashboardPage() {
  // 1. Verificação de Sessão no Servidor usando getServerSession
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  // 2. Busca de dados em paralelo no Banco de Dados
  const [dbSettings, totalSlides, totalEvents, totalPosts] = await Promise.all([
    getSettings(),
    prisma.post.count({ where: { isHighlight: true } }), 
    prisma.event.count({ where: { date: { gte: new Date() } } }), 
    prisma.post.count({ where: { status: "published" } }), 
  ]);

  const settings = dbSettings.success ? dbSettings.data : null;

  const stats = [
    { 
      label: "Slides Ativos", 
      value: totalSlides.toString(), 
      icon: ImageIcon, 
      color: "text-blue-600",
      bg: "bg-blue-50" 
    },
    { 
      label: "Próximos Eventos", 
      value: totalEvents.toString(), 
      icon: Calendar, 
      color: "text-amber-600",
      bg: "bg-amber-50" 
    },
    { 
      label: "Notícias Ativas", 
      value: totalPosts.toString(), 
      icon: FileText, 
      color: "text-emerald-600",
      bg: "bg-emerald-50" 
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Paz e Bem, ${session.user?.name?.split(' ')[0] || 'Admin'}!`} 
        subtitle={`Gestão da ${settings?.nome_paroquia || "Paróquia São João Batista"}`} 
        icon={LayoutDashboard}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
            <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title="Atalhos Administrativos">
          <div className="grid grid-cols-1 gap-2">
            {[
              { label: "Gerenciar Slides (Hero)", href: "/admin/hero", icon: ImageIcon },
              { label: "Novo Evento na Agenda", href: "/admin/events/new", icon: Calendar },
              { label: "Publicar Nova Notícia", href: "/admin/posts/new", icon: FileText },
              { label: "Configurações Gerais", href: "/admin/settings", icon: Settings },
            ].map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-300 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <link.icon size={18} className="text-slate-400 group-hover:text-primary" />
                  <span className="text-sm font-semibold text-slate-700">{link.label}</span>
                </div>
                <ArrowUpRight size={18} className="text-slate-300 group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Informações do Sistema">
          <div className="p-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 p-2">
                {settings?.logo_url ? (
                  <img src={settings.logo_url} className="h-full w-full object-contain" alt="Logo" />
                ) : (
                  <LayoutDashboard className="text-slate-200" size={32} />
                )}
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 leading-tight">
                  {settings?.nome_paroquia || "Nome não configurado"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  CNPJ: {settings?.cnpj || "Não informado"}
                </p>
              </div>
            </div>
            
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 uppercase font-bold tracking-wider">Status do Banco</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Conectado
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 uppercase font-bold tracking-wider">Ambiente</span>
                <span className="text-slate-700 font-medium">Produção (vercel/github)</span>
              </div>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}