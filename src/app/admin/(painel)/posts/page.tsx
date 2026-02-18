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

    const filteredPosts = posts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6 pb-24">
            {/* TÍTULO E SUBTÍTULO PADRÃO PMM */}
            <PageHeader
                title="Gerenciar Postagens"
                subtitle="Notícias, avisos e eventos do site."
                icon={FileText}
                action={
                    <Link href="/admin/posts/new">
                        <Button className="hidden md:flex bg-primary hover:bg-primary/90 font-bold">
                            <Plus className="w-4 h-4 mr-2" /> Novo Post
                        </Button>
                    </Link>
                }
            />

            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input placeholder="Buscar por título..." className="pl-9 bg-white border-slate-200" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <AdminCard title=":: Todas as Postagens">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Título / Capa</th>
                                <th className="px-6 py-4 hidden lg:table-cell text-center">Categoria</th>
                                <th className="px-6 py-4 hidden md:table-cell text-center">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr><td colSpan={4} className="px-6 py-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary"/></td></tr>
                            ) : filteredPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            {/* VISUAL DA IMAGEM PADRÃO PMM */}
                                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-slate-100 border-2 border-white overflow-hidden flex-shrink-0 shadow-md">
                                                {post.coverImage ? (
                                                    <img src={post.coverImage} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                                                        <ImageIcon className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-bold text-slate-800 text-base leading-tight group-hover:text-primary transition-colors truncate">{post.title}</span>
                                                <span className="text-[10px] text-slate-400 mt-1 font-mono uppercase">ID: #{post.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell text-center text-slate-500">{post.category}</td>
                                    <td className="px-6 py-4 hidden md:table-cell text-center">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            
                                            {/* VIEW MODAL - RESTAURADO COM IMAGEM E RESUMO */}
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-all"><Eye className="w-4.5 h-4.5" /></button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white p-6 border-none shadow-2xl rounded-2xl">
                                                    <DialogHeader className="mb-6 text-left">
                                                        <DialogTitle className="text-2xl font-bold text-slate-900">{post.title}</DialogTitle>
                                                        {post.summary && <p className="text-slate-500 mt-2 italic text-sm border-l-4 border-primary/20 pl-4">{post.summary}</p>}
                                                    </DialogHeader>
                                                    {post.coverImage && (
                                                        <div className="mb-8 rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                                                            <img src={post.coverImage} className="w-full h-auto" alt="Capa" />
                                                        </div>
                                                    )}
                                                    <div className="prose prose-slate max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: post.content || "" }} />
                                                </DialogContent>
                                            </Dialog>

                                            <Link href={`/admin/posts/${post.id}`}>
                                                <button className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit className="w-4.5 h-4.5" /></button>
                                            </Link>

                                            {/* EXCLUIR COM PORTAL - FIM DO SUBLINHADO */}
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

            {/* BOTÃO MOBILE FIXO NO RODAPÉ - PADRÃO PMM */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-50 shadow-lg">
                <Link href="/admin/posts/new">
                    <Button className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 shadow-lg">
                        <Plus className="w-5 h-5 mr-2" /> Novo Post
                    </Button>
                </Link>
            </div>
        </div>
    );
}