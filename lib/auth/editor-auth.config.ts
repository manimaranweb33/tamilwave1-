import type { NextAuthConfig } from "next-auth";

export const editorAuthConfig: NextAuthConfig = {
  pages: { signIn: "/editor/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  providers: [],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as "EDITOR" | "ADMIN") ?? "EDITOR";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    }
  }
};
