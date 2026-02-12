import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - جلب جميع المنافسات
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const competitions = await prisma.competition.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        referenceNumber: true,
        title: true,
        type: true,
        publishDate: true,
        closingDate: true,
        status: true,
        createdBy: true,
        createdAt: true,
      },
    });

    return NextResponse.json(competitions);
  } catch (error) {
    console.error("خطأ في جلب المنافسات:", error);
    return NextResponse.json(
      { error: "فشل جلب المنافسات" },
      { status: 500 }
    );
  }
}

// POST - إضافة منافسة جديدة
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json();
    const { referenceNumber, title, type, publishDate, closingDate, status } = body;

    // التحقق من الحقول المطلوبة
    if (!referenceNumber || !title || !type) {
      return NextResponse.json(
        { error: "الحقول المطلوبة مفقودة" },
        { status: 400 }
      );
    }

    // التحقق من عدم تكرار رقم المنافسة
    const existing = await prisma.competition.findUnique({
      where: { referenceNumber },
    });

    if (existing) {
      return NextResponse.json(
        { error: "رقم المنافسة موجود مسبقاً" },
        { status: 400 }
      );
    }

    // إنشاء المنافسة
    const competition = await prisma.competition.create({
      data: {
        referenceNumber,
        title,
        type,
        publishDate: publishDate ? new Date(publishDate) : null,
        closingDate: closingDate ? new Date(closingDate) : null,
        status: status || "draft",
        createdBy: (session.user as any).username || session.user.name,
      },
    });

    // تسجيل النشاط
    await prisma.munActivity.create({
      data: {
        userId: (session.user as any).id,
        username: (session.user as any).username || session.user.name,
        action: "create",
        entity: "competition",
        entityId: competition.id,
        details: `إضافة منافسة: ${competition.referenceNumber}`,
      },
    });

    return NextResponse.json(competition, { status: 201 });
  } catch (error) {
    console.error("خطأ في إضافة المنافسة:", error);
    return NextResponse.json(
      { error: "فشل إضافة المنافسة" },
      { status: 500 }
    );
  }
}
