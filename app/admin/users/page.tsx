import { requireAdmin } from "@/lib/session";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminUsersPage() {
  console.log("👥 Admin users page loading...");
  const session = await requireAdmin();
  console.log("✅ Admin verified:", session.username);

  const users = await prisma.munUser.findMany({
    orderBy: { createdAt: "desc" },
    include: { permissions: true },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={session} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">👥 إدارة المستخدمين</h1>
            <p className="text-gray-600">إضافة وتعديل وحذف المستخدمين</p>
          </div>
          <Link href="/admin/users/new" className="btn-primary">
            ➕ مستخدم جديد
          </Link>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">اسم المستخدم</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الاسم</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">القسم</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">المسمى</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">الصلاحيات</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">الحالة</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{user.username}</div>
                      {user.email && <div className="text-sm text-gray-600">{user.email}</div>}
                    </td>
                    <td className="px-6 py-4 text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-gray-600">{user.department || "-"}</td>
                    <td className="px-6 py-4 text-gray-600">{user.position || "-"}</td>
                    <td className="px-6 py-4 text-center">
                      {user.permissions[0]?.isAdmin ? (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-semibold">
                          مدير
                        </span>
                      ) : (
                        <Link 
                          href={`/admin/users/${user.id}/permissions`}
                          className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                        >
                          عرض الصلاحيات
                        </Link>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {user.active ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-semibold">
                          نشط
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold">
                          معطل
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
                      >
                        تعديل
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
