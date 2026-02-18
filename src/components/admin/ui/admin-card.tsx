import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminCardProps {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string; 
}

export function AdminCard({ title, children, footer, className }: AdminCardProps) { 
  return (
    <div className={cn(
      "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full",
      className // 3. INJETE O className AQUI COM A FUNÇÃO cn
    )}>
      {/* Cabeçalho do Card - Opcional */}
      {title && (
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-sm tracking-tight">{title}</h3>
        </div>
      )}

      {/* Conteúdo com margens compactas para Mobile */}
      <div className="p-4 md:p-6 flex-1">
        {children}
      </div>

      {/* Rodapé do Card - Opcional */}
      {footer && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          {footer}
        </div>
      )}
    </div>
  );
}