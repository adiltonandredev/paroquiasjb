import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, ArrowRight, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewsListPage() {
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#fcfbf9] pt-32 pb-20">
      <div className="container mx-auto px-6">
        
        {/* Cabeçalho da Página */}
        <div className="max-w-4xl mb-16">
          <span className="text-[#C4A45F] text-xs font-black uppercase tracking-[0.4em] block mb-4">
            Informativo Paroquial
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#23140c] leading-tight">
            Nossas <span className="italic font-normal">Notícias</span>
          </h1>
          <div className="w-20 h-1.5 bg-[#C4A45F] mt-8"></div>
        </div>

        {/* Grid de Notícias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              href={`/noticias/${post.slug}`}
              className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Imagem do Card */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={post.coverImage || "/images/news-placeholder.jpg"} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-[#C4A45F] uppercase tracking-widest shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Conteúdo do Card */}
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">
                  <Calendar size={14} className="text-[#C4A45F]" />
                  {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                </div>

                <h2 className="text-xl md:text-2xl font-serif font-bold text-[#23140c] mb-4 line-clamp-2 group-hover:text-[#C4A45F] transition-colors">
                  {post.title}
                </h2>

                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
                   {/* Remove as tags HTML do resumo */}
                   {post.content?.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                </p>

                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#23140c] flex items-center gap-2">
                    Ler Mais <ArrowRight size={14} className="text-[#C4A45F] group-hover:translate-x-2 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-serif italic text-lg">Nenhuma notícia publicada no momento.</p>
          </div>
        )}
      </div>
    </main>
  );
}