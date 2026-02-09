"use client";

import { useState } from "react";
import { X, Upload, Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertModal } from "./alert-modal"; // Importando o padrão de alerta

export function HeroFormModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // Estado para o Modal de Erro
  const [errorModal, setErrorModal] = useState({ show: false, title: "", message: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setErrorModal({
          show: true,
          title: "Formato Inválido",
          message: "Para garantir a qualidade do site da Paróquia, use apenas JPG, PNG ou WebP."
        });
        return;
      }
      if (file.size > maxSize) {
        setErrorModal({
          show: true,
          title: "Arquivo Muito Grande",
          message: "O limite de tamanho é 2MB. Reduza a imagem antes de enviar."
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
          
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">Novo Slide do Carrossel</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <form className="p-6 space-y-5">
            {/* Campos de Título e Descrição... */}

            <div className="space-y-2">
              <Label>Imagem de Fundo</Label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50">
                <Upload className="mb-2 text-slate-400" size={24} />
                <input type="file" className="hidden" id="hero-upload" onChange={handleFileValidation} />
                <label htmlFor="hero-upload" className="cursor-pointer text-sm font-semibold text-primary hover:underline">
                  {selectedFile ? selectedFile.name : "Clique para selecionar imagem"}
                </label>
                <p className="mt-2 text-[10px] text-slate-500 uppercase tracking-widest text-center">
                  JPG, PNG ou WebP • Proporção 16:9 • Máx 2MB
                </p>
              </div>
            </div>
          </form>

          <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button className="bg-primary hover:bg-primary/90 px-8">Salvar Slide</Button>
          </div>
        </div>
      </div>

      {/* O AlertModal garantindo a padronização de erros */}
      <AlertModal 
        isOpen={errorModal.show}
        onClose={() => setErrorModal({ ...errorModal, show: false })}
        title={errorModal.title}
        message={errorModal.message}
        type="error"
      />
    </>
  );
}