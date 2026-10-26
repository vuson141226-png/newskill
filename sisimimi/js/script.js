/* =====================================================
   SISIMIMI — JavaScript thuần cho website bài tập nhóm
   Dữ liệu mẫu chỉ dùng trình diễn, không có máy chủ.
   ===================================================== */

// PHẦN 1. DỮ LIỆU SẢN PHẨM
// Mỗi object mô tả một sản phẩm. id phải là số và không trùng nhau.
const products = [
    { id: 1, code: 'SI001', name: 'Vòng cổ mèo nơ hồng', price: 89000, category: 'phu-kien', image: 'images/product-1.svg', description: 'Một chiếc nơ nhỏ xinh cho những buổi dạo chơi cùng bé.', features: 'Khóa an toàn, điều chỉnh được độ rộng', material: 'Vải cotton và khóa nhựa', color: 'Hồng pastel', size: 'Vòng cổ 18–28 cm' },
    { id: 2, code: 'SI002', name: 'Áo hoodie cho chó', price: 159000, category: 'quan-ao', image: 'images/product-2.svg', description: 'Chiếc áo mềm mại giúp bé ấm áp khi thời tiết se lạnh.', features: 'Mũ liền áo, dễ mặc và tháo', material: 'Nỉ cotton mềm', color: 'Hồng phấn', size: 'S / M / L; liên hệ để chọn cỡ' },
    { id: 3, code: 'SI003', name: 'Bát ăn hình gấu', price: 129000, category: 'phu-kien', image: 'images/product-3.svg', description: 'Góc ăn uống đáng yêu hơn với chiếc bát hình gấu.', features: 'Đế chống trượt, dễ vệ sinh', material: 'Gốm phủ men', color: 'Kem', size: 'Đường kính 14 cm' },
    { id: 4, code: 'SI004', name: 'Đồ chơi bóng len', price: 49000, category: 'do-choi', image: 'images/product-4.svg', description: 'Quả bóng nhỏ cho mèo đuổi bắt và vận động mỗi ngày.', features: 'Nhẹ, mềm; dùng khi có người giám sát', material: 'Sợi cotton', color: 'Hồng và kem', size: 'Đường kính 6 cm' },
    { id: 5, code: 'SI005', name: 'Giường ngủ cho mèo', price: 329000, category: 'phu-kien', image: 'images/product-5.svg', description: 'Chiếc tổ êm ái dành cho những giấc ngủ tròn xoe.', features: 'Đệm tháo rời, đáy chống trượt', material: 'Vải nhung và bông', color: 'Hồng sữa', size: '45 × 40 × 18 cm' },
    { id: 6, code: 'SI006', name: 'Túi vận chuyển thú cưng', price: 459000, category: 'phu-kien', image: 'images/product-6.svg', description: 'Đưa bé đi khám hay đi chơi thật gọn gàng và thoải mái.', features: 'Cửa lưới thoáng khí, dây đeo chỉnh được', material: 'Vải polyester và lưới', color: 'Kem hồng', size: '42 × 25 × 28 cm; tối đa 5 kg' },
    { id: 7, code: 'SI007', name: 'Lược chải lông', price: 79000, category: 'phu-kien', image: 'images/product-7.svg', description: 'Chải lông nhẹ nhàng cũng là một cách dành thời gian bên bé.', features: 'Đầu răng tròn, tay cầm dễ nắm', material: 'Nhựa ABS và răng thép đầu tròn', color: 'Hồng pastel', size: 'Dài 17 cm' },
    { id: 8, code: 'SI008', name: 'Snack thưởng cho chó', price: 65000, category: 'thuc-an', image: 'images/product-8.svg', description: 'Một phần thưởng nhỏ sau những bài tập vui cùng bé.', features: 'Thức ăn bổ sung; không thay thế bữa chính', material: 'Thịt gà và tinh bột (mô tả mẫu)', color: 'Bao bì hồng', size: 'Gói 80 g' },
    { id: 9, code: 'SI009', name: 'Hạt dinh dưỡng cho mèo', price: 189000, category: 'thuc-an', image: 'images/product-9.svg', description: 'Bữa ăn mỗi ngày cho mèo trưởng thành với hạt vừa miệng.', features: 'Tham khảo khẩu phần trên bao bì, luôn có nước sạch', material: 'Cá, thịt và ngũ cốc (mô tả mẫu)', color: 'Bao bì kem hồng', size: 'Túi 1 kg' },
    { id: 10, code: 'SI010', name: 'Cần câu lông vũ', price: 59000, category: 'do-choi', image: 'images/product-10.svg', description: 'Cùng bé mèo bật nhảy và khám phá một trò chơi mới.', features: 'Cán nhẹ; cất sau khi chơi, không để bé nuốt lông', material: 'Gỗ, dây cotton và lông nhân tạo', color: 'Hồng và trắng', size: 'Cán dài 40 cm' },
    { id: 11, code: 'SI011', name: 'Áo yếm hoa nhí', price: 139000, category: 'quan-ao', image: 'images/product-11.svg', description: 'Một chút điệu đà cho những bức ảnh cuối tuần của bé.', features: 'Vải thoáng, dây cài dễ điều chỉnh', material: 'Cotton họa tiết hoa', color: 'Kem và hồng', size: 'S / M / L; đo vòng ngực trước khi chọn' },
    { id: 12, code: 'SI012', name: 'Pate cá ngừ cho mèo', price: 35000, category: 'thuc-an', image: 'images/product-12.svg', description: 'Thêm một lựa chọn mềm ngon cho thực đơn của mèo.', features: 'Thức ăn bổ sung; bảo quản lạnh sau khi mở', material: 'Cá ngừ và nước dùng (mô tả mẫu)', color: 'Bao bì hồng', size: 'Hộp 85 g' }
];

