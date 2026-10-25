document.body.classList.add('js-enabled');
// 1. Thông báo ngắn và menu trên điện thoại.
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 4200);
}
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.getElementById('main-nav');
const moreMenu = document.querySelector('.nav-more');
function setMenuOpen(isOpen) {
  mainNav.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Đóng menu' : 'Mở menu');
  menuToggle.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="' + (isOpen ? 'M6 6l12 12M18 6 6 18' : 'M4 6h16M4 12h16M4 18h16') + '"/></svg>';
  if (!isOpen && moreMenu) moreMenu.open = false;
}
if (menuToggle && mainNav) {
  setMenuOpen(false);
  menuToggle.addEventListener('click', function () {
    setMenuOpen(!mainNav.classList.contains('open'));
  });
  mainNav.addEventListener('click', function (event) {
    if (event.target.closest('a')) setMenuOpen(false);
  });
  document.addEventListener('click', function (event) {
    if (!event.composedPath().includes(mainNav) && !event.composedPath().includes(menuToggle)) setMenuOpen(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    if (moreMenu && moreMenu.open) {
      moreMenu.open = false;
      moreMenu.querySelector('summary').focus();
    } else if (mainNav.classList.contains('open')) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
  // Menu không phải hộp thoại: cho phép Tab theo thứ tự tự nhiên, đóng khi rời vùng menu.
  document.addEventListener('focusin', function (event) {
    if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) setMenuOpen(false);
  });
}
if (document.querySelector('.nav-more .active')) document.querySelector('.nav-more summary').classList.add('active');

// 2. Lọc thực đơn: kết hợp danh mục với từ khóa tìm kiếm.
const productList = document.getElementById('product-list');
if (productList) {
  let selectedCategory = new URLSearchParams(window.location.search).get('category') || 'Tất cả';
  const filterButtons = document.querySelectorAll('.filter-button');
  const search = document.getElementById('product-search');
  const validCategory = Array.from(filterButtons).some(function (button) { return button.dataset.category === selectedCategory; });
  if (!validCategory) selectedCategory = 'Tất cả';
  function filterProducts() {
    let count = 0;
    const keyword = search.value.trim().toLocaleLowerCase('vi');
    filterButtons.forEach(function (button) {
      const active = button.dataset.category === selectedCategory;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('.product-wrapper').forEach(function (item) {
      const matchCategory = selectedCategory === 'Tất cả' || item.dataset.category === selectedCategory;
      const matchName = item.dataset.name.toLocaleLowerCase('vi').includes(keyword);
      item.hidden = !(matchCategory && matchName);
      if (!item.hidden) count++;
    });
    document.getElementById('result-count').textContent = count + ' món ngon đang chờ bạn';
    document.getElementById('no-products').hidden = count > 0;
  }
  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      selectedCategory = button.dataset.category;
      filterProducts();
    });
  });
  search.addEventListener('input', filterProducts);
  filterProducts();
}

// 3. Chi tiết món: lấy ID trên URL và tra cứu mảng products.
const detailContainer = document.getElementById('product-detail');
if (detailContainer) {
  const requestedId = Number(new URLSearchParams(window.location.search).get('id') || 1);
  const product = products.find(function (item) { return item.id === requestedId; });
  if (!product) {
    detailContainer.innerHTML = '<div class="empty-state"><h1>Không tìm thấy món ăn</h1><p>Món bạn tìm có thể không nằm trong thực đơn minh họa.</p><a class="button" href="products.html">Quay lại thực đơn</a></div>';
    document.getElementById('related-products').parentElement.hidden = true;
  } else {
    document.title = product.name + ' | S Chicken';
    detailContainer.innerHTML = '<div class="detail-layout"><div class="detail-image"><img src="images/' + product.image + '" alt="' + product.name + ' — ảnh minh họa" width="500" height="400"></div><div class="detail-copy"><h1>' + product.name + '</h1><p class="detail-category">' + product.category + '</p><p class="detail-price">' + formatPrice(product.price) + '</p><p>' + product.description + ' Mỗi phần ăn là một chút niềm vui để bạn thưởng thức cùng những người thân yêu.</p><h2>Thành phần & lưu ý dị ứng</h2><p>' + product.ingredients + '</p><label for="detail-quantity">Số lượng (1–99)</label><div class="purchase-row"><div class="quantity-control"><button id="quantity-minus" aria-label="Giảm số lượng" disabled>−</button><input id="detail-quantity" type="number" min="1" max="99" step="1" value="1" aria-label="Số lượng món ăn"><button id="quantity-plus" aria-label="Tăng số lượng">+</button></div><button class="button" id="detail-add">Thêm vào giỏ hàng</button></div><p class="muted">Ảnh và thành phần minh họa. Không sử dụng thông tin này thay cho tư vấn chế độ ăn thực tế.</p></div></div>';
    const quantity = document.getElementById('detail-quantity');
    function updateQuantity(value) {
      quantity.value = Math.max(1, Math.min(99, Math.floor(Number(value) || 1)));
      document.getElementById('quantity-minus').disabled = Number(quantity.value) === 1;
      document.getElementById('quantity-plus').disabled = Number(quantity.value) === 99;
    }
    document.getElementById('quantity-minus').addEventListener('click', function () { updateQuantity(Number(quantity.value) - 1); });
    document.getElementById('quantity-plus').addEventListener('click', function () { updateQuantity(Number(quantity.value) + 1); });
    quantity.addEventListener('change', function () { updateQuantity(quantity.value); });
    document.getElementById('detail-add').addEventListener('click', function () {
      updateQuantity(quantity.value);
      addToCart(product.id, Number(quantity.value));
    });
    let related = products.filter(function (item) { return item.id !== product.id; }).slice(0, 4);
    document.getElementById('related-products').innerHTML = related.map(function (item) {
      return '<article class="product-card"><a class="product-image" href="product-detail.html?id=' + item.id + '"><img src="images/' + item.image + '" alt="' + item.name + ' — ảnh minh họa" width="300" height="240" loading="lazy"></a><div class="product-info"><h3><a href="product-detail.html?id=' + item.id + '">' + item.name + '</a></h3><span class="product-category">' + item.category + '</span><p>' + item.description + '</p><div class="product-bottom"><strong>' + formatPrice(item.price) + '</strong><button class="add-button" data-add="' + item.id + '" aria-label="Thêm ' + item.name + ' vào giỏ">+</button></div><a class="detail-link" href="product-detail.html?id=' + item.id + '">Xem chi tiết</a></div></article>';
    }).join('');
  }
}

