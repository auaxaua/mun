@echo off
chcp 65001 >nul
cls

:menu
echo.
echo ═══════════════════════════════════════════════
echo     🎯 مشروع MUN - جامعة شقراء
echo ═══════════════════════════════════════════════
echo.
echo 📋 اختر الخطوة المناسبة:
echo.
echo  1. تثبيت الحزم (مرة واحدة فقط)
echo  2. إعداد قاعدة البيانات (مرة واحدة فقط)
echo  3. إنشاء مستخدم Admin (مرة واحدة فقط)
echo  4. تثبيت التحديثات الأخيرة
echo  5. تشغيل الموقع
echo.
echo  0. فحص شامل للمشروع
echo.
echo  X. خروج
echo.
echo ═══════════════════════════════════════════════
echo.

set /p choice="اختر رقم: "

if "%choice%"=="1" goto install
if "%choice%"=="2" goto setup_db
if "%choice%"=="3" goto create_admin
if "%choice%"=="4" goto update_deps
if "%choice%"=="5" goto run
if "%choice%"=="0" goto check
if /i "%choice%"=="x" goto end

echo.
echo ❌ اختيار غير صحيح!
timeout /t 2 >nul
cls
goto menu

:install
cls
call 1-install.bat
goto menu

:setup_db
cls
call 2-setup-db.bat
goto menu

:create_admin
cls
call 3-create-admin.bat
goto menu

:update_deps
cls
call 1.5-install-new-deps.bat
goto menu

:run
cls
call 4-run.bat
goto menu

:check
cls
call 0-check-all.bat
goto menu

:end
echo.
echo 👋 إلى اللقاء!
echo.
timeout /t 2 >nul
exit
