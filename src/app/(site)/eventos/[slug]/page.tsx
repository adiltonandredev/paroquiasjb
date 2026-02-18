import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
    params: Promise<{ slug: string }>;
};

// Interface corrigida para o TS não reclamar de 'name' ou 'title'
interface EventData {
    id: number;
    name: string;
    title?: string;
    date: Date | string;
    location: string;
    coverImage?: string | null;
    description?: string | null;
}

export default async function EventoDetailPage({ params }: Props) {
    const resolvedParams = await params;
    const slug = decodeURIComponent(resolvedParams.slug);

    // Busca flexível: tenta por slug, nome ou ID
    // @ts-ignore
    const event = await prisma.event.findFirst({
        where: {
            OR: [
                { name: { contains: slug === "null" ? "" : slug.replace(/-/g, ' ') } },
                { id: isNaN(Number(slug)) ? undefined : Number(slug) }
            ]
        }
    }) as EventData | null;

    if (!event) notFound();

    return (
        <main className="min-h-screen bg-[#fcfbf9] pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">

                {/* BOTÃO VOLTAR - Adicione este bloco */}
                <Link
                    href="/"
                    className="flex items-center gap-2 text-[#C4A45F] hover:text-[#754D25] transition-colors mb-8 group"
                >
                    <div className="w-8 h-8 rounded-full border border-[#C4A45F] flex items-center justify-center group-hover:bg-[#C4A45F] group-hover:text-white transition-all">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Voltar para o Início</span>
                </Link>

                <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#23140c] mb-8">
                    {event.name || event.title}
                </h1>

                <div className="relative h-[400px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 border-8 border-white bg-gray-100">
                    {event.coverImage && (
                        <img src={event.coverImage} alt={event.name} className="w-full h-full object-cover" />
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <Calendar className="text-[#C4A45F]" size={24} />
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold">Data</p>
                            <p className="text-[#23140c] font-bold">{new Date(String(event.date)).toLocaleDateString('pt-BR')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <MapPin className="text-[#C4A45F]" size={24} />
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold">Local</p>
                            <p className="text-[#23140c] font-bold">{event.location}</p>
                        </div>
                    </div>
                </div>

                <div className="prose prose-stone max-w-none text-gray-600 font-serif text-lg"
                    dangerouslySetInnerHTML={{ __html: event.description || "" }}
                />
            </div>
        </main>
    );
}