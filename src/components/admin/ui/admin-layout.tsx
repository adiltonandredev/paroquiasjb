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
import { siteSettings } from "@/config/settings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

interface AuthUser {
  name?: string | null;
  email?: string | null;
  role?: string;
  id?: string;
  sector?: string;
}

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

  // Grupos de Menu para Escalabilidade
  const navigation: { title: string; items: MenuItem[] }[] = [
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
        // NOVO ITEM ADICIONADO ABAIXO:
        { name: "Horários de Missas", href: "/admin/missas", icon: Church },
        { name: "Galeria de Fotos", href: "/admin/gallery", icon: GalleryIcon },
        { name: "Páginas Fixas", href: "/admin/web-pages", icon: Layers },
      ],
    },
    {
      title: "Administração",
      items: [
        {
          name: "Gerenciar Equipe",
          href: "/admin/users",
          icon: Users,
          adminOnly: true,
        },
      ],
    },
  ];

  if (!mounted) return <div className="min-h-screen bg-[#F8FAFC]" />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-64 bg-slate-900 text-slate-400 transform transition-transform duration-300 md:relative md:translate-x-0 flex flex-col border-r border-white/5",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="p-2 bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
            <Church size={22} />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-black text-white text-sm leading-tight truncate">
              ParoquiaSJB Admin
            </span>
            <span className="text-[10px] text-primary font-bold uppercase tracking-[2px]">
              Portal Oficial
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
          {navigation.map((group) => (
            <div key={group.title}>
              <h3 className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  // CORREÇÃO DA TRAVA DE ADMIN:
                  // Convertemos para minúsculo para comparar sem erro de digitação
                  const userRole = (session?.user as AuthUser)?.role?.toLowerCase();

                  if (
                    item.adminOnly &&
                    userRole !== "admin"
                  )
                    return null;

                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
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

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="hidden md:flex items-center gap-2 text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-widest italic">
              Paz e Bem!
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="p-2 text-slate-400 hover:text-primary transition-colors"
            >
              <Eye size={20} />
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 outline-none hover:bg-slate-50 p-1.5 pr-3 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center text-white font-black shadow-md border-2 border-white">
                  {session?.user?.name?.charAt(0) || "U"}
                </div>
                <div className="text-left hidden sm:block leading-none">
                  <p className="text-xs font-black text-slate-800">
                    {session?.user?.name}
                  </p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">
                    Nível: {(session?.user as AuthUser)?.role || "Colaborador"}
                  </p>
                </div>
                <ChevronDown size={14} className="text-slate-300" />
              </DropdownMenuTrigger>

              {/* O CONTEÚDO ABAIXO É O QUE FAZ O MENU APARECER AO CLICAR */}
              <DropdownMenuContent
                align="end"
                className="w-60 p-2 rounded-2xl shadow-2xl border-slate-100 z-[100]"
              >
                <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 px-3 py-2">
                  Conta Pessoal
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-50" />

                <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                  <Link
                    href="/admin/profile"
                    className="flex items-center gap-3 py-2.5 font-medium"
                  >
                    <User size={16} className="text-primary" /> Meu Perfil
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 py-2.5 font-medium text-slate-600"
                  >
                    <Settings size={16} /> Configurações
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-slate-50" />

                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="rounded-lg cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 font-bold py-2.5"
                >
                  <LogOut size={16} className="mr-3" /> Encerrar Sessão
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scrollbar-hide">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
