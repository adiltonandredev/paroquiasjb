import * as React from "react";
import { cn } from "@/lib/utils"; // Lembra da nossa ferramenta de classes?
import { Loader2 } from "lucide-react"; // Ícone de carregamento automático

// Definimos as Variantes (Os "Tipos" de botão)
const variants = {
  primary: "bg-primary text-primary-foreground hover:opacity-90", // Padrão (Azul)
  destructive: "bg-destructive text-destructive-foreground hover:opacity-90", // Perigo (Vermelho)
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground", // Borda apenas
  ghost: "hover:bg-accent hover:text-accent-foreground", // Transparente (Menu)
  success: "bg-success text-success-foreground hover:opacity-90", // Sucesso (Verde)
};

const sizes = {
  sm: "h-9 px-3 text-xs",
  md: "h-10 px-4 py-2", // Tamanho padrão
  lg: "h-11 px-8 text-lg",
};

// Interface para o TypeScript te ajudar a não errar o nome das props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean; // Propriedade extra: se for true, mostra spinner e bloqueia clique
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          // Estilos BASE (Nunca mudam: arredondado, flex, foco)
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          // Estilos DINÂMICOS (Vêm das variáveis acima)
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";