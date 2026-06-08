import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { editorAuthConfig } from "@/lib/auth/editor-auth.config";
import { verifyCredentials } from "@/lib/auth/credentials";

const cookiePrefix = "editor-auth";

export const {
  handlers: editorHandlers,
  auth: editorAuth,
  signIn: editorSignIn,
  signOut: editorSignOut
} = NextAuth({
  ...editorAuthConfig,
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  basePath: "/api/editor-auth",
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}.session-token`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" }
    },
    callbackUrl: {
      name: `${cookiePrefix}.callback-url`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" }
    },
    csrfToken: {
      name: `${cookiePrefix}.csrf-token`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" }
    }
  },
  providers: [
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString() ?? "";
        const password = credentials?.password?.toString() ?? "";
        return verifyCredentials(email, password, ["EDITOR", "ADMIN"]);
      }
    })
  ],
  callbacks: {
    ...editorAuthConfig.callbacks,
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    }
  }
});
