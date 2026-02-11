const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAdminEmail() {
  console.log('🔄 تحديث البريد الإلكتروني للمدير...\n');

  try {
    const updated = await prisma.munUser.update({
      where: { username: 'admin' },
      data: { email: 'auaxaua@gmail.com' },
    });

    console.log('✅ تم تحديث البريد الإلكتروني بنجاح!\n');
    console.log('📋 البيانات المحدثة:');
    console.log('   اسم المستخدم:', updated.username);
    console.log('   البريد الإلكتروني:', updated.email);
    console.log('   الاسم:', updated.name);
    console.log('\n✅ انتهى!\n');
  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminEmail();
