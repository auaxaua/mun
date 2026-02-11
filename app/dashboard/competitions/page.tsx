"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Competition {
  id: string;
  referenceNumber: string;
  title: string;
  type: string;
  publishDate: string | null;
  closingDate: string | null;
  status: string;
  daysRemaining: number | null;
  createdBy: string | null;
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

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCompetitions();
  }, []);

  async function fetchCompetitions() {
    try {
      const res = await fetch("/api/competitions");
      if (!res.ok) throw new Error("فشل تحميل المنافسات");
      const data = await res.json();
      setCompetitions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
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

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">المنافسات</h1>
          <p className="text-gray-600 mt-1">إدارة ومتابعة المنافسات والمشتريات</p>
        </div>
        <Link
          href="/dashboard/competitions/new"
          className="btn-primary"
        >
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          منافسة جديدة
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-r-4 border-red-500 text-red-700 p-4 rounded-xl mb-6">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  رقم المنافسة
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  العنوان
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  النوع
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  تاريخ النشر
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  تاريخ فتح المظاريف
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  الأيام المتبقية
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  أدخل بواسطة
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {competitions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    لا توجد منافسات حالياً
                  </td>
                </tr>
              ) : (
                competitions.map((comp) => {
                  const daysRemaining = calculateDaysRemaining(comp.closingDate);
                  return (
                    <tr key={comp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {comp.referenceNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{comp.title}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {getTypeLabel(comp.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {comp.publishDate 
                            ? new Date(comp.publishDate).toLocaleDateString("ar-SA")
                            : "-"
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {comp.closingDate 
                            ? new Date(comp.closingDate).toLocaleDateString("ar-SA")
                            : "-"
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(comp.status)}`}>
                          {getStatusLabel(comp.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {daysRemaining !== null ? (
                          <span className={`text-sm font-semibold ${
                            daysRemaining < 0 ? "text-red-600" :
                            daysRemaining <= 7 ? "text-orange-600" :
                            "text-green-600"
                          }`}>
                            {daysRemaining < 0 ? "منتهية" : `${daysRemaining} يوم`}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {comp.createdBy || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/dashboard/competitions/${comp.id}`}
                          className="text-primary-600 hover:text-primary-700 ml-3"
                        >
                          عرض
                        </Link>
                        <Link
                          href={`/dashboard/competitions/${comp.id}/edit`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          تعديل
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
