"use client";

import React, { useState, useEffect } from "react";
import {
    Save, ArrowLeft, X, Image as ImageIcon, Calendar,
    Trash2, Share2, Facebook, Instagram, Loader2
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Textarea } from "@/components/admin/ui/textarea";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/admin/ui/rich-text-editor";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/admin/ui/alert-dialog";

export default function EditPostPage() {
    const params = useParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    // --- ESTADOS DOS CAMPOS ---
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [category, setCategory] = useState("noticias");
    const [content, setContent] = useState("");
    const [coverImage, setCoverImage] = useState<string | null>(null);

    // Hero / Destaque e Expiração
    const [isHighlight, setIsHighlight] = useState(false);
    const [highlightExpiry, setHighlightExpiry] = useState("");

    // 1. SIMULAÇÃO: CARREGAR DADOS DO POST (GET)
    useEffect(() => {
        // Aqui você faria: fetch(`/api/posts/${params.id}`)

        setTimeout(() => {
            // DADOS SIMULADOS VINDO DO "BANCO"
            setTitle("Festa do Padroeiro 2026");
            setSummary("A tradicional festa de São João Batista reuniu milhares de fiéis neste fim de semana em um momento de fé e comunhão.");
            setCategory("eventos");
            setContent(`
        <h2>Um Sucesso de Público</h2>
        <p>A festa começou logo pela manhã com a santa missa...</p>
        <p>Agradecemos a todos os voluntários que ajudaram na organização.</p>
        <ul>
            <li>Barraca do Pastel</li>
            <li>Leilão de Gado</li>
            <li>Show de Prêmios</li>
        </ul>
      `);
            setCoverImage("https://placehold.co/1200x630/EEE/31343C?text=Capa+do+Post"); // Imagem fake
            setIsHighlight(true);
            setHighlightExpiry("2026-06-30T23:59"); // Formato para input datetime-local

            setIsLoading(false);
        }, 800);
    }, [params.id]);

    const handleSave = () => {
        console.log("Atualizando Post ID:", params.id, {
            title, summary, category, isHighlight, highlightExpiry, content
        });
        alert("Post atualizado com sucesso!");
        router.push("/admin/posts");
    };

    const handleDelete = () => {
        console.log("Deletando Post ID:", params.id);
        alert("Post excluído!");
        router.push("/admin/posts");
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setCoverImage(event.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Simulação de compartilhar
    const handleShare = (network: string) => {
        const url = `https://paroquiasjb.org.br/posts/${params.id}`;
        alert(`Compartilhar no ${network}: ${url}`);
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-slate-500 gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Carregando post...
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-24">

            {/* CABEÇALHO */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <Link href="/admin/posts" className="text-xs font-medium text-slate-500 hover:text-primary flex items-center gap-1 mb-2">
                        <ArrowLeft className="w-3 h-3" /> Voltar para lista
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Editar Post</h1>
                    <p className="text-sm text-slate-500">Editando: <span className="font-mono bg-slate-100 px-1 rounded text-slate-700">ID #{params.id}</span></p>
                </div>
                <div className="hidden md:flex gap-2">
                    <Link href="/admin/posts">
                        <Button variant="outline">Cancelar</Button>
                    </Link>
                    <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                        <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* COLUNA ESQUERDA (Conteúdo) */}
                <div className="lg:col-span-2 space-y-6">
                    <AdminCard title=":: Conteúdo Principal">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Título da Postagem <span className="text-red-500">*</span></Label>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label>Resumo / Subtítulo</Label>
                                <Textarea
                                    className="h-24 resize-none"
                                    maxLength={160}
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                />
                                <div className="text-[10px] text-right text-slate-400">
                                    {summary.length}/160 caracteres
                                </div>
                            </div>


                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Categoria</Label>
                                    <select
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="noticias">Notícias</option>
                                        <option value="eventos">Eventos</option>
                                        <option value="formacoes">Formações</option>
                                        <option value="espiritualidade">Espiritualidade</option>
                                        <option value="avisos">Avisos Paroquiais</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Conteúdo Completo</Label>
                                <RichTextEditor content={content} onChange={setContent} />
                            </div>
                        </div>
                    </AdminCard>
                </div>

                {/* COLUNA DIREITA (Configurações) */}
                <div className="space-y-6">

                    <AdminCard title=":: Imagem de Destaque (Capa)">
                        <div className="space-y-4">
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 hover:bg-slate-50 transition-colors bg-white">
                                {coverImage ? (
                                    <div className="relative w-full">
                                        <img src={coverImage} alt="Capa" className="w-full h-64 object-cover rounded-md shadow-sm" />
                                        <button
                                            onClick={() => setCoverImage(null)}
                                            className="absolute top-2 right-2 bg-white/90 text-red-600 p-2 rounded-full hover:bg-red-50 shadow-sm"
                                            title="Remover imagem"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center cursor-pointer w-full h-full">
                                        <div className="p-4 bg-slate-100 rounded-full mb-3 text-slate-400">
                                            <ImageIcon className="w-8 h-8" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">Clique para enviar uma imagem</span>
                                        <span className="text-xs text-slate-400 mt-1">Recomendado: 1200x630px (JPG/PNG)</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                )}
                            </div>
                            <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-100 flex gap-2">
                                <span className="font-bold">Nota:</span> Esta imagem será usada como destaque e nas redes sociais.
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard title=":: Interação Social">
                        <div className="space-y-3">
                            <p className="text-xs text-slate-500 mb-2">Compartilhar este post:</p>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleShare('Facebook')} className="text-blue-600">
                                    <Facebook className="w-3.5 h-3.5 mr-2" /> Facebook
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleShare('WhatsApp')} className="text-green-600">
                                    <Share2 className="w-3.5 h-3.5 mr-2" /> WhatsApp
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleShare('Instagram')} className="text-pink-600">
                                    <Instagram className="w-3.5 h-3.5 mr-2" /> Instagram
                                </Button>
                            </div>

                            <div className="border-t border-slate-100 my-2"></div>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 gap-2">
                                        <Trash2 className="w-4 h-4" /> Excluir Post
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Excluir este post?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta ação removerá permanentemente "<strong>{title}</strong>".
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                                            Sim, excluir
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </AdminCard>

                </div>
            </div>

            {/* BARRA MOBILE */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-50 shadow-lg">
                <Button onClick={handleSave} className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 shadow-lg">
                    <Save className="w-5 h-5 mr-2" /> Salvar Alterações
                </Button>
            </div>

        </div>
    );
}