"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Clock, MapPin, Calendar, Loader2, Pencil, X, Check } from "lucide-react";

interface MassData {
    id: number;
    title?: string | null;
    dayOfWeek: number;
    time: string;
    location: string;
}

export default function AdminMissas() {
    const [form, setForm] = useState({
        title: "",
        dayOfWeek: "0",
        time: "",
        location: ""
    });

    const dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const [masses, setMasses] = useState<MassData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null); // Estado para ID em edição

    const loadMasses = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/masses");
            const data = await res.json();
            setMasses(data);
        } catch (error) {
            console.error("Erro ao carregar:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadMasses(); }, []);

    // Função para entrar no modo de edição
    const handleEdit = (mass: MassData) => {
        setEditingId(mass.id);
        setForm({
            title: mass.title || "",
            dayOfWeek: String(mass.dayOfWeek),
            time: mass.time,
            location: mass.location
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Função para cancelar edição
    const cancelEdit = () => {
        setEditingId(null);
        setForm({ title: "", dayOfWeek: "0", time: "", location: "" });
    };

    const handleSave = async () => {
        if (!form.time || !form.location) return alert("Preencha o horário e o local.");

        setIsSaving(true);
        try {
            // Se tiver editingId, faz um PUT (ou POST adaptado), se não, faz o POST normal
            // Para simplificar sua estrutura sem criar rota PUT, vamos usar o POST e tratar no backend 
            // ou apenas criar a lógica de salvar aqui:
            const method = editingId ? "PUT" : "POST"; 
            const url = editingId ? `/api/masses?id=${editingId}` : "/api/masses";

            await fetch(url, {
                method: method,
                body: JSON.stringify({
                    ...form,
                    dayOfWeek: Number(form.dayOfWeek)
                })
            });

            setForm({ title: "", dayOfWeek: "0", time: "", location: "" });
            setEditingId(null);
            loadMasses();
        } catch (error) {
            alert("Erro ao salvar.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir este horário?")) return;
        await fetch(`/api/masses?id=${id}`, { method: "DELETE" });
        loadMasses();
    };

    return (
        <div className="space-y-8 p-2">
            <header className="border-l-4 border-[#C4A45F] pl-6">
                <h1 className="text-3xl font-serif font-bold text-[#23140c]">
                    {editingId ? "Editar Celebração" : "Gestão de Missas"}
                </h1>
            </header>

            {/* FORMULÁRIO */}
            <div className={cn(
                "p-10 rounded-[2.5rem] border transition-all duration-500 shadow-sm",
                editingId ? "bg-[#fcfbf9] border-[#C4A45F]/30 shadow-[#C4A45F]/10" : "bg-white border-gray-100"
            )}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Título da Celebração</label>
                        <input
                            type="text"
                            placeholder="Ex: Missa de Cinzas..."
                            className="w-full p-4 rounded-2xl bg-white border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#C4A45F] outline-none"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Local / Comunidade</label>
                        <input
                            type="text"
                            placeholder="Ex: Matriz"
                            className="w-full p-4 rounded-2xl bg-white border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#C4A45F] outline-none"
                            value={form.location}
                            onChange={e => setForm({ ...form, location: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Dia da Semana</label>
                        <select 
                            className="w-full p-4 rounded-2xl bg-white border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#C4A45F] outline-none"
                            value={form.dayOfWeek}
                            onChange={e => setForm({...form, dayOfWeek: e.target.value})}
                        >
                            {dias.map((d, i) => <option key={i} value={i}>{d}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Horário</label>
                        <input
                            type="time"
                            className="w-full p-4 rounded-2xl bg-white border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#C4A45F] outline-none"
                            value={form.time}
                            onChange={e => setForm({ ...form, time: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className={cn(
                            "px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50",
                            editingId ? "bg-[#C4A45F] text-[#23140c]" : "bg-[#23140c] text-white"
                        )}
                    >
                        {isSaving ? <Loader2 className="animate-spin" /> : editingId ? <Check size={20} /> : <Plus size={20} />}
                        {isSaving ? "Salvando..." : editingId ? "Atualizar Celebração" : "Adicionar Celebração"}
                    </button>

                    {editingId && (
                        <button 
                            onClick={cancelEdit}
                            className="px-6 py-4 rounded-2xl font-bold bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all flex items-center gap-2"
                        >
                            <X size={18} /> Cancelar
                        </button>
                    )}
                </div>
            </div>

            {/* LISTAGEM */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#C4A45F]" /></div>
                ) : (
                    masses.map((m) => (
                        <div key={m.id} className="bg-white p-6 rounded-[2rem] border border-gray-50 flex justify-between items-center group hover:shadow-md transition-all">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-[#fcfbf9] rounded-xl flex items-center justify-center text-[#C4A45F]">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase text-[#C4A45F] tracking-widest">
                                        {m.title || "Missa"} — {dias[m.dayOfWeek]}
                                    </span>
                                    <h4 className="text-xl font-serif font-bold text-[#23140c]">
                                        {m.time} — {m.location}
                                    </h4>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => handleEdit(m)} 
                                    className="p-4 text-gray-300 hover:text-[#C4A45F] hover:bg-[#C4A45F]/5 rounded-2xl transition-all"
                                >
                                    <Pencil size={20} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(m.id)} 
                                    className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// Helper para classes condicionais (se não tiver instalado, pode usar template strings)
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}