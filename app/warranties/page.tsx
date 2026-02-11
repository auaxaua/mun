import { requireSession } from "@/lib/session";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function WarrantiesPage() {
  console.log("🛡️ Warranties page loading...");
  const session = await requireSession();
  console.log("✅ Session verified for:", session.username);

  const warranties = await prisma.warranty.findMany({
    orderBy: { expiryDate: "asc" },
    take: 50,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={session} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🛡️ الضمانات</h1>
            <p className="text-gray-600">إدارة ومتابعة الضمانات</p>
          </div>
          <Link href="/warranties/new" className="btn-primary">
            ➕ ضمان جديد
          </Link>
        </div>

        {warranties.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <div className="text-6xl mb-4">🛡️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">لا توجد ضمانات بعد</h3>
            <p className="text-gray-600 mb-6">ابدأ بإضافة أول ضمان</p>
            <Link href="/warranties/new" className="btn-primary inline-block">
              ➕ إضافة ضمان
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {warranties.map((warranty) => {
              const daysUntilExpiry = Math.ceil((new Date(warranty.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry <= 30;
              const isExpired = daysUntilExpiry < 0;

              return (
                <Link
                  key={warranty.id}
                  href={`/warranties/${warranty.id}`}
                  className={`glass rounded-2xl p-6 card-hover border-r-4 ${
                    isExpired ? "border-red-500" : isExpiringSoon ? "border-yellow-500" : "border-emerald-500"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-semibold">
                          {warranty.referenceNumber}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-sm font-semibold">
                          {warranty.type}
                        </span>
                        {isExpired && (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-semibold">
                            منتهي
                          </span>
                        )}
                        {isExpiringSoon && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-semibold">
                            ينتهي قريباً
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{warranty.supplier}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span>💰 {warranty.amount.toLocaleString()} {warranty.currency}</span>
                        <span>📅 ينتهي: {new Date(warranty.expiryDate).toLocaleDateString("ar-SA")}</span>
                      </div>
                      {daysUntilExpiry > 0 && (
                        <div className="text-sm text-gray-600">
                          متبقي: {daysUntilExpiry} يوم
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
