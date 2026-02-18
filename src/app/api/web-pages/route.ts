// src/app/api/web-pages/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      where: { 
        status: "published",
        parentId: null // Busca as páginas principais (Pais)
      },
      include: {
        children: { // ESSENCIAL: Incluir os submenus (Filhos)
          where: { status: "published" },
          select: {
            id: true,
            title: true,
            slug: true,
          }
        }
      },
      orderBy: { id: 'asc' }
    });
    return NextResponse.json(pages);
  } catch (error) {
    console.error("Erro na API de páginas:", error);
    return NextResponse.json([], { status: 500 });
  }
}