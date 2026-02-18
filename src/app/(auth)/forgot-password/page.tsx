"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui chamaria a API para gerar token e enviar email
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <div className="mb-6">
            <Link href="/login" className="text-xs text-slate-500 hover:text-primary flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Voltar para Login
            </Link>
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Recuperar Senha</h1>
        
        {!sent ? (
            <form onSubmit={handleReset} className="space-y-4">
                <p className="text-sm text-slate-500">
                    Digite seu e-mail cadastrado. Enviaremos um link para você redefinir sua senha.
                </p>
                <div className="space-y-2">
                    <Label>E-mail Cadastrado</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input type="email" placeholder="seu@email.com" className="pl-9" required />
                    </div>
                </div>
                <Button className="w-full">
                    <Send className="w-4 h-4 mr-2" /> Enviar Link
                </Button>
            </form>
        ) : (
            <div className="text-center space-y-4 py-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <Send className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-medium text-slate-900">Verifique seu e-mail</h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Se o e-mail existir em nossa base, você receberá as instruções em instantes.
                    </p>
                </div>
                <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
                    Tentar outro e-mail
                </Button>
            </div>
        )}
      </div>
    </div>
  );
}