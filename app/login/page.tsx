"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  console.log("🎨 LoginPage component loaded!");
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  console.log("🔧 State initialized:", { loading, error });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log("🎯 handleSubmit called!");
    e.preventDefault();
    console.log("✅ preventDefault called");
    
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    console.log("📝 Form data:", { username, password: "***" });
    console.log("🔐 Attempting login for:", username);

    if (!username || !password) {
      console.error("❌ Missing username or password");
      setError("الرجاء إدخال اسم المستخدم وكلمة المرور");
      setLoading(false);
      return;
    }

    try {
      console.log("📡 Sending request to /api/login...");
      
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("📡 Response received!");
      console.log("📡 Response status:", res.status);
      console.log("📡 Response ok:", res.ok);
      console.log("📡 Response content-type:", res.headers.get("content-type"));

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Response text:", text);
        
        try {
          const data = JSON.parse(text);
          console.error("❌ Parsed error:", data);
          setError(data.error || "اسم المستخدم أو كلمة المرور غير صحيحة");
        } catch {
          console.error("❌ Could not parse error response");
          setError("حدث خطأ في الاتصال بالخادم");
        }
        setLoading(false);
        return;
      }

      const text = await res.text();
      console.log("📄 Response text:", text);
      
      const data = JSON.parse(text);
      console.log("✅ Parsed response:", data);

      if (data.success) {
        console.log("✅ Login successful! Redirecting...");
        alert("تم تسجيل الدخول بنجاح! سيتم التوجيه إلى لوحة التحكم...");
        window.location.href = "/dashboard";
      } else {
        console.error("❌ Login failed:", data.error);
        setError(data.error || "اسم المستخدم أو كلمة المرور غير صحيحة");
        setLoading(false);
      }
    } catch (err) {
      console.error("💥 Exception during login:", err);
      console.error("💥 Error details:", {
        name: (err as Error).name,
        message: (err as Error).message,
        stack: (err as Error).stack,
      });
      setError("حدث خطأ أثناء تسجيل الدخول: " + (err as Error).message);
      setLoading(false);
    }
  }

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

        {/* Login Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            تسجيل الدخول
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-r-4 border-red-500 text-red-700 p-4 rounded-xl animate-fade-in">
                <p className="text-sm font-semibold">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                اسم المستخدم
              </label>
              <input
                type="text"
                name="username"
                required
                className="input-field"
                placeholder="أدخل اسم المستخدم"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                name="password"
                required
                className="input-field"
                placeholder="أدخل كلمة المرور"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  جاري تسجيل الدخول...
                </span>
              ) : (
                "دخول"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              هل نسيت كلمة المرور؟
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600 animate-fade-in">
          <p>© 2026 جامعة شقراء - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  );
}
