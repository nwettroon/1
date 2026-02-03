# كيفية إضافة لغات جديدة

## 📝 خطوات إضافة لغة جديدة

### الخطوة 1: اختيار رمز اللغة
ابحث عن رمز اللغة في [قائمة Google Translate الرسمية](https://developers.google.com/translate/docs/languages)

أمثلة:
- Arabic: `ar`
- English: `en`
- Portuguese: `pt`
- Hindi: `hi`

### الخطوة 2: إضافة الرسائل الثابتة
في ملف `google-translate-controller.js`:

```javascript
const systemMessages = {
    // ... اللغات الأخرى ...
    pt: {  // Portuguese
        cartLabel: "Pagar",
        cartTitle: "Carrinho",
        cartSubtitle: "Vá ao caixa para pagar",
        totalLabel: "Total:",
        payBtn: "Pagar",
        addToCart: "Adicionar ao Carrinho",
        sizes: "Tamanhos:",
        noCategories: "Sem categorias",
        noProductsInCategory: "Sem produtos nesta categoria",
        adminTitle: "Painel de Administração",
        categoriesManageTitle: "Gerenciar Categorias",
        addCategory: "+ Adicionar Categoria",
        productsManageTitle: "Gerenciar Produtos",
        addProduct: "+ Adicionar Produto",
        edit: "Editar",
        delete: "Excluir",
        addSize: "+ Adicionar Tamanho",
        sizeNamePlaceholder: "Nome do Tamanho",
        sizePricePlaceholder: "Preço",
        exportBtn: "Baixar Dados"
    }
};
```

### الخطوة 3: إضافة خريطة الترجمة
إذا كان رمز اللغة في Google مختلفاً عن رمزك، أضفه للخريطة:

```javascript
const languageCodeMap = {
    // ... الخريطة الحالية ...
    'pt': 'pt'  // Portuguese
};
```

**ملاحظة:** إذا كان الرمز متطابقاً، لا تحتاج إضافته (سيستخدم القيمة الافتراضية).

### الخطوة 4: إضافة الزر في HTML
في ملف `index.html`:

```html
<a href="#" class="lang-option" data-lang="pt" data-google-lang="pt">
    🇵🇹 Português
</a>
```

### الخطوة 5: اختبار اللغة
1. افتح صفحة الويب
2. افتح Console (F12)
3. انقر على الزر الجديد
4. تحقق من الناتج:
```javascript
console.log(currentGoogleLanguage);  // يجب أن يكون: pt
console.log(window.getSystemMessage('cartLabel', 'pt'));  // يجب أن يكون: Pagar
```

## 📋 قائمة الرسائل المطلوبة (20 رسالة)

عند إضافة لغة جديدة، تأكد من إضافة جميع هذه المفاتيح:

```javascript
{
    cartLabel: "",              // نص زر الدفع
    cartTitle: "",              // عنوان السلة
    cartSubtitle: "",           // النص الفرعي للسلة
    totalLabel: "",             // تسمية الإجمالي
    payBtn: "",                 // نص زر الدفع في Modal
    addToCart: "",              // نص زر إضافة للسلة
    sizes: "",                  // تسمية المقاسات
    noCategories: "",           // رسالة عدم وجود فئات
    noProductsInCategory: "",   // رسالة عدم وجود منتجات
    adminTitle: "",             // عنوان لوحة التحكم
    categoriesManageTitle: "",  // عنوان إدارة الفئات
    addCategory: "",            // نص زر إضافة فئة
    productsManageTitle: "",    // عنوان إدارة المنتجات
    addProduct: "",             // نص زر إضافة منتج
    edit: "",                   // نص زر التعديل
    delete: "",                 // نص زر الحذف
    addSize: "",                // نص زر إضافة حجم
    sizeNamePlaceholder: "",    // placeholder لاسم الحجم
    sizePricePlaceholder: "",   // placeholder للسعر
    exportBtn: ""               // نص زر التصدير
}
```

## 🌍 اللغات الشائعة وأكوادها

| اللغة | الرمز | أمثلة |
|-------|-------|-------|
| عربي | ar | 🇸🇦 |
| إنجليزي | en | 🇺🇸 🇬🇧 |
| أردو | ur | 🇵🇰 |
| روسي | ru | 🇷🇺 |
| أوزبكي | uz | 🇺🇿 |
| ياباني | ja | 🇯🇵 |
| إندونيسي | id | 🇮🇩 |
| فيليبيني | fil | 🇵🇭 |
| هاوسا | ha | 🇳🇬 |
| صيني | zh-CN | 🇨🇳 |
| ماليزي | ms | 🇲🇾 |
| منغولي | mn | 🇲🇳 |
| فرنسي | fr | 🇫🇷 |
| تركي | tr | 🇹🇷 |
| فارسي | fa | 🇮🇷 |
| برتغالي | pt | 🇵🇹 |
| إسباني | es | 🇪🇸 |
| ألماني | de | 🇩🇪 |
| إيطالي | it | 🇮🇹 |
| كوري | ko | 🇰🇷 |
| الهندية | hi | 🇮🇳 |
| التايلاندية | th | 🇹🇭 |
| الفيتنامية | vi | 🇻🇳 |

## 💡 نصائح مهمة

### ✅ ما يجب فعله:
1. **استخدم Google Translate** للترجمة الأولية
2. **راجع الترجمات** من قِبل ناطق أصلي
3. **اختبر جميع اللغات** عند الإضافة
4. **وثّق التغييرات** في ملف CHANGELOG

### ❌ ما يجب تجنبه:
1. **لا تترجم** باستخدام Google Translate فقط (قد يكون غير دقيق)
2. **لا تترك** مفاتيح فارغة (ستؤدي لأخطاء)
3. **لا تستخدم** رموز لغات غير صحيحة
4. **لا تنس** إضافة الزر في HTML

## 📚 موارد إضافية

- [قائمة اللغات المدعومة من Google](https://developers.google.com/translate/docs/languages)
- [أرقام ISO لرموز اللغات](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes)
- [أرقام ISO للدول/الأقاليم](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)

## 🔧 مثال عملي كامل: إضافة الإسبانية

### 1. تحديث google-translate-controller.js

```javascript
const systemMessages = {
    // ... اللغات الأخرى ...
    es: {
        cartLabel: "Pagar",
        cartTitle: "Carrito",
        cartSubtitle: "Ir a la caja para pagar",
        totalLabel: "Total:",
        payBtn: "Pagar",
        addToCart: "Agregar al Carrito",
        sizes: "Tamaños:",
        noCategories: "Sin categorías",
        noProductsInCategory: "Sin productos en esta categoría",
        adminTitle: "Panel de Administración",
        categoriesManageTitle: "Administrar Categorías",
        addCategory: "+ Agregar Categoría",
        productsManageTitle: "Administrar Productos",
        addProduct: "+ Agregar Producto",
        edit: "Editar",
        delete: "Eliminar",
        addSize: "+ Agregar Tamaño",
        sizeNamePlaceholder: "Nombre del Tamaño",
        sizePricePlaceholder: "Precio",
        exportBtn: "Descargar Datos"
    }
};

const languageCodeMap = {
    // ... الخريطة الحالية ...
    'es': 'es'
};
```

### 2. تحديث index.html

أضف هذا الزر في قسم اللغات:

```html
<a href="#" class="lang-option" data-lang="es" data-google-lang="es">
    🇪🇸 Español
</a>
```

### 3. الاختبار

```javascript
// في Console
selectGoogleLanguage('es');
updateSystemMessages('es');
console.log(window.getSystemMessage('cartLabel', 'es'));  // يجب أن يكون: Pagar
```

## ✨ خلاصة

لإضافة لغة جديدة تحتاج فقط إلى:
1. ✅ إضافة 20 رسالة في `systemMessages`
2. ✅ إضافة رمز اللغة في `languageCodeMap` (إذا اختلف)
3. ✅ إضافة زر في `index.html`
4. ✅ اختبار اللغة

هذا كل شيء! 🎉

---

**آخر تحديث:** 2024
**الحالة:** جاهز للاستخدام ✓
