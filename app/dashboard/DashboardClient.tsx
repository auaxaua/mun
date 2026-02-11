"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import type { SessionUser } from "@/lib/session";

interface Stats {
  competitions: number;
  warranties: number;
  contracts: number;
  expenses: number;
}

interface DashboardClientProps {
  session: SessionUser;
}

export default function DashboardClient({ session }: DashboardClientProps) {
  console.log("🏠 Dashboard client loaded for:", session.username);
  
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    competitions: 0,
    warranties: 0,
    contracts: 0,
    expenses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔄 Dashboard useEffect triggered");
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      console.log("📊 Fetching dashboard stats...");
      
      const res = await fetch("/api/dashboard/stats");
      
      if (!res.ok) {
        console.error("❌ Stats fetch failed:", res.status);
        throw new Error("Failed to fetch stats");
      }
      
      const data = await res.json();
      console.log("✅ Stats received:", data);
      
      setStats(data);
    } catch (error) {
      console.error("💥 Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }

  const sections = [
    {
      key: "competitions",
      name: "المنافسات",
      icon: "🏆",
      color: "from-blue-500 to-blue-600",
      count: stats.competitions,
      href: "/competitions",
    },
    {
      key: "warranties",
      name: "الضمانات",
      icon: "🛡️",
      color: "from-green-500 to-green-600",
      count: stats.warranties,
      href: "/warranties",
    },
    {
      key: "contracts",
      name: "العقود",
      icon: "📄",
      color: "from-purple-500 to-purple-600",
      count: stats.contracts,
      href: "/contracts",
    },
    {
      key: "expenses",
      name: "الصرف",
      icon: "💰",
      color: "from-orange-500 to-orange-600",
      count: stats.expenses,
      href: "/expenses",
    },
  ];

  return (
    <>
      <Header user={session} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            مرحباً {session.name}
          </h1>
          <p className="text-gray-600">
            نظرة عامة على أقسام إدارة المنافسات والمشتريات
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري التحميل...</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {sections.map((section) => (
              <Link
                key={section.key}
                href={section.href}
                className="group relative overflow-hidden bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-right block"
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                ></div>

                <div className="relative">
                  {/* Icon */}
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {section.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {section.name}
                  </h3>

                  {/* Count */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary-600">
                      {section.count}
                    </span>
                    <span className="text-sm text-gray-600">سجل</span>
                  </div>

                  {/* Arrow */}
                  <div className="absolute top-6 left-6 text-gray-400 group-hover:text-primary-600 transition-colors">
                    <svg
                      className="w-6 h-6 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {session.isAdmin && (
          <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              إجراءات سريعة
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/admin"
                className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-right"
              >
                <span className="text-2xl">⚙️</span>
                <div>
                  <div className="font-semibold text-gray-900">لوحة الإدارة</div>
                  <div className="text-sm text-gray-600">إدارة المستخدمين والصلاحيات</div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
