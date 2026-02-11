// هذا الملف قديم - استخدم lib/session.ts بدلاً منه
// يُحفظ فقط للتوافق المؤقت

import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { redirect } from "next/navigation";

export interface SessionUser {
  id: string;
  username: string;
  name: string;
  isAdmin: boolean;
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("mun-session");

    if (!token) {
      return null;
    }

    const secret = process.env.NEXTAUTH_SECRET || "mun-secret-key-2026";
    const decoded = verify(token.value, secret) as SessionUser;

    return decoded;
  } catch (error) {
    return null;
  }
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireSession();

  if (!session.isAdmin) {
    redirect("/dashboard");
  }

  return session;
}

export async function requireSectionAccess(
  section: "competitions" | "warranties" | "contracts" | "expenses"
) {
  // ببساطة نتحقق من الجلسة فقط حالياً
  // يمكن إضافة صلاحيات تفصيلية لاحقاً
  return await requireSession();
}
