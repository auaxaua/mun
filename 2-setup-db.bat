@echo off
chcp 65001 >nul
cls

echo.
echo ═══════════════════════════════════════════════
echo     📊 إعداد قاعدة البيانات - MUN
echo ═══════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo 🔍 التحقق من ملف .env...
if not exist .env (
    echo ❌ ملف .env غير موجود!
    echo.
    echo 💡 الحل: انسخ محتوى .env.example إلى .env
    echo.
    pause
    exit /b 1
)
echo ✅ ملف .env موجود
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📦 الخطوة 1: توليد Prisma Client...
echo.
call npx prisma generate

if %errorlevel% neq 0 (
    echo.
    echo ❌ فشل توليد Prisma Client!
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ تم توليد Prisma Client بنجاح!
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📊 الخطوة 2: تطبيق Schema على قاعدة البيانات...
echo ⚠️ هذه الخطوة مهمة جداً - ستنشئ جميع الجداول!
echo.
call npx prisma db push

if %errorlevel% neq 0 (
    echo.
    echo ❌ فشل تطبيق Schema!
    echo.
    echo 💡 تأكد من:
    echo    1. DATABASE_URL صحيح في ملف .env
    echo    2. الاتصال بالإنترنت يعمل
    echo    3. قاعدة البيانات متاحة
    echo.
    pause
    exit /b 1
)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo ✅ تم إعداد قاعدة البيانات بنجاح!
echo.
echo 🎯 الخطوة التالية: شغّل 3-create-admin.bat
echo.
pause
