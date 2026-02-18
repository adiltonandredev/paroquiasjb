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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const processFile = (file?: File) => {
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("A imagem é muito grande. Máximo 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) =>
        handleChange("logo_url", event.target?.result as string);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
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
        {/* CORREÇÃO AQUI: flex-wrap ativa a quebra de linha. Removi o overflow-x-auto */}
        <TabsList className="flex flex-wrap w-full h-auto justify-start gap-2 bg-transparent p-0">
          <TabsTrigger
            value="canonico"
            className="px-4 py-2 rounded-full border border-slate-200 bg-white data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary text-slate-600"
          >
            A Pároquia
          </TabsTrigger>
          <TabsTrigger
            value="governo"
            className="px-4 py-2 rounded-full border border-slate-200 bg-white data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary text-slate-600"
          >
            Administradores
          </TabsTrigger>
          <TabsTrigger
            value="secretaria"
            className="px-4 py-2 rounded-full border border-slate-200 bg-white data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary text-slate-600"
          >
            Secretaria
          </TabsTrigger>
          <TabsTrigger
            value="digital"
            className="px-4 py-2 rounded-full border border-slate-200 bg-white data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary text-slate-600"
          >
            Redes Sociais
          </TabsTrigger>
        </TabsList>

        {/* ================= ABA 1: REGISTRO CANÔNICO ================= */}
        <TabsContent
          value="canonico"
          className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-6">
              <AdminCard title=":: Dados da Instituição">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Nome da Paróquia</Label>
                    <Input
                      value={formData.nome_paroquia || ""}
                      onChange={(e) =>
                        handleChange("nome_paroquia", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CNPJ</Label>
                    <Input
                      value={formData.cnpj || ""}
                      onChange={(e) => handleChange("cnpj", e.target.value)}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Diocese / Arquidiocese</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        className="pl-9"
                        value={formData.diocese || ""}
                        onChange={(e) =>
                          handleChange("diocese", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </AdminCard>

              <AdminCard title=":: Rodapé e Institucional">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center justify-between">
                      Sobre a Paróquia
                      <span className="text-[10px] text-slate-400 font-normal">
                        Aparece no resumo do rodapé
                      </span>
                    </Label>
                    <Textarea
                      className="h-20 resize-none"
                      placeholder="Breve história ou missão da paróquia..."
                      value={formData.texto_sobre || ""}
                      onChange={(e) =>
                        handleChange("texto_sobre", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Copyright</Label>
                    <Input
                      placeholder="© 2026 Paróquia SJB - Todos os direitos reservados"
                      value={formData.copyright || ""}
                      onChange={(e) =>
                        handleChange("copyright", e.target.value)
                      }
                    />
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
                    onDrop={handleDrop}
                  >
                    {formData.logo_url ? (
                      <div className="relative w-full h-full p-4 group">
                        <img
                          src={formData.logo_url}
                          alt="Logo"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleChange("logo_url", "")}
                            className="h-8"
                          >
                            <X className="w-4 h-4 mr-2" /> Remover
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full p-6 text-center hover:bg-slate-100 transition-colors">
                        <div className="p-3 bg-white rounded-full shadow-sm mb-3 text-primary">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          Clique ou arraste
                        </span>
                        <span className="text-xs text-slate-400 mt-1">
                          PNG Transparente (Max 2MB)
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoUpload}
                        />
                      </label>
                    )}
                  </div>

                  <div className="bg-blue-50 p-3 rounded-md border border-blue-100 flex gap-2">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700">
                      Esta imagem será usada no cabeçalho do site e documentos
                      oficiais.
                    </p>
                  </div>
                </div>
              </AdminCard>
            </div>
          </div>
        </TabsContent>

        {/* ================= ABA 2: GOVERNO & CLERO ================= */}
        <TabsContent
          value="governo"
          className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminCard title=":: Administrador Paroquial">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-amber-50 text-amber-800 rounded border border-amber-100">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">
                      Pároco
                    </p>
                    <p className="text-[10px] opacity-80">
                      Responsável administrativo paroquial.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Nome Completo (com Título)</Label>
                  <Input
                    placeholder="Ex: Pe. João da Silva"
                    value={formData.paroco || ""}
                    onChange={(e) => handleChange("paroco", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>E-mail institucional / Contato</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      className="pl-9"
                      placeholder="padre@email.com"
                      value={formData.email_admin || ""}
                      onChange={(e) =>
                        handleChange("email_admin", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </AdminCard>

            <AdminCard title=":: Clero Auxiliar e Religiosos">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="w-3 h-3" /> Vigários Paroquiais
                    </span>
                  </Label>
                  <Textarea
                    className="h-20 min-h-[80px]"
                    placeholder="Um nome por linha..."
                    value={formData.vigarios || ""}
                    onChange={(e) => handleChange("vigarios", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-3 h-3" /> Congregação / Irmãos
                    </span>
                  </Label>
                  <Textarea
                    className="h-20 min-h-[80px]"
                    placeholder="Um nome por linha..."
                    value={formData.religiosos || ""}
                    onChange={(e) => handleChange("religiosos", e.target.value)}
                  />
                </div>
              </div>
            </AdminCard>
          </div>
        </TabsContent>

        {/* ================= ABA 3: SECRETARIA ================= */}
        <TabsContent
          value="secretaria"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminCard title=":: Atendimento e Contato">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label>Horário (Segunda a Sexta)</Label>
                    <Input
                      placeholder="08h às 12h..."
                      value={formData.horario_semana || ""}
                      onChange={(e) =>
                        handleChange("horario_semana", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Horário (Sábado)</Label>
                    <Input
                      placeholder="08h às 12h"
                      value={formData.horario_sabado || ""}
                      onChange={(e) =>
                        handleChange("horario_sabado", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone Fixo</Label>
                    <Input
                      className="pl-9"
                      value={formData.telefone_fixo || ""}
                      onChange={(e) =>
                        handleChange(
                          "telefone_fixo",
                          masks.phone(e.target.value),
                        )
                      }
                      maxLength={15}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp</Label>
                    <Input
                      value={formData.whatsapp || ""}
                      onChange={(e) =>
                        handleChange("whatsapp", masks.phone(e.target.value))
                      }
                      maxLength={15}
                    />
                  </div>
                </div>
                <div className="space-y-2 border-t pt-4">
                  <Label>E-mail da secretaria</Label>
                  <Input
                    value={formData.email_geral || ""}
                    onChange={(e) =>
                      handleChange("email_geral", e.target.value)
                    }
                  />
                </div>
              </div>
            </AdminCard>

            <AdminCard title=":: Endereço Físico">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Logradouro</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      className="pl-9"
                      value={formData.endereco || ""}
                      onChange={(e) => handleChange("endereco", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>CEP</Label>
                  <div className="relative">
                    <Input
                      value={formData.cep || ""}
                      onChange={(e) =>
                        handleChange("cep", masks.cep(e.target.value))
                      }
                      maxLength={9}
                    />
                  </div>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label>Cidade</Label>
                  <Input
                    value={formData.cidade || ""}
                    onChange={(e) => handleChange("cidade", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>UF</Label>
                  <Input
                    value={formData.estado || ""}
                    onChange={(e) => handleChange("estado", e.target.value)}
                  />
                </div>
              </div>
            </AdminCard>
          </div>
        </TabsContent>

        {/* ================= ABA 4: DIGITAL ================= */}
        <TabsContent
          value="digital"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminCard title=":: Mídias Sociais">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Facebook (Link)</Label>
                  <Input
                    value={formData.facebook || ""}
                    onChange={(e) => handleChange("facebook", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instagram (Link)</Label>
                  <Input
                    value={formData.instagram || ""}
                    onChange={(e) => handleChange("instagram", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Youtube (Link)</Label>
                  <Input
                    value={formData.youtube || ""}
                    onChange={(e) => handleChange("youtube", e.target.value)}
                  />
                </div>
              </div>
            </AdminCard>

            <AdminCard title=":: Integração Instagram (Feed)">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
                  <Instagram className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold">Graph API</p>
                    <p className="opacity-80 text-xs mt-1">
                      Insira o Token de Acesso (Long-Lived) para exibir as
                      últimas fotos no rodapé do site.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Token de Acesso</Label>
                  <Textarea
                    className="font-mono text-[10px] h-20 resize-none bg-slate-50"
                    placeholder="IGQV..."
                    value={formData.instagram_token || ""}
                    onChange={(e) =>
                      handleChange("instagram_token", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantidade de Fotos</Label>
                  <Input
                    type="number"
                    className="max-w-[100px]"
                    min={1}
                    max={12}
                    value={formData.instagram_fotos_qtd || 6}
                    onChange={(e) =>
                      handleChange(
                        "instagram_fotos_qtd",
                        parseInt(e.target.value),
                      )
                    }
                  />
                </div>
              </div>
            </AdminCard>
          </div>
        </TabsContent>
      </Tabs>

      {/* BOTÃO FLUTUANTE NO MOBILE (FIXO) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-50 shadow-lg">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 shadow-lg"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Save className="w-5 h-5 mr-2" />
          )}
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
}