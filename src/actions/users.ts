"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface UserFormData {
  id?: string | number;
  name: string;
  email: string;
  password?: string;
  role: string;
  sector: string;
  active: any; // Deixamos como any para tratar a conversão manualmente
}

export async function saveUser(formData: UserFormData) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role?.toLowerCase();
  
  if (userRole !== "admin") return { success: false, error: "Acesso negado." };

  try {
    const { id, name, email, password, role, sector, active } = formData;
    
    // LOG DE DEPURAÇÃO: Verifique no terminal o que aparece aqui ao salvar
    console.log("Recebido do formulário - ID:", id, "Status (active):", active);

    // CONVERSÃO MANUAL INFALÍVEL
    // Se vier booleano true ou a string "true", vira true. Caso contrário, false.
    const activeValue = active === true || active === "true";

    let hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    if (id) {
      await prisma.user.update({
        where: { id: Number(id) },
        data: {
          name,
          email,
          role,
          sector,
          active: activeValue, // VALOR CONVERTIDO
          ...(hashedPassword && { password: hashedPassword })
        }
      });
    } else {
      await prisma.user.create({
        data: {
          name, email, role, sector,
          active: true,
          password: hashedPassword || "",
        },
      });
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Erro Prisma:", error);
    return { success: false, error: "Erro ao salvar no servidor." };
  }
}

export async function deleteUser(id: number | string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role?.toLowerCase() !== "admin") return { success: false };

  try {
    await prisma.user.delete({ where: { id: Number(id) } });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}