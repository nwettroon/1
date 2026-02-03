# دليل استكشاف الأخطاء السريع

## 🔍 الأخطاء الشائعة والحلول

### ❌ المشكلة 1: اللغة لا تتغير عند النقر على الزر

**الأعراض:**
- تنقر على زر اللغة ولا شيء يحدث
- المحتوى لا يتحول

**الحل - الخطوة 1:**
افتح Console (F12) وقم بتشغيل:
```javascript
console.log(document.querySelector('.goog-te-combo'));
```

**النتيجة المتوقعة:**
```html
<select class="goog-te-combo">...</select>
```

إذا كانت النتيجة `null`، فـ Google Translate لم يحمل.

**الحل - الخطوة 2:**
تحقق من وجود Google Translate Script في `index.html`:
```html
<script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
```

**الحل - الخطوة 3:**
تأكد من وجود الدالة:
```javascript
function googleTranslateElementInit() {
    new google.translate.TranslateElement({...}, 'google_translate_element')
}
```

---

### ❌ المشكلة 2: الشريط الأزرق من Google يظهر

**الأعراض:**
- شريط أزرق يظهر في أعلى الصفحة
- يقول "Page translated"

**السبب:**
- `hideGoogleTranslateBar()` لم تعمل
- CSS لم يحمل بشكل صحيح

**الحل - الخطوة 1:**
جرب إخفاء يدوي في Console:
```javascript
document.querySelector('.goog-te-banner-frame').style.display = 'none';
document.body.style.top = '0';
```

إذا اختفى الشريط، فـ CSS في المشكلة.

**الحل - الخطوة 2:**
تحقق من `styles.css`:
```css
.goog-te-banner-frame {
    display: none !important;
}

.skiptranslate {
    display: none !important;
}

body {
    top: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
}
```

**الحل - الخطوة 3:**
أضف CSS يدويًا في `<head>`:
```html
<style>
    .goog-te-banner-frame { display: none !important; }
    .skiptranslate { display: none !important; }
    .goog-te-spinner-pos { display: none !important; }
    body { top: 0 !important; }
</style>
```

---

### ❌ المشكلة 3: الرسائل الثابتة لا تتحدّث (Pay ← ادفع)

**الأعراض:**
- تغيّر اللغة لكن النصوص مثل "ادفع" و "السلة" لا تتغيّر
- تبقى بنفس اللغة السابقة

**السبب:**
- `updateSystemMessages()` لم تُستدعَ
- عنصر DOM لم يُعثر عليه

**الحل - الخطوة 1:**
تحقق من وجود العنصر في Console:
```javascript
console.log(document.getElementById('cartLabel'));
```

إذا كانت النتيجة `null`، فالعنصر غير موجود في HTML.

**الحل - الخطوة 2:**
افتح `index.html` وتحقق من وجود:
```html
<span id="cartLabel">ادفع</span>
```

إذا لم يكن موجوداً، أضفه.

**الحل - الخطوة 3:**
جرّب استدعاء الدالة يدويًا:
```javascript
window.updateSystemMessages('en');
console.log(document.getElementById('cartLabel').textContent);  // يجب أن يكون: Pay
```

**الحل - الخطوة 4:**
تحقق من أن الرسالة موجودة في `google-translate-controller.js`:
```javascript
const systemMessages = {
    en: {
        cartLabel: "Pay",  // ✓ موجود
        // ...
    }
};
```

---

### ❌ المشكلة 4: اللغة تعود للعربية بعد Refresh

**الأعراض:**
- تختار لغة (مثل Urdu)
- تضغط Refresh (F5)
- اللغة تعود للعربية

**السبب:**
- `localStorage` لم يحفظ اللغة
- `loadSavedLanguage()` لم تعمل

**الحل - الخطوة 1:**
تحقق من localStorage:
```javascript
console.log(localStorage.getItem('selectedLanguage'));
```

إذا كانت النتيجة `null`، فـ localStorage فارغ.

**الحل - الخطوة 2:**
اختر لغة وتحقق:
```javascript
// اختر الأردية
selectGoogleLanguage('ur');
updateSystemMessages('ur');

// تحقق
console.log(localStorage.getItem('selectedLanguage'));  // يجب أن يكون: ur
```

**الحل - الخطوة 3:**
تأكد من وجود الكود في `setupLanguageButtons()`:
```javascript
localStorage.setItem('selectedLanguage', lang);
```

**الحل - الخطوة 4:**
تأكد من استدعاء `loadSavedLanguage()` عند التحميل:
```javascript
function initGoogleTranslateController() {
    // ...
    loadSavedLanguage();  // ✓ يجب أن يكون موجود
}
```

---

### ❌ المشكلة 5: معرّفات لغات خاطئة

**الأعراض:**
- اختيار لغة لا يترجم المحتوى
- Console يظهر أخطاء

**السبب:**
- رمز اللغة خاطئ في `languageCodeMap`
- Google Translate لا يفهم الرمز