const categoryNames = {
    'thuc-an': 'Thức ăn',
    'do-choi': 'Đồ chơi',
    'quan-ao': 'Quần áo',
    'phu-kien': 'Phụ kiện'
};

function formatPrice(price) {
    return price.toLocaleString('vi-VN') + ' ₫';
}

function findProduct(id) {
    return products.find(function (product) {
        return product.id === id;
    });
}

// PHẦN 2. HIỂN THỊ THẺ SẢN PHẨM
// innerHTML ở đây chỉ ghép dữ liệu mẫu do chúng ta viết, không ghép nội dung người dùng.
function productCard(product) {
    return '<article class="product-card">' +
        '<a class="product-image" href="product-detail.html?id=' + product.id + '">' +
        '<img src="' + product.image + '" alt="Minh họa ' + product.name + '" width="400" height="400" loading="lazy"></a>' +
        '<div class="product-info"><p class="product-category">' + categoryNames[product.category] + ' · ' + product.code + '</p>' +
        '<h3><a href="product-detail.html?id=' + product.id + '">' + product.name + '</a></h3>' +
        '<p class="product-description">' + product.description + '</p>' +
        '<p class="product-feature">' + product.features + '</p>' +
        '<p class="product-price">' + formatPrice(product.price) + '</p>' +
        '<div class="product-actions"><a class="button button-outline" href="product-detail.html?id=' + product.id + '">Xem chi tiết</a>' +
        '<button class="button" type="button" data-add="' + product.id + '">Thêm vào giỏ</button></div></div></article>';
}

const featuredProducts = document.getElementById('featured-products');
if (featuredProducts) {
    featuredProducts.innerHTML = products.slice(0, 4).map(productCard).join('');
}

// PHẦN 3 VÀ 4. TÌM KIẾM KẾT HỢP LỌC DANH MỤC
const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-button');
const requestedCategory = new URLSearchParams(window.location.search).get('category');
let selectedCategory = categoryNames[requestedCategory] ? requestedCategory : 'all';

function normalizedText(value) {
    // Bỏ dấu để gõ "vong co" vẫn tìm thấy "Vòng cổ".
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
}

function renderProducts() {
    if (!productGrid) return;
    const keyword = searchInput ? normalizedText(searchInput.value.trim()) : '';
    const visibleProducts = products.filter(function (product) {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesKeyword = normalizedText(product.name).includes(keyword);
        return matchesCategory && matchesKeyword;
    });
    productGrid.innerHTML = visibleProducts.map(productCard).join('');
    const resultCount = document.getElementById('result-count');
    const noProducts = document.getElementById('no-products');
    if (resultCount) resultCount.textContent = visibleProducts.length + ' sản phẩm dành cho bé';
    if (noProducts) noProducts.hidden = visibleProducts.length !== 0;
    filterButtons.forEach(function (button) {
        const active = button.dataset.category === selectedCategory;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
    });
}

