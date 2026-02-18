import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string; // O NextAuth trata como string na sessão
    role: string;
    sector?: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      sector?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    sector?: string | null;
  }
}