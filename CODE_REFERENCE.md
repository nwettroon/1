# 📋 مرجع سريع للأكوال

## 🔧 الأكوال الأساسية

### 1️⃣ تبديل اللغة

```javascript
// تبديل اللغة إلى الإنجليزية
selectGoogleLanguage('en');
updateSystemMessages('en');

// تبديل اللغة إلى الأردية
selectGoogleLanguage('ur');
updateSystemMessages('ur');
```

### 2️⃣ الحصول على رسالة

```javascript
// الحصول على رسالة "ادفع" بالإنجليزية
const cartLabel = window.getSystemMessage('cartLabel', 'en');
console.log(cartLabel);  // Output: "Pay"

// استخدام اللغة الحالية
const message = window.getSystemMessage('addToCart', window.currentGoogleLanguage);
```

### 3️⃣ تحديث الواجهة

```javascript
// تحديث جميع الرسائل الثابتة
window.updateSystemMessages('en');

// أو بدون تحديد (استخدم اللغة الحالية)
window.updateSystemMessages(window.currentGoogleLanguage);
```

### 4️⃣ إخفاء شريط Google

```javascript
// إخفاء الشريط يدويًا
hideGoogleTranslateBar();

// يعمل تلقائياً كل 500ms
// لكن يمكنك استدعاؤه يدويًا إذا لزم الأمر
```

---

## 🌍 أكوال اللغات

### قائمة جميع اللغات المدعومة

```javascript
const languages = {
    ar: 'العربية',
    en: 'English',
    ur: 'اردو',
    ru: 'Русский',
    uz: 'Oʻzbekcha',
    ja: '日本語',
    id: 'Bahasa Indonesia',
    fil: 'Filipino',
    ha: 'Hausa',
    'zh-SG': '中文 (新加坡)',
    ms: 'Bahasa Melayu',
    zh: '中文',
    mn: 'Монгол',
    fr: 'Français',
    tr: 'Türkçe',
    fa: 'فارسی'
};
```

### تبديل لغة حسب الكود

```javascript
// قائمة أكوال اللغات وترجمتها
const languageMap = {
    'ar': { flag: '🇸🇦', name: 'العربية' },
    'en': { flag: '🇺🇸', name: 'English' },
    'ur': { flag: '🇵🇰', name: 'اردو' },
    'ru': { flag: '🇷🇺', name: 'Русский' },
    'uz': { flag: '🇺🇿', name: 'Oʻzbekcha' },
    'ja': { flag: '🇯🇵', name: '日本語' },
    'id': { flag: '🇮🇩', name: 'Bahasa Indonesia' },
    'fil': { flag: '🇵🇭', name: 'Filipino' },
    'ha': { flag: '🇳🇬', name: 'Hausa' },
    'zh-SG': { flag: '🇸🇬', name: '中文' },
    'ms': { flag: '🇲🇾', name: 'Bahasa Melayu' },
    'zh': { flag: '🇨🇳', name: '中文' },
    'mn': { flag: '🇲🇳', name: 'Монгол' },
    'fr': { flag: '🇫🇷', name: 'Français' },
    'tr': { flag: '🇹🇷', name: 'Türkçe' },
    'fa': { flag: '🇮🇷', name: 'فارسی' }
};
```

---

## 📝 كل الرسائل الثابتة (20)

### قائمة المفاتيح

```javascript
const messageKeys = [
    'cartLabel',              // نص زر الدفع (ادفع)
    'cartTitle',              // عنوان السلة (السلة)
    'cartSubtitle',           // النص الفرعي للسلة
    'totalLabel',             // تسمية الإجمالي
    'payBtn',                 // نص زر الدفع في Modal
    'addToCart',              // نص زر إضافة للسلة
    'sizes',                  // تسمية المقاسات
    'noCategories',           // رسالة عدم وجود فئات
    'noProductsInCategory',   // رسالة عدم وجود منتجات
    'adminTitle',             // عنوان لوحة التحكم
    'categoriesManageTitle',  // عنوان إدارة الفئات
    'addCategory',            // نص زر إضافة فئة
    'productsManageTitle',    // عنوان إدارة المنتجات
    'addProduct',             // نص زر إضافة منتج
    'edit',                   // نص زر التعديل
    'delete',                 // نص زر الحذف
    'addSize',                // نص زر إضافة حجم
    'sizeNamePlaceholder',    // placeholder لاسم الحجم
    'sizePricePlaceholder',   // placeholder للسعر
    'exportBtn'               // نص زر التصدير
];
```

