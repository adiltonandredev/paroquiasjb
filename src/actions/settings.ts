"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Essa tipagem remove os erros vermelhos do seu page.tsx
export type ActionResponse = {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
};

export async function getSettings(): Promise<ActionResponse> {
  try {
    const data = await prisma.setting.findFirst();
    // Retorna success e data para o useEffect do seu page.tsx
    return { success: true, data: data || {} };
  } catch (error) {
    console.error("Erro ao buscar:", error);
    return { success: false, data: {} };
  }
}

export async function saveSettings(formData: any): Promise<ActionResponse> {
  try {
    // 1. Removemos o ID para não dar erro de chave primária no MySQL
    const { id, ...dataToSave } = formData;

    const current = await prisma.setting.findFirst();

    if (current) {
      await prisma.setting.update({
        where: { id: current.id },
        data: dataToSave,
      });
    } else {
      await prisma.setting.create({
        data: dataToSave,
      });
    }

    // 2. Força o Next.js a atualizar o Footer e a Logo no site todo
    revalidatePath("/", "layout");
    
    // Retorna 'message' para o toast.success do seu handleSave
    return { success: true, message: "Configurações salvas com sucesso na Hostinger!" };
  } catch (error: any) {
    console.error("Erro ao salvar:", error);
    return { success: false, error: "Falha ao gravar os dados no servidor remoto." };
  }
}