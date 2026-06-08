import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { userAuthConfig } from "@/lib/auth/user-auth.config";
import { verifyCredentials } from "@/lib/auth/credentials";

export const { handlers: userHandlers, auth: userAuth, signIn: userSignIn, signOut: userSignOut } =
  NextAuth({
    ...userAuthConfig,
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    adapter: PrismaAdapter(db),
    providers: [
      ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? [
            Google({
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
              allowDangerousEmailAccountLinking: false
            })
          ]
        : []),
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
          return verifyCredentials(email, password, ["USER"]);
        }
      })
    ],
    events: {
      async createUser({ user }) {
        await db.user.update({
          where: { id: user.id },
          data: { role: "USER" }
        });
      }
    },
    callbacks: {
      ...userAuthConfig.callbacks,
      async signIn({ user, account }) {
        if (account?.provider === "google") {
          const existing = await db.user.findUnique({ where: { email: user.email! } });
          if (existing && existing.role !== "USER") return false;
        }
        return true;
      },
      async jwt({ token, user, account }) {
        if (user) {
          const dbUser = await db.user.findUnique({ where: { id: user.id } });
          if (dbUser) {
            token.role = dbUser.role;
            if (dbUser.image) token.picture = dbUser.image;
          }
        }
        if (account?.provider === "google" && user?.id) {
          token.role = "USER";
        }
        return token;
      }
    }
  });