// 4. Accordion FAQ và bài viết: hiệu ứng nhẹ, vẫn đồng bộ trạng thái trợ năng.
const panelTimers = new WeakMap();
document.querySelectorAll('.faq-question, .read-more').forEach(function (button) {
  button.addEventListener('click', function () {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    const expanded = button.getAttribute('aria-expanded') === 'true';
    clearTimeout(panelTimers.get(panel));
    panel.classList.remove('is-opening', 'is-closing');
    button.setAttribute('aria-expanded', String(!expanded));
    if (!expanded) {
      panel.hidden = false;
      if (!reducedMotion.matches) panel.classList.add('is-opening');
    } else if (reducedMotion.matches) {
      panel.hidden = true;
    } else {
      panel.classList.add('is-closing');
      panelTimers.set(panel, setTimeout(function () {
        panel.hidden = true;
        panel.classList.remove('is-closing');
      }, 180));
    }
    if (button.classList.contains('read-more')) button.textContent = expanded ? 'Đọc thêm' : 'Thu gọn';
    else button.querySelector('b').textContent = expanded ? '+' : '−';
  });
});

// 5. Chuyển biểu mẫu tài khoản (không tạo tài khoản hoặc lưu mật khẩu).
document.querySelectorAll('.auth-tab').forEach(function (button) {
  button.addEventListener('click', function () {
    document.querySelectorAll('.auth-tab').forEach(function (tab) {
      const active = tab === button;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-pressed', String(active));
      document.getElementById(tab.dataset.form).hidden = !active;
    });
  });
});

// 6. Kiểm tra form trước khi hiển thị kết quả mô phỏng; không gửi hoặc lưu dữ liệu.
document.querySelectorAll('[data-demo-form]').forEach(function (form, formIndex) {
  const message = form.querySelector('.form-message');
  message.id = message.id || 'form-feedback-' + formIndex;
  // Chỉ tắt hộp lỗi mặc định sau khi JavaScript đã sẵn sàng xử lý mọi trường.
  form.noValidate = true;
  form.addEventListener('input', function (event) {
    event.target.removeAttribute('aria-invalid');
    message.classList.remove('success');
    if (!form.querySelector('[aria-invalid="true"]')) {
      message.textContent = '';
      message.classList.remove('error');
    }
  });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    message.classList.remove('error', 'success');
    message.textContent = '';
    let firstInvalid = null;
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(function (field) {
      field.removeAttribute('aria-invalid');
      const blank = field.required && field.type !== 'checkbox' && !field.value.trim();
      if (blank || !field.checkValidity()) {
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', message.id);
        if (!firstInvalid) firstInvalid = field;
      }
    });
    if (firstInvalid) {
      message.textContent = 'Vui lòng kiểm tra các mục được đánh dấu. Điền đủ thông tin và đúng định dạng.';
      message.classList.add('error');
      firstInvalid.focus();
      return;
    }
    if (form.dataset.demoForm === 'register' && form.elements.password.value !== form.elements.confirmPassword.value) {
      message.textContent = 'Mật khẩu xác nhận chưa khớp. Bạn kiểm tra lại nhé!';
      message.classList.add('error');
      form.elements.confirmPassword.setAttribute('aria-invalid', 'true');
      form.elements.confirmPassword.setAttribute('aria-describedby', message.id);
      form.elements.confirmPassword.focus();
      return;
    }
    const messages = {
      contact: 'Lời nhắn hợp lệ trong bản mô phỏng. Không có dữ liệu nào được gửi đi.',
      careers: 'Thông tin ứng tuyển hợp lệ trong bản mô phỏng. Không có hồ sơ thực tế được gửi đi.',
      login: 'Đăng nhập mô phỏng thành công! Không có tài khoản hay phiên xác thực thực tế.',
      register: 'Đăng ký mô phỏng thành công! Không lưu tài khoản hoặc mật khẩu.'
    };
    message.textContent = messages[form.dataset.demoForm];
    message.classList.add('success');
    form.reset();
  });
});

document.querySelectorAll('.apply-job').forEach(function (button) {
  button.addEventListener('click', function () {
    document.getElementById('job-position').value = button.dataset.position;
    document.getElementById('application').scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
    document.getElementById('job-position').focus({ preventScroll: true });
  });
});

// Chỉ bật nút sau khi đã gắn xử lý ngăn gửi biểu mẫu.
document.querySelectorAll('[data-demo-form] button[type="submit"]').forEach(function (button) { button.disabled = false; });

// Hiệu ứng xuất hiện nhẹ; nội dung vẫn hiện khi không có JavaScript.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const reveal = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-enter');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  const story = document.querySelector('.about-preview');
  if (story) reveal.observe(story);
}
