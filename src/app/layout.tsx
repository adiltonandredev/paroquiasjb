import type { Metadata } from "next";
// 1. Importamos as fontes do Google aqui
import { Inter, Roboto_Slab } from "next/font/google"; 
import "./globals.css";

// 2. Configuramos as variáveis. Quer mudar a fonte? Mude AQUI.
const mainFont = Inter({ 
  subsets: ["latin"], 
  variable: "--font-main" // Identidade interna
});

const titleFont = Roboto_Slab({ 
  subsets: ["latin"], 
  variable: "--font-title" // Identidade para títulos
});

export const metadata: Metadata = {
  title: "Paróquia SJB",
  description: "Sistema Paroquial Integrado",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      {/* 3. Injetamos as variáveis no corpo do site */}
      <body className={`${mainFont.variable} ${titleFont.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}