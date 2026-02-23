"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ImageIcon,
  Calendar,
  LogOut,
  Menu,
  X,
  Church,
  Users,
  Bell,
  ChevronDown,
  User,
  Eye,
  Layers,
  Settings,
  Image as GalleryIcon,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";

// ... (interfaces MenuItem e AuthUser permanecem as mesmas)

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Grupos de Menu
  const navigation = [
    {
      title: "Geral",
      items: [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Banners (Hero)", href: "/admin/hero", icon: ImageIcon },
        { name: "Mural de Avisos", href: "/admin/mural", icon: Bell },
      ],
    },
    {
      title: "Conteúdo Profissional",
      items: [
        { name: "Postagens", href: "/admin/posts", icon: FileText },
        { name: "Eventos", href: "/admin/events", icon: Calendar },
        { name: "Horários de Missas", href: "/admin/missas", icon: Church },
        { name: "Galeria de Fotos", href: "/admin/gallery", icon: GalleryIcon },
        { name: "Páginas Fixas", href: "/admin/web-pages", icon: Layers },
      ],
    },
    {
      title: "Administração",
      items: [
        { name: "Gerenciar Equipe", href: "/admin/users", icon: Users, adminOnly: true },
      ],
    },
  ];

  if (!mounted) return <div className="min-h-screen bg-[#F8FAFC]" />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">

      {/* 1. OVERLAY (CAMADA ESCURA) - Fecha o menu ao clicar fora */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[65] md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-72 bg-slate-900 text-slate-400 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col border-r border-white/5",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* 2. CABEÇALHO DA SIDEBAR COM BOTÃO DE FECHAR (X) */}
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
              <Church size={22} />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-white text-sm leading-tight">Admin PMM</span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Painel Gestor</span>
            </div>
          </div>

          {/* Botão X Visível apenas no Mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
          {navigation.map((group: any) => (
            <div key={group.title}>
              <h3 className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item: any) => {
                  // Buscamos o cargo do usuário com segurança
                  const userRole = (session?.user as any)?.role?.toLowerCase();

                  // Se o item for só para admin e o usuário não for admin, não renderiza
                  if (item.adminOnly && userRole !== "admin") {
                    return null;
                  }

                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      // AUTO-CLOSE: Fecha o menu ao clicar (Mobile First)
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium group",
                        isActive
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <item.icon
                        size={18}
                        className={cn(
                          isActive
                            ? "text-white"
                            : "text-slate-500 group-hover:text-primary transition-colors",
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={22} />
          </button>

          <div className="hidden md:flex items-center gap-2 text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-widest italic">Paz e Bem!</span>
          </div>

          <div className="flex items-center gap-3">
            {/* ... (resto do seu código de perfil e dropdown permanece igual) */}
            <Link href="/" target="_blank" className="p-2 text-slate-400 hover:text-primary transition-colors">
              <Eye size={20} />
            </Link>
            {/* (Mantenha seu DropdownMenu aqui conforme o original) */}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}