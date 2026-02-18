"use server";

import { prisma } from "@/lib/prisma";

/**
 * Busca as contagens para os cards de estatísticas
 */
export async function getDashboardStats() {
  try {
    // Executa as contagens em paralelo para não travar o carregamento
    const [postsCount, usersCount, slidesCount] = await Promise.all([
      prisma.post.count(),
      prisma.user.count(),
      prisma.post.count({ where: { isHighlight: true } }), // Exemplo para Hero Slides
    ]);

    return {
      success: true,
      data: {
        posts: postsCount,
        users: usersCount,
        slides: slidesCount,
        visits: "2.4k" // Valor simulado até integrar Analytics
      }
    };
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return { success: false, error: "Erro ao carregar estatísticas." };
  }
}

/**
 * Busca os últimos usuários registrados para o card de Atividade
 */
export async function getRecentActivity() {
  try {
    const activities = await prisma.user.findMany({
      take: 5,
      orderBy: { id: 'desc' },
      select: {
        id: true,
        name: true,
        role: true,
        sector: true
      }
    });

    return { success: true, data: activities };
  } catch (error) {
    return { success: false, error: "Falha ao carregar lista de atividades." };
  }
}