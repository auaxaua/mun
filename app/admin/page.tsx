import { requireAdmin } from "@/lib/session";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPage() {
  console.log("⚙️ Admin page loading...");
  const session = await requireAdmin();
  console.log("✅ Admin verified:", session.username);

  const [usersCount, competitionsCount, warrantiesCount, contractsCount, expensesCount] = await Promise.all([
    prisma.munUser.count(),
    prisma.competition.count(),
    prisma.warranty.count(),
    prisma.contract.count(),
    prisma.expense.count(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={session} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">⚙️ لوحة التحكم</h1>
          <p className="text-gray-600">إدارة النظام والمستخدمين والصلاحيات</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard title="المستخدمون" value={usersCount} icon="👥" color="primary" />
          <StatCard title="المنافسات" value={competitionsCount} icon="🏆" color="amber" />
          <StatCard title="الضمانات" value={warrantiesCount} icon="🛡️" color="emerald" />
          <StatCard title="العقود" value={contractsCount} icon="📄" color="blue" />
          <StatCard title="الصرف" value={expensesCount} icon="💰" color="purple" />
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminCard
            href="/admin/users"
            icon="👥"
            title="إدارة المستخدمين"
            description="إضافة وتعديل وحذف المستخدمين"
            color="from-blue-500 to-blue-600"
          />
          <AdminCard
            href="/admin/permissions"
            icon="🔐"
            title="الصلاحيات"
            description="إدارة صلاحيات المستخدمين"
            color="from-purple-500 to-purple-600"
          />
          <AdminCard
            href="/admin/backup"
            icon="💾"
            title="النسخ الاحتياطي"
            description="أخذ واستعادة النسخ الاحتياطية"
            color="from-green-500 to-green-600"
          />
          <AdminCard
            href="/admin/activities"
            icon="📊"
            title="سجل النشاطات"
            description="عرض سجل نشاطات المستخدمين"
            color="from-amber-500 to-amber-600"
          />
          <AdminCard
            href="/admin/settings"
            icon="⚙️"
            title="الإعدادات"
            description="إعدادات النظام العامة"
            color="from-gray-500 to-gray-600"
          />
          <AdminCard
            href="/admin/stats"
            icon="📈"
            title="الإحصائيات"
            description="تقارير وإحصائيات مفصلة"
            color="from-indigo-500 to-indigo-600"
          />
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
  const colors = {
    primary: "from-primary-500 to-primary-600",
    amber: "from-amber-500 to-amber-600",
    emerald: "from-emerald-500 to-emerald-600",
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl">{icon}</div>
        <div className={`text-3xl font-bold bg-gradient-to-r ${colors[color as keyof typeof colors]} bg-clip-text text-transparent`}>
          {value}
        </div>
      </div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
}

function AdminCard({ href, icon, title, description, color }: { 
  href: string; 
  icon: string; 
  title: string; 
  description: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="glass rounded-2xl p-6 card-hover border-2 border-gray-200 hover:border-primary-500 group"
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}
