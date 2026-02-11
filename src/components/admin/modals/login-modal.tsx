"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/admin/ui/dialog";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
// Importando a action que acabamos de criar
import { requestPasswordReset } from "@/actions/auth"; 

export function LoginModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"login" | "forgot">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Estados dos inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Credenciais inválidas.");
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
      router.refresh();
      setIsOpen(false);
    }
  };

  // RECUPERAR SENHA
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await requestPasswordReset(email);
      setSuccess(result.message);
      setLoading(false);
    } catch (err) {
      setError("Erro ao processar solicitação.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      
      <DialogContent className="sm:max-w-[400px] bg-white p-0 overflow-hidden gap-0">
        <div className="p-6">
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                    <Lock className="w-6 h-6" />
                </div>
                <DialogTitle className="text-xl font-bold text-slate-900">
                    {view === "login" ? "Acesso Restrito" : "Recuperar Senha"}
                </DialogTitle>
                <DialogDescription className="text-center">
                    {view === "login" 
                        ? "Entre com suas credenciais." 
                        : "Informe seu e-mail para continuar."}
                </DialogDescription>
            </div>

            {/* FORMULÁRIO DE LOGIN */}
            {view === "login" && (
                <form onSubmit={handleLogin} className="space-y-4 animate-in slide-in-from-left-4 duration-300">
                    <div className="space-y-2">
                        <Label>E-mail</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input 
                                type="email" placeholder="admin@admin.com" className="pl-9" 
                                value={email} onChange={(e) => setEmail(e.target.value)} required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                         <div className="flex items-center justify-between">
                            <Label>Senha</Label>
                            <button 
                                type="button"
                                onClick={() => { setView("forgot"); setError(""); }}
                                className="text-xs text-primary hover:underline font-medium"
                            >
                                Esqueceu a senha?
                            </button>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input 
                                type="password" placeholder="••••••" className="pl-9" 
                                value={password} onChange={(e) => setPassword(e.target.value)} required
                            />
                        </div>
                    </div>

                    {error && <div className="text-xs text-red-500 bg-red-50 p-2 rounded text-center">{error}</div>}

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Entrar"}
                    </Button>
                </form>
            )}

            {/* FORMULÁRIO DE ESQUECI A SENHA */}
            {view === "forgot" && !success && (
                <form onSubmit={handleForgot} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    <div className="space-y-2">
                        <Label>E-mail Cadastrado</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input 
                                type="email" placeholder="admin@admin.com" className="pl-9" 
                                value={email} onChange={(e) => setEmail(e.target.value)} required
                            />
                        </div>
                    </div>

                    {error && <div className="text-xs text-red-500 bg-red-50 p-2 rounded text-center">{error}</div>}

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Enviar Link"}
                    </Button>

                    <button 
                        type="button"
                        onClick={() => setView("login")}
                        className="flex items-center justify-center w-full text-sm text-slate-500 hover:text-slate-800 mt-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
                    </button>
                </form>
            )}

            {/* TELA DE SUCESSO */}
            {view === "forgot" && success && (
                 <div className="text-center space-y-4 animate-in zoom-in duration-300 py-2">
                    <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-medium text-slate-900">Link Enviado!</h4>
                        <p className="text-xs text-slate-500 mt-1">Verifique seu e-mail.</p>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => { setView("login"); setSuccess(""); }}>
                        Voltar ao Login
                    </Button>
                 </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}