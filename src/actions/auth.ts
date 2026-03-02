"use server";

import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function requestPasswordReset(email: string) {
  // 1. Verifica se o usuário existe
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Retornamos sucesso mesmo se não existir (por segurança, para não revelar emails cadastrados)
    return { success: true, message: "Se o e-mail existir, você receberá um link." };
  }

  // 2. Gera um token único e data de expiração (1 hora)
  const token = randomBytes(32).toString("hex");
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  // 3. Salva no banco
  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  // 4. SIMULAÇÃO DE ENVIO DE E-MAIL (Aqui entra o Resend/Nodemailer depois)
  const resetLink = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${token}`;
  
  console.log("========================================");
  console.log("📧 E-MAIL DE RECUPERAÇÃO (SIMULADO):");
  console.log(`Para: ${email}`);
  console.log(`Link: ${resetLink}`);
  console.log("========================================");

  return { success: true, message: "Link de recuperação enviado para o e-mail." };
}