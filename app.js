// Global State
let cart = [];
let categories = [];
let products = [];
let selectedCategory = null;
let currentProductQuantity = 1;
let currentProductSize = null;
let editingProductId = null;
let currentSizeQuantities = {};
let adminFormMode = null;
let editingCategoryId = null;
// Flag to indicate admin paste action was used for sizes
let adminSizesClipboardUsed = false;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadData();
    renderCategories();
    renderProducts();
    setupViewToggle();
    setupScrollToTop();
});

function initializeApp() {
    // Load data from data.json (centralized storage)
    loadDataFromServer();
}

function createDefaultData() {
    categories = [
        { id: 1, name: 'بيتزا', image: 'images/بيبروني.jpg' },
        { id: 2, name: 'الشورما', image: 'images/شورما.jpg' },
        { id: 3, name: 'عصائر', image: 'images/عصائر.jpg' }
    ];
    
    products = [
        {
            id: 1,
            name: 'بيبروني',
            categoryId: 1,
            image: 'images/بيبروني.jpg',
            basePrice: 35,
            sizes: [
                { name: 'صغير', price: 35 },
                { name: 'وسط', price: 50 },
                { name: 'كبير', price: 65 }
            ]
        },
        {
            id: 2,
            name: 'عربي',
            categoryId: 2,
            image: 'images/عربي.jpg',
            basePrice: 12,
            sizes: [
                { name: 'صغير', price: 12 },
                { name: 'كبير', price: 18 }
            ]
        },
        {
            id: 3,
            name: 'برتقال',
            categoryId: 3,
            image: 'images/برتقال.jpg',
            basePrice: 15,
            sizes: [
                { name: 'صغير', price: 15 },
                { name: 'كبير', price: 20 }
            ]
        }
    ];
    
    saveData();
}

function setupEventListeners() {
    // Cart
    document.getElementById('cartBtn').addEventListener('click', openCartModal);
    document.getElementById('closeCart').addEventListener('click', closeCartModal);
    document.getElementById('payBtn').addEventListener('click', printInvoice);
    
    // Product Modal
    document.getElementById('closeModal').addEventListener('click', closeProductModal);
    
    // Admin
    document.getElementById('adminBtn').addEventListener('click', openAdminModal);
    document.getElementById('closeAdmin').addEventListener('click', closeAdminModal);
    document.getElementById('exportDataBtn').addEventListener('click', exportData);
    document.getElementById('resetInvoiceCounterBtn').addEventListener('click', resetInvoiceCounter);
    document.getElementById('addCategoryBtn').addEventListener('click', () => openAdminForm('category-add'));
    document.getElementById('addProductBtn').addEventListener('click', () => openAdminForm('product-add'));
    
    // Edit Product Modal
    document.getElementById('closeEditProduct').addEventListener('click', closeEditProductModal);
    document.getElementById('cancelEditProduct').addEventListener('click', closeEditProductModal);
    document.getElementById('editProductForm').addEventListener('submit', saveEditedProduct);
    const copyBtn = document.getElementById('copySizesBtn');
    if (copyBtn) copyBtn.addEventListener('click', copySizes);
    const pasteBtn = document.getElementById('pasteSizesBtn');
    if (pasteBtn) pasteBtn.addEventListener('click', pasteSizesIntoEdit);
    const pasteAdminBtn = document.getElementById('pasteSizesAdminBtn');
    if (pasteAdminBtn) pasteAdminBtn.addEventListener('click', pasteSizesIntoAdminForm);
    document.getElementById('addSizeBtn').addEventListener('click', addNewSize);

    // Admin Form Modal
    document.getElementById('closeAdminForm').addEventListener('click', closeAdminForm);
    document.getElementById('cancelAdminForm').addEventListener('click', closeAdminForm);
    document.getElementById('adminForm').addEventListener('submit', saveAdminForm);
    const saveAdminBtn = document.getElementById('saveAdminForm');
    if (saveAdminBtn) {
        saveAdminBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // call save handler directly in case form submit is blocked by browser validation
            try { saveAdminForm(new Event('submit')); } catch (err) { console.error(err); }
        });
    }
    
    // Close modal on outside click
    document.getElementById('productModal').addEventListener('click', function(e) {
        if (e.target === this) closeProductModal();
    });
    
    document.getElementById('cartModal').addEventListener('click', function(e) {
        if (e.target === this) closeCartModal();
    });
    
    document.getElementById('adminModal').addEventListener('click', function(e) {
        if (e.target === this) closeAdminModal();
    });

    document.getElementById('adminFormModal').addEventListener('click', function(e) {
        if (e.target === this) closeAdminForm();
    });
}

function formatNumber(value) {
    // Always use English numbers
    return value.toString();
}

function formatNumber(value) {
    return value.toString();
}

function formatPrice(value) {
    return `${formatNumber(value)} ريال`;
}

function loadDataFromServer() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            categories = data.categories || [];
            products = data.products || [];
            renderCategories();
            renderProducts();
        })
        .catch(error => {
            console.log('خطأ في تحميل البيانات:', error);
            // استخدام البيانات الافتراضية في حالة الفشل
            createDefaultData();
        });
}

function loadData() {
    loadDataFromServer();
}

function saveData() {
    // إرسال البيانات إلى الخادم لحفظها
    fetch('data.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            categories,
            products
        })
    })
    .catch(error => console.log('خطأ في حفظ البيانات:', error));
}

function exportData() {
    const data = { categories, products };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('تم تحميل ملف data.json بنجاح!', 'success');
}

