"use client";

import { useState } from "react";

export default function TestLoginPage() {
  const [result, setResult] = useState<string>("");

  async function testLogin() {
    console.log("🧪 Test login started");
    setResult("جاري الاختبار...");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "admin",
          password: "admin123",
        }),
      });

      console.log("Status:", res.status);
      const data = await res.json();
      console.log("Response:", data);

      setResult(JSON.stringify(data, null, 2));

      if (data.success) {
        alert("نجح! سيتم التوجيه...");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Error:", error);
      setResult("خطأ: " + (error as Error).message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6">🧪 اختبار تسجيل الدخول</h1>

        <div className="space-y-4">
          <button
            onClick={testLogin}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-bold"
          >
            اختبار تسجيل الدخول (admin / admin123)
          </button>

          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="font-bold mb-2">النتيجة:</h2>
            <pre className="text-sm overflow-auto">{result || "لم يتم الاختبار بعد"}</pre>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 text-sm">
            <p className="font-bold mb-2">📋 تعليمات:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>اضغط F12 لفتح Console</li>
              <li>فعّل "Preserve log"</li>
              <li>اضغط الزر أعلاه</li>
              <li>راقب Console والنتيجة</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