**الحل - الخطوة 1:**
تحقق من `languageCodeMap` في `google-translate-controller.js`:
```javascript
const languageCodeMap = {
    'ar': 'ar',      // ✓ صحيح
    'en': 'en',      // ✓ صحيح
    'ur': 'ur',      // ✓ صحيح
    'zh-SG': 'zh-CN' // ✓ صحيح (Google يستخدم zh-CN)
};
```

**الحل - الخطوة 2:**
من قائمة [رموز Google الرسمية](https://developers.google.com/translate/docs/languages):
```javascript
// أمثلة صحيحة:
'pt': 'pt',        // Portuguese
'es': 'es',        // Spanish
'de': 'de',        // German
'ja': 'ja',        // Japanese
'zh-CN': 'zh-CN'   // Simplified Chinese
```

---

### ❌ المشكلة 6: النصوص الأجنبية تظهر بشكل غريب (ترميز)

**الأعراض:**
- النصوص تظهر كـ ??? أو أحرف غريبة
- مثال: "Pay" يظهر "PÂ¤"

**السبب:**
- ترميز UTF-8 غير صحيح في HTML

**الحل - الخطوة 1:**
تحقق من meta tag في `<head>`:
```html
<meta charset="UTF-8">
```

**الحل - الخطوة 2:**
إذا لم يكن موجوداً، أضفه:
```html
<head>
    <meta charset="UTF-8">
    <!-- باقي meta tags -->
</head>
```

---

### ❌ المشكلة 7: أزرار اللغات لا تظهر

**الأعراض:**
- أزرار تبديل اللغة غير مرئية
- لا يمكن اختيار لغة

**السبب:**
- CSS مخفي الأزرار
- HTML الأزرار محذوف

**الحل - الخطوة 1:**
تحقق من وجود الأزرار في Console:
```javascript
console.log(document.querySelectorAll('.lang-option'));
```

إذا كانت النتيجة فارغة `[]`، الأزرار غير موجودة.

**الحل - الخطوة 2:**
افتح `index.html` وتحقق من:
```html
<a href="#" class="lang-option" data-lang="ar">🇸🇦 العربية</a>
<a href="#" class="lang-option" data-lang="en">🇺🇸 English</a>
<!-- ... باقي الأزرار -->
```

**الحل - الخطوة 3:**
تحقق من CSS في `styles.css`:
```css
.lang-option {
    display: inline-block;  /* ✓ يجب أن يكون مرئي */
    padding: 10px;
    margin: 5px;
}

/* تأكد من عدم إخفاء الأزرار */
.lang-option { display: none; } /* ❌ خاطئ */
```

---

## 📋 قائمة الفحص السريعة

عند حدوث مشكلة، اتبع هذا الترتيب:

- [ ] 1. هل Google Translate Script محمّل؟
  ```javascript
  console.log(document.querySelector('.goog-te-combo'));
  ```

- [ ] 2. هل `.lang-option` الأزرار موجودة؟
  ```javascript
  console.log(document.querySelectorAll('.lang-option'));
  ```

- [ ] 3. هل `systemMessages` يحتوي على اللغة؟
  ```javascript
  console.log(systemMessages['en']);
  ```

- [ ] 4. هل العناصر (IDs) موجودة في HTML؟
  ```javascript
  console.log(document.getElementById('cartLabel'));
  ```

- [ ] 5. هل localStorage يعمل؟
  ```javascript
  localStorage.setItem('test', 'value');
  console.log(localStorage.getItem('test'));
  ```

- [ ] 6. هل CSS محمّل بشكل صحيح؟
  ```javascript
  console.log(getComputedStyle(document.body).top);
  ```

---

## 🧪 الاختبارات السريعة

### الاختبار 1: تبديل اللغة الأساسي
```javascript
// اختبر العربية
selectGoogleLanguage('ar');
updateSystemMessages('ar');

// انتظر ثانية
setTimeout(() => {
    // اختبر الإنجليزية
    selectGoogleLanguage('en');
    updateSystemMessages('en');
}, 1000);
```

### الاختبار 2: جميع الرسائل
```javascript
Object.keys(systemMessages).forEach(lang => {
    console.log(`${lang}: ${window.getSystemMessage('cartLabel', lang)}`);
});
```

### الاختبار 3: التحقق من localStorage
```javascript
localStorage.setItem('selectedLanguage', 'fr');
location.reload();

// بعد إعادة التحميل
console.log(localStorage.getItem('selectedLanguage'));  // يجب: fr
```

---

## 📞 معلومات الدعم

**للمزيد من المعلومات، اقرأ:**
- `GOOGLE_TRANSLATE_SETUP.md` - شرح النظام
- `TEST_GOOGLE_TRANSLATE.md` - قائمة اختبار كاملة
- `ADD_NEW_LANGUAGE.md` - إضافة لغات جديدة

---

**آخر تحديث**: 2024
**الإصدار**: 1.0
