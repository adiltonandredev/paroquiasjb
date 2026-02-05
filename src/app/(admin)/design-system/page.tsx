"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // Seu botão inteligente
import { Modal } from "@/components/ui/modal";   // Seu modal
import { masks } from "@/lib/masks";             // Suas máscaras

export default function DesignSystemPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"default" | "success" | "danger">("default");
  
  // Estados para inputs com máscara
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");

  const openModal = (type: "default" | "success" | "danger") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="p-10 space-y-10 max-w-4xl mx-auto">
      
      {/* 1. Títulos e Fontes */}
      <section className="space-y-4">
        <h1 className="text-4xl font-serif font-bold text-primary">Identidade Visual (H1 Serif)</h1>
        <p className="text-gray-600">
          Este é o padrão de texto do corpo (Sans Serif Inter). As cores devem respeitar a paleta global.
        </p>
      </section>

      <hr />

      {/* 2. Botões */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Botões Padronizados</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Botão Primário (Salvar)</Button>
          <Button variant="destructive">Botão Perigo (Excluir)</Button>
          <Button variant="success">Botão Sucesso (Aprovar)</Button>
          <Button variant="outline">Botão Outline (Voltar)</Button>
          <Button variant="ghost">Botão Ghost (Menu)</Button>
          <Button isLoading>Carregando...</Button>
        </div>
      </section>

      <hr />

      {/* 3. Inputs com Máscaras */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Inputs & Máscaras Centralizadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Teste de CPF</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary outline-none"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(masks.cpf(e.target.value))}
            />
            <span className="text-xs text-gray-500">Valor Real: {cpf}</span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Teste de Telefone</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary outline-none"
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={(e) => setPhone(masks.phone(e.target.value))}
            />
          </div>
        </div>
      </section>

      <hr />

      {/* 4. Modais e Alertas */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Modais & Alertas</h2>
        <div className="flex gap-4">
          <Button onClick={() => openModal("default")} variant="outline">
            Abrir Modal Comum
          </Button>
          <Button onClick={() => openModal("success")} variant="success">
            Abrir Alerta Sucesso
          </Button>
          <Button onClick={() => openModal("danger")} variant="destructive">
            Abrir Alerta Perigo
          </Button>
        </div>
      </section>

      {/* O Componente Modal fica aqui, invisível até ser chamado */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'danger' ? 'Cuidado!' : modalType === 'success' ? 'Sucesso!' : 'Informação'}
        type={modalType}
      >
        <p className="text-gray-600">
          Este é um modal reutilizável. Você pode colocar qualquer conteúdo aqui dentro (formulários, avisos, textos).
          A cor do cabeçalho muda automaticamente baseada na propriedade "type".
        </p>
        <div className="mt-6 flex justify-end">
          <Button onClick={() => setIsModalOpen(false)} variant={modalType === 'danger' ? 'destructive' : 'primary'}>
            Entendi
          </Button>
        </div>
      </Modal>

    </div>
  );
}