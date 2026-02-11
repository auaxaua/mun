/**
 * إرسال البريد (نسيت كلمة المرور).
 * أضف في .env:
 *   SMTP_HOST=...
 *   SMTP_PORT=587
 *   SMTP_USER=...
 *   SMTP_PASS=...
 *   EMAIL_FROM=ادارة المنافسات والمشتريات <noreply@yourdomain.com>
 */
import nodemailer from "nodemailer";

const from = process.env.EMAIL_FROM ?? "ادارة المنافسات والمشتريات <noreply@example.com>";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port: port ? parseInt(port, 10) : 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
}

export async function sendMail(to: string, subject: string, text: string, html?: string): Promise<boolean> {
  const transport = getTransporter();
  if (!transport) {
    if (process.env.NODE_ENV === "development") {
      console.error("[email] لا يوجد إعداد SMTP: تأكد من SMTP_HOST, SMTP_USER, SMTP_PASS في .env");
    }
    // في الإنتاج، نسجل الخطأ بدون كشف التفاصيل الحساسة
    return false;
  }
  try {
    await transport.sendMail({
      from,
      to,
      subject,
      text,
      html: html ?? text,
    });
    if (process.env.NODE_ENV === "development") {
      console.log("[email] تم إرسال البريد بنجاح إلى:", to);
    }
    return true;
  } catch (err) {
    // معالجة الأخطاء بشكل آمن
    if (process.env.NODE_ENV === "development") {
      // في التطوير، نعرض التفاصيل
      console.error("[email] فشل الإرسال:", err instanceof Error ? err.message : String(err));
    } else {
      // في الإنتاج، نسجل خطأ عام فقط
      console.error("[email] فشل إرسال البريد الإلكتروني");
      // هنا يمكن إرسال الخطأ إلى خدمة مراقبة مثل Sentry
    }
    return false;
  }
}
