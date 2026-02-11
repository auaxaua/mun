import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { 
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "اسم المستخدم", type: "text" },
        password: { label: "كلمة المرور", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim();
        const password = credentials?.password ?? "";
        if (!username || !password) return null;

        const user = await prisma.munUser.findUnique({ 
          where: { username },
          include: { permissions: true },
        });
        
        if (!user || !user.active) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? undefined,
          username: user.username,
          department: user.department,
          position: user.position,
          isAdmin: user.permissions?.isAdmin ?? false,
        } as any;
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        await prisma.munActivity.create({
          data: {
            userId: (user as any).id,
            username: (user as any).username,
            action: "login",
          },
        });
      } catch {
        // لا نفشل تسجيل الدخول
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        (token as any).id = (user as any).id;
        (token as any).username = (user as any).username;
        (token as any).department = (user as any).department;
        (token as any).position = (user as any).position;
        (token as any).isAdmin = (user as any).isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token as any).id;
        (session.user as any).username = (token as any).username;
        (session.user as any).department = (token as any).department;
        (session.user as any).position = (token as any).position;
        (session.user as any).isAdmin = (token as any).isAdmin;
      }
      return session;
    },
  },
};
