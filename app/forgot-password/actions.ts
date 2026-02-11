"use server";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/email";
import { isValidEmail, generateSecureToken } from "@/lib/security";
import rateLimiter, { RATE_LIMITS } from "@/lib/rateLimit";

const SUCCESS_MESSAGE =
  "إذا كان البريد الإلكتروني مسجلاً لدينا، سيصلك رابط لإعادة تعيين كلمة المرور.";

export async function submitForgotPassword(
  _prevState: { message: string | null; error: string | null } | null,
  formData: FormData
): Promise<{ message: string | null; error: string | null }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) {
    return { message: null, error: "أدخل البريد الإلكتروني." };
  }

  // التحقق من صحة البريد الإلكتروني
  if (!isValidEmail(email)) {
    return { message: null, error: "البريد الإلكتروني غير صالح." };
  }

  // Rate limiting
  const rateLimitKey = `forgot-password:${email}`;
  if (rateLimiter.isRateLimited(rateLimitKey, RATE_LIMITS.FORGOT_PASSWORD.limit, RATE_LIMITS.FORGOT_PASSWORD.window)) {
    return { 
      message: null, 
      error: "تم تجاوز الحد المسموح. يرجى المحاولة لاحقاً." 
    };
  }

  const user = await prisma.munUser.findUnique({
    where: { email },
    select: { id: true, username: true, name: true },
  });

  // نفس الرسالة سواء وُجد المستخدم أم لا (عدم كشف وجود الحساب)
  if (!user) {
    return { message: SUCCESS_MESSAGE, error: null };
  }

  // إنشاء token فريد وآمن
  const resetToken = generateSecureToken(32);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // ساعة واحدة

  // حفظ الـ token في قاعدة البيانات
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: resetToken,
      expires: expiresAt,
    },
  });

  // إنشاء رابط إعادة التعيين
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3001";
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

  // إرسال البريد مع الرابط
  const sent = await sendMail(
    email,
    "إعادة تعيين كلمة المرور — إدارة المنافسات والمشتريات",
    `مرحباً ${user.name}،\n\nتلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك.\n\nلإعادة تعيين كلمة المرور، انقر على الرابط التالي:\n\n${resetUrl}\n\nهذا الرابط صالح لمدة ساعة واحدة فقط.\n\nإذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة.\n\n— إدارة المنافسات والمشتريات`,
    `
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #333;">إعادة تعيين كلمة المرور</h2>
        <p>مرحباً <strong>${user.name}</strong>،</p>
        <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك.</p>
        <p>لإعادة تعيين كلمة المرور، انقر على الزر أدناه:</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${resetUrl}" style="background-color: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 10px; display: inline-block;">إعادة تعيين كلمة المرور</a>
        </div>
        <p style="color: #666; font-size: 14px;">أو انسخ الرابط التالي في المتصفح:</p>
        <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;">${resetUrl}</p>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">هذا الرابط صالح لمدة <strong>ساعة واحدة</strong> فقط.</p>
        <p style="color: #999; font-size: 13px; margin-top: 30px;">إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة.</p>
        <hr style="margin: 20px 0; border: 1px solid #ddd;">
        <p style="color: #999; font-size: 12px;">— إدارة المنافسات والمشتريات - جامعة شقراء</p>
      </div>
    `
  );

  if (!sent) {
    return {
      message: null,
      error: "تعذّر إرسال البريد. تأكد من إعداد SMTP في الخادم أو تواصل مع مدير النظام.",
    };
  }

  return { message: SUCCESS_MESSAGE, error: null };
}
