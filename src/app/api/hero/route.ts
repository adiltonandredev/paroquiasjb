import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Busca qualquer destaque publicado, independente da categoria, para garantir que apareça algo
    const banners = await prisma.post.findMany({
      where: {
        isHighlight: true,
        status: "published",
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Formata para o json que o componente visual espera
    const formattedBanners = banners.map((b) => ({
      id: b.id,
      titleRest: b.title,
      titleHighlight: "",
      subtitle: b.category || "Destaque",
      description: "",
      // O segredo da imagem: garantimos que o campo se chama backgroundImageUrl
      backgroundImageUrl: b.coverImage || "", 
      primaryButtonText: "Ler Mais",
      primaryButtonUrl: `/noticias/${b.slug}`,
      secondaryButtonText: "Ver Todas",
      secondaryButtonUrl: "/noticias",
    }));

    return NextResponse.json(formattedBanners);
  } catch (error) {
    console.error("Erro API Hero:", error);
    return NextResponse.json([]);
  }
}