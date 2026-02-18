"use client";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Usando o componente Input estilizado
import { Label } from "@/components/ui/label"; // Usando o componente Label estilizado
import { Modal } from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import { masks } from "@/lib/masks";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useState } from "react";

export default function DesignSystemPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"default" | "success" | "danger">("default");
  
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");

  const openModal = (type: "default" | "success" | "danger") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* CABEÇALHO PRINCIPAL */}
        <div className="space-y-2 pb-4 border-b border-secondary/30">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight">
            Design System <span className="text-secondary">Paroquial</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed font-sans">
            Guia de estilo oficial. Cores sóbrias, tipografia elegante e componentes padronizados 
            para manter a identidade visual da Paróquia São João Batista.
          </p>
        </div>

        {/* 1. TIPOGRAFIA E CORES */}
        <Card className="border-secondary/20 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-primary">1. Tipografia & Hierarquia</CardTitle>
            <CardDescription>Demonstração das fontes Serif (Títulos) e Sans (Corpo) combinadas com as cores da marca.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
             <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 space-y-2">
                <span className="text-xs uppercase tracking-wider text-secondary font-bold">Fonte de Títulos (Serif)</span>
                <h2 className="text-3xl font-serif font-bold text-primary">Título Nobre H2</h2>
                <h3 className="text-xl font-serif font-semibold text-primary/90">Subtítulo Elegante H3</h3>
             </div>
             <div className="p-4 bg-background rounded-lg border border-border space-y-2">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Fonte de Corpo (Sans)</span>
                <p className="text-base text-foreground leading-relaxed">
                  Este é um parágrafo de texto padrão. Usamos a fonte Sans para garantir leitura fácil em textos longos.
                  A cor não é preto puro, é um <span className="font-semibold text-primary">marrom café profundo</span>.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Texto de apoio ou legendas usam uma cor ligeiramente mais clara para criar hierarquia visual sem perder o contraste.
                </p>
             </div>
          </CardContent>
        </Card>

        {/* 2. BOTÕES */}
        <Card className="border-secondary/20 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-primary">2. Botões e Ações</CardTitle>
            <CardDescription>Variações de botões para diferentes contextos e hierarquias de ação.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 p-4 bg-background/50 rounded-lg border border-border/50 items-center">
              <div className="space-y-2 flex flex-col items-center">
                <Button>Botão Principal</Button>
                <span className="text-xs text-muted-foreground">Default (Marrom)</span>
              </div>
              <div className="space-y-2 flex flex-col items-center">
                 <Button variant="secondary">Botão Secundário</Button>
                 <span className="text-xs text-muted-foreground">Secondary (Dourado)</span>
              </div>
              <Separator orientation="vertical" className="h-10 mx-2 bg-secondary/30 hidden md:block" />
               <div className="space-y-2 flex flex-col items-center">
                <Button variant="success" className="gap-2"><CheckCircle className="w-4 h-4"/> Aprovar</Button>
                 <span className="text-xs text-muted-foreground">Success (Verde)</span>
              </div>
              <div className="space-y-2 flex flex-col items-center">
                <Button variant="destructive" className="gap-2"><AlertTriangle className="w-4 h-4"/> Excluir</Button>
                 <span className="text-xs text-muted-foreground">Destructive (Vermelho)</span>
              </div>
               <Separator orientation="vertical" className="h-10 mx-2 bg-secondary/30 hidden md:block" />
              <div className="space-y-2 flex flex-col items-center">
                <Button variant="outline">Outline</Button>
                <span className="text-xs text-muted-foreground">Borda Dourada</span>
              </div>
              <div className="space-y-2 flex flex-col items-center">
                <Button variant="ghost">Ghost Link</Button>
                <span className="text-xs text-muted-foreground">Link Sutil</span>
              </div>
              <div className="space-y-2 flex flex-col items-center">
                <Button isLoading>Processando</Button>
                 <span className="text-xs text-muted-foreground">Loading State</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. INPUTS E FORMULÁRIOS */}
        <Card className="border-secondary/20 shadow-sm overflow-hidden">
          <CardHeader className="bg-secondary/5 border-b border-secondary/10">
            <CardTitle className="font-serif text-2xl text-primary">3. Formulários & Máscaras</CardTitle>
            <CardDescription>Inputs estilizados com foco dourado e máscaras automáticas.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Input CPF */}
            <div className="space-y-3 bg-background p-4 rounded-lg border border-border shadow-sm">
              <div className="space-y-1">
                <Label htmlFor="cpf-input" className="text-primary font-semibold flex items-center gap-2">
                   CPF do Fiel <Info className="w-4 h-4 text-secondary/70" />
                </Label>
                <Input
                  id="cpf-input"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(masks.cpf(e.target.value))}
                  className="bg-white/50"
                />
              </div>
              <div className="flex items-center gap-2 text-sm p-2 bg-primary/5 rounded border border-primary/10 text-primary/80">
                <span className="font-bold">Valor Puro:</span> 
                <span className="font-mono bg-white px-2 rounded border border-border/50">{cpf || "vazio"}</span>
              </div>
            </div>

            {/* Input Telefone */}
             <div className="space-y-3 bg-background p-4 rounded-lg border border-border shadow-sm">
              <div className="space-y-1">
                <Label htmlFor="phone-input" className="text-primary font-semibold">
                   Telefone de Contato
                </Label>
                <Input
                  id="phone-input"
                  type="text"
                  placeholder="(00) 90000-0000"
                  value={phone}
                  onChange={(e) => setPhone(masks.phone(e.target.value))}
                   className="bg-white/50"
                />
              </div>
               <div className="flex items-center gap-2 text-sm p-2 bg-primary/5 rounded border border-primary/10 text-primary/80">
                <span className="font-bold">Valor Formatado:</span> 
                <span className="font-mono bg-white px-2 rounded border border-border/50">{phone || "vazio"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. MODAIS E FEEDBACK */}
        <Card className="border-secondary/20 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-primary">4. Modais de Feedback</CardTitle>
            <CardDescription>Janelas de diálogo padronizadas para comunicar o resultado de ações.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex flex-wrap gap-4 p-6 bg-secondary/5 rounded-xl justify-center border border-secondary/10">
              <Button onClick={() => openModal("default")} variant="outline" className="bg-white hover:bg-primary/20 border-primary/20">
                <Info className="w-4 h-4 mr-2 text-primary"/> Modal Padrão
              </Button>
              <Button onClick={() => openModal("success")} variant="success" className="shadow-green-100">
                <CheckCircle className="w-4 h-4 mr-2"/> Alerta de Sucesso
              </Button>
              <Button onClick={() => openModal("danger")} variant="destructive" className="shadow-red-100">
                 <AlertTriangle className="w-4 h-4 mr-2"/> Alerta de Perigo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Componente Modal Invisível */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'danger' ? 'Atenção Necessária' : modalType === 'success' ? 'Operação Concluída!' : 'Informação do Sistema'}
        type={modalType}
      >
        <div className="space-y-4">
            <p className="text-base leading-relaxed">
            Este é o corpo do modal. O cabeçalho acima muda de cor automaticamente (Marrom, Verde ou Vermelho) dependendo do tipo de feedback que você deseja passar ao usuário.
            </p>
            <p className="text-sm text-muted-foreground">
                Use este espaço para mensagens claras e diretas. Evite textos muito longos.
            </p>
        </div>
        <div className="mt-6 flex justify-end pt-4 border-t border-border/50">
          <Button 
            onClick={() => setIsModalOpen(false)} 
            variant={modalType === 'danger' ? 'destructive' : modalType === 'success' ? 'success' : 'default'}
          >
            Compreendi
          </Button>
        </div>
      </Modal>
    </div>
  );
}