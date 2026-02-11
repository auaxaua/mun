import { requireSession } from "@/lib/session";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CompetitionsPage() {
  console.log("🏆 Competitions page loading...");
  const session = await requireSession();
  console.log("✅ Session verified for:", session.username);

  const competitions = await prisma.competition.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={session} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🏆 المنافسات</h1>
            <p className="text-gray-600">إدارة ومتابعة المنافسات</p>
          </div>
          <Link
            href="/competitions/new"
            className="btn-primary"
          >
            ➕ منافسة جديدة
          </Link>
        </div>

        {competitions.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">لا توجد منافسات بعد</h3>
            <p className="text-gray-600 mb-6">ابدأ بإضافة أول منافسة</p>
            <Link href="/competitions/new" className="btn-primary inline-block">
              ➕ إضافة منافسة
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {competitions.map((comp) => (
              <Link
                key={comp.id}
                href={`/competitions/${comp.id}`}
                className="glass rounded-2xl p-6 card-hover border-r-4 border-amber-500"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-sm font-semibold">
                        {comp.referenceNumber}
                      </span>
                      <StatusBadge status={comp.status} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{comp.title}</h3>
                    {comp.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{comp.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>📅 {comp.publishDate ? new Date(comp.publishDate).toLocaleDateString("ar-SA") : "غير محدد"}</span>
                      {comp.budget && <span>💰 {comp.budget.toLocaleString()} ريال</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    draft: "bg-gray-100 text-gray-800",
    published: "bg-blue-100 text-blue-800",
    closed: "bg-red-100 text-red-800",
    awarded: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-600",
  };
  
  const labels = {
    draft: "مسودة",
    published: "منشورة",
    closed: "مغلقة",
    awarded: "مرساة",
    cancelled: "ملغاة",
  };

  return (
    <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${styles[status as keyof typeof styles] || styles.draft}`}>
      {labels[status as keyof typeof labels] || status}
    </span>
  );
}