if (searchInput) searchInput.addEventListener('input', renderProducts);
filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        selectedCategory = button.dataset.category;
        renderProducts();
    });
});
renderProducts();

// PHẦN 5. CHI TIẾT SẢN PHẨM THEO ID TRÊN URL
const detailContainer = document.getElementById('product-detail');
let detailQuantity = 1;
let detailProduct = null;

if (detailContainer) {
    const productId = Number(new URLSearchParams(window.location.search).get('id'));
    detailProduct = findProduct(productId);
    if (!detailProduct) {
        detailContainer.innerHTML = '<div class="empty-state"><h1>Không tìm thấy sản phẩm</h1><p>Mã sản phẩm chưa có trong cửa hàng. Mời bạn xem các món đồ khác nhé.</p><a class="button" href="products.html">Xem sản phẩm</a></div>';
    } else {
        detailContainer.innerHTML = '<div class="detail-layout"><div class="detail-image"><img src="' + detailProduct.image + '" alt="Minh họa ' + detailProduct.name + '" width="600" height="600"></div>' +
            '<div class="detail-info"><p class="eyebrow">' + categoryNames[detailProduct.category] + ' · ' + detailProduct.code + '</p>' +
            '<h1>' + detailProduct.name + '</h1><p class="detail-price">' + formatPrice(detailProduct.price) + '</p><p>' + detailProduct.description + '</p>' +
            '<dl class="product-specs"><dt>Đặc điểm</dt><dd>' + detailProduct.features + '</dd><dt>Chất liệu / thành phần</dt><dd>' + detailProduct.material + '</dd><dt>Màu sắc</dt><dd>' + detailProduct.color + '</dd><dt>Kích thước / khối lượng</dt><dd>' + detailProduct.size + '</dd></dl>' +
            '<p>Hình ảnh minh họa. Hãy chọn kích thước và sản phẩm phù hợp với bé trước khi mua.</p>' +
            '<div class="detail-purchase"><div class="quantity-control"><button type="button" id="detail-minus" aria-label="Giảm số lượng" disabled>−</button><span id="detail-quantity" aria-live="polite">1</span><button type="button" id="detail-plus" aria-label="Tăng số lượng">+</button></div><button type="button" class="button" id="detail-add">Thêm vào giỏ</button></div><a class="text-link" href="contact.html">Cần tư vấn? Nhắn chúng mình nhé →</a></div></div>';
        document.getElementById('detail-minus').addEventListener('click', function () { changeDetailQuantity(-1); });
        document.getElementById('detail-plus').addEventListener('click', function () { changeDetailQuantity(1); });
        document.getElementById('detail-add').addEventListener('click', function () { addToCart(detailProduct.id, detailQuantity); });
    }
}

function changeDetailQuantity(change) {
    detailQuantity = Math.max(1, Math.min(99, detailQuantity + change));
    document.getElementById('detail-quantity').textContent = detailQuantity;
    document.getElementById('detail-minus').disabled = detailQuantity === 1;
    document.getElementById('detail-plus').disabled = detailQuantity === 99;
}

// PHẦN 6. GIỎ HÀNG DÙNG CHUNG CHO MỌI TRANG
// Chỉ lưu id và quantity, không lưu giá hoặc dữ liệu cá nhân.
const cartKey = 'sisimimi-cart';
let cart = [];
let storageAvailable = true;

function readCart() {
    cart = [];
    try {
        const savedCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
        if (!Array.isArray(savedCart)) return;
        savedCart.forEach(function (item) {
            if (!item || !Number.isInteger(item.id) || !Number.isInteger(item.quantity)) return;
            if (!findProduct(item.id) || item.quantity < 1) return;
            const existing = cart.find(function (row) { return row.id === item.id; });
            if (existing) existing.quantity = Math.min(99, existing.quantity + item.quantity);
            else cart.push({ id: item.id, quantity: Math.min(99, item.quantity) });
        });
        storageAvailable = true;
    } catch (error) {
        // JSON lỗi hoặc trình duyệt chặn lưu trữ: trang vẫn hoạt động.
        storageAvailable = false;
    }
}

