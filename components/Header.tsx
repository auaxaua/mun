"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface HeaderProps {
  user?: {
    name: string;
    username: string;
    position?: string;
    department?: string;
    isAdmin?: boolean;
  };
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<{date: string, time: string}>({
    date: "",
    time: ""
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString("ar-SA", { 
        weekday: "long", 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      });
      const timeStr = now.toLocaleTimeString("ar-SA", { 
        hour: "2-digit", 
        minute: "2-digit" 
      });
      setCurrentTime({ date: dateStr, time: timeStr });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  async function handleLogout() {
    console.log("🚪 Logging out...");
    
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      if (res.ok) {
        console.log("✅ Logout successful");
        router.push("/login");
      }
    } catch (error) {
      console.error("❌ Logout failed:", error);
      // حتى لو فشل، نوجه للـ login
      router.push("/login");
    }
  }

  const isActive = (path: string) => pathname === path;

  return (
    <header className="glass sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🏛️</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">جامعة شقراء</h1>
              <p className="text-xs text-gray-600">إدارة المنافسات والمشتريات</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Date & Time */}
            <div className="hidden md:block text-left">
              <div className="text-sm font-semibold text-gray-900">{currentTime.time}</div>
              <div className="text-xs text-gray-600">{currentTime.date}</div>
            </div>

            {/* User Menu */}
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    مرحباً، {user.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {user.position || user.department || "موظف"}
                  </div>
                </div>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                {user.name[0]}
              </div>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-semibold"
            >
              تسجيل خروج
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-2">
          <NavLink href="/dashboard" active={isActive("/dashboard")}>
            🏠 الرئيسية
          </NavLink>
          <NavLink href="/competitions" active={isActive("/competitions")}>
            🏆 المنافسات
          </NavLink>
          <NavLink href="/warranties" active={isActive("/warranties")}>
            🛡️ الضمانات
          </NavLink>
          <NavLink href="/contracts" active={isActive("/contracts")}>
            📄 العقود
          </NavLink>
          <NavLink href="/expenses" active={isActive("/expenses")}>
            💰 الصرف
          </NavLink>
          {user?.isAdmin && (
            <NavLink href="/admin" active={isActive("/admin")}>
              ⚙️ الإدارة
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
        active
          ? "bg-primary-600 text-white shadow-lg"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {children}
    </Link>
  );
}
