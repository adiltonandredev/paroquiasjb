"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calendar, Plus, Search, Edit, Trash2, Eye, 
  MapPin, Clock, Filter, Star, CheckCircle2, History, ImageIcon 
} from "lucide-react";

import { PageHeader } from "@/components/admin/ui/page-header";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
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
// Importando o Modal
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/admin/ui/dialog";

export default function EventsList() {
  // 1. LÓGICA DE DATA
  const getTodayISO = () => new Date().toISOString().split('T')[0];
  
  const isExpired = (eventDate: string) => {
    return eventDate < getTodayISO();
  };

  const formatDateBr = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // 2. DADOS FALSOS
  const [events, setEvents] = useState([
    { 
        id: 1, 
        name: "Acampamento Juvenil 2026", 
        category: "Acampamento", 
        date: "2026-04-15",
        time: "18:00",
        location: "Sítio Emaús",
        highlight: true,
        summary: "Um final de semana de encontro com Deus..."
    },
    { 
        id: 2, 
        name: "Missa de Cura", 
        category: "Santa Missa", 
        date: "2026-03-20",
        time: "19:30",
        location: "Igreja Matriz",
        highlight: false,
        summary: "Missa especial com oração por cura e libertação."
    },
    { 
        id: 3, 
        name: "Formação de Catequistas", 
        category: "Formação", 
        date: "2024-01-10", // PASSADO
        time: "08:00",
        location: "Salão Paroquial",
        highlight: true, // Será ignorado visualmente pois expirou
        summary: "Encontro anual de formação."
    },
  ]);

  const handleDelete = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
    alert("Evento excluído!");
  };

  return (
    <div className="space-y-6 pb-24">
      <PageHeader 
        title="Agenda de Eventos" 
        subtitle="Gerencie o calendário paroquial."
        icon={Calendar}
        action={
            <Link href="/admin/events/new">
                <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" /> Novo Evento
                </Button>
            </Link>
        }
      />

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Buscar evento..." className="pl-9 bg-white" />
        </div>
        <div className="flex gap-2">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50">
                <Filter className="w-4 h-4" /> Próximos Eventos
             </button>
        </div>
      </div>

      {/* Tabela */}
      <AdminCard title=":: Próximos Eventos">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                    <tr>
                        <th className="px-6 py-4">Evento</th>
                        <th className="px-6 py-4 hidden md:table-cell">Data / Hora</th>
                        <th className="px-6 py-4 hidden md:table-cell">Local</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-center">Destaque</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {events.map((evt) => {
                        const expired = isExpired(evt.date);
                        
                        return (
                            <tr key={evt.id} className={`transition-colors group ${expired ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}>
                                <td className="px-6 py-4 font-medium text-slate-700">
                                    <div className={expired ? "opacity-50" : ""}>
                                        {evt.name}
                                    </div>
                                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border mt-1
                                        ${evt.category === 'Santa Missa' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                                        evt.category === 'Acampamento' ? 'bg-orange-50 text-orange-700 border-orange-100' : 
                                        'bg-blue-50 text-blue-700 border-blue-100'}
                                        ${expired ? 'grayscale opacity-60' : ''} 
                                    `}>
                                        {evt.category}
                                    </span>
                                </td>
                                
                                <td className="px-6 py-4 hidden md:table-cell text-slate-500">
                                    <div className={`flex flex-col ${expired ? "opacity-50" : ""}`}>
                                        <span className="flex items-center gap-1 font-medium text-slate-700">
                                            <Calendar className="w-3 h-3" /> {formatDateBr(evt.date)}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs mt-0.5">
                                            <Clock className="w-3 h-3" /> {evt.time}
                                        </span>
                                    </div>
                                </td>
                                
                                <td className="px-6 py-4 hidden md:table-cell text-slate-500">
                                    <div className={`flex items-center gap-1 ${expired ? "opacity-50" : ""}`}>
                                        <MapPin className="w-3 h-3" /> {evt.location}
                                    </div>
                                </td>

                                {/* STATUS (AUTOMÁTICO) */}
                                <td className="px-6 py-4 text-center">
                                    {expired ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200">
                                            <History className="w-3 h-3" /> Realizado
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                                            <CheckCircle2 className="w-3 h-3" /> Agendado
                                        </span>
                                    )}
                                </td>
                                
                                {/* DESTAQUE (SOME SE EXPIRADO) */}
                                <td className="px-6 py-4 text-center">
                                    {evt.highlight && !expired ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100">
                                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Capa
                                        </span>
                                    ) : (
                                        <span className="text-slate-300">-</span>
                                    )}
                                </td>

                                {/* AÇÕES */}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        
                                        {/* 1. VISUALIZAR (MODAL) */}
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button className="flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors" title="Ver Detalhes">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-md bg-white">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl flex items-center gap-2">
                                                        {evt.name}
                                                        {expired && <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">(Encerrado)</span>}
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        {evt.category} • {formatDateBr(evt.date)}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                
                                                <div className="mt-4 space-y-4">
                                                    {/* Banner Simulado */}
                                                    <div className="w-full h-32 bg-slate-100 rounded-lg flex flex-col items-center justify-center text-slate-400 border border-slate-200">
                                                        <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                                                        <span className="text-xs">Banner do Evento</span>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div className="space-y-1">
                                                            <span className="text-xs text-slate-500 block">Horário</span>
                                                            <span className="font-medium flex items-center gap-2"><Clock className="w-3 h-3"/> {evt.time}</span>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <span className="text-xs text-slate-500 block">Local</span>
                                                            <span className="font-medium flex items-center gap-2"><MapPin className="w-3 h-3"/> {evt.location}</span>
                                                        </div>
                                                        <div className="col-span-2 space-y-1 bg-slate-50 p-3 rounded-md border border-slate-100">
                                                            <span className="text-xs text-slate-500 block mb-1">Resumo</span>
                                                            <p className="text-slate-700 italic">"{evt.summary}"</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                        
                                        {/* 2. EDITAR */}
                                        <Link href={`/admin/events/${evt.id}`}> 
                                            <button className="flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Editar">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </Link>

                                        {/* 3. EXCLUIR */}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button className="flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors" title="Excluir">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-white">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Cancelar Evento?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Você está prestes a remover <strong>"{evt.name}"</strong> da agenda.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Voltar</AlertDialogCancel>
                                                    <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleDelete(evt.id)}>
                                                        Confirmar Exclusão
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </AdminCard>
    </div>
  );
}