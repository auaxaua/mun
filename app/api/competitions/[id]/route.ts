import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - جلب منافسة واحدة
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;

    const competition = await prisma.competition.findUnique({
      where: { id },
    });

    if (!competition) {
      return NextResponse.json(
        { error: "المنافسة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json(competition);
  } catch (error) {
    console.error("خطأ في جلب المنافسة:", error);
    return NextResponse.json(
      { error: "فشل جلب المنافسة" },
      { status: 500 }
    );
  }
}

// PUT - تحديث منافسة
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { referenceNumber, title, type, publishDate, closingDate, status, description } = body;

    // التحقق من وجود المنافسة
    const existing = await prisma.competition.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "المنافسة غير موجودة" },
        { status: 404 }
      );
    }

    // التحقق من عدم تكرار رقم المنافسة (إذا تغير)
    if (referenceNumber && referenceNumber !== existing.referenceNumber) {
      const duplicate = await prisma.competition.findUnique({
        where: { referenceNumber },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: "رقم المنافسة موجود مسبقاً" },
          { status: 400 }
        );
      }
    }

    // تحديث المنافسة
    const competition = await prisma.competition.update({
      where: { id },
      data: {
        referenceNumber,
        title,
        type,
        description,
        publishDate: publishDate ? new Date(publishDate) : null,
        closingDate: closingDate ? new Date(closingDate) : null,
        status,
      },
    });

    // تسجيل النشاط
    await prisma.munActivity.create({
      data: {
        userId: (session.user as any).id,
        username: (session.user as any).username || session.user.name,
        action: "update",
        entity: "competition",
        entityId: competition.id,
        details: `تحديث منافسة: ${competition.referenceNumber}`,
      },
    });

    return NextResponse.json(competition);
  } catch (error) {
    console.error("خطأ في تحديث المنافسة:", error);
    return NextResponse.json(
      { error: "فشل تحديث المنافسة" },
      { status: 500 }
    );
  }
}

// DELETE - حذف منافسة
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;

    // التحقق من وجود المنافسة
    const existing = await prisma.competition.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "المنافسة غير موجودة" },
        { status: 404 }
      );
    }

    // حذف المنافسة
    await prisma.competition.delete({
      where: { id },
    });

    // تسجيل النشاط
    await prisma.munActivity.create({
      data: {
        userId: (session.user as any).id,
        username: (session.user as any).username || session.user.name,
        action: "delete",
        entity: "competition",
        entityId: id,
        details: `حذف منافسة: ${existing.referenceNumber}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("خطأ في حذف المنافسة:", error);
    return NextResponse.json(
      { error: "فشل حذف المنافسة" },
      { status: 500 }
    );
  }
}
