# أناقة أون لاين — Expo + GitHub Ready

مشروع تطبيق متجر ملابس عربي (RTL) باسم **أناقة أون لاين**، مجهز للرفع إلى GitHub ثم البناء عبر Expo EAS.

## بنية المشروع

```text
anaqa-online/
├── App.js
├── app.json
├── eas.json
├── package.json
├── babel.config.js
├── assets/
│   ├── icon.png
│   ├── adaptive-icon-foreground.png
│   ├── splash.png
│   ├── logo.png
│   └── brand-logo.png
├── EXPO_BUILD.md
├── GITHUB_UPLOAD.md
├── LICENSE
├── .gitignore
└── .easignore
```

> **مهم:** يجب أن يكون مجلد `assets/` داخل جذر المستودع، وليس داخل مجلد فرعي إضافي.

## التشغيل محليًا

```bash
npm install
npx expo start
```

## ربط المشروع بـ EAS لأول مرة

```bash
npx eas login
eas init
```

## بناء APK قابل للتثبيت على Android

```bash
eas build --platform android --profile apk
```

## بناء AAB للنشر على Google Play

```bash
eas build --platform android --profile production
```

## ملاحظة عن الصور

كل مسارات الصور المستخدمة في إعداد Expo موجودة داخل `assets/`، ولا يحتاج المشروع إلى روابط خارجية للشعار أو شاشة البداية أو أيقونة التطبيق.
