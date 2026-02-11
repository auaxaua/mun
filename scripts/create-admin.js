// سكريبت إنشاء مستخدم إداري
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 إنشاء مستخدم إداري...\n');

  // بيانات المستخدم الإداري
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = 'المدير العام';
  const email = 'admin@su.edu.sa';

  // تشفير كلمة المرور
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    // إنشاء المستخدم
    const user = await prisma.munUser.upsert({
      where: { username },
      update: {
        name,
        email,
        passwordHash,
        active: true,
      },
      create: {
        username,
        name,
        email,
        passwordHash,
        department: 'إدارة المنافسات والمشتريات',
        position: 'مدير النظام',
        active: true,
      },
    });

    console.log('✅ تم إنشاء المستخدم الإداري بنجاح!\n');
    console.log('📋 بيانات الدخول:');
    console.log('   اسم المستخدم:', username);
    console.log('   كلمة المرور:', password);
    console.log('   البريد الإلكتروني:', email);
    console.log('\n⚠️  تأكد من تغيير كلمة المرور بعد أول تسجيل دخول!\n');

    // إنشاء صلاحيات المدير
    await prisma.munPermission.upsert({
      where: { userId: user.id },
      update: {
        isAdmin: true,
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
      create: {
        userId: user.id,
        isAdmin: true,
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

    console.log('✅ تم إعداد الصلاحيات الإدارية بنجاح!\n');

  } catch (error) {
    console.error('❌ خطأ أثناء إنشاء المستخدم:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
