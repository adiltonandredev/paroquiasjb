"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. LISTAR TODAS (Com dados do pai para exibir na tabela)
export async function getPages() {
  try {
    const pages = await prisma.page.findMany({
      include: { parent: { select: { title: true } } }, // Busca o nome do pai
      orderBy: { updatedAt: 'desc' }
    });
    return { success: true, data: pages };
  } catch (error) {
    return { success: false, error: "Erro ao buscar páginas." };
  }
}

// 2. LISTAR APENAS PAIS (Para o Dropdown do formulário)
export async function getParentPages() {
  try {
    const parents = await prisma.page.findMany({
      where: { type: "menu" }, // Só pega quem é menu principal
      select: { id: true, title: true }
    });
    return { success: true, data: parents };
  } catch (error) {
    return { success: false, data: [] };
  }
}

// 3. BUSCAR PELO ID
export async function getPageById(id: number) {
  try {
    const page = await prisma.page.findUnique({ where: { id } });
    if (!page) return { success: false, error: "Página não encontrada" };
    return { success: true, data: page };
  } catch (error) {
    return { success: false, error: "Erro ao buscar." };
  }
}

// 4. CRIAR
export async function createPage(data: any) {
  try {
    // 1. Garantir que não estamos enviando um ID no objeto de criação
    // 2. Garantir que o parentId seja número ou null
    await prisma.page.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        type: data.type,
        status: data.isActive ? "published" : "draft",
        parentId: data.type === "submenu" && data.parentId ? Number(data.parentId) : null,
      }
    });

    revalidatePath("/admin/web-pages");
    return { success: true, message: "Página criada com sucesso!" };
  } catch (error: any) {
    console.error("Erro completo do Prisma:", error); // Isso vai mostrar o erro real no seu terminal
    
    if (error.code === 'P2002') {
      return { success: false, error: "Já existe uma página com este Slug (URL). Tente mudar o título." };
    }
    return { success: false, error: "Erro interno ao salvar no banco." };
  }
}

// 5. ATUALIZAR
export async function updatePage(id: number, data: any) {
  try {
    await prisma.page.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        type: data.type,
        status: data.isActive ? "published" : "draft",
        parentId: data.type === "submenu" && data.parentId ? parseInt(data.parentId) : null,
      }
    });
    revalidatePath("/admin/web-pages");
    return { success: true, message: "Página atualizada!" };
  } catch (error) {
    return { success: false, error: "Erro ao atualizar." };
  }
}

// 6. EXCLUIR
export async function deletePage(id: number) {
  try {
    await prisma.page.delete({ where: { id } });
    revalidatePath("/admin/web-pages");
    return { success: true, message: "Página excluída." };
  } catch (error) {
    return { success: false, error: "Erro ao excluir." };
  }
}