@echo off
chcp 65001 >nul
cls

echo.
echo ═══════════════════════════════════════════════
echo     🧪 اختبار التنقل - MUN
echo ═══════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo 🌐 فتح صفحة اختبار التنقل...
echo.
echo 📍 الملف: test-navigation.html
echo.
echo ✅ ستفتح صفحة HTML بها جميع الروابط للاختبار
echo.
echo 💡 تأكد أن الموقع يعمل على localhost:3001 أولاً!
echo.

start test-navigation.html

echo ✅ تم فتح صفحة الاختبار!
echo.
pause
