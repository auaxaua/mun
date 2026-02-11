const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkEverything() {
  console.log("\n🔍 فحص شامل لمشروع MUN\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  try {
    // 1. فحص الاتصال بقاعدة البيانات
    console.log("1️⃣ فحص قاعدة البيانات...");
    await prisma.$connect();
    console.log("✅ الاتصال بقاعدة البيانات يعمل!\n");

    // 2. فحص جدول MunUser
    console.log("2️⃣ فحص جدول MunUser...");
    const userCount = await prisma.munUser.count();
    console.log(`✅ الجدول موجود - عدد المستخدمين: ${userCount}\n`);

    // 3. فحص المستخدم admin
    console.log("3️⃣ فحص المستخدم admin...");
    const adminUser = await prisma.munUser.findUnique({
      where: { username: "admin" },
      include: { permissions: true },
    });

    if (adminUser) {
      console.log("✅ المستخدم admin موجود!");
      console.log(`   📝 الاسم: ${adminUser.name}`);
      console.log(`   🔐 نشط: ${adminUser.active ? "نعم" : "لا"}`);
      console.log(`   👤 القسم: ${adminUser.department || "غير محدد"}`);
      console.log(`   💼 المنصب: ${adminUser.position || "غير محدد"}`);
      
      if (adminUser.permissions) {
        console.log(`   🔑 صلاحيات إدارية: ${adminUser.permissions.isAdmin ? "نعم" : "لا"}`);
      } else {
        console.log("   ⚠️ لا توجد صلاحيات!");
      }
    } else {
      console.log("❌ المستخدم admin غير موجود!");
      console.log("\n💡 الحل: شغّل 3-create-admin.bat");
    }

    console.log("\n4️⃣ فحص الجداول الأخرى...");
    
    const tables = [
      { name: "MunPermission", model: prisma.munPermission },
      { name: "Competition", model: prisma.competition },
      { name: "Warranty", model: prisma.warranty },
      { name: "Contract", model: prisma.contract },
      { name: "Expense", model: prisma.expense },
      { name: "MunActivity", model: prisma.munActivity },
    ];

    for (const table of tables) {
      try {
        const count = await table.model.count();
        console.log(`✅ ${table.name}: ${count} سجل`);
      } catch (err) {
        console.log(`❌ ${table.name}: ${err.message}`);
      }
    }

    console.log("\n5️⃣ اختبار كلمة المرور...");
    if (adminUser) {
      const bcrypt = require("bcryptjs");
      const isValid = await bcrypt.compare("admin123", adminUser.passwordHash);
      console.log(`🔑 كلمة المرور "admin123": ${isValid ? "✅ صحيحة" : "❌ خاطئة"}`);
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("✅ الفحص اكتمل!\n");
    console.log("🚀 الخطوة التالية:");
    console.log("   1. شغّل: 1.5-install-new-deps.bat");
    console.log("   2. شغّل: 4-run.bat");
    console.log("   3. افتح: http://localhost:3001/api/test\n");

  } catch (error) {
    console.error("\n❌ خطأ:", error.message);
    console.log("\n💡 الحل:");
    console.log("   1. تأكد من ملف .env");
    console.log("   2. شغّل: 2-setup-db.bat");
    console.log("   3. شغّل: 3-create-admin.bat\n");
  } finally {
    await prisma.$disconnect();
  }
}

checkEverything().catch(console.error);