function renderCategories() {
    // Render in fixed bar
    const barContainer = document.getElementById('categoriesList');
    barContainer.innerHTML = '';
    
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = category.name;
        if (selectedCategory === category.id) {
            btn.classList.add('active');
        }
        btn.addEventListener('click', function() {
            selectedCategory = category.id;
            renderCategories();
            renderProducts();
            const section = document.getElementById(`category-section-${category.id}`);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
        barContainer.appendChild(btn);
    });
    
    // Render in header section
    const headerContainer = document.getElementById('categoriesSection');
    if (headerContainer) {
        headerContainer.innerHTML = '';
        categories.forEach(category => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <img src="${category.image}" alt="${category.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23f0e6d8%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'">
                <div class="category-card-name">${category.name}</div>
            `;
            card.addEventListener('click', function() {
                selectedCategory = category.id;
                renderCategories();
                renderProducts();
                const section = document.getElementById(`category-section-${category.id}`);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    document.getElementById('productsContainer').scrollIntoView({ behavior: 'smooth' });
                }
            });
            headerContainer.appendChild(card);
        });
    }
}

function renderProducts() {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    if (!categories.length) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">لا توجد أقسام</p>`;
        return;
    }

    categories.forEach(category => {
        const section = document.createElement('section');
        section.className = 'category-section-block';
        section.id = `category-section-${category.id}`;

        const title = document.createElement('h3');
        title.className = 'category-section-title';
        title.textContent = category.name;

        const grid = document.createElement('div');
        grid.className = 'category-products-grid';

        const categoryProducts = products.filter(p => p.categoryId === category.id);
        if (categoryProducts.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'category-empty';
            empty.textContent = 'لا توجد منتجات في هذا القسم';
            grid.appendChild(empty);
        } else {
            categoryProducts.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';

                const minPrice = product.sizes && product.sizes.length > 0
                    ? Math.min(...product.sizes.map(s => s.price))
                    : product.basePrice;

                // Badge
                if (product.badge) {
                    if (product.badge === 'best') {
                        // Fire effect for best seller
                        card.classList.add('card-on-fire');
                        
                        // Fire particles
                        const fireContainer = document.createElement('div');
                        fireContainer.className = 'fire-particles';
                        const fireEmojis = ['🔥', '🔥', '🔥', '🔥', '🔥', '🔥', '🔥', '🔥'];
                        fireEmojis.forEach(emoji => {
                            const particle = document.createElement('span');
                            particle.className = 'fire-particle';
                            particle.textContent = emoji;
                            fireContainer.appendChild(particle);
                        });
                        card.appendChild(fireContainer);
                        
                        // Fire label
                        const fireLabel = document.createElement('span');
                        fireLabel.className = 'fire-label';
                        fireLabel.textContent = '🔥 الأكثر مبيعاً';
                        card.appendChild(fireLabel);
                    } else {
                        const badgeEl = document.createElement('span');
                        const badgeMap = {
                            'new': { class: 'badge-new', text: 'جديد' },
                            'offer': { class: 'badge-offer', text: 'عرض خاص' }
                        };
                        const badgeInfo = badgeMap[product.badge];
                        if (badgeInfo) {
                            badgeEl.className = `product-badge ${badgeInfo.class}`;
                            badgeEl.textContent = badgeInfo.text;
                            card.appendChild(badgeEl);
                        }
                    }
                }

                const imgElement = document.createElement('img');
                imgElement.className = 'product-image';
                imgElement.src = product.image;
                imgElement.alt = product.name;
                imgElement.onerror = function() {
                    this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f5f5f5" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="14" fill="%23999" text-anchor="middle" dy=".3em" font-family="Arial"%3Eصورة غير متوفرة%3C/text%3E%3C/svg%3E';
                };

                const infoDiv = document.createElement('div');
                infoDiv.className = 'product-info';

                const nameDiv = document.createElement('div');
                nameDiv.className = 'product-name';
                nameDiv.textContent = product.name;

                const priceBtn = document.createElement('div');
                priceBtn.className = 'product-price';
                priceBtn.textContent = `من ${formatNumber(minPrice)} ريال`;

                infoDiv.appendChild(nameDiv);
                infoDiv.appendChild(priceBtn);

                card.appendChild(imgElement);
                card.appendChild(infoDiv);

                card.addEventListener('mouseenter', function() {
                    this.classList.add('glowing');
                });

                card.addEventListener('mouseleave', function() {
                    this.classList.remove('glowing');
                });

                card.addEventListener('click', function() {
                    openProductModal(product);
                });

                grid.appendChild(card);
            });
        }

        section.appendChild(title);
        section.appendChild(grid);
        container.appendChild(section);
    });
}