function saveCart() {
    try {
        localStorage.setItem(cartKey, JSON.stringify(cart));
        storageAvailable = true;
    } catch (error) {
        storageAvailable = false;
    }
    updateCartCount();
}

function totalQuantity() {
    let quantity = 0;
    cart.forEach(function (item) { quantity += item.quantity; });
    return quantity;
}

function cartTotal() {
    let total = 0;
    cart.forEach(function (item) { total += findProduct(item.id).price * item.quantity; });
    return total;
}

function updateCartCount() {
    document.querySelectorAll('.cart-count').forEach(function (badge) {
        badge.textContent = totalQuantity();
        const link = badge.closest('a');
        if (link) link.setAttribute('aria-label', 'Giỏ hàng, ' + totalQuantity() + ' sản phẩm');
    });
}

function addToCart(id, quantity) {
    if (!findProduct(id) || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) return;
    const existing = cart.find(function (item) { return item.id === id; });
    if (existing && existing.quantity + quantity > 99) {
        showToast('Mỗi sản phẩm tối đa 99 món. Bạn kiểm tra lại giỏ nhé!');
        return;
    }
    if (existing) existing.quantity += quantity;
    else cart.push({ id: id, quantity: quantity });
    saveCart();
    renderCart();
    showToast(storageAvailable ? 'Đã thêm ' + findProduct(id).name + ' vào giỏ!' : 'Đã thêm trong trang này. Trình duyệt đang chặn lưu giỏ khi chuyển trang.');
}

function renderCart() {
    const container = document.getElementById('cart-content');
    const summary = document.getElementById('cart-summary');
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-state"><span class="empty-icon" aria-hidden="true">♡</span><h2>Giỏ nhỏ đang chờ những món xinh</h2><p>Cùng chọn một món quà cho bé yêu nhé!</p><a class="button" href="products.html">Khám phá sản phẩm</a></div>';
        if (summary) { summary.innerHTML = ''; summary.hidden = true; }
        return;
    }
    container.innerHTML = cart.map(function (item) {
        const product = findProduct(item.id);
        return '<article class="cart-row"><a href="product-detail.html?id=' + product.id + '"><img src="' + product.image + '" alt="' + product.name + '" width="100" height="100"></a>' +
            '<div class="cart-item-info"><h2><a href="product-detail.html?id=' + product.id + '">' + product.name + '</a></h2><p>Đơn giá: ' + formatPrice(product.price) + '</p>' +
            '<div class="quantity-control"><button type="button" data-cart-change="-1" data-id="' + product.id + '" aria-label="Giảm số lượng ' + product.name + '" ' + (item.quantity === 1 ? 'disabled' : '') + '>−</button><span aria-label="Số lượng">' + item.quantity + '</span><button type="button" data-cart-change="1" data-id="' + product.id + '" aria-label="Tăng số lượng ' + product.name + '" ' + (item.quantity === 99 ? 'disabled' : '') + '>+</button></div></div>' +
            '<div class="cart-item-end"><strong>' + formatPrice(product.price * item.quantity) + '</strong><button type="button" class="remove-item" data-remove="' + product.id + '" aria-label="Xóa ' + product.name + '">Xóa</button></div></article>';
    }).join('');
    if (summary) {
        summary.hidden = false;
        summary.innerHTML = '<h2>Chiếc giỏ yêu thương</h2><div class="summary-line"><span>Tổng số lượng</span><strong>' + totalQuantity() + '</strong></div><div class="summary-line"><span>Tạm tính</span><strong>' + formatPrice(cartTotal()) + '</strong></div><div class="summary-line"><span>Vận chuyển</span><span>0 ₫ (minh họa)</span></div><div class="summary-line summary-total"><span>Tổng cộng</span><strong>' + formatPrice(cartTotal()) + '</strong></div><button type="button" class="button" id="checkout-button">Tiến hành thanh toán</button><p class="muted">Đặt hàng mô phỏng cho bài tập. Không thu tiền hoặc giao hàng thật.</p><a class="text-link" href="products.html">Tiếp tục mua sắm →</a>';
    }
}

