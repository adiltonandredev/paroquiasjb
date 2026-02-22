import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, Share2, Printer } from "lucide-react";
import Link from "next/link";

// Garante que a página sempre carregue dados novos
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

// Funçãozinha para calcular tempo de leitura
function estimateReadingTime(text: string) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

export default async function GenericPage(props: Props) {
  // 1. Next.js 15: Aguardamos os parâmetros (sem isso dá erro)
  const params = await props.params;
  const { slug } = params;

  // Proteção para não quebrar rotas do sistema
  if (["admin", "noticias", "uploads", "api", "login"].includes(slug)) {
    return notFound();
  }

  // 2. Busca o conteúdo no banco
  const page = await prisma.page.findFirst({
    where: {
      slug: slug,
      status: "published"
    }
  });

  if (!page) return notFound();

  const readingTime = estimateReadingTime(page.content || "");

  return (
    // MUDANÇA 1: Fundo Creme Suave (Papel) - Muito mais sofisticado
    <main className="min-h-screen bg-[#fcfbf9] text-[#23140c] font-sans pt-28 pb-20 selection:bg-[#C4A45F] selection:text-white">

      <div className="container mx-auto px-6 max-w-6xl">

        {/* --- CABEÇALHO EDITORIAL --- */}
        <header className="mb-12 border-b border-[#C4A45F]/20 pb-10">
          {/* Botão Voltar Minimalista */}
          <Link
            href="/"
            className="inline-flex items-center text-xs font-bold text-[#C4A45F] hover:text-[#754D25] uppercase tracking-[0.2em] mb-8 transition-colors group"
          >
            <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar ao Início
          </Link>

          {/* Título Gigante e Limpo (Sem fundo escuro) */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] mb-8 text-[#23140c]">
            {page.title}
          </h1>

          {/* Comente ou remova este bloco por enquanto */}
          {/* {page.coverImage && (
            <div className="relative w-full aspect-[21/9] md:aspect-[21/8] rounded-xl overflow-hidden shadow-sm border border-black/5">
              <img
                src={page.coverImage}
                alt={page.title}
                className="w-full h-full object-cover"
              />
            </div>
          )} 
          */}
        </header>

        {/* --- LAYOUT EM GRID (Coluna Lateral + Texto) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* COLUNA 1: METADADOS (Lateral Esquerda) */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="sticky top-32 space-y-8">

              <div className="flex flex-col gap-6 text-sm text-gray-500 border-l-2 border-[#C4A45F]/30 pl-4">
                <div>
                  <span className="block text-xs font-bold text-[#C4A45F] uppercase tracking-wider mb-1">Atualizado em</span>
                  <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <Calendar size={16} />
                    {new Date(page.updatedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold text-[#C4A45F] uppercase tracking-wider mb-1">Tempo de Leitura</span>
                  <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <Clock size={16} />
                    {readingTime} min
                  </div>
                </div>
              </div>

              {/* Botões de Ação Decorativos */}
              <div className="hidden lg:flex gap-3 pt-4">
                <button className="p-3 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-[#C4A45F] hover:border-[#C4A45F] transition-all" title="Compartilhar">
                  <Share2 size={18} />
                </button>
                <button className="p-3 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-[#C4A45F] hover:border-[#C4A45F] transition-all" title="Imprimir">
                  <Printer size={18} />
                </button>
              </div>

            </div>
          </div>

          {/* COLUNA 2: TEXTO PRINCIPAL (Direita) */}
          <div className="lg:col-span-9 order-1 lg:order-2">
            <article
              className="prose prose-lg md:prose-xl prose-stone max-w-none
                /* Títulos */
                prose-headings:font-serif prose-headings:text-[#23140c] prose-headings:font-bold
                prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-3xl
                
                /* Parágrafos */
                prose-p:text-gray-600 prose-p:leading-8 prose-p:text-justify
                
                /* Links */
                prose-a:text-[#C4A45F] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                
                /* Citações */
                prose-blockquote:border-l-4 prose-blockquote:border-[#C4A45F] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:bg-white prose-blockquote:py-2 prose-blockquote:rounded-r-lg
                
                /* Imagens no texto */
                prose-img:rounded-lg prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: page.content || "" }}
            />

            {/* Assinatura / Fim */}
            <div className="mt-16 pt-8 border-t border-gray-200 flex justify-center opacity-40">
              <span className="text-3xl text-[#C4A45F] font-serif">❦</span>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}