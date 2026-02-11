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
      console.log("❌ No session cookie found");
      return null;
    }

    const secret = process.env.NEXTAUTH_SECRET || "mun-secret-key-2026";
    const decoded = verify(token.value, secret) as SessionUser;

    console.log("✅ Session verified:", decoded.username);
    return decoded;
  } catch (error) {
    console.error("❌ Session verification failed:", error);
    return null;
  }
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();

  if (!session) {
    console.log("🔒 No session, redirecting to login");
    redirect("/login");
  }

  return session;
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireSession();

  if (!session.isAdmin) {
    console.log("🚫 User is not admin");
    redirect("/dashboard");
  }

  return session;
}