// Ủy quyền sự kiện: nút được tạo lại sau mỗi lần render vẫn bấm được.
document.addEventListener('click', function (event) {
    const addButton = event.target.closest('[data-add]');
    if (addButton) addToCart(Number(addButton.dataset.add), 1);
    const changeButton = event.target.closest('[data-cart-change]');
    if (changeButton) {
        const item = cart.find(function (row) { return row.id === Number(changeButton.dataset.id); });
        if (item) {
            item.quantity = Math.max(1, Math.min(99, item.quantity + Number(changeButton.dataset.cartChange)));
            saveCart();
            renderCart();
            const replacement = document.querySelector('[data-cart-change="' + changeButton.dataset.cartChange + '"][data-id="' + item.id + '"]');
            const opposite = document.querySelector('[data-cart-change="' + (-Number(changeButton.dataset.cartChange)) + '"][data-id="' + item.id + '"]');
            const nextFocus = replacement && !replacement.disabled ? replacement : opposite;
            if (nextFocus) nextFocus.focus({ preventScroll: true });
            showToast('Đã cập nhật giỏ hàng.');
        }
    }
    const removeButton = event.target.closest('[data-remove]');
    if (removeButton) {
        cart = cart.filter(function (item) { return item.id !== Number(removeButton.dataset.remove); });
        saveCart();
        renderCart();
        const nextFocus = document.querySelector('[data-remove]') || document.querySelector('#cart-content .button');
        if (nextFocus) nextFocus.focus({ preventScroll: true });
        showToast('Đã xóa sản phẩm khỏi giỏ.');
    }
    if (event.target.closest('#checkout-button') && cart.length > 0) {
        const checkoutSummary = document.getElementById('checkout-summary');
        if (checkoutSummary) checkoutSummary.textContent = totalQuantity() + ' sản phẩm · Tổng tiền minh họa: ' + formatPrice(cartTotal());
        const dialog = document.getElementById('checkout-dialog');
        if (dialog) dialog.showModal();
    }
});

const checkoutDialog = document.getElementById('checkout-dialog');
const closeCheckout = document.getElementById('close-checkout');
const confirmCheckout = document.getElementById('confirm-checkout');
if (closeCheckout && checkoutDialog) closeCheckout.addEventListener('click', function () { checkoutDialog.close(); });
if (confirmCheckout && checkoutDialog) {
    confirmCheckout.addEventListener('click', function () {
        cart = [];
        saveCart();
        renderCart();
        checkoutDialog.close();
        showToast('Đã xác nhận đơn hàng mô phỏng. Không có giao dịch hoặc đơn hàng thật.');
    });
}
if (checkoutDialog) checkoutDialog.addEventListener('close', function () {
    const button = document.getElementById('checkout-button') || document.querySelector('#cart-content .button');
    if (button) button.focus();
});
window.addEventListener('storage', function (event) {
    if (event.key === cartKey || event.key === null) { readCart(); updateCartCount(); renderCart(); }
});
readCart();
updateCartCount();
renderCart();

// PHẦN 7. CHUYỂN FORM ĐĂNG NHẬP / ĐĂNG KÝ
document.querySelectorAll('.auth-tab').forEach(function (button) {
    button.addEventListener('click', function () {
        const register = button.dataset.form === 'register';
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        if (loginForm) loginForm.hidden = register;
        if (registerForm) registerForm.hidden = !register;
        document.querySelectorAll('.auth-tab').forEach(function (tab) {
            const active = tab === button;
            tab.classList.toggle('active', active);
            tab.setAttribute('aria-pressed', String(active));
        });
    });
});

