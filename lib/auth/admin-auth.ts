import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { adminAuthConfig } from "@/lib/auth/admin-auth.config";
import { verifyCredentials } from "@/lib/auth/credentials";

const cookiePrefix = "admin-auth";

export const {
  handlers: adminHandlers,
  auth: adminAuth,
  signIn: adminSignIn,
  signOut: adminSignOut
} = NextAuth({
  ...adminAuthConfig,
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  basePath: "/api/admin-auth",
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
        return verifyCredentials(email, password, ["ADMIN"]);
      }
    })
  ],
  callbacks: {
    ...adminAuthConfig.callbacks,
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    }
  }
});
