import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  console.log("🔐 Login API called");
  
  try {
    const body = await request.json();
    console.log("📥 Request body:", { username: body.username });
    
    const { username, password } = body;

    if (!username || !password) {
      console.log("❌ Missing credentials");
      return NextResponse.json(
        { error: "اسم المستخدم وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    console.log("🔍 Searching for user:", username);
    
    // البحث عن المستخدم
    const user = await prisma.munUser.findUnique({
      where: { username: username.trim() },
      include: { permissions: true },
    });

    if (!user) {
      console.log("❌ User not found");
      return NextResponse.json(
        { error: "اسم المستخدم أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    console.log("✅ User found:", user.username);
    console.log("🔍 User permissions:", user.permissions);

    if (!user.active) {
      console.log("❌ User inactive");
      return NextResponse.json(
        { error: "هذا الحساب معطل" },
        { status: 401 }
      );
    }

    // التحقق من كلمة المرور
    const isValid = await bcrypt.compare(password, user.passwordHash);
    console.log("🔑 Password valid:", isValid);

    if (!isValid) {
      return NextResponse.json(
        { error: "اسم المستخدم أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    // تحديد isAdmin - إذا كانت permissions موجودة ومفعلة
    const isAdmin = user.permissions[0]?.isAdmin === true;
    console.log("👑 Is Admin:", isAdmin);

    // تسجيل نشاط
    await prisma.munActivity.create({
      data: {
        userId: user.id,
        username: user.username,
        action: "login",
      },
    });

    // إنشاء الجلسة
    const token = sign(
      {
        id: user.id,
        username: user.username,
        name: user.name,
        isAdmin: isAdmin,
      },
      process.env.NEXTAUTH_SECRET || "mun-secret-key-2026",
      { expiresIn: "8h" }
    );

    console.log("✅ Login successful - isAdmin:", isAdmin);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        department: user.department,
        position: user.position,
        isAdmin: isAdmin,
      },
    });

    // حفظ الجلسة في Cookie
    response.cookies.set("mun-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60, // 8 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("💥 Login error:", error);
    return NextResponse.json(
      { error: "حدث خطأ: " + (error as Error).message },
      { status: 500 }
    );
  }
}
