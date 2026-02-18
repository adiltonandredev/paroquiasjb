import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, Share2, Tag, Printer } from "lucide-react";
import Link from "next/link";

// Garante atualização constante
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

// Função para calcular tempo de leitura
function estimateReadingTime(text: string) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

export default async function NewsDetailPage(props: Props) {
  // 1. Next.js 15: Aguarda parâmetros
  const params = await props.params;
  const { slug } = params;

  // 2. Busca a NOTÍCIA no banco (Tabela Post)
  const post = await prisma.post.findFirst({
    where: { 
      slug: slug,
      status: "published"
    }
  });

  if (!post) return notFound();

  const readingTime = estimateReadingTime(post.content || "");

  return (
    // PADRÃO VISUAL: Fundo Creme Suave (#fcfbf9) e Texto Escuro (#23140c)
    <main className="min-h-screen bg-[#fcfbf9] text-[#23140c] font-sans pt-28 pb-20 selection:bg-[#C4A45F] selection:text-white">
      
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* --- CABEÇALHO EDITORIAL --- */}
        <header className="mb-12 border-b border-[#C4A45F]/20 pb-10">
          {/* Botão Voltar */}
          <Link 
            href="/noticias" 
            className="inline-flex items-center text-xs font-bold text-[#C4A45F] hover:text-[#754D25] uppercase tracking-[0.2em] mb-8 transition-colors group"
          >
            <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar para Notícias
          </Link>

          {/* Categoria (Diferencial da Notícia) */}
          <div className="mb-4">
             <span className="inline-block py-1 px-3 border border-[#C4A45F] text-[#C4A45F] text-[10px] font-bold uppercase tracking-widest rounded-sm">
               {post.category}
             </span>
          </div>

          {/* Título Gigante */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-[1.1] mb-8 text-[#23140c]">
            {post.title}
          </h1>

          {/* Imagem de Capa */}
          {post.coverImage && (
            <div className="relative w-full aspect-[21/9] md:aspect-[21/8] rounded-xl overflow-hidden shadow-sm border border-black/5">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>

        {/* --- LAYOUT GRID (Igual ao da Página Institucional) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* COLUNA LATERAL (Info) */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="sticky top-32 space-y-8">
              
              <div className="flex flex-col gap-6 text-sm text-gray-500 border-l-2 border-[#C4A45F]/30 pl-4">
                <div>
                  <span className="block text-xs font-bold text-[#C4A45F] uppercase tracking-wider mb-1">Publicado em</span>
                  <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <Calendar size={16} />
                    {new Date(post.createdAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold text-[#C4A45F] uppercase tracking-wider mb-1">Leitura</span>
                  <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <Clock size={16} />
                    {readingTime} min
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold text-[#C4A45F] uppercase tracking-wider mb-1">Categoria</span>
                  <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <Tag size={16} />
                    {post.category}
                  </div>
                </div>
              </div>

              {/* Botões Decorativos */}
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

          {/* COLUNA DE CONTEÚDO */}
          <div className="lg:col-span-9 order-1 lg:order-2">
            <article 
              className="prose prose-lg md:prose-xl prose-stone max-w-none
                prose-headings:font-serif prose-headings:text-[#23140c] prose-headings:font-bold
                prose-p:text-gray-600 prose-p:leading-8 prose-p:text-justify
                prose-a:text-[#C4A45F] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-[#C4A45F] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:bg-white prose-blockquote:py-2 prose-blockquote:rounded-r-lg
                prose-img:rounded-lg prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: post.content || "" }} 
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