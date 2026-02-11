"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const COMPETITION_TYPES = [
  { value: "public", label: "منافسة عامة" },
  { value: "limited", label: "منافسة محدودة" },
  { value: "direct", label: "شراء مباشر" },
  { value: "framework", label: "اتفاقية إطارية" },
  { value: "quote", label: "طلب عروض أسعار" },
  { value: "other", label: "أخرى" },
];

const COMPETITION_STATUSES = [
  { value: "draft", label: "مسودة" },
  { value: "published", label: "منشورة" },
  { value: "closed", label: "مغلقة" },
  { value: "awarded", label: "مرساة" },
];

export default function NewCompetitionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    referenceNumber: "",
    title: "",
    type: "public",
    publishDate: "",
    closingDate: "",
    status: "draft",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/competitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "فشل إضافة المنافسة");
      }

      const data = await res.json();
      router.push(`/dashboard/competitions/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/dashboard/competitions"
          className="text-primary-600 hover:text-primary-700 mb-4 inline-flex items-center"
        >
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          العودة للمنافسات
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">إضافة منافسة جديدة</h1>
        <p className="text-gray-600 mt-1">أدخل بيانات المنافسة الجديدة</p>
      </div>

      {error && (
        <div className="bg-red-50 border-r-4 border-red-500 text-red-700 p-4 rounded-xl mb-6">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* رقم المنافسة */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              رقم المنافسة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleChange}
              required
              className="w-full h-12 rounded-xl border-2 border-gray-200 bg-white px-4 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              placeholder="مثال: MUN-2024-001"
            />
          </div>

          {/* نوع المنافسة */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              نوع المنافسة <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full h-12 rounded-xl border-2 border-gray-200 bg-white px-4 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              {COMPETITION_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* عنوان المنافسة */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              عنوان المنافسة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full h-12 rounded-xl border-2 border-gray-200 bg-white px-4 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              placeholder="أدخل عنوان المنافسة"
            />
          </div>

          {/* تاريخ النشر */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              تاريخ النشر
            </label>
            <input
              type="date"
              name="publishDate"
              value={formData.publishDate}
              onChange={handleChange}
              className="w-full h-12 rounded-xl border-2 border-gray-200 bg-white px-4 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* تاريخ فتح المظاريف */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              تاريخ فتح المظاريف
            </label>
            <input
              type="date"
              name="closingDate"
              value={formData.closingDate}
              onChange={handleChange}
              className="w-full h-12 rounded-xl border-2 border-gray-200 bg-white px-4 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* الحالة */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الحالة <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full h-12 rounded-xl border-2 border-gray-200 bg-white px-4 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              {COMPETITION_STATUSES.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                جارٍ الحفظ...
              </span>
            ) : (
              "حفظ المنافسة"
            )}
          </button>

          <Link
            href="/dashboard/competitions"
            className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}
