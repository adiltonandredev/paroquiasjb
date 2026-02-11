import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// GET: Listar Usuários
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, sector: true } // Não devolvemos a senha
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 });
  }
}

// POST: Criar Usuário
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role, sector } = body;

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role, sector }
    });

    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 });
  }
}