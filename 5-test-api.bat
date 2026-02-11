@echo off
chcp 65001 >nul
cls

echo.
echo ═══════════════════════════════════════════════
echo     🧪 اختبار API - MUN
echo ═══════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo 📡 اختبار الاتصال بـ API...
echo.
echo 🌐 افتح المتصفح واذهب إلى:
echo    http://localhost:3001/api/test
echo.
echo ✅ إذا ظهرت رسالة JSON: API يعمل بشكل صحيح
echo ❌ إذا ظهرت صفحة HTML: هناك مشكلة في الإعداد
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 🔐 بعد التأكد من عمل API، جرب تسجيل الدخول:
echo    http://localhost:3001/login
echo.
echo 📝 البيانات:
echo    اسم المستخدم: admin
echo    كلمة المرور: admin123
echo.

pause
