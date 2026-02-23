import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image"; 
import { ArrowRight, Calendar } from "lucide-react";

export async function NewsSection() {
  const news = await prisma.post.findMany({
    where: {
      status: "published",
      category: { notIn: ["hero", "feature-card"] } 
    },
    // OTIMIZAÇÃO: Buscamos apenas o necessário. O 'content' fica no banco.
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      coverImage: true,
      category: true,
      createdAt: true,
      // content: false (ao usar select, o que não está aqui não é baixado)
    },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  return (
    <section className="py-12 md:py-20 bg-[#fcfbf9]">
      <div className="container mx-auto px-4 md:px-6">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-4">
          <div>
            <span className="text-[#C4A45F] font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs bg-[#C4A45F]/10 px-3 py-1 rounded-full">
              Fique por dentro
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#23140c] mt-4">
              Notícias e Avisos
            </h2>
          </div>
          <Link href="/noticias" className="group text-[#754D25] font-bold text-sm flex items-center gap-2 hover:text-[#C4A45F] transition-colors">
            Ver todas as notícias 
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {news.map((item) => (
            <Link key={item.id} href={`/noticias/${item.slug}`} className="group">
              <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-full flex flex-col transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                
                <div className="h-56 overflow-hidden relative">
                  <Image
                    src={item.coverImage || '/images/default-news.jpg'}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-bold text-[#754D25] uppercase shadow-sm border border-[#C4A45F]/20">
                    {item.category}
                  </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500 mb-4 uppercase tracking-wider">
                    <Calendar size={14} className="text-[#C4A45F]" />
                    {new Date(item.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>

                  <h3 className="text-xl font-bold font-serif text-[#23140c] mb-4 group-hover:text-[#754D25] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  {/* Alterado para usar apenas o summary, que já é leve */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                    {item.summary || "Clique para ler os detalhes desta publicação..."}
                  </p>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[#754D25] font-bold text-xs uppercase tracking-widest group-hover:text-[#C4A45F] transition-colors">
                      Ler mais
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#fcfbf9] flex items-center justify-center group-hover:bg-[#C4A45F] group-hover:text-white transition-all">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {news.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 italic">Nenhuma notícia publicada no momento.</p>
          </div>
        )}
      </div>
    </section>
  );
}