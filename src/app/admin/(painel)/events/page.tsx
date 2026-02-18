"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Plus,
  Search,
  Edit,
  Eye,
  MapPin,
  Clock,
  Filter,
  Star,
  CheckCircle2,
  History,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/admin/ui/page-header";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/admin/ui/dialog";
import { DeleteButton } from "@/components/admin/ui/delete-button";
import { getEvents, deleteEvent } from "@/actions/events";

export default function EventsList() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // BUSCA DADOS REAIS DO BANCO
  useEffect(() => {
    async function fetchEvents() {
      try {
        const result = await getEvents();
        if (result.success && result.data) {
          setEvents(result.data);
        }
      } catch (error) {
        toast.error("Erro ao carregar agenda.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const getTodayISO = () => new Date().toISOString().split("T")[0];
  const isExpired = (eventDate: any) => {
    const dateObj = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas o dia
    return dateObj < today;
  };
  const formatDateBr = (dateValue: any) => {
    if (!dateValue) return "";

    // Se já for um objeto Date (vinda do banco), formatamos direto
    if (dateValue instanceof Date) {
      return dateValue.toLocaleDateString("pt-BR");
    }

    // Se for uma string (caso venha de cache ou estado antigo)
    try {
      const dateObj = new Date(dateValue);
      // Verifica se a data é válida antes de formatar
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleDateString("pt-BR");
      }

      // Fallback caso seja a string no formato YYYY-MM-DD
      const [year, month, day] = dateValue.split("T")[0].split("-");
      return `${day}/${month}/${year}`;
    } catch (e) {
      return String(dateValue);
    }
  };

  // FUNÇÃO DE EXCLUSÃO CORRIGIDA (SEM SUBLINHADO)
  const handleDelete = async (id: number) => {
    try {
      const result = await deleteEvent(id);
      if (result.success) {
        setEvents((current) => current.filter((e) => e.id !== id));
        toast.success("Evento removido com sucesso!");
      } else {
        toast.error("Erro ao excluir evento.");
      }
    } catch (error) {
      toast.error("Erro de conexão com o banco.");
    }
  };

  const filteredEvents = events.filter((evt) =>
    evt.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 pb-24 px-2 md:px-0">
      <PageHeader
        title="Agenda de Eventos"
        subtitle="Gerencie o calendário paroquial."
        icon={Calendar}
        action={
          <Link href="/admin/events/new">
            <Button className="hidden md:flex bg-primary hover:bg-primary/90 font-bold">
              <Plus className="w-4 h-4 mr-2" /> Novo Evento
            </Button>
          </Link>
        }
      />

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar evento..."
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Próximos Eventos
          </button>
        </div>
      </div>

      <AdminCard title=":: Listagem Geral">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => {
                  const expired = isExpired(evt.date);
                  return (
                    <tr
                      key={evt.id}
                      className={`transition-colors group ${expired ? "bg-slate-50/50" : "hover:bg-slate-50"}`}
                    >
                      <td className="px-6 py-4 font-bold text-slate-700">
                        <div className={expired ? "opacity-50" : ""}>
                          {evt.name}
                        </div>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border mt-1 bg-blue-50 text-blue-700 border-blue-100 uppercase">
                          {evt.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-slate-500">
                        <div
                          className={`flex flex-col ${expired ? "opacity-50" : ""}`}
                        >
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <Calendar className="w-3 h-3" />{" "}
                            {formatDateBr(evt.date)}
                          </span>
                          <span className="flex items-center gap-1 text-xs mt-0.5">
                            <Clock className="w-3 h-3" /> {evt.time}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-slate-500">
                        <div
                          className={`flex items-center gap-1 ${expired ? "opacity-50" : ""}`}
                        >
                          <MapPin className="w-3 h-3" /> {evt.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {expired ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold border">
                            Realizado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-100">
                            Agendado
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {evt.isHighlight && !expired ? (
                          <Star className="w-4 h-4 fill-amber-500 text-amber-500 mx-auto" />
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* VISUALIZAR */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-all">
                                <Eye className="w-4.5 h-4.5" />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md bg-white p-6 rounded-2xl border-none shadow-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-bold">
                                  {evt.name}
                                </DialogTitle>
                                <DialogDescription>
                                  {evt.category} • {formatDateBr(evt.date)}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="mt-4 space-y-4">
                                <div className="w-full h-40 bg-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 overflow-hidden">
                                  {evt.coverImage ? (
                                    <img
                                      src={evt.coverImage}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-[10px] font-bold uppercase p-4 text-center">
                                      Banner Ideal: 1920x600px
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-600 italic">
                                  "{evt.summary}"
                                </p>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* EDITAR */}
                          <Link href={`/admin/events/${evt.id}`}>
                            <button className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                              <Edit className="w-4.5 h-4.5" />
                            </button>
                          </Link>

                          {/* EXCLUIR COM PORTAL (CORRIGIDO) */}
                          <DeleteButton
                            onDelete={() => {
                              void handleDelete(evt.id);
                            }}
                            itemName={evt.name}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* BOTÃO MOBILE FIXO */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-50 shadow-lg">
        <Link href="/admin/events/new">
          <Button className="w-full h-12 text-base font-bold bg-primary shadow-lg">
            <Plus className="w-5 h-5 mr-2" /> Novo Evento
          </Button>
        </Link>
      </div>
    </div>
  );
}
