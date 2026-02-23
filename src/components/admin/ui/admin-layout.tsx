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
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

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
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[65] md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-72 bg-slate-900 text-slate-400 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col border-r border-white/5",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
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
                  const userRole = (session?.user as any)?.role?.toLowerCase();
                  if (item.adminOnly && userRole !== "admin") return null;
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
                          isActive ? "text-white" : "text-slate-500 group-hover:text-primary transition-colors"
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

          {/* ÁREA DO PERFIL RESTAURADA ABAIXO */}
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="p-2 text-slate-400 hover:text-primary transition-colors">
              <Eye size={20} />
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 p-1 hover:bg-slate-100 rounded-full transition-all outline-none">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-sm">
                  {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : <User size={18} />}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-700 leading-tight">
                    {session?.user?.name || "Administrador"}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">
                    {session?.user?.role || "Painel PMM"}
                  </span>
                </div>
                <ChevronDown size={14} className="text-slate-400 mr-2" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 rounded-xl mt-2">
                <DropdownMenuLabel className="font-bold text-slate-700">Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/admin/profile")}
                  className="gap-2 py-3 cursor-pointer rounded-lg"
                >
                  <User size={16} /> Perfil
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/admin/settings")}
                  className="gap-2 py-3 cursor-pointer rounded-lg"
                >
                  <Settings size={16} /> Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="gap-2 py-3 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg font-medium"
                >
                  <LogOut size={16} /> Sair do Painel
                </DropdownMenuItem>
              </DropdownMenuContent>

            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}