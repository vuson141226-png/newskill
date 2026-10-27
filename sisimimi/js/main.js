/* =====================================================
   SISIMIMI — Tương tác trang, theo cách tổ chức S-Chicken
   HTML có sẵn danh sách; JavaScript lọc và xử lý thao tác.
   ===================================================== */

// 1. THẺ SẢN PHẨM DÙNG CHO MỤC SẢN PHẨM LIÊN QUAN
// Chỉ ghép dữ liệu mẫu của dự án, không ghép nội dung do người dùng nhập.
function productCard(product) {
    return `
        <article class="product-card">
            <a class="product-image" href="product-detail.html?id=${product.id}">
                <img src="${product.image}" alt="Minh họa ${product.name}"
                    width="400" height="400" loading="lazy">
            </a>
            <div class="product-info">
                <span class="product-category">${categoryNames[product.category]} · ${product.code}</span>
                <h3><a href="product-detail.html?id=${product.id}">${product.name}</a></h3>
                <p class="product-description">${product.description}</p>
                <p class="product-feature">${product.features}</p>
                <div class="product-bottom">
                    <strong class="product-price">${formatPrice(product.price)}</strong>
                    <button class="add-button" type="button" data-add="${product.id}"
                        aria-label="Thêm ${product.name} vào giỏ">+</button>
                </div>
                <a class="detail-link" href="product-detail.html?id=${product.id}">Xem chi tiết ↗</a>
            </div>
        </article>`;
}

// 2. LỌC THẺ HTML CÓ SẴN THEO TỪ KHÓA VÀ DANH MỤC
const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-button');
const requestedCategory = new URLSearchParams(window.location.search).get('category');
let selectedCategory = categoryNames[requestedCategory] ? requestedCategory : 'all';

function normalizedText(value) {
    // Bỏ dấu để gõ "vong co" vẫn tìm thấy "Vòng cổ".
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
}

function filterProducts() {
    if (!productGrid) return;
    const keyword = searchInput ? normalizedText(searchInput.value.trim()) : '';
    let visibleCount = 0;
    productGrid.querySelectorAll('.product-wrapper').forEach(function (wrapper) {
        const matchesCategory = selectedCategory === 'all' || wrapper.dataset.category === selectedCategory;
        const matchesKeyword = normalizedText(wrapper.dataset.name).includes(keyword);
        wrapper.hidden = !(matchesCategory && matchesKeyword);
        if (!wrapper.hidden) visibleCount++;
    });
    const resultCount = document.getElementById('result-count');
    const noProducts = document.getElementById('no-products');
    if (resultCount) resultCount.textContent = visibleCount + ' sản phẩm dành cho bé';
    if (noProducts) noProducts.hidden = visibleCount !== 0;
    filterButtons.forEach(function (button) {
        const active = button.dataset.category === selectedCategory;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
    });
}

if (searchInput) searchInput.addEventListener('input', filterProducts);
filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        selectedCategory = button.dataset.category;
        filterProducts();
    });
});
filterProducts();

