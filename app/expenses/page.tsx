import { requireSession } from "@/lib/session";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ExpensesPage() {
  console.log("💰 Expenses page loading...");
  const session = await requireSession();
  console.log("✅ Session verified for:", session.username);

  const expenses = await prisma.expense.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingCount = expenses.filter(e => e.status === "pending").length;
  const approvedCount = expenses.filter(e => e.status === "approved").length;
  const paidCount = expenses.filter(e => e.status === "paid").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={session} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">💰 الصرف</h1>
            <p className="text-gray-600">إدارة ومتابعة المصروفات</p>
          </div>
          <Link href="/expenses/new" className="btn-primary">
            ➕ صرف جديد
          </Link>
        </div>

        {/* Stats */}
        {expenses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="الإجمالي" value={`${totalAmount.toLocaleString()} ريال`} color="blue" />
            <StatCard title="قيد الانتظار" value={pendingCount.toString()} color="yellow" />
            <StatCard title="معتمدة" value={approvedCount.toString()} color="green" />
            <StatCard title="مصروفة" value={paidCount.toString()} color="purple" />
          </div>
        )}

        {expenses.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">لا توجد مصروفات بعد</h3>
            <p className="text-gray-600 mb-6">ابدأ بإضافة أول أمر صرف</p>
            <Link href="/expenses/new" className="btn-primary inline-block">
              ➕ إضافة صرف
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {expenses.map((expense) => (
              <Link
                key={expense.id}
                href={`/expenses/${expense.id}`}
                className="glass rounded-2xl p-6 card-hover border-r-4 border-purple-500"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm font-semibold">
                        {expense.referenceNumber}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-sm font-semibold">
                        {expense.category}
                      </span>
                      <StatusBadge status={expense.status} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{expense.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">المستفيد: {expense.beneficiary}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>💰 {expense.amount.toLocaleString()} {expense.currency}</span>
                      <span>📅 {new Date(expense.requestDate).toLocaleDateString("ar-SA")}</span>
                      {expense.department && <span>🏢 {expense.department}</span>}
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
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    paid: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-600",
  };
  
  const labels = {
    pending: "قيد الانتظار",
    approved: "معتمد",
    paid: "مصروف",
    rejected: "مرفوض",
    cancelled: "ملغي",
  };

  return (
    <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${styles[status as keyof typeof styles] || styles.pending}`}>
      {labels[status as keyof typeof labels] || status}
    </span>
  );
}

function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    yellow: "from-yellow-500 to-yellow-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="text-sm text-gray-600 mb-2">{title}</div>
      <div className={`text-2xl font-bold bg-gradient-to-r ${colors[color as keyof typeof colors]} bg-clip-text text-transparent`}>
        {value}
      </div>
    </div>
  );
}
