# فحص الملفات

تم تجهيز وفحص الحزمة قبل تسليمها:

- `assets/icon.png` موجود وصالح كصورة PNG.
- `assets/adaptive-icon-foreground.png` موجود وصالح كصورة PNG.
- `assets/splash.png` موجود وصالح كصورة PNG.
- `assets/logo.png` موجود ويستخدم داخل التطبيق.
- `assets/brand-logo.png` موجود كنسخة هوية العلامة.
- `app.json` يشير إلى مسارات الصور الصحيحة داخل `assets/`.
- `eas.json` يحتوي ملف تعريف `apk` مع `android.buildType: apk`.
- `package.json` يحتوي تبعيات Expo/React Native المتوافقة مع Expo SDK 57.
- لا توجد مفاتيح API أو كلمات مرور أو بيانات حساب داخل المشروع.

لا ترفع مجلد `node_modules` إلى GitHub.
