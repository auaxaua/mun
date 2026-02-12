"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Competition {
  id: string;
  referenceNumber: string;
  title: string;
  description: string | null;
  type: string;
  publishDate: string | null;
  closingDate: string | null;
  status: string;
  createdBy: string | null;
  createdAt: string;
}

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

export default function CompetitionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchCompetition(params.id as string);
    }
  }, [params.id]);

  async function fetchCompetition(id: string) {
    try {
      const res = await fetch(`/api/competitions/${id}`);
      if (!res.ok) throw new Error("فشل تحميل المنافسة");
      const data = await res.json();
      setCompetition(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("هل أنت متأكد من حذف هذه المنافسة؟")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/competitions/${params.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("فشل حذف المنافسة");

      router.push("/dashboard/competitions");
    } catch (err) {
      alert(err instanceof Error ? err.message : "حدث خطأ");
      setDeleting(false);
    }
  }

  function getTypeLabel(value: string): string {
    return COMPETITION_TYPES.find(t => t.value === value)?.label || value;
  }

  function getStatusLabel(value: string): string {
    return COMPETITION_STATUSES.find(s => s.value === value)?.label || value;
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800";
      case "published": return "bg-blue-100 text-blue-800";
      case "closed": return "bg-yellow-100 text-yellow-800";
      case "awarded": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  function calculateDaysRemaining(closingDate: string | null): number | null {
    if (!closingDate) return null;
    const today = new Date();
    const closing = new Date(closingDate);
    const diffTime = closing.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto mb-4"></div>
          <p className="text-gray-600">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-r-4 border-red-500 text-red-700 p-4 rounded-xl">
          <p className="font-semibold">{error || "المنافسة غير موجودة"}</p>
        </div>
        <Link
          href="/dashboard/competitions"
          className="mt-4 inline-block text-primary-600 hover:text-primary-700"
        >
          العودة للمنافسات
        </Link>
      </div>
    );
  }

  const daysRemaining = calculateDaysRemaining(competition.closingDate);

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
      </div>

      <div className="glass rounded-2xl p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {competition.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>رقم المنافسة: <strong>{competition.referenceNumber}</strong></span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(competition.status)}`}>
                {getStatusLabel(competition.status)}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/dashboard/competitions/${competition.id}/edit`}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              تعديل
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleting ? "جارٍ الحذف..." : "حذف"}
            </button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">النوع</label>
            <p className="text-gray-900">{getTypeLabel(competition.type)}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">تاريخ النشر</label>
            <p className="text-gray-900">
              {competition.publishDate 
                ? new Date(competition.publishDate).toLocaleDateString("ar-SA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"
              }
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">تاريخ فتح المظاريف</label>
            <p className="text-gray-900">
              {competition.closingDate 
                ? new Date(competition.closingDate).toLocaleDateString("ar-SA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"
              }
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">الأيام المتبقية</label>
            {daysRemaining !== null ? (
              <p className={`font-semibold ${
                daysRemaining < 0 ? "text-red-600" :
                daysRemaining <= 7 ? "text-orange-600" :
                "text-green-600"
              }`}>
                {daysRemaining < 0 ? "منتهية" : `${daysRemaining} يوم`}
              </p>
            ) : (
              <p className="text-gray-500">-</p>
            )}
          </div>

          {competition.description && (
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">الوصف</label>
              <p className="text-gray-900 whitespace-pre-wrap">{competition.description}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">أدخل بواسطة</label>
            <p className="text-gray-900">{competition.createdBy || "-"}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">تاريخ الإضافة</label>
            <p className="text-gray-900">
              {new Date(competition.createdAt).toLocaleDateString("ar-SA", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
