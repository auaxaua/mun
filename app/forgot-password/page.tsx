"use client";

import Link from "next/link";
import { useActionState } from "react";

import { submitForgotPassword } from "./actions";

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(submitForgotPassword, { message: null, error: null });

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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              استعادة كلمة المرور
            </h2>
            <p className="text-center text-base font-medium text-gray-600">
              أدخل بريدك الإلكتروني وسيصلك رابط لإعادة تعيين كلمة المرور
            </p>
          </div>

          <form action={formAction} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                البريد الإلكتروني
              </label>
              <input
                name="email"
                type="email"
                required
                dir="ltr"
                autoComplete="email"
                className="h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                placeholder="user@example.com"
              />
            </div>

            {state?.error ? (
              <div className="bg-red-50 border-r-4 border-red-500 text-red-700 p-4 rounded-xl animate-fade-in">
                <p className="text-sm font-semibold">{state.error}</p>
              </div>
            ) : null}

            {state?.message ? (
              <div className="bg-green-50 border-r-4 border-green-500 text-green-700 p-4 rounded-xl animate-fade-in">
                <p className="text-sm font-semibold">{state.message}</p>
              </div>
            ) : null}

            <button
              type="submit"
              className="w-full btn-primary"
            >
              إرسال رابط الاستعادة
            </button>
          </form>

          <p className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              العودة لتسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
