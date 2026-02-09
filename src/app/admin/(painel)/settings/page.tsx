"use client";

import {
  Settings,
  Save,
  User,
  MapPin,
  Phone,
  Building,
  Upload,
  AlertTriangle, // <--- Novo ícone para o aviso do Token
} from "lucide-react";
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

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-24">
      <PageHeader
        title="Configurações Gerais"
        subtitle="Gerencie os dados institucionais, equipe e integrações."
        icon={Settings}
        action={
          <Button className="hidden md:flex bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" /> Salvar Alterações
          </Button>
        }
      />

      <Tabs defaultValue="paroquia" className="w-full space-y-6">
        <TabsList className="flex flex-wrap h-auto w-full items-center justify-start gap-2 bg-transparent p-0">
          <TabsTrigger
            value="paroquia"
            className="flex-1 md:flex-none min-w-[110px] rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Paróquia
          </TabsTrigger>

          <TabsTrigger
            value="administrativo"
            className="flex-1 md:flex-none min-w-[110px] rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Administrativo
          </TabsTrigger>

          <TabsTrigger
            value="secretaria"
            className="flex-1 md:flex-none min-w-[110px] rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Secretaria
          </TabsTrigger>

          <TabsTrigger
            value="sociais"
            className="flex-1 md:flex-none min-w-[110px] rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Redes Sociais
          </TabsTrigger>

          <TabsTrigger
            value="aparencia"
            className="flex-1 md:flex-none min-w-[110px] rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Aparência
          </TabsTrigger>

          <TabsTrigger
            value="rodape"
            className="flex-1 md:flex-none min-w-[110px] rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Rodapé
          </TabsTrigger>
        </TabsList>

        {/* ================= ABA: PARÓQUIA ================= */}
        <TabsContent value="paroquia" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <AdminCard title=":: Dados Institucionais">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label>Nome da Paróquia</Label>
                <Input defaultValue="Paróquia São João Batista" />
              </div>
              <div className="space-y-2">
                <Label>CNPJ</Label>
                <Input defaultValue="04.128.765/0009-10" />
              </div>
              <div className="space-y-2">
                <Label>Diocese</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input className="pl-9" defaultValue="Diocese de Ji-Paraná" placeholder="Ex: Diocese de Ji-Paraná" />
                </div>
              </div>
            </div>
          </AdminCard>

          <AdminCard title=":: Localização">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label>Endereço Completo</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input className="pl-9" defaultValue="Av. São João Batista, 1626 - Centro" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input defaultValue="Presidente Médici" />
              </div>
              <div className="space-y-2">
                <Label>Estado (UF)</Label>
                <Input defaultValue="Rondônia" />
              </div>
              <div className="space-y-2">
                <Label>CEP</Label>
                <Input defaultValue="76.916-000" />
              </div>
            </div>
          </AdminCard>

          <AdminCard title=":: Contato Oficial">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Telefone Fixo</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input className="pl-9" defaultValue="(69) 3471-0000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input defaultValue="(69) 90000-0000" placeholder="(69) 9..." />
              </div>
              <div className="space-y-2">
                <Label>E-mail Geral</Label>
                <Input defaultValue="contato@paroquiasjb.org.br" />
              </div>
            </div>
          </AdminCard>
        </TabsContent>

        {/* ================= ABA: ADMINISTRATIVO ================= */}
        <TabsContent value="administrativo" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <AdminCard title=":: Administrador Paroquial">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Nome do Administrador</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input className="pl-9" defaultValue="Pe. Sergio Kalizak, CR" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>E-mail / Contato</Label>
                <Input defaultValue="paroco@paroquiasjb.org.br" />
              </div>
            </div>
          </AdminCard>

          <AdminCard title=":: Equipe Administrativa">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-2">
                  <Label>Auxiliar Administrativo 01</Label>
                  <Input placeholder="Nome completo" />
                </div>
                <div className="space-y-2">
                  <Label>Contato / E-mail</Label>
                  <Input placeholder="Telefone ou E-mail" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Auxiliar Administrativo 02</Label>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Opcional</span>
                  </div>
                  <Input placeholder="Nome completo" />
                </div>
                <div className="space-y-2">
                  <Label>Contato / E-mail</Label>
                  <Input placeholder="Telefone ou E-mail" />
                </div>
              </div>
            </div>
          </AdminCard>

          <AdminCard title=":: Auxiliares Paroquiais">
            <div className="p-4 bg-blue-50/50 rounded-lg mb-6 border border-blue-100">
              <p className="text-xs text-blue-600 flex items-center gap-2">
                <Settings className="w-3 h-3" />
                Estes campos só aparecerão no site público se estiverem preenchidos.
              </p>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Auxiliar Paroquial 01</Label>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Opcional</span>
                  </div>
                  <Input placeholder="Ex: Vigário, Secretário Pastoral..." />
                </div>
                <div className="space-y-2">
                  <Label>Contato / E-mail</Label>
                  <Input placeholder="Telefone ou E-mail" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Auxiliar Paroquial 02</Label>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Opcional</span>
                  </div>
                  <Input placeholder="Ex: Diácono, Coordenador..." />
                </div>
                <div className="space-y-2">
                  <Label>Contato / E-mail</Label>
                  <Input placeholder="Telefone ou E-mail" />
                </div>
              </div>
            </div>
          </AdminCard>
        </TabsContent>

        {/* ================= ABA: SECRETARIA ================= */}
        <TabsContent value="secretaria" className="animate-in fade-in slide-in-from-bottom-2">
          <AdminCard title=":: Horários da Secretaria">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Atendimento (Segunda a Sexta)</Label>
                <Input defaultValue="08h às 11h30 e 13h30 às 17h30" />
              </div>
              <div className="space-y-2">
                <Label>Atendimento (Sábado)</Label>
                <Input defaultValue="08h às 12h" />
              </div>
            </div>
          </AdminCard>
        </TabsContent>

        {/* ================= ABA: REDES SOCIAIS (ATUALIZADA) ================= */}
        <TabsContent value="sociais" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          
          {/* 1. Links Públicos */}
          <AdminCard title=":: Redes Sociais (Links Públicos)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Facebook (URL)</Label>
                <Input defaultValue="https://facebook.com/paroquiasjbmedici" />
              </div>
              <div className="space-y-2">
                <Label>Instagram (URL)</Label>
                <Input defaultValue="https://instagram.com/paroquiasjbatistaro" />
              </div>
              <div className="space-y-2">
                <Label>YouTube (URL)</Label>
                <Input placeholder="https://youtube.com/..." />
              </div>
            </div>
          </AdminCard>

          {/* 2. Integração Feed Instagram */}
          <AdminCard title=":: Integração Feed Instagram">
             {/* Aviso Importante */}
             <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
                <h4 className="text-sm font-bold text-amber-800 flex items-center gap-2 mb-1">
                   <AlertTriangle className="w-4 h-4" /> Configuração do Token
                </h4>
                <p className="text-xs text-amber-700 leading-relaxed">
                   Para exibir as fotos recentes no site, você precisa gerar um <strong>Token de Acesso do Instagram (Basic Display API)</strong>. 
                   <br/>Este token geralmente precisa ser renovado a cada 60 dias para o feed não parar de funcionar.
                </p>
             </div>

             <div className="space-y-4">
                <div className="space-y-2">
                   <Label>Instagram Access Token</Label>
                   <Textarea 
                      className="font-mono text-[10px] min-h-[80px] break-all bg-slate-50" 
                      placeholder="Cole aqui o token longo (ex: IGQJ...)" 
                   />
                   <p className="text-[10px] text-slate-400">
                      O token deve começar geralmente com "IGQJ" ou similar. Certifique-se de copiar o código inteiro.
                   </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label>Quantidade de Fotos</Label>
                      <Input type="number" defaultValue="6" min="3" max="12" />
                      <p className="text-[10px] text-slate-400">Quantas imagens exibir no rodapé.</p>
                   </div>
                </div>
             </div>
          </AdminCard>
        </TabsContent>

        {/* ================= ABA: APARÊNCIA ================= */}
        <TabsContent value="aparencia" className="animate-in fade-in slide-in-from-bottom-2">
          <AdminCard title=":: Identidade Visual">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <Label>Logo Principal</Label>
                  <span className="text-[10px] text-slate-400">PNG ou SVG (Fundo Transparente)</span>
                </div>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="p-3 bg-slate-100 rounded-full group-hover:bg-slate-200 transition-colors">
                    <Upload className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="text-center space-y-1">
                    <span className="text-xs font-medium text-primary">Clique para enviar</span>
                    <p className="text-[10px] text-slate-400">Máx: 2MB • Min: 200px largura</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs mt-2">Escolher arquivo</Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <Label>Favicon (Ícone da Aba)</Label>
                  <span className="text-[10px] text-slate-400">PNG ou ICO (Quadrado)</span>
                </div>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="p-3 bg-slate-100 rounded-full group-hover:bg-slate-200 transition-colors">
                    <Upload className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="text-center space-y-1">
                    <span className="text-xs font-medium text-primary">Clique para enviar</span>
                    <p className="text-[10px] text-slate-400">Máx: 100KB • 32x32px ou 192x192px</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs mt-2">Escolher arquivo</Button>
                </div>
              </div>
            </div>
          </AdminCard>
        </TabsContent>

        {/* ================= ABA: RODAPÉ ================= */}
        <TabsContent value="rodape" className="animate-in fade-in slide-in-from-bottom-2">
          <AdminCard title=":: Sobre-nós e Rodapé">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label>Texto "Sobre a Paróquia"</Label>
                <Textarea
                  className="min-h-[120px] resize-none"
                  defaultValue="Somos a Paróquia São João Batista, mais de 40 anos de Evangelização..."
                />
                <p className="text-[10px] text-slate-400 text-right">Aparece no rodapé do site.</p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Frase de Copyright</Label>
                <Input defaultValue="© 2026 Paróquia São João Batista. Todos os direitos reservados." />
              </div>
            </div>
          </AdminCard>
        </TabsContent>
      </Tabs>

      {/* ================= BARRA FIXA MOBILE ================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <Button className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 shadow-lg">
          <Save className="w-5 h-5 mr-2" /> Salvar Alterações
        </Button>
      </div>
    </div>
  );
}