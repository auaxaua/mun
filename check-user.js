// سكريبت للتحقق من وجود المستخدم
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 البحث عن المستخدم admin...\n');

  try {
    const user = await prisma.munUser.findUnique({
      where: { username: 'admin' },
      include: { permissions: true },
    });

    if (user) {
      console.log('✅ المستخدم موجود!');
      console.log('📋 البيانات:');
      console.log('   ID:', user.id);
      console.log('   اسم المستخدم:', user.username);
      console.log('   الاسم:', user.name);
      console.log('   البريد:', user.email);
      console.log('   نشط:', user.active);
      console.log('   صلاحيات المدير:', user.permissions?.isAdmin);
      console.log('\n✅ يمكنك تسجيل الدخول بـ: admin / admin123\n');
    } else {
      console.log('❌ المستخدم غير موجود!');
      console.log('⚠️  قم بتشغيل: node scripts/create-admin.js\n');
    }

  } catch (error) {
    console.error('❌ خطأ:', error.message);
    
    if (error.message.includes('MunUser')) {
      console.log('\n⚠️  الجدول MunUser غير موجود في قاعدة البيانات!');
      console.log('✅ الحل: شغّل الملف 2-setup-db.bat\n');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
