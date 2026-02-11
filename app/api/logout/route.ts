import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST() {
  console.log("🚪 Logout requested");
  
  const cookieStore = await cookies();
  cookieStore.delete("mun-session");
  
  console.log("✅ Session cookie deleted");
  
  return NextResponse.json({ success: true });
}
