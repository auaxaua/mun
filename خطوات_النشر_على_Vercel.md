# ✅ خطوات نشر مشروع MUN على Vercel وربطه بـ mun.xcoxco.com

## 📋 الحالة الحالية
✅ تم تهيئة Git repository محلياً  
✅ تم إنشاء commit أولي (4828e5e)  
⏳ الانتقال للخطوة التالية: إنشاء GitHub repository

---

## 🔹 الخطوة 2: إنشاء GitHub Repository

### الطريقة الأولى: عبر GitHub.com (موصى بها)

1. **افتح GitHub:**
   - اذهب إلى: https://github.com/new

2. **املأ البيانات:**
   - **Repository name:** `mun`
   - **Description:** `نظام إدارة المنافسات والمشتريات - جامعة شقراء`
   - **Visibility:** 
     - ✅ **Private** (إذا كان المشروع سري)
     - أو **Public** (إذا كان عام)
   - **لا تختر** "Initialize this repository with a README"

3. **اضغط "Create repository"**

4. **ستظهر تعليمات - تجاهلها**، ثم نفذ الأوامر التالية:

```powershell
cd "C:\Users\hp\Desktop\موقعي\MUN"
git remote add origin https://github.com/auaxaua/mun.git
git push -u origin main
```

> **ملاحظة:** استبدل `auaxaua` باسم حسابك على GitHub إذا كان مختلفاً

---

## 🔹 الخطوة 3: رفع الكود إلى GitHub

بعد إنشاء repository، نفذ هذه الأوامر في PowerShell:

```powershell
# الانتقال لمجلد MUN
cd "C:\Users\hp\Desktop\موقعي\MUN"

# ربط المجلد المحلي بـ GitHub
git remote add origin https://github.com/auaxaua/mun.git

# رفع الكود إلى GitHub
git push -u origin main
```

---

## 🔹 الخطوة 4: نشر MUN على Vercel

بعد رفع الكود على GitHub، نفذ هذا الأمر:

```powershell
cd "C:\Users\hp\Desktop\موقعي\MUN"
vercel --prod --scope survivors-projects-0699042e
```

أثناء التنصيب ستُطرح أسئلة:
- **Set up and deploy?** → `Y`
- **Which scope?** → `survivors-projects-0699042e`
- **Link to existing project?** → `N`
- **Project name?** → `mun` (أو اضغط Enter)
- **Directory?** → `.` (اضغط Enter)
- **Override settings?** → `N`

---

## 🔹 الخطوة 5: ربط mun.xcoxco.com بمشروع MUN

بعد نشر MUN بنجاح، نفذ:

```powershell
vercel alias set <deployment-url> mun.xcoxco.com --scope survivors-projects-0699042e
```

أو ببساطة:

```powershell
vercel domains add mun.xcoxco.com mun --scope survivors-projects-0699042e --yes
```

---

## 🔹 الخطوة 6: إعداد DNS في GoDaddy (مرة واحدة فقط)

إذا لم تضف سجل CNAME لـ `mun` بعد، افتح:
- https://dcc.godaddy.com/domains/xcoxco.com/dns

أضف:
| النوع | الاسم | القيمة | TTL |
|-------|-------|--------|-----|
| CNAME | mun   | cname.vercel-dns.com | 1 Hour |

---

## ✅ النتيجة النهائية

بعد اكتمال جميع الخطوات:
- ✅ `xcoxco.com` → مشروع SURVIVOR
- ✅ `www.xcoxco.com` → مشروع SURVIVOR
- ✅ `mun.xcoxco.com` → مشروع MUN

---

## 🚀 أوامر سريعة (بعد إنشاء GitHub repo)

```powershell
# 1. رفع الكود إلى GitHub
cd "C:\Users\hp\Desktop\موقعي\MUN"
git remote add origin https://github.com/auaxaua/mun.git
git push -u origin main

# 2. نشر على Vercel
vercel --prod --scope survivors-projects-0699042e

# 3. ربط الدومين
vercel domains add mun.xcoxco.com mun --scope survivors-projects-0699042e --yes
```

---

**📝 ملاحظة مهمة:**
- قبل نشر MUN، تأكد من إضافة متغيرات البيئة في Vercel:
  - `DATABASE_URL` (نفس القيمة المستخدمة في SURVIVOR)
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL=https://mun.xcoxco.com`