// PHẦN 8 VÀ 9. KIỂM TRA FORM MÔ PHỎNG
// Không gửi dữ liệu ra mạng và không ghi thông tin cá nhân vào localStorage.
document.querySelectorAll('.demo-form').forEach(function (form) {
    form.noValidate = true;
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = false;
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const fields = form.querySelectorAll('input, select, textarea');
        const message = form.querySelector('.form-message');
        let firstInvalid = null;
        fields.forEach(function (field) {
            field.setCustomValidity('');
            field.removeAttribute('aria-invalid');
            if (field.type !== 'file' && field.required && !field.value.trim()) {
                field.setCustomValidity('Vui lòng nhập nội dung, không chỉ có khoảng trắng.');
            }
            if (field.type === 'tel' && field.value && !/^(\+84|0)[0-9]{9}$/.test(field.value.replace(/[\s.-]/g, ''))) {
                field.setCustomValidity('Nhập số điện thoại Việt Nam gồm 10 số, bắt đầu bằng 0, hoặc dùng +84.');
            }
            if (field.type === 'password' && field.value.length < 6) {
                field.setCustomValidity('Mật khẩu minh họa cần ít nhất 6 ký tự.');
            }
            if (field.name === 'confirmPassword') {
                const password = form.querySelector('[name="password"]');
                if (password && field.value !== password.value) field.setCustomValidity('Mật khẩu xác nhận chưa khớp.');
            }
            if (field.type === 'file' && field.files.length > 0) {
                const file = field.files[0];
                if (file.size > 5 * 1024 * 1024) field.setCustomValidity('Chọn CV không quá 5 MB.');
                if (!/\.(pdf|doc|docx)$/i.test(file.name)) field.setCustomValidity('Chọn tệp PDF, DOC hoặc DOCX.');
            }
            if (!field.checkValidity()) {
                field.setAttribute('aria-invalid', 'true');
                if (!firstInvalid) firstInvalid = field;
            }
        });
        if (firstInvalid) {
            if (message) { message.textContent = 'Bạn kiểm tra lại: ' + firstInvalid.validationMessage; message.classList.add('is-error'); }
            firstInvalid.focus();
            return;
        }
        let feedback = 'Biểu mẫu hợp lệ! Đây là gửi liên hệ mô phỏng; chưa có email hay dữ liệu nào được gửi đi.';
        if (form.id === 'application-form') feedback = 'Hồ sơ hợp lệ! Đây là ứng tuyển mô phỏng; CV không được tải lên máy chủ.';
        if (form.id === 'login-form') feedback = 'Thông tin hợp lệ! Đăng nhập mô phỏng; chưa xác thực hoặc tạo phiên tài khoản thật.';
        if (form.id === 'register-form') feedback = 'Thông tin hợp lệ! Đăng ký mô phỏng; chưa tạo tài khoản và không lưu mật khẩu.';
        if (message) { message.textContent = feedback; message.classList.remove('is-error'); }
        form.reset();
    });
    form.addEventListener('input', function (event) {
        if (typeof event.target.setCustomValidity === 'function') {
            event.target.setCustomValidity('');
            event.target.removeAttribute('aria-invalid');
        }
    });
});

document.querySelectorAll('[data-job]').forEach(function (button) {
    button.addEventListener('click', function () {
        const position = document.getElementById('job-position');
        const form = document.getElementById('application-form');
        if (position) position.value = button.dataset.job;
        if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (position) position.focus({ preventScroll: true });
    });
});

