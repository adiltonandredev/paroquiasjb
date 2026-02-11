import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Definimos que params é uma Promise
interface RouteContext {
  params: Promise<{ id: string }>;
}

// PUT: Atualizar Usuário (Dados + Status + Senha)
export async function PUT(req: Request, { params }: RouteContext) {
  try {
    // 1. Aguardamos o params antes de usar (Correção Next.js 15)
    const { id } = await params;
    const userId = parseInt(id);

    const body = await req.json();

    // Validar ID
    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    // Preparar dados para o Prisma
    const dataToUpdate: Prisma.UserUpdateInput = {
      name: body.name,
      email: body.email,
      role: body.role,
      sector: body.sector,
      active: body.active,
    };

    // Atualizar senha apenas se foi enviada e não está vazia
    if (body.password && typeof body.password === 'string' && body.password.trim() !== "") {
      dataToUpdate.password = await bcrypt.hash(body.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    // Remove a senha do retorno por segurança
    const { password, ...safeUser } = updatedUser;

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("Erro no PUT:", error);
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
  }
}

// DELETE: Excluir Usuário
export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const userId = parseInt(id);

    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: userId } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no DELETE:", error);
    return NextResponse.json({ error: "Erro ao excluir usuário" }, { status: 500 });
  }
}