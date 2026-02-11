@echo off
chcp 65001 >nul
cls

echo.
echo ═══════════════════════════════════════════════
echo     🚀 تشغيل الموقع - MUN
echo ═══════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo 🌐 جاري تشغيل الموقع...
echo.
echo 📍 الموقع: http://localhost:3001
echo.
echo 🔐 بيانات الدخول:
echo    اسم المستخدم: admin
echo    كلمة المرور: admin123
echo.
echo 🧪 اختبار API: http://localhost:3001/api/test
echo.
echo ⚠️ لا تغلق هذه النافذة أثناء التشغيل
echo.
echo 💡 تلميح: انتظر حتى تظهر رسالة "Ready" ثم افتح الموقع
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

call npm run dev

pause
