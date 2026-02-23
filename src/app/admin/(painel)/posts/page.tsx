"use client";

import React, { useState, useEffect } from "react";
import { FileText, Plus, Search, Edit, Eye, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/ui/page-header";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/admin/ui/dialog";
import { DeleteButton } from "@/components/admin/ui/delete-button";
import { getPosts, deletePost } from "@/actions/posts";
import { cn } from "@/lib/utils";

export default function PostsList() {
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchPosts() {
            try {
                const result = await getPosts();
                if (result.success && result.data) {
                    setPosts(result.data as any[]);
                }
            } catch (error) {
                toast.error("Erro ao carregar dados.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchPosts();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const result = await deletePost(id);
            if (result.success) {
                setPosts(current => current.filter(p => p.id !== id));
                toast.success("Postagem excluída com sucesso!");
            } else {
                toast.error(result.error || "Erro ao excluir.");
            }
        } catch (error) {
            toast.error("Erro de conexão.");
        }
    };

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-24 md:pb-10">
            <PageHeader
                title="Postagens"
                subtitle="Gerencie as notícias e avisos do portal."
                icon={FileText}
                action={
                    <Link href="/admin/posts/new">
                        <Button className="hidden md:flex bg-primary hover:bg-primary/90 font-bold shadow-sm">
                            <Plus className="w-4 h-4 mr-2" /> Novo Post
                        </Button>
                    </Link>
                }
            />

            {/* BARRA DE BUSCA COMPACTA NO MOBILE */}
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input
                    placeholder="Buscar por título..."
                    className="pl-10 bg-white border-slate-200 focus-visible:ring-primary/20 h-11 md:h-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <AdminCard title=":: Lista de Publicações">
                <div className="overflow-x-auto -mx-6 md:mx-0">
                    <table className="w-full text-sm text-left border-collapse min-w-[600px] md:min-w-full">
                        <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Conteúdo</th>
                                <th className="px-6 py-4 hidden lg:table-cell text-center">Categoria</th>
                                <th className="px-6 py-4 hidden md:table-cell text-center">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Carregando...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPosts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center text-slate-400 font-medium">
                                        Nenhuma postagem encontrada.
                                    </td>
                                </tr>
                            ) : filteredPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-slate-50/80 transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 md:w-12 md:h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 shadow-sm transition-transform group-hover:scale-105">
                                                {post.coverImage ? (
                                                    <img src={post.coverImage} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                                                        <ImageIcon className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-bold text-slate-800 text-sm md:text-base leading-snug group-hover:text-primary transition-colors truncate">
                                                    {post.title}
                                                </span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono uppercase">ID #{post.id}</span>
                                                    <span className="md:hidden text-[10px] text-primary font-bold">{post.category}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell text-center font-medium text-slate-600">
                                        {post.category}
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell text-center">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                            post.status === 'published' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                                        )}>
                                            {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 md:gap-2">

                                            {/* VIEW MODAL COM SCROLL CORRIGIDO */}
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                                                        <Eye className="w-4.5 h-4.5" />
                                                    </button>
                                                </DialogTrigger>

                                                {/* O segredo está no flex flex-col e no max-h */}
                                                <DialogContent className="max-w-2xl w-[95vw] md:w-full bg-white p-0 border-none shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">

                                                    {/* Banner de Capa - flex-shrink-0 para não esmagar a imagem */}
                                                    <div className="relative h-40 md:h-56 bg-slate-100 flex-shrink-0">
                                                        {post.coverImage && (
                                                            <img src={post.coverImage} className="w-full h-full object-cover" alt="Capa" />
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-6 md:p-8">
                                                            <DialogTitle className="text-lg md:text-2xl font-bold text-white leading-tight">
                                                                {post.title}
                                                            </DialogTitle>
                                                        </div>
                                                    </div>

                                                    {/* ÁREA COM ROLAGEM: flex-1 e overflow-y-auto fazem o scroll funcionar */}
                                                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                                                        {post.summary && (
                                                            <p className="text-slate-500 mb-6 italic text-sm border-l-4 border-primary/30 pl-4 bg-slate-50/50 py-2">
                                                                {post.summary}
                                                            </p>
                                                        )}

                                                        <div
                                                            className="prose prose-slate prose-sm md:prose-base max-w-none text-slate-700 pb-10"
                                                            dangerouslySetInnerHTML={{ __html: post.content || "" }}
                                                        />
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            <Link href={`/admin/posts/${post.id}`}>
                                                <button className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit className="w-4.5 h-4.5" /></button>
                                            </Link>

                                            <DeleteButton
                                                onDelete={() => { void handleDelete(post.id) }}
                                                itemName={post.title}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AdminCard>

            {/* BOTÃO MOBILE FIXO - DESIGN PMM */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-slate-200 z-[60] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <Link href="/admin/posts/new">
                    <Button className="w-full h-12 text-sm font-black uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-2xl">
                        <Plus className="w-5 h-5 mr-2" /> Novo Post
                    </Button>
                </Link>
            </div>
        </div>
    );
}