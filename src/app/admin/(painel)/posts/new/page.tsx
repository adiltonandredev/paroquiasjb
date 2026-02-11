"use client";

import React, { useState } from "react";
import {
    Save, ArrowLeft, Upload, Calendar,
    Share2, Facebook, Instagram, Linkedin, X, Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Textarea } from "@/components/admin/ui/textarea";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/admin/ui/rich-text-editor";

export default function NewPostPage() {
    const router = useRouter();

    // --- ESTADOS ---
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [category, setCategory] = useState("noticias");
    const [content, setContent] = useState("");
    const [coverImage, setCoverImage] = useState<string | null>(null);

    // Lógica do Destaque (Hero)
    const [isHighlight, setIsHighlight] = useState(false);
    const [highlightExpiry, setHighlightExpiry] = useState("");

    // Simulação de Salvamento
    const handleSave = () => {
        if (!title || !content) {
            alert("Preencha pelo menos o Título e o Conteúdo.");
            return;
        }

        const payload = {
            title,
            summary,
            category,
            content,
            coverImage,
            hero: {
                active: isHighlight,
                expires_at: isHighlight ? highlightExpiry : null
            },
            created_at: new Date().toISOString()
        };

        console.log("Salvando Post:", payload);
        alert("Post criado com sucesso! (Veja o console para detalhes)");
        router.push("/admin/posts");
    };

    // Função para simular upload de imagem
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCoverImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Função de Compartilhar (Simulação)
    const handleSocialShare = (network: string) => {
        // Aqui você geraria o link real do post: ex: https://paroquia.../noticia/slug
        const fakeLink = `https://paroquiasjb.org.br/post/${title.toLowerCase().replace(/ /g, "-")}`;
        const text = encodeURIComponent(`Confira essa novidade: ${title}`);
        const url = encodeURIComponent(fakeLink);

        let shareUrl = "";

        switch (network) {
            case "facebook": shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
            case "twitter": shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`; break;
            case "linkedin": shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`; break;
            case "whatsapp": shareUrl = `https://api.whatsapp.com/send?text=${text} ${url}`; break;
            default: alert(`Link copiado: ${fakeLink}`); return;
        }

        if (shareUrl) window.open(shareUrl, "_blank");
    };

    return (
        <div className="space-y-6 pb-24">

            {/* CABEÇALHO */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <Link href="/admin/posts" className="text-xs font-medium text-slate-500 hover:text-primary flex items-center gap-1 mb-2">
                        <ArrowLeft className="w-3 h-3" /> Voltar para lista
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Novo Post</h1>
                    <p className="text-sm text-slate-500">Crie notícias, eventos ou formações para o site.</p>
                </div>
                <div className="hidden md:flex gap-2">
                    <Link href="/admin/posts">
                        <Button variant="outline">Cancelar</Button>
                    </Link>
                    <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                        <Save className="w-4 h-4 mr-2" /> Publicar Post
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* === COLUNA ESQUERDA (CONTEÚDO) === */}
                <div className="lg:col-span-2 space-y-6">

                    <AdminCard title=":: Conteúdo Principal">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Título da Postagem <span className="text-red-500">*</span></Label>
                                <Input
                                    placeholder="Ex: Festa do Padroeiro atrai multidão..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Resumo / Subtítulo</Label>
                                <Textarea
                                    placeholder="Um breve texto que aparece nos cards de listagem (máx 150 caracteres)..."
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
                                    <Label>Selecione uma das categorias</Label>
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
                                <RichTextEditor
                                    content={content}
                                    onChange={setContent}
                                />
                            </div>
                        </div>
                    </AdminCard>
                </div>

                {/* === COLUNA DIREITA (CONFIGURAÇÕES) === */}
                <div className="space-y-6">

                    {/* CARD DE IMAGEM DE CAPA */}
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

                        <div className="space-y-4 mt-2">
                            <div className="flex items-center justify-between p-3 bg-slate-400 rounded-lg border border-slate-100">
                                <span className="text-sm font-medium text-gray-100">Destacar na Capa?</span>
                                <div
                                    className={cn(
                                        "cursor-pointer w-10 h-5 rounded-full relative transition-colors duration-300",
                                        isHighlight ? "bg-amber-500" : "bg-slate-300"
                                    )}
                                    onClick={() => setIsHighlight(!isHighlight)}
                                >
                                    <div className={cn(
                                        "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300",
                                        isHighlight ? "left-5.5" : "left-0.5"
                                    )} />
                                </div>
                            </div>

                            {isHighlight && (
                                <div className="animate-in slide-in-from-top-2 space-y-2 pt-2 border-t border-slate-100">
                                    <Label className="text-xs">Expira do destaque em (Opcional):</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            type="datetime-local"
                                            className="pl-9 text-xs"
                                            value={highlightExpiry}
                                            onChange={(e) => setHighlightExpiry(e.target.value)}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400">
                                        Se vazio, o destaque permanece até ser removido manualmente.
                                    </p>
                                </div>
                            )}
                        </div>
                    </AdminCard>

                    {/* INTERAÇÃO SOCIAL */}
                    <AdminCard title=":: Divulgação">
                        <div className="space-y-4">
                            <p className="text-xs text-slate-500 mb-2">
                                Após salvar, compartilhe o link nas redes:
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" size="sm" className="w-full text-blue-600 hover:text-blue-700" onClick={() => handleSocialShare('facebook')}>
                                    <Facebook className="w-3.5 h-3.5 mr-2" /> Facebook
                                </Button>
                                <Button variant="outline" size="sm" className="w-full text-green-600 hover:text-green-700" onClick={() => handleSocialShare('whatsapp')}>
                                    <Share2 className="w-3.5 h-3.5 mr-2" /> WhatsApp
                                </Button>
                                <Button variant="outline" size="sm" className="w-full text-pink-600 hover:text-pink-700" onClick={() => handleSocialShare('instagram')}>
                                    <Instagram className="w-3.5 h-3.5 mr-2" /> Instagram
                                </Button>
                                <Button variant="outline" size="sm" className="w-full text-slate-700 hover:text-black" onClick={() => handleSocialShare('twitter')}>
                                    <X className="w-3.5 h-3.5 mr-2" /> Twitter/X
                                </Button>
                            </div>
                            <div className="p-2 bg-slate-100 rounded text-[10px] text-slate-500 text-center mt-2">
                                O link será gerado após a publicação.
                            </div>
                        </div>
                    </AdminCard>

                </div>
            </div>

            {/* BARRA MOBILE */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-50 shadow-lg">
                <Button onClick={handleSave} className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 shadow-lg">
                    <Save className="w-5 h-5 mr-2" /> Publicar Post
                </Button>
            </div>

        </div>
    );
}