### مثال: الحصول على جميع الرسائل لغة معينة

```javascript
// للإنجليزية
const englishMessages = systemMessages.en;
console.log(englishMessages);
// Output: {
//   cartLabel: 'Pay',
//   cartTitle: 'Cart',
//   ...
// }

// للعربية
const arabicMessages = systemMessages.ar;
console.log(arabicMessages);
// Output: {
//   cartLabel: 'ادفع',
//   cartTitle: 'السلة',
//   ...
// }
```

---

## 🔄 تحديث العناصر

### تحديث عنصر واحد

```javascript
// تحديث عنصر cartLabel بناءً على اللغة الحالية
const lang = window.currentGoogleLanguage;
const message = window.getSystemMessage('cartLabel', lang);
document.getElementById('cartLabel').textContent = message;
```

### تحديث عناصر متعددة

```javascript
function updateAllMessages(lang) {
    const messages = systemMessages[lang] || systemMessages['en'];
    
    // تحديث جميع العناصر
    document.getElementById('cartLabel').textContent = messages.cartLabel;
    document.getElementById('cartTitle').textContent = messages.cartTitle;
    document.getElementById('totalLabel').textContent = messages.totalLabel;
    document.getElementById('payBtn').textContent = messages.payBtn;
    document.getElementById('addToCart').textContent = messages.addToCart;
    
    // ... الخ
}

// استدعِها عند تغيير اللغة
updateAllMessages('en');
```

---

## 🛠️ الدوال المتاحة

### الدوال الرئيسية

```javascript
// 1. تحديد اللغة برمجياً
selectGoogleLanguage(lang);
// مثال: selectGoogleLanguage('en');

// 2. تحديث الرسائل الثابتة
updateSystemMessages(lang);
// مثال: updateSystemMessages('en');

// 3. الحصول على رسالة
window.getSystemMessage(key, lang);
// مثال: window.getSystemMessage('cartLabel', 'en');
// النتيجة: 'Pay'

// 4. إخفاء شريط Google
hideGoogleTranslateBar();

// 5. تحديث زر اللغة المختار
updateActiveLanguageButton(lang);
// مثال: updateActiveLanguageButton('en');

// 6. تحميل اللغة المحفوظة
loadSavedLanguage();

// 7. تهيئة النظام
initGoogleTranslateController();
```

### الخصائص العامة

```javascript
// اللغة الحالية
window.currentGoogleLanguage;  // مثال: 'en'

// قاموس الرسائل
window.systemMessages;  // Object بـ 15 لغة

// خريطة تحويل رموز اللغات
window.languageCodeMap;  // Object مع تحويلات
```

---

## 🧪 أمثلة عملية

### مثال 1: تبديل اللغة وحفظها

```javascript
function changeLanguage(lang) {
    // تحديث Google Translate
    selectGoogleLanguage(languageCodeMap[lang] || lang);
    
    // تحديث الرسائل الثابتة
    updateSystemMessages(lang);
    
    // تحديث اللغة الحالية
    window.currentGoogleLanguage = lang;
    
    // حفظ في localStorage
    localStorage.setItem('selectedLanguage', lang);
    
    // تحديث الزر النشط
    updateActiveLanguageButton(lang);
}

// الاستخدام
changeLanguage('en');
```

### مثال 2: عرض كل الرسائل لجميع اللغات

```javascript
// اطبع جميع الرسائل
function printAllMessages() {
    Object.keys(systemMessages).forEach(lang => {
        console.log(`\n=== ${lang} ===`);
        console.log(systemMessages[lang]);
    });
}

// الاستخدام
printAllMessages();
```

### مثال 3: التحقق من الترجمة

```javascript
// تحقق من أن الرسالة موجودة لجميع اللغات
function validateAllLanguages(key) {
    Object.keys(systemMessages).forEach(lang => {
        const msg = systemMessages[lang][key];
        if (!msg) {
            console.error(`Missing "${key}" for language: ${lang}`);
        } else {
            console.log(`✓ ${lang}: ${msg}`);
        }
    });
}

// الاستخدام
validateAllLanguages('cartLabel');
```

