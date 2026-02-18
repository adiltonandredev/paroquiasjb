"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * 1. LISTAR TODOS OS EVENTOS
 * Busca a agenda completa ordenada pela data mais próxima.
 */
export async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
    });
    return { success: true, data: events };
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return { success: false, error: "Erro ao carregar a agenda de eventos." };
  }
}

/**
 * 2. BUSCAR EVENTO POR ID
 */
export async function getEventById(id: number) {
  try {
    const event = await prisma.event.findUnique({ where: { id: Number(id) } });
    if (!event) return { success: false, error: "Evento não encontrado." };
    return { success: true, data: event };
  } catch (error) {
    return { success: false, error: "Erro ao carregar detalhes do evento." };
  }
}

/**
 * 3. SALVAR OU ATUALIZAR EVENTO
 */
export async function saveEvent(id: number | null, data: any) {
  try {
    if (!data.date) {
      return { success: false, error: "A data do evento é obrigatória." };
    }

    // Ajustamos os nomes dos campos para bater exatamente com o seu Prisma
    const eventData = {
      name: data.name,
      category: data.category,
      date: new Date(data.date), 
      time: data.time,
      location: data.location,
      summary: data.summary,
      description: data.description,
      coverImage: data.coverImage,
      // NOMES CORRIGIDOS ABAIXO:
      isHighlight: data.hero?.active ?? false, 
      highlightExpiresAt: data.hero?.expires_at ? new Date(data.hero.expires_at) : null,
    };

    if (id) {
      await prisma.event.update({
        where: { id: Number(id) },
        data: eventData,
      });
      revalidatePath("/admin/events");
      return { success: true, message: "Evento atualizado!" };
    } else {
      await prisma.event.create({
        data: eventData,
      });
      revalidatePath("/admin/events");
      return { success: true, message: "Evento agendado com sucesso!" };
    }
  } catch (error: any) {
    console.error("Erro no Prisma:", error);
    return { success: false, error: "Erro técnico ao gravar no banco." };
  }
}
/**
 * 4. EXCLUIR EVENTO (Ação chamada pelo DeleteButton)
 */
export async function deleteEvent(id: number) {
  try {
    await prisma.event.delete({
      where: { id: Number(id) },
    });

    // Força o Next.js a atualizar a lista na tela imediatamente
    revalidatePath("/admin/events");

    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    return { success: false, error: "Não foi possível remover o evento." };
  }
}