"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ActionResponse = {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
};

export async function getSettings(): Promise<ActionResponse> {
  try {
    const data = await prisma.setting.findFirst();
    return { success: true, data: data || {} };
  } catch (error) {
    console.error("Erro ao buscar:", error);
    return { success: false, data: {} };
  }
}

export async function saveSettings(formData: any): Promise<ActionResponse> {
  try {
    // 1. Limpeza dos dados: Removemos ID e garantimos que campos vazios virem null
    const { id, ...dataToSave } = formData;

    const current = await prisma.setting.findFirst();

    // 2. Mapeamento explícito (Garante que o Prisma veja os novos campos)
    const payload = {
      ...dataToSave,
      paroco: dataToSave.paroco || null,
      paroco_foto: dataToSave.paroco_foto || null,
      paroco_bio: dataToSave.paroco_bio || null,
      vigarios: dataToSave.vigarios || null,
      religiosos: dataToSave.religiosos || null, // CAMPO DOS IRMÃOS
    };

    if (current) {
      await prisma.setting.update({
        where: { id: current.id },
        data: payload,
      });
    } else {
      await prisma.setting.create({
        data: payload,
      });
    }

    // 3. Revalida tudo: O site inteiro e a página do clero específica
    revalidatePath("/", "layout");
    revalidatePath("/nossa-paroquia/clero");
    
    return { 
      success: true, 
      message: "Configurações e fotos atualizadas com sucesso!" 
    };
  } catch (error: any) {
    console.error("Erro ao salvar no banco:", error);
    return { 
      success: false, 
      error: "Falha ao gravar os dados. Verifique se as colunas existem no banco." 
    };
  }
}