function openProductModal(product) {
    currentProductQuantity = 1;
    currentProductSize = null;
    currentSizeQuantities = {};
    
    const imgElement = document.getElementById('modalProductImg');
    imgElement.src = product.image;
    imgElement.onerror = function() {
        this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23f5f5f5" width="300" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="16" fill="%23999" text-anchor="middle" dy=".3em" font-family="Arial"%3Eصورة غير متوفرة%3C/text%3E%3C/svg%3E';
    };
    
    document.getElementById('modalProductName').textContent = product.name;
    
    const sizesList = document.getElementById('productSizesList');
    sizesList.innerHTML = '';

    const quantitySection = document.querySelector('.quantity-section');
    if (product.sizes && product.sizes.length > 0) {
        if (quantitySection) quantitySection.style.display = 'none';

        product.sizes.forEach((size, index) => {
            currentSizeQuantities[index] = 0;
            const sizeRow = document.createElement('div');
            sizeRow.className = 'size-item size-item-row';
            sizeRow.innerHTML = `
                <div class="size-info">
                    <span class="size-name">${size.name}</span>
                    <span class="size-price">${formatPrice(size.price)}</span>
                </div>
                <div class="size-qty-controls">
                    <button class="qty-btn" type="button" data-action="plus" data-index="${index}" data-product-id="${product.id}">+</button>
                    <span class="qty-display" data-index="${index}">0</span>
                    <button class="qty-btn" type="button" data-action="minus" data-index="${index}" data-product-id="${product.id}">−</button>
                </div>
            `;
            sizesList.appendChild(sizeRow);
        });

        sizesList.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                const action = this.getAttribute('data-action');
                const productId = parseInt(this.getAttribute('data-product-id'));
                const current = currentSizeQuantities[idx] || 0;
                const next = action === 'plus' ? current + 1 : Math.max(0, current - 1);
                currentSizeQuantities[idx] = next;
                const display = sizesList.querySelector(`.qty-display[data-index="${idx}"]`);
                if (display) display.textContent = next;
                
                // Add to cart immediately
                const prod = products.find(p => p.id === productId);
                if (prod && prod.sizes[idx]) {
                    const size = prod.sizes[idx];
                    addToCartDirectly(prod, size, next - current);
                }
            });
        });
    } else {
        if (quantitySection) quantitySection.style.display = '';
        // If no sizes, use base price
        currentProductSize = { name: '', price: product.basePrice };
        updateQuantityDisplay();
    }
    document.getElementById('productModal').classList.add('active');
}

function addToCartDirectly(product, size, quantityChange) {
    if (quantityChange === 0) return;
    
    // Find if item already exists in cart
    const existingItemIndex = cart.findIndex(item => 
        item.productId === product.id && item.size === size.name
    );
    
    if (existingItemIndex !== -1) {
        // Update existing item
        cart[existingItemIndex].quantity += quantityChange;
        if (cart[existingItemIndex].quantity <= 0) {
            cart.splice(existingItemIndex, 1);
        }
    } else if (quantityChange > 0) {
        // Add new item
        cart.push({
            productId: product.id,
            productName: product.name,
            productImage: product.image,
            size: size.name,
            price: size.price,
            quantity: quantityChange
        });
    }
    
    // Fly-to-cart animation on add
    if (quantityChange > 0) {
        flyToCartAnimation();
    }
    
    updateCartCount();
}

