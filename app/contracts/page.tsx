import { requireSession } from "@/lib/session";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ContractsPage() {
  console.log("📄 Contracts page loading...");
  const session = await requireSession();
  console.log("✅ Session verified for:", session.username);

  const contracts = await prisma.contract.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={session} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">📄 العقود</h1>
            <p className="text-gray-600">إدارة ومتابعة العقود</p>
          </div>
          <Link href="/contracts/new" className="btn-primary">
            ➕ عقد جديد
          </Link>
        </div>

        {contracts.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">لا توجد عقود بعد</h3>
            <p className="text-gray-600 mb-6">ابدأ بإضافة أول عقد</p>
            <Link href="/contracts/new" className="btn-primary inline-block">
              ➕ إضافة عقد
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {contracts.map((contract) => (
              <Link
                key={contract.id}
                href={`/contracts/${contract.id}`}
                className="glass rounded-2xl p-6 card-hover border-r-4 border-blue-500"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-semibold">
                        {contract.referenceNumber}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-sm font-semibold">
                        {contract.type}
                      </span>
                      <StatusBadge status={contract.status} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{contract.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{contract.supplier}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>💰 {contract.amount.toLocaleString()} {contract.currency}</span>
                      <span>📅 من {new Date(contract.startDate).toLocaleDateString("ar-SA")}</span>
                      <span>إلى {new Date(contract.endDate).toLocaleDateString("ar-SA")}</span>
                    </div>
                    {contract.completionRate > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">نسبة الإنجاز</span>
                          <span className="font-semibold text-gray-900">{contract.completionRate}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                            style={{ width: `${contract.completionRate}%` }}
                          />
                        </div>
                      </div>
                    )}
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
    active: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
    suspended: "bg-yellow-100 text-yellow-800",
  };
  
  const labels = {
    active: "نشط",
    completed: "مكتمل",
    cancelled: "ملغي",
    suspended: "متوقف",
  };

  return (
    <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${styles[status as keyof typeof styles] || styles.active}`}>
      {labels[status as keyof typeof labels] || status}
    </span>
  );
}
