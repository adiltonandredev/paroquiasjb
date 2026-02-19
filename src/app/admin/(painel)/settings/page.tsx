"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  User,
  MapPin,
  Building,
  Loader2,
  X,
  Instagram,
  Users,
  BookOpen,
  UploadCloud,
  Info,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { masks } from "@/lib/masks";
import { PageHeader } from "@/components/admin/ui/page-header";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Textarea } from "@/components/admin/ui/textarea";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/admin/ui/tabs";
import { getSettings, saveSettings } from "@/actions/settings";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState({
    nome_paroquia: "",
    cnpj: "",
    diocese: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    telefone_fixo: "",
    whatsapp: "",
    email_geral: "",
    paroco: "",
    paroco_foto: "",
    paroco_bio: "",
    email_admin: "",
    vigarios: "",
    religiosos: "",
    horario_semana: "",
    horario_sabado: "",
    facebook: "",
    instagram: "",
    youtube: "",
    instagram_token: "",
    instagram_fotos_qtd: 6,
    texto_sobre: "",
    copyright: "",
    logo_url: "",
  });

  useEffect(() => {
    async function loadData() {
      const result = await getSettings();
      if (result.success && result.data) {
        const data = result.data;
        setFormData((prev) => ({ ...prev, ...(data as any) }));
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // FUNÇÃO DE PROCESSAMENTO DE IMAGEM ATUALIZADA
  const processFile = (file: File | undefined, field: string) => {
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("A imagem é muito grande. Máximo 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) =>
        handleChange(field, event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, field: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0], field);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await saveSettings(formData);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.error);
    }
    setSaving(false);
  };

  if (loading)
    return (
      <div className="p-8 flex justify-center text-slate-500">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Carregando sistema...
      </div>
    );

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto">
      <PageHeader
        title="Configurações do Sistema"
        subtitle="Gerencie os dados da instituição e do site."
        icon={Settings}
        action={
          <Button
            onClick={handleSave}
            disabled={saving}
            className="hidden md:flex bg-primary hover:bg-primary/90 min-w-[140px]"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? "Salvar" : "Salvar Tudo"}
          </Button>
        }
      />

      <Tabs defaultValue="canonico" className="w-full space-y-6">
        <TabsList className="flex flex-wrap w-full h-auto justify-start gap-2 bg-transparent p-0">
          <TabsTrigger value="canonico" className="px-4 py-2 rounded-full border border-slate-200 bg-white data-[state=active]:bg-primary data-[state=active]:text-white text-slate-600">
            A Pároquia
          </TabsTrigger>
          <TabsTrigger value="governo" className="px-4 py-2 rounded-full border border-slate-200 bg-white data-[state=active]:bg-primary data-[state=active]:text-white text-slate-600">
            Administradores
          </TabsTrigger>
          <TabsTrigger value="secretaria" className="px-4 py-2 rounded-full border border-slate-200 bg-white data-[state=active]:bg-primary data-[state=active]:text-white text-slate-600">
            Secretaria
          </TabsTrigger>
          <TabsTrigger value="digital" className="px-4 py-2 rounded-full border border-slate-200 bg-white data-[state=active]:bg-primary data-[state=active]:text-white text-slate-600">
            Redes Sociais
          </TabsTrigger>
        </TabsList>

        {/* ================= ABA 1: REGISTRO CANÔNICO ================= */}
        <TabsContent value="canonico" className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-6">
              <AdminCard title=":: Dados da Instituição">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Nome da Paróquia</Label>
                    <Input value={formData.nome_paroquia || ""} onChange={(e) => handleChange("nome_paroquia", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>CNPJ</Label>
                    <Input value={formData.cnpj || ""} onChange={(e) => handleChange("cnpj", e.target.value)} placeholder="00.000.000/0000-00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Diocese / Arquidiocese</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input className="pl-9" value={formData.diocese || ""} onChange={(e) => handleChange("diocese", e.target.value)} />
                    </div>
                  </div>
                </div>
              </AdminCard>

              <AdminCard title=":: Rodapé e Institucional">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center justify-between">Sobre a Paróquia</Label>
                    <Textarea className="h-20 resize-none" placeholder="Breve história..." value={formData.texto_sobre || ""} onChange={(e) => handleChange("texto_sobre", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Copyright</Label>
                    <Input placeholder="© 2026 Paróquia SJB" value={formData.copyright || ""} onChange={(e) => handleChange("copyright", e.target.value)} />
                  </div>
                </div>
              </AdminCard>
            </div>

            <div className="lg:col-span-4">
              <AdminCard title=":: Brasão / Logo">
                <div className="flex flex-col space-y-4">
                  <div
                    className={`relative w-full aspect-square bg-slate-50 border-2 border-dashed rounded-xl flex flex-col items-center justify-center overflow-hidden transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-slate-200"}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={(e) => handleDrop(e, "logo_url")}
                  >
                    {formData.logo_url ? (
                      <div className="relative w-full h-full p-4 group">
                        <img src={formData.logo_url} alt="Logo" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="destructive" size="sm" onClick={() => handleChange("logo_url", "")}><X className="w-4 h-4 mr-2" /> Remover</Button>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full p-6 text-center hover:bg-slate-100 transition-colors">
                        <UploadCloud className="w-6 h-6 mb-3 text-primary" />
                        <span className="text-sm font-medium">Clique ou arraste a Logo</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => processFile(e.target.files?.[0], "logo_url")} />
                      </label>
                    )}
                  </div>
                </div>
              </AdminCard>
            </div>
          </div>
        </TabsContent>

        {/* ================= ABA 2: GOVERNO & CLERO ================= */}
        <TabsContent value="governo" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-6">
              <AdminCard title=":: Perfil do Pároco">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Nome Completo (com Título)</Label>
                      <Input placeholder="Ex: Pe. Sergio Kalizak, CR" value={formData.paroco || ""} onChange={(e) => handleChange("paroco", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>E-mail de Contato</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input className="pl-9" placeholder="padre@paroquiasjb.org.br" value={formData.email_admin || ""} onChange={(e) => handleChange("email_admin", e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center justify-between">Biografia e Trajetória</Label>
                    <Textarea className="h-64 resize-none leading-relaxed" placeholder="Conte a história do pároco..." value={formData.paroco_bio || ""} onChange={(e) => handleChange("paroco_bio", e.target.value)} />
                  </div>
                </div>
              </AdminCard>

              <AdminCard title=":: Equipe Auxiliar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Users className="w-3 h-3" /> Vigários</Label>
                    <Textarea className="h-24" placeholder="Ex: Pe. Luis Cezar, CR" value={formData.vigarios || ""} onChange={(e) => handleChange("vigarios", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><BookOpen className="w-3 h-3" /> Religiosos</Label>
                    <Textarea className="h-24" placeholder="Ex: Irmãos da Copiosa Redenção" value={formData.religiosos || ""} onChange={(e) => handleChange("religiosos", e.target.value)} />
                  </div>
                </div>
              </AdminCard>
            </div>

            <div className="lg:col-span-4">
              <AdminCard title=":: Foto Oficial">
                <div className="space-y-4">
                  <div
                    className={`relative w-full aspect-[3/4] bg-slate-50 border-2 border-dashed rounded-xl flex flex-col items-center justify-center overflow-hidden transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-slate-200"}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={(e) => handleDrop(e, "paroco_foto")}
                  >
                    {formData.paroco_foto ? (
                      <div className="relative w-full h-full group">
                        <img src={formData.paroco_foto} alt="Foto Padre" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="destructive" size="sm" onClick={() => handleChange("paroco_foto", "")}><X className="w-4 h-4 mr-2" /> Remover</Button>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full p-6 text-center hover:bg-slate-100 transition-colors">
                        <UploadCloud className="w-6 h-6 mb-3 text-primary" />
                        <span className="text-sm font-medium">Foto do Padre</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => processFile(e.target.files?.[0], "paroco_foto")} />
                      </label>
                    )}
                  </div>
                </div>
              </AdminCard>
            </div>
          </div>
        </TabsContent>

        {/* ================= ABA 3: SECRETARIA ================= */}
        <TabsContent value="secretaria" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminCard title=":: Atendimento e Contato">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label>Horário (Segunda a Sexta)</Label>
                    <Input placeholder="08h às 18h" value={formData.horario_semana || ""} onChange={(e) => handleChange("horario_semana", e.target.value)} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Horário (Sábado)</Label>
                    <Input placeholder="08h às 12h" value={formData.horario_sabado || ""} onChange={(e) => handleChange("horario_sabado", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone Fixo</Label>
                    <Input value={formData.telefone_fixo || ""} onChange={(e) => handleChange("telefone_fixo", masks.phone(e.target.value))} maxLength={15} />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp</Label>
                    <Input value={formData.whatsapp || ""} onChange={(e) => handleChange("whatsapp", masks.phone(e.target.value))} maxLength={15} />
                  </div>
                </div>
              </div>
            </AdminCard>

            <AdminCard title=":: Endereço Físico">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Logradouro</Label>
                  <Input value={formData.endereco || ""} onChange={(e) => handleChange("endereco", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cidade</Label>
                    <Input value={formData.cidade || ""} onChange={(e) => handleChange("cidade", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>UF</Label>
                    <Input value={formData.estado || ""} onChange={(e) => handleChange("estado", e.target.value)} />
                  </div>
                </div>
              </div>
            </AdminCard>
          </div>
        </TabsContent>

        {/* ================= ABA 4: DIGITAL ================= */}
        <TabsContent value="digital" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <AdminCard title=":: Mídias Sociais">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Facebook</Label>
                <Input value={formData.facebook || ""} onChange={(e) => handleChange("facebook", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input value={formData.instagram || ""} onChange={(e) => handleChange("instagram", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Youtube</Label>
                <Input value={formData.youtube || ""} onChange={(e) => handleChange("youtube", e.target.value)} />
              </div>
            </div>
          </AdminCard>
        </TabsContent>
      </Tabs>

      {/* BOTÃO MOBILE */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-50 shadow-lg">
        <Button onClick={handleSave} disabled={saving} className="w-full h-12 text-base font-bold">
          {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}