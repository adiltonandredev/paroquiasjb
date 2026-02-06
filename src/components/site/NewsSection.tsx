import { NewsService } from "@/services/news-service";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

export async function NewsSection() {
  const news = await NewsService.getLatestNews();

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <span className="text-primary font-bold tracking-wider uppercase text-sm">Fique por dentro</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2">
              Notícias e Avisos
            </h2>
          </div>
          <Link href="/noticias" className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            Ver todas as notícias <ArrowRight size={18} />
          </Link>
        </div>

        {/* Grid de Notícias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <Link key={item.id} href={`/noticias/${item.slug}`} className="group">
              <article className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                
                {/* Imagem (com efeito de zoom ao passar mouse) */}
                <div className="h-48 overflow-hidden relative">
                  <div 
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${item.imageUrl})` }}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary uppercase shadow-sm">
                    {item.category}
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Calendar size={14} className="text-primary" />
                    {item.date}
                  </div>
                  
                  <h3 className="text-xl font-bold font-serif text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                    {item.excerpt}
                  </p>
                  
                  <span className="text-primary font-medium text-sm flex items-center gap-1 group-hover:underline decoration-2 underline-offset-4">
                    Ler mais
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}