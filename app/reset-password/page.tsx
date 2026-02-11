"use client";

import Link from "next/link";
import { Suspense, useEffect, useState, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import PasswordInput from "@/components/PasswordInput";
import { submitResetPassword } from "./actions";

function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  
  const [state, formAction] = useActionState(submitResetPassword, null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (state?.message) {
      // إعادة توجيه إلى صفحة تسجيل الدخول بعد النجاح
      setTimeout(() => {
        window.location.href = "/login?reset=success";
      }, 2000);
    }
  }, [state?.message]);

  if (!token) {
    return (
      <div className="bg-red-50 border-r-4 border-red-500 text-red-700 p-6 rounded-xl text-center">
        <p className="font-semibold">
          رابط غير صالح. يرجى طلب رابط جديد من صفحة{" "}
          <Link
            href="/forgot-password"
            className="underline hover:no-underline"
          >
            استعادة كلمة المرور
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="token" value={token} />
      
      {state?.error && (
        <div className="bg-red-50 border-r-4 border-red-500 text-red-700 p-4 rounded-xl">
          <p className="text-sm font-semibold">{state.error}</p>
        </div>
      )}

      {state?.message && (
        <div className="bg-green-50 border-r-4 border-green-500 text-green-700 p-4 rounded-xl">
          <p className="text-sm font-semibold">{state.message}</p>
        </div>
      )}

      <div>
        <PasswordInput
          label="كلمة المرور الجديدة"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="أدخل كلمة المرور الجديدة"
        />
        <p className="mt-2 text-xs text-gray-500">
          يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، ورقم
        </p>
      </div>

      <div>
        <PasswordInput
          label="تأكيد كلمة المرور"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="أعد إدخال كلمة المرور"
        />
      </div>

      <button
        type="submit"
        disabled={!!state?.message}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state?.message ? "جارٍ التحويل..." : "تغيير كلمة المرور"}
      </button>

      <div className="text-center">
        <Link
          href="/login"
          className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
        >
          العودة لتسجيل الدخول
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary-600 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-primary-500 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-4 bg-primary-700 rounded-2xl shadow-lg mb-4">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
              <span className="text-3xl">🏛️</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary-900 mb-2">
            جامعة شقراء
          </h1>
          <p className="text-gray-600 font-semibold">
            إدارة المنافسات والمشتريات
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-primary-500 to-gold-500 rounded-full mx-auto mt-3"></div>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              إعادة تعيين كلمة المرور
            </h2>
            <p className="text-sm text-gray-600">
              أدخل كلمة مرور جديدة لحسابك
            </p>
          </div>

          <Suspense
            fallback={
              <div className="text-center text-gray-500">جارٍ التحميل...</div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
