import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.isBlocked = user.isBlocked;

        // Auto-promote admin email if it's not already set in DB manually
        if (
          session.user.email === "bijalijayalakshmijayan@gmail.com" &&
          session.user.role !== "ADMIN"
        ) {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "ADMIN" },
          });
          session.user.role = "ADMIN";
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
