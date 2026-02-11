"use client";

import { useState } from "react";
import { LayoutDashboard, Settings, ImageIcon, Calendar, LogOut, Menu, X, Church } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { siteSettings } from "@/config/settings";
import { authService } from "@/services/auth";
// O segredo está aqui: como este arquivo está na pasta 'ui', 
// precisamos subir um nível (..) para achar a pasta 'modals'
import { ConfirmModal } from "../modals/confirm-modal"; 

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Paginas e Menus", href: "/admin/web-pages", icon: ImageIcon },
    { name: "Posts", href: "/admin/posts", icon: Calendar },
    { name: "Evento", href: "/admin/events", icon: Calendar },
    { name: "Configurações", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* HEADER MOBILE */}
      <div className="md:hidden bg-primary p-4 flex justify-between items-center text-white shadow-md z-[60]">
        <div className="flex items-center gap-2">
           <Church size={20} className="text-secondary" />
           <span className="font-bold tracking-tight text-xs uppercase">Painel Paróquia</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-[70] w-64 bg-primary text-white transform transition-transform duration-300 md:relative md:translate-x-0 shadow-2xl",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-white/10 rounded-lg">
                <Church size={24} className="text-secondary" />
             </div>
             <div className="flex flex-col">
                <span className="font-bold text-sm leading-tight">SJB Admin</span>
                <span className="text-[10px] text-secondary uppercase tracking-[2px]">Gestão Ativa</span>
             </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
                  isActive 
                    ? "bg-secondary text-primary shadow-lg shadow-secondary/10" 
                    : "hover:bg-white/5 text-slate-300 hover:text-white"
                )}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT SEGURO */}
        <div className="absolute bottom-0 w-full p-4 border-t border-white/5 bg-primary/50 backdrop-blur-md">
          <ConfirmModal 
            title="Encerrar Sessão?"
            description="Deseja mesmo sair do painel da Paróquia?"
            onConfirm={() => {
              authService.logout();
              router.push("/admin/login?logout=success");
            }}
          >
            <button className="flex items-center gap-3 px-4 py-3 w-full text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all group">
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              Sair do Painel
            </button>
          </ConfirmModal>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 lg:p-12 w-full">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-[65] md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
}