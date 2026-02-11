@echo off
chcp 65001 >nul
cls

echo.
echo ═══════════════════════════════════════════════
echo     🔄 تثبيت التبعيات الجديدة - MUN
echo ═══════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo 📦 تثبيت حزم جديدة...
call npm install jsonwebtoken @types/jsonwebtoken

echo.
if %errorlevel% equ 0 (
    echo ✅ تم تثبيت التبعيات بنجاح!
    echo.
    echo 🚀 الخطوة التالية: شغّل 4-run.bat
) else (
    echo ❌ فشل تثبيت التبعيات!
    echo.
    echo 💡 الحل: تأكد من الاتصال بالإنترنت وشغّل الملف مرة أخرى
)

echo.
pause
