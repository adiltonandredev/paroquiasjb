// src/lib/permissions.ts

export const CAN = {
  // Quem pode gerenciar usuários (Criar e Ver lista)
  manageUsers: (role: string) => role === "admin",
  
  // Quem pode excluir usuários
  deleteUser: (role: string) => role === "admin",
  
  // Quem pode mexer em conteúdo (Posts, Eventos)
  manageContent: (role: string) => ["admin", "editor"].includes(role),
  
  // Quem pode excluir configurações
  deleteSettings: (role: string) => role === "admin",
};