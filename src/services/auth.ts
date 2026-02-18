// src/services/auth.ts
export const authService = {
  logout: () => {
    // Remove o token ou cookie de sessão
    localStorage.removeItem("@SJB:token");
    // Aqui você pode adicionar a lógica de limpeza de cookies se usar js-cookie
  }
};