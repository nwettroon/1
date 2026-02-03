# نظام الترجمة - Translation System

## اللغات المدعومة - Supported Languages:
1. 🇸🇦 العربية (Arabic)
2. 🇬🇧 English
3. 🇨🇳 中文 (Chinese)
4. 🇮🇳 हिंदी (Hindi)
5. 🇮🇷 فارسی (Persian)
6. 🇮🇩 Bahasa Indonesia (Indonesian)
7. 🇲🇳 Монгол (Mongolian)
8. 🇺🇿 O'zbekcha (Uzbek)
9. 🇵🇭 Filipino
10. 🇲🇾 Bahasa Melayu (Malay)
11. 🇹🇷 Türkçe (Turkish)
12. 🇳🇬 Yorùbá (Nigerian/Yoruba)
13. 🇷🇺 Русский (Russian)
14. 🇯🇵 日本語 (Japanese)

## كيفية الاستخدام - How to Use:

### 1. تفعيل الترجمة - Enable Translation:
```javascript
// في app.js - في app.js
currentLanguage = 'ar'; // العربية
setLanguage('ar'); // تغيير اللغة
```

### 2. إضافة نصوص جديدة - Add New Text:
في `translations.js`:
```javascript
const translations = {
    'ar': {
        'myNewText': 'النص العربي'
    },
    'en': {
        'myNewText': 'English text'
    }
    // ... باقي اللغات
}
```

### 3. استخدام النصوص - Use Translations:
```javascript
const text = t('myNewText'); // سيعيد النص بناءً على اللغة الحالية
```

## ملاحظات مهمة - Important Notes:
- اللغات RTL (العربية والفارسية) تدعم الاتجاه من اليمين لليسار
- جميع النصوص في الواجهة الأمامية قابلة للترجمة
- يتم حفظ اختيار اللغة في localStorage

## الملفات المتعلقة - Related Files:
- `translations.js` - قاموس الترجمة
- `app.js` - دوال الترجمة والتبديل
- `index.html` - عنصر اختيار اللغة