// 3. CHI TIẾT SẢN PHẨM THEO ID VÀ SẢN PHẨM LIÊN QUAN
function showProductDetails(product) {
    const detailContainer = document.getElementById('product-detail');
    detailContainer.innerHTML = `
        <div class="detail-layout">
            <div class="detail-image">
                <img src="${product.image}" alt="Minh họa ${product.name}" width="600" height="600">
            </div>
            <div class="detail-info detail-copy">
                <p class="eyebrow">${categoryNames[product.category]} · ${product.code}</p>
                <h1>${product.name}</h1>
                <p class="detail-price">${formatPrice(product.price)}</p>
                <p>${product.description}</p>
                <dl class="product-specs">
                    <dt>Đặc điểm</dt><dd>${product.features}</dd>
                    <dt>Chất liệu / thành phần</dt><dd>${product.material}</dd>
                    <dt>Màu sắc</dt><dd>${product.color}</dd>
                    <dt>Kích thước / khối lượng</dt><dd>${product.size}</dd>
                </dl>
                <p>Hình ảnh minh họa. Chọn kích thước và sản phẩm phù hợp với bé trước khi mua.</p>
                <label for="detail-quantity">Số lượng (1–99)</label>
                <div class="detail-purchase purchase-row">
                    <div class="quantity-control">
                        <button type="button" id="detail-minus" aria-label="Giảm số lượng" disabled>−</button>
                        <input id="detail-quantity" type="number" min="1" max="99" step="1" value="1" aria-label="Số lượng sản phẩm">
                        <button type="button" id="detail-plus" aria-label="Tăng số lượng">+</button>
                    </div>
                    <button type="button" class="button" id="detail-add">Thêm vào giỏ</button>
                </div>
                <a class="text-link" href="contact.html">Cần tư vấn? Nhắn chúng mình nhé →</a>
            </div>
        </div>`;
    const quantityInput = document.getElementById('detail-quantity');
    const minusButton = document.getElementById('detail-minus');
    const plusButton = document.getElementById('detail-plus');

    function setQuantity(value) {
        // Làm tròn xuống để giỏ không chứa số lượng lẻ; ép về khoảng 1–99.
        const quantity = Math.max(1, Math.min(99, Math.floor(Number(value) || 1)));
        quantityInput.value = quantity;
        minusButton.disabled = quantity === 1;
        plusButton.disabled = quantity === 99;
    }
    minusButton.addEventListener('click', function () { setQuantity(Number(quantityInput.value) - 1); });
    plusButton.addEventListener('click', function () { setQuantity(Number(quantityInput.value) + 1); });
    quantityInput.addEventListener('change', function () { setQuantity(quantityInput.value); });
    document.getElementById('detail-add').addEventListener('click', function () {
        setQuantity(quantityInput.value);
        addToCart(product.id, Number(quantityInput.value));
    });

    // Ưu tiên cùng danh mục, bổ sung món khác nếu chưa đủ bốn sản phẩm.
    const sameCategory = products.filter(function (item) { return item.id !== product.id && item.category === product.category; });
    const otherCategories = products.filter(function (item) { return item.category !== product.category; });
    const relatedProducts = sameCategory.concat(otherCategories).slice(0, 4);
    const relatedContainer = document.getElementById('related-products');
    if (relatedContainer) relatedContainer.innerHTML = relatedProducts.map(productCard).join('');
    // Không gắn thêm sự kiện [data-add] ở đây: cart.js đã xử lý một lần dùng chung.
}

const detailContainer = document.getElementById('product-detail');
if (detailContainer) {
    const requestedId = new URLSearchParams(window.location.search).get('id');
    const selectedProduct = findProduct(Number(requestedId || 1));
    if (selectedProduct) {
        showProductDetails(selectedProduct);
    } else {
        detailContainer.innerHTML = '<div class="empty-state"><h1>Không tìm thấy sản phẩm</h1><p>Mã sản phẩm chưa có trong cửa hàng. Mời bạn xem các món đồ khác nhé.</p><a class="button" href="products.html">Xem sản phẩm</a></div>';
        const relatedContainer = document.getElementById('related-products');
        if (relatedContainer) {
            const relatedSection = relatedContainer.closest('section') || relatedContainer.parentElement;
            relatedSection.hidden = true;
        }
    }
}

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

// Danh sách tin tức được viết sẵn trong news.html; hàm này dùng khi chuẩn bị HTML.
function newsCard(article) {
    return '<article class="news-card"><a class="news-image" href="news-detail.html?id=' + article.id + '"><img src="' + article.image + '" alt="Minh họa ' + article.title + '" width="600" height="400" loading="lazy"></a><div class="news-info"><p class="eyebrow">' + article.category + '</p><h2><a href="news-detail.html?id=' + article.id + '">' + article.title + '</a></h2><p class="news-meta">' + article.author + ' · ' + article.date + ' · Bài viết mẫu</p><p>' + article.intro + '</p><a class="text-link" href="news-detail.html?id=' + article.id + '">Đọc thêm →</a></div></article>';
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
