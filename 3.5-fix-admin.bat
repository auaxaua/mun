@echo off
chcp 65001 >nul
cls

echo.
echo ═══════════════════════════════════════════════
echo     🔧 إصلاح صلاحيات Admin - MUN
echo ═══════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo 🔍 جاري إصلاح صلاحيات المستخدم admin...
echo.

call node fix-admin-permissions.js

echo.
pause
