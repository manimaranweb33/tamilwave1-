import type { NextAuthConfig } from "next-auth";

export const userAuthConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  providers: [],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as "USER") ?? "USER";
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "USER";
        if ((user as { image?: string }).image) token.picture = (user as { image?: string }).image;
      }
      return token;
    }
  }
};
