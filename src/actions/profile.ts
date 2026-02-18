"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

interface ProfileUpdateData {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export async function updateProfile(formData: ProfileUpdateData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Não autorizado." };

  try {
    const { name, email, password, confirmPassword } = formData;
    const userId = Number(session.user.id);

    // Validação de confirmação de senha
    if (password && password !== confirmPassword) {
      return { success: false, error: "As senhas não coincidem." };
    }

    const data: Partial<ProfileUpdateData> = { name, email };

    if (password && password.trim() !== "") {
      data.password = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: { id: userId },
      data
    });

    revalidatePath("/admin/profile");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao atualizar perfil." };
  }
}