function flyToCartAnimation() {
    const cartBtn = document.getElementById('cartBtn');
    if (!cartBtn) return;
    
    // Get the last clicked button position
    const clickedBtn = document.querySelector('.qty-btn:focus, .qty-btn:active');
    let startX, startY;
    
    if (clickedBtn) {
        const btnRect = clickedBtn.getBoundingClientRect();
        startX = btnRect.left + btnRect.width / 2;
        startY = btnRect.top + btnRect.height / 2;
    } else {
        // Fallback to center of modal
        const modal = document.getElementById('productModal');
        const modalRect = modal.getBoundingClientRect();
        startX = modalRect.left + modalRect.width / 2;
        startY = modalRect.top + modalRect.height / 2;
    }
    
    const cartRect = cartBtn.getBoundingClientRect();
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;
    
    // Create flying element
    const flyEl = document.createElement('div');
    flyEl.className = 'fly-to-cart';
    flyEl.textContent = '+1';
    flyEl.style.left = startX - 18 + 'px';
    flyEl.style.top = startY - 18 + 'px';
    document.body.appendChild(flyEl);
    
    // Trigger animation
    requestAnimationFrame(() => {
        flyEl.style.left = endX - 18 + 'px';
        flyEl.style.top = endY - 18 + 'px';
        flyEl.classList.add('animate');
    });
    
    // Shake cart on arrival
    setTimeout(() => {
        const cartFixed = document.querySelector('.cart-fixed');
        if (cartFixed) {
            cartFixed.classList.remove('shake');
            void cartFixed.offsetWidth; // force reflow
            cartFixed.classList.add('shake');
        }
    }, 500);
    
    // Remove flying element
    setTimeout(() => {
        flyEl.remove();
    }, 650);
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

function updateQuantityDisplay() {
    document.getElementById('qtyDisplay').textContent = formatNumber(currentProductQuantity);
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = formatNumber(count);
}

function openCartModal() {
    const cartItemsList = document.getElementById('cartItemsList');
    cartItemsList.innerHTML = '';
    
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.productName}</div>
                ${item.size ? `<div class="cart-item-size">${window.getSystemMessage ? window.getSystemMessage('sizeLabel', window.currentGoogleLanguage) : 'المقاس'}: ${item.size}</div>` : ''}
                <div class="cart-item-qty">${window.getSystemMessage ? window.getSystemMessage('quantityLabel', window.currentGoogleLanguage) : 'الكمية'}: ${formatNumber(item.quantity)}</div>
                <div>${window.getSystemMessage ? window.getSystemMessage('priceLabel', window.currentGoogleLanguage) : 'السعر'}: ${formatPrice(itemTotal)}</div>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="increaseCartItem(${index})">+</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="decreaseCartItem(${index})">−</button>
                <button class="cart-remove-btn" onclick="removeFromCart(${index})">✕</button>
            </div>
        `;
        cartItemsList.appendChild(cartItemDiv);
    });
    
    document.getElementById('totalPrice').textContent = formatNumber(total);
    document.getElementById('cartModal').classList.add('active');
}

function closeCartModal() {
    document.getElementById('cartModal').classList.remove('active');
}

function increaseCartItem(index) {
    if (cart[index]) {
        cart[index].quantity++;
        updateCartCount();
        openCartModal();
    }
}

function decreaseCartItem(index) {
    if (cart[index] && cart[index].quantity > 1) {
        cart[index].quantity--;
        updateCartCount();
        openCartModal();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    openCartModal();
}

function printInvoice() {
    if (cart.length === 0) {
        showToast('السلة فارغة', 'error');
        return;
    }
    
    const date = new Date();
    // Persistent sequential invoice counter stored in localStorage
    const counterKey = 'invoiceCounter';
    let stored = parseInt(localStorage.getItem(counterKey) || '0', 10);
    if (isNaN(stored) || stored < 1) {
        stored = 1;
    } else {
        stored = stored + 1;
    }
    localStorage.setItem(counterKey, stored);
    const invoiceNumber = String(stored);
    const dateStr = date.toLocaleDateString('ar-SA');
    const timeStr = date.toLocaleTimeString('ar-SA');
    
    let invoiceHTML = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 400px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                }
                .invoice {
                    border: 2px solid #333;
                    padding: 20px;
                    text-align: center;
                }
                .header {
                    border-bottom: 2px solid #333;
                    padding-bottom: 10px;
                    margin-bottom: 15px;
                }
                .header h1 {
                    margin: 0;
                    font-size: 18px;
                }
                .invoice-meta {
                    font-size: 12px;
                    margin: 10px 0;
                    text-align: left;
                }
                .invoice-number-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 6px;
                }
                .inv-label {
                    font-size: 12px;
                }
                .inv-value {
                    font-size: 16px;
                    font-weight: 700;
                    border: 1px solid #333;
                    padding: 4px 8px;
                    border-radius: 4px;
                    background: #f9f9f9;
                }
                .items {
                    margin: 15px 0;
                    border-top: 1px solid #ddd;
                    border-bottom: 1px solid #ddd;
                    padding: 10px 0;
                }
                .item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 6px 0;
                    font-size: 12px;
                }
                .item-left {
                    display: flex;
                    flex: 1;
                    gap: 8px;
                    align-items: center;
                    justify-content: flex-end;
                }
                .item-name {
                    font-size: 15px;
                    font-weight: 600;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .item-qty {
                    min-width: 36px;
                    text-align: center;
                    font-weight: 700;
                }
                .item-price {
                    width: 100px;
                    text-align: left;
                    font-size: 13px;
                    font-weight: 700;
                }
                .total {
                    display: flex;
                    justify-content: space-between;
                    font-weight: bold;
                    margin-top: 10px;
                    font-size: 14px;
                }
                .thank-you {
                    margin-top: 15px;
                    font-size: 12px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="invoice">
                <div class="header">
                    <h1>ثمرة المذاق المنعش</h1>
                </div>
                <div class="invoice-meta">
                    <div class="invoice-number-row">
                        <span class="inv-label">رقم الفاتورة:</span>
                        <span class="inv-value">${invoiceNumber}</span>
                    </div>
                    <div class="invoice-datetime">
                        <div>التاريخ: ${dateStr}</div>
                        <div>الوقت: ${timeStr}</div>
                    </div>
                </div>
                <div class="items">
    `;
    
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const size = item.size ? ` (${item.size})` : '';
        invoiceHTML += `
            <div class="item">
                <div class="item-left">
                    <span class="item-name">${item.productName}${size}</span>
                    <span class="item-qty">× ${item.quantity}</span>
                </div>
                <span class="item-price">${itemTotal} ريال</span>
            </div>
        `;
    });
    
    invoiceHTML += `
                </div>
                <div class="total">
                    <span>الإجمالي:</span>
                    <span>${total} ريال</span>
                </div>
                <div class="thank-you">
                    شكراً لتفضلكم بزيارتنا
                </div>
            </div>
            <script>
                (function(){
                    function doPrint(){
                        try{ window.focus(); window.print(); }catch(e){}
                    }
                    if (typeof window !== 'undefined'){
                        if ('onafterprint' in window){
                            window.onafterprint = function(){ try{ window.close(); }catch(e){} };
                        }
                        window.onload = function(){ setTimeout(doPrint, 50); };
                        // Fallback: close after 3s if onafterprint didn't run
                        setTimeout(function(){ try{ window.close(); }catch(e){} }, 3000);
                    }
                })();
            <\/script>
        </body>
        </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        showToast('تم حظر النافذة المنبثقة للطباعة. سمح بفتح النوافذ المنبثقة ثم أعد المحاولة.', 'error', 5000);
        return;
    }
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();

    // When the print document finishes loading, trigger print and close the window.
    const tryPrintAndClose = function() {
        try {
            printWindow.focus();
            printWindow.print();
        } catch (err) {
            console.warn('print failed:', err);
        }

        // Prefer onafterprint when available to close the window after the print dialog.
        if ('onafterprint' in printWindow) {
            printWindow.onafterprint = function() {
                try { printWindow.close(); } catch (e) {}
            };
        } else {
            // Fallback: close shortly after calling print.
            setTimeout(function() {
                try { printWindow.close(); } catch (e) {}
            }, 1000);
        }
    };

    // If the new window has already loaded the content, run immediately, otherwise wait for load.
    if (printWindow.document.readyState === 'complete') {
        tryPrintAndClose();
    } else {
        printWindow.addEventListener('load', tryPrintAndClose);
        // As an extra fallback, attempt to print after a short delay if load doesn't fire.
        setTimeout(tryPrintAndClose, 500);
    }

    // Clear cart after printing (kept short delay as before)
    setTimeout(function() {
        cart = [];
        updateCartCount();
        closeCartModal();
    }, 1200);
}

// Admin Panel Functions
function openAdminModal() {
    renderAdminPanel();
    document.getElementById('adminModal').classList.add('active');
}

function closeAdminModal() {
    document.getElementById('adminModal').classList.remove('active');
}

function openAdminForm(mode, id = null) {
    adminFormMode = mode;
    editingCategoryId = null;

    const modal = document.getElementById('adminFormModal');
    const title = document.getElementById('adminFormTitle');
    const nameInput = document.getElementById('adminItemName');
    const imageInput = document.getElementById('adminItemImage');
    const priceGroup = document.getElementById('adminProductPriceGroup');
    const priceInput = document.getElementById('adminProductPrice');
    const categoryGroup = document.getElementById('adminProductCategoryGroup');
    const categorySelect = document.getElementById('adminProductCategory');

    nameInput.value = '';
    imageInput.value = '';
    priceInput.value = '';
    categorySelect.innerHTML = '';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });

    nameInput.oninput = function() {
        if (!imageInput.dataset.manual) {
            const suggested = this.value.trim();
            imageInput.value = suggested ? `${suggested}.jpg` : '';
        }
    };

    imageInput.oninput = function() {
        imageInput.dataset.manual = imageInput.value.trim() ? '1' : '';
    };

    if (mode === 'category-add') {
        title.textContent = 'إضافة قسم جديد';
        categoryGroup.style.display = 'none';
        priceGroup.style.display = 'none';
    }

    if (mode === 'category-edit') {
        const category = categories.find(c => c.id === id);
        if (!category) return;
        editingCategoryId = id;
        title.textContent = 'تعديل القسم';
        nameInput.value = category.name;
        imageInput.value = category.image || '';
        imageInput.dataset.manual = imageInput.value.trim() ? '1' : '';
        categoryGroup.style.display = 'none';
        priceGroup.style.display = 'none';
    }

    if (mode === 'product-add') {
        title.textContent = 'إضافة منتج جديد';
        categoryGroup.style.display = '';
        priceGroup.style.display = '';
        priceInput.required = true;
    }

    modal.classList.add('active');
}

function resetInvoiceCounter() {
    const counterKey = 'invoiceCounter';
    localStorage.setItem(counterKey, '0');
    showToast('تمت إعادة تعيين عداد الفواتير. الفاتورة التالية ستكون رقم 1', 'success');
}

function closeAdminForm() {
    const modal = document.getElementById('adminFormModal');
    modal.classList.remove('active');
    document.getElementById('adminForm').reset();
    adminFormMode = null;
    editingCategoryId = null;
}

function saveAdminForm(e) {
    e.preventDefault();

    const nameInput = document.getElementById('adminItemName');
    const imageInput = document.getElementById('adminItemImage');
    const priceInput = document.getElementById('adminProductPrice');
    const categorySelect = document.getElementById('adminProductCategory');

    const name = nameInput.value.trim();
    const imageValue = imageInput.value.trim() || (name ? `${name}.jpg` : '');

    if (!name) return;

    if (adminFormMode === 'category-add') {
        const newCategory = {
            id: Math.max(...categories.map(c => c.id), 0) + 1,
            name: name,
            image: imageValue ? (imageValue.startsWith('images/') ? imageValue : 'images/' + imageValue) : 'images/default.jpg'
        };
        categories.push(newCategory);
        saveData();
        renderCategories();
        renderAdminPanel();
        closeAdminForm();
        return;
    }

    if (adminFormMode === 'category-edit' && editingCategoryId) {
        const category = categories.find(c => c.id === editingCategoryId);
        if (!category) return;
        const oldName = category.name;
        // Update name
        category.name = name;
        if (imageValue) {
            category.image = imageValue.startsWith('images/') ? imageValue : 'images/' + imageValue;
        } else if (category.image) {
            // If the existing image filename contains the old name, update it to the new name
            try {
                const parts = category.image.split('/');
                const filename = parts.pop();
                const idx = filename.lastIndexOf('.');
                const base = idx !== -1 ? filename.substring(0, idx) : filename;
                const ext = idx !== -1 ? filename.substring(idx) : '';
                if (base === oldName) {
                    const newFilename = name + ext;
                    parts.push(newFilename);
                    category.image = parts.join('/');
                }
            } catch (e) {
                // ignore errors and keep existing image
            }
        }
        saveData();
        renderCategories();
        renderAdminPanel();
        closeAdminForm();
        return;
    }

    if (adminFormMode === 'product-add') {
        const categoryId = parseInt(categorySelect.value);
        const basePrice = parseFloat(priceInput.value);
        if (!categoryId || isNaN(basePrice)) return;
        // By default use single size 'عادي'. Use clipboard sizes ONLY if admin explicitly pasted them.
        let sizesForNew = [{ name: 'عادي', price: basePrice }];
        if (adminSizesClipboardUsed) {
            try {
                const clipboard = JSON.parse(localStorage.getItem('sizesClipboard') || 'null');
                if (clipboard && Array.isArray(clipboard) && clipboard.length > 0) {
                    sizesForNew = clipboard.map(s => ({ name: s.name || 'عادي', price: (typeof s.price === 'number' ? s.price : basePrice) }));
                }
            } catch (e) {
                console.error('خطأ عند قراءة الحافظة:', e);
            }
        }

        const newProduct = {
            id: Math.max(...products.map(p => p.id), 0) + 1,
            name: name,
            categoryId: categoryId,
            image: imageValue ? (imageValue.startsWith('images/') ? imageValue : 'images/' + imageValue) : 'images/default.jpg',
            basePrice: basePrice,
            sizes: sizesForNew
        };
        products.push(newProduct);
        saveData();
        renderProducts();
        renderAdminPanel();
        closeAdminForm();
        // reset flag after use so future adds won't auto-apply clipboard
        adminSizesClipboardUsed = false;
    }
}

// Copy current editing product sizes to localStorage clipboard
function copySizes() {
    if (!editingProductId) {
        console.warn('لا يوجد منتج مفتوح للنسخ');
        return;
    }
    const product = products.find(p => p.id === editingProductId);
    if (!product || !product.sizes) {
        console.warn('لا توجد أحجام للنسخ');
        return;
    }
    try {
        localStorage.setItem('sizesClipboard', JSON.stringify(product.sizes));
        console.log('تم نسخ الأحجام إلى الحافظة');
    } catch (e) {
        console.error(e);
        console.error('تعذر نسخ الأحجام');
    }
}

// Paste clipboard sizes into current edit product and re-render
function pasteSizesIntoEdit() {
    if (!editingProductId) {
        console.warn('لا يوجد منتج مفتوح للصق');
        return;
    }
    try {
        const clipboard = JSON.parse(localStorage.getItem('sizesClipboard') || 'null');
        if (!clipboard || !Array.isArray(clipboard) || clipboard.length === 0) {
            console.warn('لا توجد أحجام في الحافظة');
            return;
        }
        const product = products.find(p => p.id === editingProductId);
        product.sizes = clipboard.map(s => ({ name: s.name || 'عادي', price: (typeof s.price === 'number' ? s.price : 0) }));
        renderSizesForEdit(product);
        console.log('تم لصق الأحجام');
    } catch (e) {
        console.error(e);
        console.error('تعذر لصق الأحجام');
    }
}

// Paste sizes into admin add form preview area (doesn't save until form submit)
function pasteSizesIntoAdminForm() {
    try {
        const clipboard = JSON.parse(localStorage.getItem('sizesClipboard') || 'null');
        const preview = document.getElementById('adminSizesPreview');
        if (!clipboard || !Array.isArray(clipboard) || clipboard.length === 0) {
            if (preview) preview.textContent = 'لا توجد أحجام في الحافظة';
            console.warn('لا توجد أحجام في الحافظة');
            return;
        }
        if (preview) {
            preview.innerHTML = clipboard.map(s => `${s.name || 'عادي'}: ${formatPrice(typeof s.price === 'number' ? s.price : 0)}`).join(' · ');
        }
        // mark that admin explicitly pasted sizes (so saveAdminForm will use them)
        adminSizesClipboardUsed = true;
        console.log('تم لصق المعاينة في النموذج');
    } catch (e) {
        console.error(e);
        console.error('تعذر لصق الأحجام في النموذج');
    }
}

function renderAdminPanel() {
    const categorySelect = document.getElementById('categorySelect');
    if (!categorySelect) return;
    
    const previouslySelected = categorySelect.value ? parseInt(categorySelect.value) : null;
    categorySelect.innerHTML = '';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });

    if (categories.length > 0) {
        const stillExists = categories.some(c => c.id === previouslySelected);
        categorySelect.value = stillExists ? previouslySelected : categories[0].id;
    }
    
    // Render categories in admin
    const adminCategoriesList = document.getElementById('adminCategoriesList');
    if (adminCategoriesList) {
        adminCategoriesList.innerHTML = '';
        categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category-item';
            categoryDiv.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${category.name}</div>
                    <div class="item-image">${category.image}</div>
                </div>
                <div class="item-actions">
                    <button class="edit-btn" onclick="editCategory(${category.id})">تعديل</button>
                    <button class="delete-btn" onclick="deleteCategory(${category.id})">حذف</button>
                </div>
            `;
            adminCategoriesList.appendChild(categoryDiv);
        });
    }
    
    // Render products in admin
    const categoryId = parseInt(categorySelect.value);
    const adminProductsList = document.getElementById('adminProductsList');
    if (adminProductsList) {
        const filteredProducts = products.filter(p => p.categoryId === categoryId);
        adminProductsList.innerHTML = '';
        if (filteredProducts.length === 0) {
            adminProductsList.innerHTML = `<p style="text-align:center;color:#999;padding:15px;">لا توجد منتجات في هذا القسم</p>`;
            return;
        }
        filteredProducts.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product-item';
            const sizeCount = product.sizes ? product.sizes.length : 0;
            
            let sizesHTML = '';
            if (product.sizes && product.sizes.length > 0) {
                sizesHTML = '<div class="sizes-list">';
                product.sizes.forEach((size, idx) => {
                    sizesHTML += `
                        <div class="size-row">
                            <span>${size.name} - ${formatPrice(size.price)}</span>
                            <div class="size-actions">
                                <button class="edit-btn" style="padding: 4px 8px; font-size: 12px;" onclick="editSize(${product.id}, ${idx})">تعديل</button>
                                <button class="delete-btn" style="padding: 4px 8px; font-size: 12px;" onclick="deleteSize(${product.id}, ${idx})">حذف</button>
                            </div>
                        </div>
                    `;
                });
                sizesHTML += '</div>';
            }
            
            const currentCategory = categories.find(c => c.id === product.categoryId);
            const categoryName = currentCategory ? currentCategory.name : 'غير محدد';
            
            const badgeLabels = { 'new': '🟢 جديد', 'best': '🔴 الأكثر مبيعاً', 'offer': '🟡 عرض خاص' };
            const badgeText = product.badge && badgeLabels[product.badge] ? ` | الشارة: ${badgeLabels[product.badge]}` : '';
            
            productDiv.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${product.name}</div>
                    <div class="item-image">القسم: ${categoryName} | السعر: ${formatPrice(product.basePrice)} | المقاسات: ${formatNumber(sizeCount)}${badgeText}</div>
                    ${sizesHTML}
                </div>
                <div class="item-actions">
                    <button class="edit-btn" onclick="editProduct(${product.id})">تعديل</button>
                    <button class="add-btn" onclick="addSizeToProduct(${product.id})">+ إضافة حجم</button>
                    <button class="delete-btn" onclick="deleteProduct(${product.id})">حذف</button>
                </div>
            `;
            adminProductsList.appendChild(productDiv);
        });
    }
}

function addCategory() {
    openAdminForm('category-add');
}

function addProduct() {
    openAdminForm('product-add');
}

function editCategory(categoryId) {
    openAdminForm('category-edit', categoryId);
}

function deleteCategory(categoryId) {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    
    categories = categories.filter(c => c.id !== categoryId);
    products = products.filter(p => p.categoryId !== categoryId);
    saveData();
    renderCategories();
    renderProducts();
    renderAdminPanel();
    showToast('تم الحذف بنجاح', 'success');
}

function editProduct(productId) {
    openEditProductModal(productId);
}

function openEditProductModal(productId) {
    const product = products.find(p => p.id === productId);
    console.log('openEditProductModal called for id', productId, 'found:', !!product);
    if (!product) return;

    editingProductId = productId;

    // ملء بيانات النموذج
    const nameInput = document.getElementById('productName');
    if (nameInput) nameInput.value = product.name;

    // ملء الشارة
    const badgeSelect = document.getElementById('productBadge');
    if (badgeSelect) badgeSelect.value = product.badge || '';

    // ملء قائمة الأقسام
    const categorySelect = document.getElementById('productCategory');
    if (categorySelect) {
        categorySelect.innerHTML = '';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            if (cat.id === product.categoryId) {
                option.selected = true;
            }
            categorySelect.appendChild(option);
        });
    } else {
        console.warn('productCategory select not found in DOM');
    }

    // عرض الأحجام والأسعار
    renderSizesForEdit(product);

    // أغلق لوحة الإدارة إذا كانت مفتوحة ثم افتح نموذج التعديل
    if (typeof closeAdminModal === 'function') closeAdminModal();
    const modal = document.getElementById('editProductModal');
    if (modal) modal.classList.add('active');
}

function renderSizesForEdit(product) {
    const sizesList = document.getElementById('editSizesList');
    if (!sizesList) {
        console.warn('editSizesList container not found in DOM');
        return;
    }
    sizesList.innerHTML = '';
    sizesList.style.display = '';
    
    if (!product.sizes || product.sizes.length === 0) {
        product.sizes = [{ name: 'افتراضي', price: product.basePrice }];
    }
    console.log('renderSizesForEdit for product', product.id, 'sizes:', product.sizes);
    // عرض رسالة توضيحية داخل النموذج
    const infoLine = document.createElement('div');
    infoLine.style.fontSize = '13px';
    infoLine.style.color = '#7a5a40';
    infoLine.style.marginBottom = '8px';
    infoLine.textContent = `عدد الأحجام: ${product.sizes.length}`;
    sizesList.appendChild(infoLine);
    
    product.sizes.forEach((size, index) => {
        const sizeRow = document.createElement('div');
        sizeRow.className = 'size-row';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'delete-size-btn';
        deleteBtn.textContent = '✕';
        deleteBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            product.sizes.splice(index, 1);
            renderSizesForEdit(product);
        };
        
        const sizeNameInput = document.createElement('input');
        sizeNameInput.type = 'text';
        sizeNameInput.placeholder = 'المقاس';
        sizeNameInput.value = size.name;
        sizeNameInput.oninput = (e) => {
            product.sizes[index].name = e.target.value;
        };
        
        const priceInput = document.createElement('input');
        priceInput.type = 'number';
        priceInput.step = '0.01';
        priceInput.placeholder = 'السعر';
        priceInput.value = size.price;
        priceInput.oninput = (e) => {
            product.sizes[index].price = parseFloat(e.target.value) || 0;
        };
        
        sizeRow.appendChild(deleteBtn);
        sizeRow.appendChild(sizeNameInput);
        sizeRow.appendChild(priceInput);
        sizesList.appendChild(sizeRow);
    });

    // إذا لم تكن هناك أحجام بعد العرض، أظهر رسالة واضحة
    if (product.sizes.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.textContent = 'لا توجد أحجام. اضغط "أضف حجم أخر" لإضافة حجم جديد.';
        emptyMsg.style.color = '#b35050';
        emptyMsg.style.marginTop = '8px';
        sizesList.appendChild(emptyMsg);
    }
}

function addNewSize() {
    if (!editingProductId) {
        console.log('لا يوجد منتج يتم تحريره');
        return;
    }
    
    const product = products.find(p => p.id === editingProductId);
    if (!product) {
        console.log('لم يتم العثور على المنتج');
        return;
    }
    
    if (!product.sizes) {
        product.sizes = [];
    }
    
    product.sizes.push({ name: '', price: 0 });
    renderSizesForEdit(product);
}

function closeEditProductModal() {
    const modal = document.getElementById('editProductModal');
    modal.classList.remove('active');
    document.getElementById('editProductForm').reset();
    editingProductId = null;
}

function saveEditedProduct(e) {
    e.preventDefault();
    
    if (!editingProductId) {
        showToast('خطأ: لم يتم تحديد المنتج', 'error');
        return;
    }
    
    const product = products.find(p => p.id === editingProductId);
    if (!product) return;
    
    const newName = document.getElementById('productName').value.trim();
    const newCategoryId = parseInt(document.getElementById('productCategory').value);
    
    // التحقق من البيانات
    if (!newName) {
        showToast('يجب إدخال اسم المنتج', 'error');
        return;
    }
    
    if (!categories.find(c => c.id === newCategoryId)) {
        showToast('يجب اختيار قسم صحيح', 'error');
        return;
    }
    
    if (!product.sizes || product.sizes.length === 0) {
        showToast('يجب إضافة حجم واحد على الأقل', 'error');
        return;
    }
    
    // تحديث بيانات المنتج
    const oldProductName = product.name;
    product.name = newName;
    product.categoryId = newCategoryId;
    product.basePrice = product.sizes[0].price;
    
    // تحديث الشارة
    const badgeSelect = document.getElementById('productBadge');
    if (badgeSelect) {
        product.badge = badgeSelect.value || '';
    }

    // If product has an image whose filename equals the old product name, update it to the new name
    if (product.image) {
        try {
            const parts = product.image.split('/');
            const filename = parts.pop();
            const idx = filename.lastIndexOf('.');
            const base = idx !== -1 ? filename.substring(0, idx) : filename;
            const ext = idx !== -1 ? filename.substring(idx) : '';
            if (base === oldProductName) {
                const newFilename = newName + ext;
                parts.push(newFilename);
                product.image = parts.join('/');
            }
        } catch (e) {
            // ignore and keep existing image
        }
    }
    
    saveData();
    renderProducts();
    renderAdminPanel();
    closeEditProductModal();
}

function deleteProduct(productId) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    
    products = products.filter(p => p.id !== productId);
    saveData();
    renderProducts();
    renderAdminPanel();
    showToast('تم الحذف بنجاح', 'success');
}

function addSizeToProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const sizeName = prompt('أدخل اسم المقاس:');
    if (!sizeName) return;
    
    const price = parseFloat(prompt('أدخل السعر:'));
    if (isNaN(price)) return;
    
    if (!product.sizes) {
        product.sizes = [];
    }
    
    product.sizes.push({ name: sizeName, price: price });
    saveData();
    renderProducts();
    renderAdminPanel();
    showToast('تم إضافة المقاس بنجاح', 'success');
}

function editSize(productId, sizeIndex) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.sizes || !product.sizes[sizeIndex]) return;
    
    const currentSize = product.sizes[sizeIndex];
    const newName = prompt('أدخل اسم المقاس الجديد:', currentSize.name);
    if (!newName) return;
    
    const newPrice = parseFloat(prompt('أدخل السعر الجديد:', currentSize.price));
    if (isNaN(newPrice)) return;
    
    product.sizes[sizeIndex] = { name: newName, price: newPrice };
    saveData();
    renderProducts();
    renderAdminPanel();
    showToast('تم تعديل المقاس بنجاح', 'success');
}

function deleteSize(productId, sizeIndex) {
    if (!confirm('هل أنت متأكد من حذف هذا المقاس؟')) return;
    
    const product = products.find(p => p.id === productId);
    if (!product || !product.sizes) return;
    
    product.sizes.splice(sizeIndex, 1);
    saveData();
    renderProducts();
    renderAdminPanel();
    showToast('تم حذف المقاس بنجاح', 'success');
}
// Update UI System Messages when language changes
function updateUIMessages(lang) {
    if (!window.getSystemMessage) return;
    
    // Update cart label
    const cartLabel = document.getElementById('cartLabel');
    if (cartLabel) {
        cartLabel.textContent = window.getSystemMessage('cartLabel', lang);
    }
    
    // Update cart title and subtitle if modal is open
    const cartTitle = document.getElementById('cartTitle');
    if (cartTitle) {
        cartTitle.textContent = window.getSystemMessage('cartTitle', lang);
    }
    
    const cartSubtitle = document.querySelector('.cart-subtitle');
    if (cartSubtitle) {
        cartSubtitle.textContent = window.getSystemMessage('cartSubtitle', lang);
    }
    
    // Update total label
    const totalLabel = document.getElementById('totalLabel');
    if (totalLabel) {
        totalLabel.textContent = window.getSystemMessage('totalLabel', lang) + ':';
    }
    
    // Update pay button
    const payBtn = document.getElementById('payBtn');
    if (payBtn) {
        payBtn.textContent = window.getSystemMessage('payBtn', lang);
    }
    
    // Update admin title
    const adminTitle = document.getElementById('adminTitle');
    if (adminTitle) {
        adminTitle.textContent = window.getSystemMessage('adminTitle', lang);
    }
    
    // Update categories manage title
    const categoriesManageTitle = document.getElementById('categoriesManageTitle');
    if (categoriesManageTitle) {
        categoriesManageTitle.textContent = window.getSystemMessage('categoriesManageTitle', lang);
    }
    
    // Update products manage title
    const productsManageTitle = document.getElementById('productsManageTitle');
    if (productsManageTitle) {
        productsManageTitle.textContent = window.getSystemMessage('productsManageTitle', lang);
    }
}

// Monitor language changes and update UI
const originalUpdateSystemMessages = window.updateSystemMessages;
window.updateSystemMessages = function(lang) {
    if (originalUpdateSystemMessages) {
        originalUpdateSystemMessages(lang);
    }
    updateUIMessages(lang);
};

// === Toast Notifications ===
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// === Grid/List View Toggle ===
function setupViewToggle() {
    const btn = document.getElementById('viewToggleBtn');
    if (!btn) return;
    
    // Restore saved preference
    const saved = localStorage.getItem('viewMode');
    if (saved === 'list') {
        document.getElementById('productsContainer').classList.add('list-view');
        btn.textContent = '▦';
        btn.title = 'عرض شبكي';
    }
    
    btn.addEventListener('click', function() {
        const container = document.getElementById('productsContainer');
        const isList = container.classList.toggle('list-view');
        btn.textContent = isList ? '▦' : '☰';
        btn.title = isList ? 'عرض شبكي' : 'عرض قائمة';
        localStorage.setItem('viewMode', isList ? 'list' : 'grid');
    });
}

// === Scroll to Top ===
function setupScrollToTop() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
    
    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}