import type { NextAuthConfig } from "next-auth";

export const adminAuthConfig: NextAuthConfig = {
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  providers: [],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as "ADMIN") ?? "ADMIN";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    }
  }
};