// PHẦN 10. BÀI VIẾT VÀ TRANG CHI TIẾT
// Nội dung kiến thức tham khảo, không thay thế lời khuyên của bác sĩ thú y.
const articles = [
    { id: 1, title: 'Cách chăm sóc mèo con mới về nhà', category: 'Chăm sóc mèo', author: 'Mai An', date: '20/10/2026', image: 'images/news-1.svg', intro: 'Một góc nhỏ yên tĩnh, chiếc bát quen và thật nhiều kiên nhẫn: bắt đầu tình bạn mới theo cách nhẹ nhàng.', sections: [
        { heading: 'Chuẩn bị một góc an toàn', text: 'Chọn căn phòng yên tĩnh, đóng cửa sổ và cất dây điện, cây độc, hóa chất. Đặt giường, khay vệ sinh và chỗ ăn riêng; để bát ăn cách xa khay vệ sinh. Một chiếc hộp giấy sạch cũng giúp bé có nơi ẩn nấp khi còn bỡ ngỡ.' },
        { heading: 'Làm quen theo nhịp của bé', text: 'Để mèo tự bước ra khỏi túi vận chuyển. Không kéo bé ra hoặc bế liên tục. Ngồi thấp, nói nhỏ và cho bé thời gian khám phá. Khi nhà có thú cưng khác, cần giới thiệu từ từ và giám sát, không để hai bé gặp nhau ngay lập tức.' },
        { heading: 'Ăn uống và kiểm tra sức khỏe', text: 'Hỏi người chăm trước về loại thức ăn đang dùng, chuyển thức ăn mới từ từ. Luôn có nước sạch; không tự cho uống sữa bò hoặc thuốc của người. Đặt lịch khám thú y để được hướng dẫn lịch tiêm và tẩy ký sinh trùng. Nếu bé bỏ ăn, nôn, tiêu chảy hoặc lờ đờ, liên hệ bác sĩ.' }
    ] },
    { id: 2, title: 'Những món đồ chơi giúp chó vận động', category: 'Chơi cùng bé', author: 'Minh Thư', date: '18/10/2026', image: 'images/news-2.svg', intro: 'Biến thời gian chơi thành những khoảnh khắc kết nối, với đồ chơi vừa kích thước và mức năng lượng của bé.', sections: [
        { heading: 'Chọn đồ chơi vừa miệng', text: 'Đồ chơi cần đủ lớn để chó không nuốt được, nhưng không quá cứng gây tổn thương răng. Kiểm tra đường may và mảnh nhỏ trước mỗi buổi chơi. Bỏ đồ chơi bị rách hoặc bong ra. Không để bé chơi một mình với dây dài hay đồ có chi tiết dễ rời.' },
        { heading: 'Thay đổi trò chơi mỗi ngày', text: 'Có thể xen kẽ ném nhặt bóng ở khu vực an toàn, tìm phần thưởng hoặc kéo co nhẹ. Bắt đầu ngắn, quan sát nhịp thở và cho bé nghỉ. Chó con, chó lớn tuổi và các giống mũi ngắn cần hoạt động phù hợp, đặc biệt tránh thời tiết nóng.' },
        { heading: 'Chơi để hiểu nhau hơn', text: 'Dùng lời khen và phần thưởng nhỏ khi bé làm đúng. Không giật mạnh hoặc ép chơi khi bé lảng tránh. Dọn và vệ sinh đồ chơi theo hướng dẫn. Nếu chưa biết mức vận động thích hợp, hỏi bác sĩ thú y theo tuổi và tình trạng sức khỏe của bé.' }
    ] },
    { id: 3, title: 'Bí quyết chọn thức ăn cho mèo', category: 'Dinh dưỡng', author: 'Khánh Linh', date: '15/10/2026', image: 'images/news-3.svg', intro: 'Đọc nhãn, chọn theo giai đoạn sống và thay đổi từ từ để mỗi bữa ăn của mèo luôn phù hợp.', sections: [
        { heading: 'Đọc nhãn trước khi mua', text: 'Chọn thức ăn ghi rõ dành cho mèo và phù hợp giai đoạn sống. Phân biệt thức ăn hoàn chỉnh với thức ăn bổ sung; snack và pate bổ sung không tự động thay thế bữa chính. Kiểm tra hạn dùng, bao bì nguyên vẹn và hướng dẫn bảo quản.' },
        { heading: 'Thay đổi từ từ và quan sát', text: 'Trộn một phần nhỏ thức ăn mới với thức ăn quen, rồi tăng dần theo hướng dẫn và khả năng dung nạp của bé. Theo dõi phân, da lông và mức ăn uống. Không thay nhiều loại cùng lúc. Nếu xuất hiện dấu hiệu bất thường, ngừng thử và trao đổi với bác sĩ thú y.' },
        { heading: 'Nước sạch luôn cần thiết', text: 'Đặt nước sạch ở nơi yên tĩnh và thay hằng ngày. Đong khẩu phần thay vì đổ đầy liên tục; tính cả phần thưởng trong tổng lượng ăn. Mèo có bệnh thận, tiết niệu, dị ứng hoặc nhu cầu đặc biệt cần chế độ do bác sĩ tư vấn, không tự áp dụng theo bài viết.' }
    ] },
    { id: 4, title: 'Cách giữ vệ sinh cho thú cưng', category: 'Góc chăm sóc', author: 'Mai An', date: '12/10/2026', image: 'images/news-4.svg', intro: 'Một vài thói quen nhỏ giúp góc sống của bé sạch sẽ hơn mà vẫn giữ được sự thoải mái và an toàn.', sections: [
        { heading: 'Chải lông nhẹ nhàng', text: 'Dùng lược phù hợp loại lông, chải từng vùng nhỏ và không kéo rối mạnh. Khen bé khi hợp tác, dừng nếu bé căng thẳng. Không tự cắt sát búi rối bằng kéo. Khi da có vết đỏ, ngứa hoặc rụng lông bất thường, đưa bé đi kiểm tra.' },
        { heading: 'Giữ sạch đồ dùng', text: 'Rửa bát ăn và thay nước mỗi ngày. Dọn khay vệ sinh đều đặn, giặt đệm và đồ vải theo nhãn. Tráng kỹ chất tẩy và để khô trước khi dùng lại. Cất hóa chất xa bé; không trộn các chất tẩy rửa và không dùng sản phẩm có hương mạnh tùy tiện.' },
        { heading: 'Tắm và chăm sóc đúng cách', text: 'Chỉ dùng sản phẩm phù hợp loài và hỏi bác sĩ về tần suất tắm khi cần. Tránh để nước vào tai, lau khô nhẹ nhàng và không sấy quá nóng. Không tự nhỏ thuốc tai, mắt hoặc dùng thuốc trị ve của chó cho mèo. Chăm sóc đều đặn luôn đi cùng quan sát sức khỏe.' }
    ] }
];

