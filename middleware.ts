import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

// Proteger todas as rotas que começam com /admin
export const config = {
  matcher: ["/admin/:path*"],
};