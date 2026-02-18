"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getNotices() {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: notices };
  } catch (error) {
    return { success: false, error: "Erro ao buscar avisos." };
  }
}

export async function saveNotice(formData: any) {
  try {
    const { id, title, description, imageUrl, expiresAt, active } = formData;

    const data = {
      title,
      description,
      imageUrl,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      active: Boolean(active),
    };

    if (id) {
      await prisma.notice.update({
        where: { id: Number(id) },
        data
      });
    } else {
      await prisma.notice.create({ data });
    }

    revalidatePath("/admin/mural");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao salvar o aviso." };
  }
}

export async function deleteNotice(id: number) {
  try {
    await prisma.notice.delete({ where: { id } });
    revalidatePath("/admin/mural");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao excluir aviso." };
  }
}