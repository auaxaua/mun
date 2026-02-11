const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function fixAdminPermissions() {
  console.log("\n🔧 إصلاح صلاحيات Admin\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  try {
    // البحث عن المستخدم admin
    console.log("1️⃣ البحث عن المستخدم admin...");
    const adminUser = await prisma.munUser.findUnique({
      where: { username: "admin" },
      include: { permissions: true },
    });

    if (!adminUser) {
      console.log("❌ المستخدم admin غير موجود!");
      return;
    }

    console.log("✅ تم العثور على المستخدم admin");
    console.log("   ID:", adminUser.id);
    console.log("   الاسم:", adminUser.name);
    console.log("   Permissions موجودة:", !!adminUser.permissions);

    if (adminUser.permissions) {
      console.log("   isAdmin حالياً:", adminUser.permissions.isAdmin);
    }

    console.log("\n2️⃣ تحديث الصلاحيات...");

    // حذف الصلاحيات القديمة إذا كانت موجودة
    if (adminUser.permissions) {
      await prisma.munPermission.delete({
        where: { id: adminUser.permissions.id },
      });
      console.log("   🗑️ تم حذف الصلاحيات القديمة");
    }

    // إنشاء صلاحيات جديدة
    const newPermissions = await prisma.munPermission.create({
      data: {
        userId: adminUser.id,
        isAdmin: true,
        
        // صلاحيات كاملة لجميع الأقسام
        competitions_view: true,
        competitions_edit: true,
        competitions_admin: true,
        
        warranties_view: true,
        warranties_edit: true,
        warranties_admin: true,
        
        contracts_view: true,
        contracts_edit: true,
        contracts_admin: true,
        
        expenses_view: true,
        expenses_edit: true,
        expenses_admin: true,
      },
    });

    console.log("✅ تم إنشاء صلاحيات جديدة بنجاح!");
    console.log("   isAdmin:", newPermissions.isAdmin);

    console.log("\n3️⃣ التحقق من الصلاحيات الجديدة...");
    
    const verifyUser = await prisma.munUser.findUnique({
      where: { username: "admin" },
      include: { permissions: true },
    });

    console.log("✅ التحقق النهائي:");
    console.log("   المستخدم:", verifyUser.username);
    console.log("   Permissions موجودة:", !!verifyUser.permissions);
    console.log("   isAdmin:", verifyUser.permissions?.isAdmin);

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("✅ تم الإصلاح بنجاح!\n");
    console.log("🔄 الآن:");
    console.log("   1. أعد تشغيل الموقع (4-run.bat)");
    console.log("   2. سجّل دخول مرة أخرى");
    console.log("   3. يجب أن تظهر لوحة التحكم\n");

  } catch (error) {
    console.error("\n❌ خطأ:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminPermissions();
