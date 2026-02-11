import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { 
  FileText, Calendar, Image as ImageIcon, Users, 
  Clock 
} from "lucide-react";
import { AdminCard } from "@/components/admin/ui/admin-card";

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const stats = {
    posts: await prisma.post.count(),
    events: await prisma.event.count(),
    albums: await prisma.album.count(),
    users: await prisma.user.count(),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Olá, {session?.user?.name || "Administrador"}!
        </h1>
        <p className="text-sm text-slate-500">
          Bem-vindo ao painel de controle da Paróquia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARDS DE ESTATÍSTICAS (Mantive igual) */}
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Notícias</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.posts}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Eventos</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.events}</h3>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-full">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Álbuns</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.albums}</h3>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
            <ImageIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Usuários</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.users}</h3>
          </div>
          <div className="p-3 bg-slate-100 text-slate-600 rounded-full">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title="Ações Rápidas">
           <div className="grid grid-cols-2 gap-4">
              {/* CORREÇÃO AQUI: Trocamos <a> por <Link> */}
              <Link href="/admin/posts/new" className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors text-slate-600 gap-2">
                 <FileText className="w-5 h-5" />
                 <span className="text-sm font-medium">Nova Notícia</span>
              </Link>
              <Link href="/admin/events/new" className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors text-slate-600 gap-2">
                 <Calendar className="w-5 h-5" />
                 <span className="text-sm font-medium">Novo Evento</span>
              </Link>
           </div>
        </AdminCard>

        <AdminCard title="Status do Sistema">
            <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Banco de Dados
                    </span>
                    <span className="font-medium text-green-600">Conectado</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600">
                        <Clock className="w-4 h-4" /> Último Backup
                    </span>
                    <span className="text-slate-500">Automático (Hostinger)</span>
                </div>
            </div>
        </AdminCard>
      </div>
    </div>
  );
}