const newsGrid = document.getElementById('news-grid');
if (newsGrid) {
    newsGrid.innerHTML = articles.map(function (article) {
        return '<article class="news-card"><a class="news-image" href="news-detail.html?id=' + article.id + '"><img src="' + article.image + '" alt="Minh họa ' + article.title + '" width="600" height="400" loading="lazy"></a><div class="news-info"><p class="eyebrow">' + article.category + '</p><h2><a href="news-detail.html?id=' + article.id + '">' + article.title + '</a></h2><p class="news-meta">' + article.author + ' · ' + article.date + ' · Bài viết mẫu</p><p>' + article.intro + '</p><a class="text-link" href="news-detail.html?id=' + article.id + '">Đọc thêm →</a></div></article>';
    }).join('');
}
const newsDetail = document.getElementById('news-detail');
if (newsDetail) {
    const articleId = Number(new URLSearchParams(window.location.search).get('id'));
    const article = articles.find(function (item) { return item.id === articleId; });
    if (!article) {
        newsDetail.innerHTML = '<div class="empty-state"><h1>Chưa tìm thấy bài viết này</h1><p>Mời bạn ghé góc nhỏ để đọc thêm những câu chuyện khác.</p><a class="button" href="news.html">Quay lại tin tức</a></div>';
    } else {
        newsDetail.innerHTML = '<article class="article-body"><p class="eyebrow">' + article.category + '</p><h1>' + article.title + '</h1><p class="news-meta">' + article.author + ' · ' + article.date + ' · Nội dung và tác giả minh họa</p><img class="article-cover" src="' + article.image + '" alt="Minh họa ' + article.title + '" width="900" height="600"><p class="article-intro">' + article.intro + '</p>' + article.sections.map(function (section) { return '<section><h3>' + section.heading + '</h3><p>' + section.text + '</p></section>'; }).join('') + '<aside class="note">Thông tin tham khảo cho bài tập, không thay thế tư vấn của bác sĩ thú y. Hãy hỏi bác sĩ khi bé có biểu hiện bất thường.</aside><a class="text-link" href="news.html">← Quay lại Tin tức</a></article><section class="related-articles"><h2>Đọc thêm một chút</h2>' + articles.filter(function (item) { return item.id !== article.id; }).map(function (item) { return '<p><a href="news-detail.html?id=' + item.id + '">' + item.title + ' →</a></p>'; }).join('') + '</section>';
    }
}

// PHẦN 11. MENU ĐIỆN THOẠI VÀ THÔNG BÁO
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.getElementById('main-nav');
function closeMenu() {
    if (mainNav) mainNav.classList.remove('is-open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
}
if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
        const open = menuToggle.getAttribute('aria-expanded') !== 'true';
        mainNav.classList.toggle('is-open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
            closeMenu();
            menuToggle.focus();
        }
    });
    mainNav.addEventListener('click', function (event) {
        if (event.target.closest('a')) closeMenu();
    });
}

let toastTimer;
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('is-visible');
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 4500);
}
