import { requireSession } from "@/lib/session";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  console.log("🏠 Dashboard page loading...");
  
  // التحقق من الجلسة
  const session = await requireSession();
  
  if (!session) {
    console.log("❌ No session, redirecting to login");
    redirect("/login");
  }
  
  console.log("✅ Session verified for:", session.username);
  
  return <DashboardClient session={session} />;
}
