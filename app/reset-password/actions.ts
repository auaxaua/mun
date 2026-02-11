"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isStrongPassword } from "@/lib/security";

export async function submitResetPassword(
  _prevState: { message: string | null; error: string | null } | null,
  formData: FormData
): Promise<{ message: string | null; error: string | null }> {
  const token = String(formData.get("token") ?? "").trim();
  const newPassword = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!token) {
    return { message: null, error: "رابط غير صالح." };
  }

  if (!newPassword || !confirmPassword) {
    return { message: null, error: "يرجى إدخال كلمة المرور وتأكيدها." };
  }

  if (newPassword !== confirmPassword) {
    return { message: null, error: "كلمتا المرور غير متطابقتين." };
  }

  // التحقق من قوة كلمة المرور
  const passwordCheck = isStrongPassword(newPassword);
  if (!passwordCheck.valid) {
    return { message: null, error: passwordCheck.message || "كلمة مرور ضعيفة." };
  }

  // البحث عن الـ token
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: { select: { id: true } } },
  });

  if (!resetToken) {
    return { message: null, error: "رابط غير صالح أو منتهي الصلاحية." };
  }

  // التحقق من صلاحية الـ token
  if (resetToken.used) {
    return { message: null, error: "تم استخدام هذا الرابط مسبقاً." };
  }

  if (new Date() > resetToken.expires) {
    return { message: null, error: "انتهت صلاحية هذا الرابط. يرجى طلب رابط جديد." };
  }

  // تحديث كلمة المرور
  const passwordHash = await bcrypt.hash(newPassword, 12);
  
  await prisma.$transaction([
    prisma.munUser.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    }),
  ]);

  return { 
    message: "تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.", 
    error: null 
  };
}
