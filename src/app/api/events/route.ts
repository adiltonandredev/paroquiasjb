import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    const events = await prisma.event.findMany({
      where: {
        // Opcional: Mostrar apenas eventos que ainda não passaram
        date: {
          gte: new Date(), 
        },
      },
      orderBy: {
        date: 'asc',
      },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Erro na API de eventos:", error);
    return NextResponse.json([], { status: 500 });
  }
}