### مثال 4: تبديل لغة عند النقر على زر

```javascript
// في HTML
// <button data-lang="en" class="lang-btn">English</button>

// في JavaScript
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const lang = this.dataset.lang;
        selectGoogleLanguage(languageCodeMap[lang] || lang);
        updateSystemMessages(lang);
        window.currentGoogleLanguage = lang;
        localStorage.setItem('selectedLanguage', lang);
        updateActiveLanguageButton(lang);
    });
});
```

---

## 📊 جدول الرسائل الكاملة

| Key | Arabic | English | Urdu |
|-----|--------|---------|------|
| cartLabel | ادفع | Pay | ادائیگی |
| cartTitle | السلة | Cart | ڈبہ |
| totalLabel | الإجمالي: | Total: | کل: |
| payBtn | دفع | Pay | ادائیگی کریں |
| addToCart | إضافة للسلة | Add to Cart | ڈبے میں شامل کریں |

*للمزيد، اقرأ `google-translate-controller.js`*

---

## 💾 العمل مع localStorage

```javascript
// حفظ اللغة
localStorage.setItem('selectedLanguage', 'en');

// تحميل اللغة
const saved = localStorage.getItem('selectedLanguage');
console.log(saved);  // 'en'

// حذف
localStorage.removeItem('selectedLanguage');

// مسح الكل
localStorage.clear();
```

---

## 🔍 استكشاف في Console

```javascript
// انسخ هذه الأوامر في Console (F12):

// 1. تحقق من تحميل النظام
console.log('Google Language:', window.currentGoogleLanguage);

// 2. اختبر الرسالة
console.log('Message:', window.getSystemMessage('cartLabel', 'en'));

// 3. اختبر جميع اللغات
Object.keys(systemMessages).forEach(lang => {
    console.log(`${lang}: ${systemMessages[lang].cartLabel}`);
});

// 4. تحقق من localStorage
console.log('Saved Language:', localStorage.getItem('selectedLanguage'));

// 5. تحقق من توفر Google
console.log('Google Translate Ready:', !!document.querySelector('.goog-te-combo'));
```

---

## ⚠️ الأخطاء الشائعة

### ❌ خطأ 1: استدعاء دالة غير موجودة

```javascript
// ❌ خطأ
selectLanguage('en');  // الاسم خاطئ

// ✅ صحيح
selectGoogleLanguage('en');
```

### ❌ خطأ 2: بدون تحديث الرسائل

```javascript
// ❌ خطأ - تغير اللغة فقط
selectGoogleLanguage('en');

// ✅ صحيح - غير اللغة والرسائل
selectGoogleLanguage('en');
updateSystemMessages('en');
```

### ❌ خطأ 3: رمز لغة خاطئ

```javascript
// ❌ خطأ
selectGoogleLanguage('english');  // رمز خاطئ

// ✅ صحيح
selectGoogleLanguage('en');  // استخدم الرمز الصحيح
```

---

## ✨ نصائح مفيدة

### 💡 نصيحة 1: استخدم console.log للتصحيح

```javascript
function debugLanguage(lang) {
    console.log('Language:', lang);
    console.log('Mapped:', languageCodeMap[lang]);
    console.log('Messages:', systemMessages[lang]);
    console.log('Current:', window.currentGoogleLanguage);
}

debugLanguage('en');
```

### 💡 نصيحة 2: تحقق من العناصر

```javascript
// هل العنصر موجود؟
console.log(document.getElementById('cartLabel'));

// هل له محتوى؟
console.log(document.getElementById('cartLabel')?.textContent);
```

### 💡 نصيحة 3: استخدم async/await للترجمات البطيئة

```javascript
async function changeLanguageAsync(lang) {
    selectGoogleLanguage(languageCodeMap[lang] || lang);
    
    // انتظر الترجمة
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // ثم حدّث الرسائل
    updateSystemMessages(lang);
}

// الاستخدام
changeLanguageAsync('en');
```

---

**آخر تحديث:** 2024  
**الإصدار:** 1.0
