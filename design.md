# Design: S Chicken

Hệ thống dùng chung cho 10 trang, dựa trên màu và logo của dự án được cung cấp.

## Định hướng
- Hallmark v2.0.0, full redesign; genre playful; theme brand.
- Trang chủ: ảnh đĩa gà sốt là điểm nhấn, tiêu đề lớn trên nền kem.
- Mục tiêu: thực đơn → chi tiết món → thêm giỏ → xác nhận mô phỏng.
- Nội dung, ID món, giá, đường dẫn trang và nhãn mô phỏng được giữ.
- Không thêm khách hàng, số liệu hoặc đánh giá mới.

## Nguồn token
`css/tokens.css` là nguồn màu, font, khoảng cách và kích thước.
- Nền: #fff8ef; lớp phụ #f5ebdc; nội dung #2c201c.
- Đỏ #c62828; đỏ hover #991b1b; vàng #ffb800.
- Chữ: Be Vietnam Pro 400/700/800, lưu cục bộ, OFL đi kèm.
- Container 1280px; lề 40px desktop, 24px tablet, 16px mobile.
- Nội dung 16px; chữ phụ 14px; chú thích 13px.
- Bo góc ảnh 16px; input 8px; nút chính dạng pill, cao tối thiểu 44px.
- Grid co được bằng minmax(0, 1fr); typography có clamp và overflow-wrap.

## Thành phần
- Một kiểu nút chính đỏ; biến thể vàng chỉ dùng trên khối đỏ.
- Card món mở, nền chỉ ô ảnh; tên → danh mục → mô tả → giá và nút thêm.
- Footer chữ thương hiệu lớn; liên kết nhóm theo nhu cầu.
- Focus luôn nhìn thấy; aria-live cho giỏ và form.
- FAQ và form được giữ nguyên ID/thuộc tính nối với JavaScript.

## Chuyển động
- Hover 150–220ms; ảnh zoom nhẹ theo yêu cầu người dùng.
- Một hiệu ứng IntersectionObserver ở phần câu chuyện trang chủ.
- FAQ vào/ra 180ms bằng opacity/transform.
- prefers-reduced-motion tắt hiệu ứng, nội dung luôn hiện khi tắt JavaScript.

## Ngoại lệ có chủ đích
- Nội dung các trang cũ được giữ, nên một số trang vượt ngân sách chữ Hallmark.
- Đồ uống/đội ngũ giữ SVG minh họa của dự án, không nhận là ảnh thật.
- Header và footer lặp trong HTML để chạy trực tiếp và dễ hiểu với sinh viên.
- Kiểm tra hình ảnh bằng Chromium/Playwright riêng; render tier của Hallmark thiếu puppeteer-core.
