/* SISIMIMI — Giỏ hàng dùng chung, chỉ lưu ID và số lượng. */
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
