# بناء APK من هذا المشروع

## 1) المتطلبات

- Node.js LTS
- حساب Expo
- حساب GitHub اختياري لحفظ المصدر

## 2) بعد تنزيل المشروع

```bash
npm install
```

## 3) تسجيل الدخول إلى Expo

```bash
npx eas login
```

## 4) ربط المشروع بحساب EAS

```bash
eas init
```

## 5) بناء APK

```bash
eas build --platform android --profile apk
```

بعد انتهاء البناء سيظهر رابط ملف APK في نتيجة EAS.

### اختصار من npm

```bash
npm run build:apk
```

