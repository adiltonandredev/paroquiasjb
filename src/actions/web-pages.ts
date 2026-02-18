"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function savePage(data: any) {
  try {
    const { id, title, slug, content, parentId, status, type } = data;

    const payload = {
      title,
      slug: slug.toLowerCase().trim(), // Garante slug limpo
      content,
      type: type || "menu",
      status: status || "published",
      parentId: parentId ? parseInt(parentId) : null,
    };

    if (id) {
      await prisma.page.update({
        where: { id: parseInt(id) },
        data: payload,
      });
    } else {
      await prisma.page.create({
        data: payload,
      });
    }

    // LIMPEZA DE CACHE (Essencial para parar o 404)
    revalidatePath("/");
    revalidatePath(`/${slug}`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Erro Action:", error);
    return { success: false, error: error.message };
  }
}