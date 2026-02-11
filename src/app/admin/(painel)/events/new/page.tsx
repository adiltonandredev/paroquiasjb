"use client";

import React, { useState } from "react";
import { 
  Save, ArrowLeft, Calendar, MapPin, Clock, 
  Image as ImageIcon, X, Ticket 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Textarea } from "@/components/admin/ui/textarea";
import { cn } from "@/lib/utils"; // Importante para o Switch funcionar
import RichTextEditor from "@/components/admin/ui/rich-text-editor";

export default function NewEventPage() {
  const router = useRouter();
  
  // --- ESTADOS ---
  const [name, setName] = useState("");
  const [category, setCategory] = useState("evento");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState(""); 
  const [summary, setSummary] = useState(""); 
  const [coverImage, setCoverImage] = useState<string | null>(null);

  // NOVO: Estados do Hero (Destaque)
  const [isHighlight, setIsHighlight] = useState(false);
  const [highlightExpiry, setHighlightExpiry] = useState("");

  const handleSave = () => {
    if (!name || !date || !time) {
      alert("Por favor, preencha pelo menos Nome, Data e Horário.");
      return;
    }

    const payload = {
      name, category, date, time, location, summary, description, coverImage,
      // Enviando dados do destaque
      hero: {
          active: isHighlight,
          expires_at: isHighlight ? highlightExpiry : null
      }
    };

    console.log("Salvando Evento:", payload);
    alert("Evento cadastrado com sucesso!");
    router.push("/admin/events");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setCoverImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <Link href="/admin/events" className="text-xs font-medium text-slate-500 hover:text-primary flex items-center gap-1 mb-2">
                <ArrowLeft className="w-3 h-3" /> Voltar para lista
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Novo Evento</h1>
            <p className="text-sm text-slate-500">Agende missas, retiros, festas e formações.</p>
        </div>
        <div className="hidden md:flex gap-2">
            <Link href="/admin/events">
                <Button variant="outline">Cancelar</Button>
            </Link>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" /> Salvar Evento
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* === COLUNA ESQUERDA === */}
        <div className="lg:col-span-2 space-y-6">
            
            <AdminCard title=":: Detalhes do Evento">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Nome do Evento <span className="text-red-500">*</span></Label>
                        <Input 
                            placeholder="Ex: Acampamento de Jovens 2026" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Data do Evento <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input 
                                    type="date" 
                                    className="pl-9"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Horário <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input 
                                    type="time" 
                                    className="pl-9"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Local / Endereço</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input 
                                className="pl-9"
                                placeholder="Ex: Salão Paroquial ou Capela São José..." 
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </AdminCard>

            <AdminCard title=":: Descrição e Conteúdo">
                 <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Breve Resumo (Para listagem)</Label>
                        <Textarea 
                            className="h-20 resize-none" 
                            placeholder="Descrição curta que aparece no card do evento..."
                            maxLength={150}
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                        />
                         <div className="text-[10px] text-right text-slate-400">
                            {summary.length}/150 caracteres
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Informações Completas</Label>
                        <RichTextEditor 
                            content={description} 
                            onChange={setDescription} 
                        />
                    </div>
                 </div>
            </AdminCard>
        </div>

        {/* === COLUNA DIREITA === */}
        <div className="space-y-6">
            
            <AdminCard title=":: Classificação">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Categoria</Label>
                        <div className="relative">
                            <Ticket className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <select 
                                className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="evento">Evento Geral</option>
                                <option value="acampamento">Acampamento</option>
                                <option value="missa">Santa Missa</option>
                                <option value="formacao">Formação</option>
                                <option value="retiro">Retiro</option>
                                <option value="outros">Outros</option>
                            </select>
                        </div>
                    </div>
                </div>
            </AdminCard>

            {/* === NOVO CARD: DESTAQUE (HERO) === */}
            <AdminCard title=":: Destaque (Hero)">
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-sm font-medium text-slate-700">Destacar na Capa?</span>
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
                            <Label className="text-xs">Remover destaque após:</Label>
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
                                Geralmente configurado para o dia seguinte ao evento.
                            </p>
                        </div>
                    )}
                </div>
            </AdminCard>

            <AdminCard title=":: Banner do Evento">
                <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 hover:bg-slate-50 transition-colors bg-white">
                        {coverImage ? (
                            <div className="relative w-full group">
                                <img src={coverImage} alt="Banner" className="w-full h-40 object-cover rounded-md shadow-sm" />
                                <button 
                                    onClick={() => setCoverImage(null)}
                                    className="absolute top-2 right-2 bg-white/90 text-red-600 p-1.5 rounded-full hover:bg-red-50 shadow-sm"
                                    title="Remover imagem"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center cursor-pointer w-full h-full">
                                <div className="p-3 bg-slate-100 rounded-full mb-3 text-slate-400">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium text-slate-700 text-center">Clique para enviar o Banner</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        )}
                    </div>
                    <p className="text-[10px] text-slate-400 text-center">
                        Formato ideal: 1920x600px
                    </p>
                </div>
            </AdminCard>

        </div>
      </div>

      {/* BARRA MOBILE */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-50 shadow-lg">
        <Button onClick={handleSave} className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 shadow-lg">
          <Save className="w-5 h-5 mr-2" /> Salvar Evento
        </Button>
      </div>

    </div>
  );
}