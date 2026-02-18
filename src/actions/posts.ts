"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. LISTAR TODOS OS POSTS
export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: posts };
  } catch (error) {
    return { success: false, error: "Erro ao buscar postagens." };
  }
}

// 2. BUSCAR POST POR ID
export async function getPostById(id: number) {
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return { success: false, error: "Postagem não encontrada." };
    return { success: true, data: post };
  } catch (error) {
    return { success: false, error: "Erro ao carregar postagem." };
  }
}

// 3. CRIAR / EDITAR POSTAGEM
export async function savePost(id: number | null, data: Record<string, any>) {
  try {
    // Montamos o objeto APENAS com os campos de dados, sem o ID para não dar erro de ROLLBACK
    const postData = {
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      content: data.content,
      coverImage: data.coverImage,
      category: data.category,
      isHighlight: data.isHighlight,
      status: data.status,
    };

    if (id) {
      // Atualizar existente
      await prisma.post.update({
        where: { id },
        data: postData,
      });
      revalidatePath("/admin/posts");
      return { success: true, message: "Postagem atualizada!" };
    } else {
      // Criar novo (sem enviar o ID)
      await prisma.post.create({
        data: postData,
      });
      revalidatePath("/admin/posts");
      return { success: true, message: "Postagem criada com sucesso!" };
    }
  } catch (error: any) {
    console.error("Erro no Prisma:", error);
    return { success: false, error: "Erro ao guardar no banco de dados." };
  }
}

// 4. EXCLUIR POST
export async function deletePost(id: number) {
    try {
        await prisma.post.delete({
            where: { id: id }
        });
        
        // ESSA LINHA É OBRIGATÓRIA PARA A TELA ATUALIZAR
        revalidatePath("/admin/posts"); 
        
        return { success: true };
    } catch (error) {
        return { success: false, error: "Falha ao excluir." };
    }
}