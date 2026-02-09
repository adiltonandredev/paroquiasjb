import { ReactNode } from "react";

interface AdminCardProps {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AdminCard({ title, children, footer }: AdminCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
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