/* Kiểm thử phát triển bằng Playwright; website không cần Node để chạy.
   Chạy server ở thư mục newskill, sau đó: node sisimimi/tests/smoke.cjs
   Cần cài Playwright trong môi trường phát triển nếu máy chưa có.
   Có thể chọn SISIMIMI_BASE_URL và CHROMIUM_PATH khi chạy ở máy khác. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const base = (process.env.SISIMIMI_BASE_URL || 'http://127.0.0.1:8000/sisimimi/').replace(/\/?$/, '/');
const widths = [320, 375, 768, 1280, 1920];
const pages = ['index.html', 'about.html', 'products.html', 'product-detail.html?id=1', 'news.html', 'news-detail.html?id=1', 'contact.html', 'faq.html', 'login.html', 'cart.html', 'careers.html'];
const results = [];
const pageErrors = [];
const localErrors = [];
const posts = [];
const localLinks = new Set();
const startedAt = new Date().toISOString();
let page;

// Mỗi case ghi một kết quả rõ ràng; thất bại không làm mất báo cáo các case khác.
async function check(name, group, action) {
    const start = Date.now();
    try {
        await action();
        results.push({ name, group, status: 'passed', duration_ms: Date.now() - start });
        console.log('PASS ' + name);
    } catch (error) {
        results.push({ name, group, status: 'failed', error: error.message, duration_ms: Date.now() - start });
        console.error('FAIL ' + name + ': ' + error.message);
    }
}

async function go(file) {
    const response = await page.goto(base + file);
    assert.equal(response.status(), 200, file + ' phải trả HTTP 200');
    await page.locator('h1').first().waitFor();
}

async function assertTotal(expected) {
    const total = await page.locator('.summary-total').innerText();
    assert.ok(total.includes(expected), 'Tổng tiền cần là ' + expected + ', thực tế: ' + total);
}

async function setCart(value) {
    await page.evaluate(value => localStorage.setItem('sisimimi-cart', value), value);
    await go('cart.html');
}

async function fillContact() {
    await page.locator('#contact-name').fill('Người kiểm thử');
    await page.locator('#contact-email').fill('test-only@example.com');
    await page.locator('#contact-phone').fill('0912345678');
    await page.locator('#contact-subject').selectOption({ label: 'Tư vấn sản phẩm' });
    await page.locator('#contact-message').fill('Đây là nội dung kiểm thử giả, không gửi thực tế.');
}

(async function main() {
    const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
    try {
        page = await browser.newPage();
        page.setDefaultTimeout(8000);
        page.on('pageerror', error => pageErrors.push(error.message));
        page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
        page.on('response', response => {
            if (response.url().startsWith(base) && response.status() >= 400) localErrors.push(response.status() + ' ' + response.url());
        });
        // Google Maps và mạng xã hội không thuộc kiểm thử cục bộ; chặn để kết quả lặp lại được.
        await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
        await go('index.html');
        await page.evaluate(() => localStorage.setItem('sisimimi-cart', JSON.stringify([{ id: 1, quantity: 2 }, { id: 2, quantity: 1 }])));

        const titles = new Set();
        for (const width of widths) {
            await page.setViewportSize({ width, height: 900 });
            for (const file of pages) {
                await check(file + ' @ ' + width + 'px', 'viewport', async () => {
                    await go(file);
                    const title = await page.title();
                    assert.ok(title.includes('sisimimi'));
                    if (width === widths[0]) { assert.ok(!titles.has(title), 'Title phải riêng cho từng trang'); titles.add(title); }
                    assert.equal(await page.locator('h1').count(), 1, 'Mỗi trang có một h1');
                    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
                    assert.ok(overflow <= 1, 'Trang tràn ngang ' + overflow + 'px');
                    await page.locator('img').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
                    await page.waitForFunction(() => Array.from(document.images).every(image => image.complete && image.naturalWidth > 0));
                    const links = await page.locator('a[href]').evaluateAll(links => links.map(link => link.href));
                    links.filter(link => link.startsWith(base)).forEach(link => localLinks.add(link.split('#')[0]));
                    if (file === 'cart.html') assert.equal(await page.locator('.cart-row').count(), 2, 'Kiểm tra responsive với giỏ có dữ liệu');
                });
            }
        }

        await page.setViewportSize({ width: 1280, height: 900 });
        await check('Mọi liên kết HTML cục bộ trả HTTP 200', 'resources', async () => {
            assert.ok(localLinks.size >= 11);
            for (const url of localLinks) {
                const response = await page.request.get(url);
                assert.equal(response.status(), 200, url);
            }
        });
        await check('Danh sách 12 sản phẩm, lọc danh mục và tìm không dấu', 'functional', async () => {
            await go('products.html');
            assert.equal(await page.locator('.product-card:visible').count(), 12);
            // Giá và nội dung HTML phải khớp dữ liệu mà giỏ hàng đang dùng.
            const catalogData = await page.evaluate(() => products.map(product => ({ id: product.id, name: product.name, price: product.price, image: product.image })));
            for (const product of catalogData) {
                const card = page.locator('#product-grid .product-wrapper[data-id="' + product.id + '"]');
                assert.equal(await card.locator('h3').innerText(), product.name);
                assert.ok((await card.locator('.product-price').innerText()).includes(product.price.toLocaleString('vi-VN')));
                assert.equal(await card.locator('img').getAttribute('src'), product.image);
            }
            for (const [category, count] of [['thuc-an', 3], ['do-choi', 2], ['quan-ao', 2], ['phu-kien', 5]]) {
                await page.locator('.filter-button[data-category="' + category + '"]').click();
                assert.equal(await page.locator('.product-card:visible').count(), count);
            }
            await page.locator('.filter-button[data-category="all"]').click();
            await page.locator('#search-input').fill('vong co');
            assert.equal(await page.locator('.product-card:visible').count(), 1);
            assert.match(await page.locator('.product-card:visible h3').innerText(), /Vòng cổ/);
        });
        await check('Không có kết quả và kết hợp tìm với lọc', 'functional', async () => {
            await go('products.html');
            await page.locator('#search-input').fill('khong-co-san-pham-nay');
            assert.equal(await page.locator('.product-card:visible').count(), 0);
            assert.ok(await page.locator('#no-products').isVisible());
            await page.locator('#search-input').fill('meo');
            await page.locator('.filter-button[data-category="thuc-an"]').click();
            assert.equal(await page.locator('.product-card:visible').count(), 2);
        });
        await check('Danh mục truyền qua URL', 'functional', async () => {
            await go('products.html?category=quan-ao');
            assert.equal(await page.locator('.product-card:visible').count(), 2);
            assert.equal(await page.locator('.filter-button[data-category="quan-ao"]').getAttribute('aria-pressed'), 'true');
        });
        await check('Chi tiết đúng ID, giới hạn số lượng 1–99', 'functional', async () => {
            await go('product-detail.html?id=2');
            assert.equal(await page.locator('h1').innerText(), 'Áo hoodie cho chó');
            assert.ok(await page.locator('#detail-minus').isDisabled());
            await page.locator('#detail-plus').evaluate(button => { for (let i = 0; i < 110; i++) button.click(); });
            assert.equal(await page.locator('#detail-quantity').inputValue(), '99');
            assert.ok(await page.locator('#detail-plus').isDisabled());
            await page.locator('#detail-minus').evaluate(button => { for (let i = 0; i < 110; i++) button.click(); });
            assert.equal(await page.locator('#detail-quantity').inputValue(), '1');
            assert.ok(await page.locator('#detail-minus').isDisabled());
            await page.locator('#detail-quantity').fill('120');
            await page.locator('#detail-quantity').press('Tab');
            assert.equal(await page.locator('#detail-quantity').inputValue(), '99');
            await page.locator('#detail-quantity').fill('2.9');
            await page.locator('#detail-quantity').press('Tab');
            assert.equal(await page.locator('#detail-quantity').inputValue(), '2');
            await page.locator('#detail-quantity').fill('0');
            await page.locator('#detail-quantity').press('Tab');
            assert.equal(await page.locator('#detail-quantity').inputValue(), '1');
        });
        await check('Bốn sản phẩm liên quan, ưu tiên cùng nhóm; bấm thêm chỉ tăng một lần', 'functional', async () => {
            await go('product-detail.html?id=1');
            await page.evaluate(() => localStorage.removeItem('sisimimi-cart'));
            await page.reload();
            assert.equal(await page.locator('#related-products .product-card').count(), 4);
            assert.equal(await page.locator('#related-products a[href="product-detail.html?id=1"]').count(), 0);
            const categories = await page.locator('#related-products .product-category').allTextContents();
            assert.ok(categories.every(text => text.includes('Phụ kiện')));
            await page.locator('#related-products [data-add]').first().click();
            assert.equal(await page.locator('.cart-count').innerText(), '1');
            await go('cart.html');
            assert.equal(await page.locator('.cart-row').count(), 1);
            assert.equal(await page.locator('.cart-count').innerText(), '1');
        });
        await check('ID sản phẩm không tồn tại', 'functional', async () => {
            await go('product-detail.html?id=999');
            assert.match(await page.locator('h1').innerText(), /Không tìm thấy/);
            assert.equal(await page.locator('#detail-add').count(), 0);
            assert.ok(await page.locator('#related-products').isHidden());
        });
        await check('Thêm từ danh sách và chi tiết, tổng 337.000 ₫', 'functional', async () => {
            await go('products.html');
            await page.evaluate(() => localStorage.removeItem('sisimimi-cart'));
            await page.reload();
            await page.locator('[data-add="1"]').click();
            await page.locator('[data-add="1"]').click();
            await go('product-detail.html?id=2');
            await page.locator('#detail-add').click();
            assert.equal(await page.locator('.cart-count').innerText(), '3');
            await go('cart.html');
            await assertTotal('337.000');
        });
        await check('Tăng, giảm, xóa và lưu giỏ: 496.000 → 337.000 → 496.000 → 318.000 ₫', 'functional', async () => {
            await page.locator('[data-cart-change="1"][data-id="2"]').click(); await assertTotal('496.000');
            await page.locator('[data-cart-change="-1"][data-id="2"]').click(); await assertTotal('337.000');
            await page.locator('[data-cart-change="1"][data-id="2"]').click();
            await page.locator('[data-remove="1"]').click(); await assertTotal('318.000');
            await page.reload(); await assertTotal('318.000');
            assert.equal(await page.locator('.cart-count').innerText(), '2');
        });
        await check('Hủy thanh toán giữ giỏ, xác nhận mô phỏng làm trống giỏ', 'functional', async () => {
            await page.locator('#checkout-button').click();
            assert.ok(await page.locator('#checkout-dialog').isVisible());
            await page.locator('#close-checkout').click();
            await assertTotal('318.000');
            await page.locator('#checkout-button').click();
            await page.locator('#confirm-checkout').click();
            assert.equal(await page.locator('.cart-row').count(), 0);
            assert.match(await page.locator('#cart-content').innerText(), /Giỏ nhỏ đang chờ/);
            await page.reload(); assert.equal(await page.locator('.cart-count').innerText(), '0');
        });
        await check('Giỏ dữ liệu null và JSON hỏng vẫn dùng được', 'robustness', async () => {
            await setCart('null'); assert.equal(await page.locator('.cart-row').count(), 0);
            await setCart('{broken'); assert.equal(await page.locator('.cart-row').count(), 0);
            await go('products.html'); await page.locator('[data-add="1"]').click();
            await go('cart.html'); await assertTotal('89.000');
        });
        await check('Giỏ bỏ ID lạ/số âm, gộp ID trùng, giới hạn 99', 'robustness', async () => {
            await setCart(JSON.stringify([null, { id: 999, quantity: 2 }, { id: 1, quantity: -2 }, { id: 1, quantity: 2 }, { id: 1, quantity: 3 }]));
            assert.equal(await page.locator('.cart-row').count(), 1); await assertTotal('445.000');
            assert.equal(await page.locator('.cart-count').innerText(), '5');
            await setCart(JSON.stringify([{ id: 1, quantity: 150 }]));
            assert.equal(await page.locator('.cart-count').innerText(), '99');
            assert.ok(await page.locator('[data-cart-change="1"]').isDisabled());
        });
        await check('10 câu FAQ mở và đóng bằng bàn phím', 'functional', async () => {
            await go('faq.html'); assert.equal(await page.locator('.faq-item').count(), 10);
            const question = page.locator('.faq-item summary').first();
            await question.focus(); await page.keyboard.press('Enter');
            assert.equal(await question.evaluate(element => element.parentElement.open), true);
            await page.keyboard.press('Enter'); assert.equal(await question.evaluate(element => element.parentElement.open), false);
        });
        await check('Menu điện thoại, phím Escape', 'functional', async () => {
            await page.setViewportSize({ width: 375, height: 812 }); await go('index.html');
            await page.locator('.menu-toggle').click();
            assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
            assert.ok(await page.locator('#main-nav').isVisible());
            await page.keyboard.press('Escape'); assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
            await page.setViewportSize({ width: 1280, height: 900 });
        });
        await check('Bốn bài viết có chi tiết riêng và xử lý ID lạ', 'functional', async () => {
            await go('news.html'); assert.equal(await page.locator('.news-card').count(), 4);
            const headings = new Set();
            for (const id of [1, 2, 3, 4]) {
                await go('news-detail.html?id=' + id); headings.add(await page.locator('h1').innerText());
                assert.ok(await page.locator('.article-body section').count() >= 3);
            }
            assert.equal(headings.size, 4); await go('news-detail.html?id=999');
            assert.match(await page.locator('h1').innerText(), /Chưa tìm thấy/);
        });
        await check('Đăng nhập hợp lệ chỉ mô phỏng', 'forms', async () => {
            await go('login.html');
            await page.locator('#login-email').fill('test-only@example.com');
            await page.locator('#login-password').fill('fake-pass-123');
            await page.locator('#login-form button[type="submit"]').click();
            assert.match(await page.locator('#login-form .form-message').innerText(), /mô phỏng/);
            assert.equal(await page.locator('#login-password').inputValue(), '');
        });
        await check('Đăng ký chặn email sai, mật khẩu lệch và xử lý hợp lệ', 'forms', async () => {
            await go('login.html'); await page.locator('[data-form="register"]').click();
            assert.ok(await page.locator('#register-form').isVisible()); assert.ok(await page.locator('#login-form').isHidden());
            await page.locator('#register-name').fill('Người kiểm thử');
            await page.locator('#register-email').fill('invalid-email');
            await page.locator('#register-password').fill('fake-pass-123');
            await page.locator('#confirm-password').fill('different-pass');
            await page.locator('#register-form button[type="submit"]').click();
            assert.equal(await page.locator('#register-email').getAttribute('aria-invalid'), 'true');
            assert.equal(await page.locator('#confirm-password').getAttribute('aria-invalid'), 'true');
            await page.locator('#register-email').fill('test-only@example.com');
            await page.locator('#confirm-password').fill('fake-pass-123');
            await page.locator('#register-form button[type="submit"]').click();
            assert.match(await page.locator('#register-form .form-message').innerText(), /mô phỏng/);
        });
        await check('Liên hệ chặn khoảng trắng/điện thoại sai, không gửi thực tế', 'forms', async () => {
            await go('contact.html'); await fillContact();
            await page.locator('#contact-name').fill('   '); await page.locator('#contact-phone').fill('12345');
            await page.locator('#contact-form button[type="submit"]').click();
            assert.equal(await page.locator('#contact-name').getAttribute('aria-invalid'), 'true');
            assert.equal(await page.locator('#contact-phone').getAttribute('aria-invalid'), 'true');
            await fillContact(); await page.locator('#contact-form button[type="submit"]').click();
            assert.match(await page.locator('#contact-form .form-message').innerText(), /mô phỏng/);
            assert.equal(await page.locator('#contact-name').inputValue(), '');
        });
        await check('Ứng tuyển chọn vị trí, chặn CV sai loại/quá lớn, nhận CV mẫu', 'forms', async () => {
            await go('careers.html');
            await page.locator('[data-job="Nhân viên quản lý kho"]').click();
            assert.equal(await page.locator('#job-position').inputValue(), 'Nhân viên quản lý kho');
            await page.locator('#applicant-name').fill('Người kiểm thử');
            await page.locator('#applicant-email').fill('test-only@example.com');
            await page.locator('#applicant-phone').fill('+84912345678');
            await page.locator('#applicant-cv').setInputFiles({ name: 'test.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('fake') });
            await page.locator('#application-form button[type="submit"]').click();
            assert.equal(await page.locator('#applicant-cv').getAttribute('aria-invalid'), 'true');
            await page.locator('#applicant-cv').setInputFiles({ name: 'large.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(5 * 1024 * 1024 + 1) });
            await page.locator('#application-form button[type="submit"]').click();
            assert.equal(await page.locator('#applicant-cv').getAttribute('aria-invalid'), 'true');
            await page.locator('#applicant-cv').setInputFiles({ name: 'test.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF fake CV for test only') });
            await page.locator('#application-form button[type="submit"]').click();
            assert.match(await page.locator('#application-form .form-message').innerText(), /mô phỏng/);
        });
        await check('Giảm chuyển động tắt animation ở banner', 'accessibility', async () => {
            const context = await browser.newContext({ reducedMotion: 'reduce' });
            try {
                const reducedPage = await context.newPage();
                await reducedPage.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
                await reducedPage.goto(base + 'index.html');
                assert.equal(await reducedPage.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), true);
                assert.equal(await reducedPage.locator('.floating-tag').evaluate(element => getComputedStyle(element).animationName), 'none');
            } finally { await context.close(); }
        });
        await check('Tắt JavaScript: form không gửi qua nút hoặc Enter', 'no-javascript', async () => {
            const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } });
            try {
                const noJsPage = await context.newPage();
                await noJsPage.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
                const unexpectedRequests = [];
                let allowInitialNavigation = false;
                noJsPage.on('request', request => {
                    if (request.method() === 'POST' || (request.isNavigationRequest() && request.frame() === noJsPage.mainFrame() && !allowInitialNavigation)) unexpectedRequests.push(request.method() + ' ' + request.url());
                });
                async function open(file) {
                    allowInitialNavigation = true;
                    await noJsPage.goto(base + file);
                    allowInitialNavigation = false;
                }
                async function trySubmit(formSelector, fieldSelector) {
                    const originalUrl = noJsPage.url();
                    const button = noJsPage.locator(formSelector + ' button[type="submit"]');
                    assert.ok(await button.isDisabled());
                    // Bấm chuột thật lên nút disabled, rồi thử Enter ở trường hợp lệ.
                    // Driver chỉ cuộn DOM; mã JavaScript của website vẫn bị tắt.
                    // Cuộn tức thì tránh chờ ổn định trong trang có scroll-behavior:smooth.
                    await button.evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'center' }));
                    const box = await button.boundingBox();
                    assert.ok(box);
                    assert.ok(box.y >= 0 && box.y + box.height <= 900, 'Nút cần nằm trong viewport khi thử click');
                    await noJsPage.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
                    await noJsPage.locator(fieldSelector).press('Enter');
                    await noJsPage.waitForTimeout(100);
                    assert.equal(noJsPage.url(), originalUrl);
                }
                await open('login.html');
                await noJsPage.locator('#login-email').fill('test-only@example.com');
                await noJsPage.locator('#login-password').fill('fake-pass-123');
                await trySubmit('#login-form', '#login-password');
                assert.ok(await noJsPage.locator('#register-form').isHidden());
                assert.ok(await noJsPage.locator('#register-form button[type="submit"]').isDisabled());
                // Chuyển form đăng ký cần JS; khi tắt JS, form ẩn và nút gửi vẫn khóa.
                await open('contact.html');
                await noJsPage.locator('#contact-name').fill('Người kiểm thử');
                await noJsPage.locator('#contact-email').fill('test-only@example.com');
                await noJsPage.locator('#contact-phone').fill('0912345678');
                await noJsPage.locator('#contact-subject').selectOption({ label: 'Tư vấn sản phẩm' });
                await noJsPage.locator('#contact-message').fill('Nội dung kiểm thử giả hợp lệ.');
                await trySubmit('#contact-form', '#contact-phone');
                await open('careers.html');
                await noJsPage.locator('#applicant-name').fill('Người kiểm thử');
                await noJsPage.locator('#applicant-email').fill('test-only@example.com');
                await noJsPage.locator('#applicant-phone').fill('0912345678');
                await noJsPage.locator('#job-position').selectOption({ label: 'Nhân viên quản lý kho' });
                await noJsPage.locator('#applicant-cv').setInputFiles({ name: 'test.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF fake') });
                await trySubmit('#application-form', '#applicant-phone');
                assert.deepEqual(unexpectedRequests, [], 'Không được điều hướng/gửi dữ liệu khi JS tắt');
            } finally { await context.close(); }
        });
        await check('Tắt JavaScript: danh sách sản phẩm, nổi bật và tin tức vẫn có nội dung', 'no-javascript', async () => {
            const context = await browser.newContext({ javaScriptEnabled: false });
            try {
                const noJsPage = await context.newPage();
                await noJsPage.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
                await noJsPage.goto(base + 'products.html');
                assert.equal(await noJsPage.locator('#product-grid .product-card:visible').count(), 12);
                assert.match(await noJsPage.locator('#product-grid').innerText(), /Vòng cổ mèo nơ hồng/);
                await noJsPage.goto(base + 'index.html');
                assert.equal(await noJsPage.locator('#featured-products .product-card:visible').count(), 4);
                await noJsPage.goto(base + 'news.html');
                assert.equal(await noJsPage.locator('.news-card:visible').count(), 4);
            } finally { await context.close(); }
        });
        await check('Tắt JavaScript: FAQ native vẫn mở và đóng', 'no-javascript', async () => {
            const context = await browser.newContext({ javaScriptEnabled: false });
            try {
                const noJsPage = await context.newPage();
                await noJsPage.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
                await noJsPage.goto(base + 'faq.html');
                const question = noJsPage.locator('.faq-item summary').first();
                await question.click();
                assert.equal(await question.evaluate(element => element.parentElement.open), true);
                await question.click();
                assert.equal(await question.evaluate(element => element.parentElement.open), false);
            } finally { await context.close(); }
        });
        await check('Không POST, không lưu mật khẩu/thông tin cá nhân', 'privacy', async () => {
            assert.deepEqual(posts, []);
            const stored = await page.evaluate(() => Object.keys(localStorage).map(key => [key, localStorage.getItem(key)]));
            assert.ok(stored.every(([key]) => key === 'sisimimi-cart'));
            assert.ok(!JSON.stringify(stored).includes('test-only@example.com'));
            assert.ok(!JSON.stringify(stored).includes('fake-pass-123'));
            assert.ok(!JSON.stringify(stored).includes('Người kiểm thử'));
        });
        await check('Không lỗi JavaScript hoặc tài nguyên cục bộ HTTP 4xx/5xx', 'resources', async () => {
            assert.deepEqual(pageErrors, []); assert.deepEqual(localErrors, []);
        });
    } finally {
        await browser.close();
        const passed = results.filter(item => item.status === 'passed').length;
        const failed = results.filter(item => item.status === 'failed').length;
        const report = {
            started_at: startedAt, finished_at: new Date().toISOString(), browser: 'Chromium qua Playwright',
            base_url: base, viewport_widths: widths, summary: { passed, failed, skipped: 0, viewport_cases: results.filter(item => item.group === 'viewport').length, other_cases: results.filter(item => item.group !== 'viewport').length },
            local_links_checked: localLinks.size, javascript_errors: pageErrors, failed_local_http_responses: localErrors, post_requests: posts,
            limitations: ['Không xác minh Google Maps hoặc dịch vụ ngoài; các yêu cầu ngoài đã được chặn.', 'Chưa chạy Chrome, Edge, Firefox cài riêng, thiết bị thật hoặc trình đọc màn hình.', 'Số case gồm tổ hợp trang × viewport và các nhóm chức năng; không phải số kịch bản nghiệp vụ độc lập.'],
            results
        };
        const output = path.resolve(__dirname, '../docs/ket-qua-kiem-thu.json');
        fs.mkdirSync(path.dirname(output), { recursive: true });
        fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
        console.log('Kết quả: ' + passed + ' passed, ' + failed + ' failed. ' + output);
        if (failed > 0) process.exitCode = 1;
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
