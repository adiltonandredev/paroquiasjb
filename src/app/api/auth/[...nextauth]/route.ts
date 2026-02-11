import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const handler = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 15 * 60, // 15 minutos
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 1. Buscar usuário
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          return null;
        }

        // --- NOVIDADE 1: Bloquear usuário inativo ---
        // Se active for false, jogamos um erro que impede o login
        if (user.active === false) {
           throw new Error("Sua conta foi desativada.");
        }

        // --- NOVIDADE 2: Comparação Híbrida de Senha ---
        
        // Primeiro tentamos comparar usando BCRYPT (para usuários novos criados no painel)
        let isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        // Se o bcrypt falhar, tentamos comparar TEXTO PURO (para o admin original do seed "123456")
        if (!isPasswordValid && credentials.password === user.password) {
            isPasswordValid = true;
        }

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          sector: user.sector, // Passamos o setor também
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.sector = user.sector;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.sector = token.sector;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };