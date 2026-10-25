# Kiểm thử bản thiết kế lại

Ngày kiểm tra: 24/10/2026. Công cụ: Chromium headless thật qua Playwright, phục vụ tệp tĩnh bằng HTTP server. Những công cụ này chỉ dùng phát triển/kiểm thử; website chạy bằng Live Server không cần npm, Node hoặc Playwright.

## Trạng thái hiện tại

Bộ kiểm thử bản redesign đạt **60/60 kiểm tra, 0 lỗi JavaScript**: 50 tổ hợp (10 trang × 320, 375, 768, 1280, 1920px) và 10 nhóm chức năng. Số lượng này không đồng nghĩa 60 kịch bản nghiệp vụ độc lập.

Sau sửa cuối, đã kiểm tra thêm: bấm trực tiếp SVG menu và Escape; 5 liên kết danh mục từ trang chủ; giảm chuyển động; focus bàn phím; không gửi form bằng nút hoặc Enter khi tắt JavaScript; headline và CTA nằm trong màn hình 1280×800. Ba bố cục vừa chỉnh (trang chủ, tin tức, FAQ) qua thêm **9 kiểm tra ở 320, 375, 1280px**. Tổng tiền kiểm chứng: 137.000 → 176.000 → 78.000 ₫.

Kiểm tra tĩnh Hallmark trên 10 trang: **0 FAIL, 0 WARN**, một ngoại lệ hover ảnh theo yêu cầu; các ghi chú số chữ giữ lại để bảo toàn nội dung. Render tier riêng của Hallmark không chạy vì thiếu puppeteer-core. Kiểm tra giao diện/chức năng thực tế được chạy riêng bằng Chromium/Playwright; không tuyên bố render tier đã đạt.

Đối chiếu ZIP gốc: tên/trường form, ID và đích liên kết được bảo toàn ở cả 10 trang. `js/products.js` giống nguyên bản từng byte. Bốn URL danh mục được chuẩn hóa mã hóa; riêng dấu & trong “Burger & món kèm” được mã hóa để bộ lọc nhận đúng. Hallmark ghi nhận bốn chuỗi URL thay đổi, không phải bốn trang bị xóa.

Tệp kết quả chi tiết: `ket-qua-kiem-thu.json`, `kiem-tra-bo-sung.json`, `bao-toan-du-lieu.json` và `hallmark-check.txt`.

Kết quả 523 phép kiểm tra ghi trong dự án ban đầu không được dùng làm bằng chứng cho bản redesign.

## Phạm vi kiểm tra

- Các trang, title, đường dẫn cục bộ, ảnh, lỗi JavaScript và tràn ngang.
- Bộ lọc 5 danh mục, tìm món, danh mục từ URL, trường hợp không có kết quả.
- Chi tiết ID hợp lệ/không tồn tại; số lượng từ 1 đến 99.
- Thêm giỏ, đổi số lượng, xóa món, tải lại, tổng tiền, trạng thái trống và xác nhận mô phỏng.
- Dữ liệu localStorage hỏng, null, ID lạ, số âm, trùng ID và giới hạn số lượng.
- FAQ, bài viết, chuyển form tài khoản, kiểm tra các trường bắt buộc/mật khẩu xác nhận.
- Form liên hệ/ứng tuyển với thông tin giả; nút ứng tuyển chọn vị trí.
- Menu di động, Escape, focus bàn phím và giảm chuyển động.

## Kịch bản nhóm có thể chạy lại

1. Mở 10 trang; xem Console và thử các liên kết trên header/footer.
2. Lọc Gà sốt, gõ tên món, gõ từ không có kết quả và xóa từ khóa.
3. Mở `product-detail.html?id=3`, sau đó thử `?id=999`; thử số lượng 1 và 99.
4. Thêm 2 burger 49.000 ₫ và 1 gà 39.000 ₫: tổng 137.000 ₫. Tăng gà thành 2: 176.000 ₫. Xóa burger: 78.000 ₫.
5. Tải lại và chuyển trang; giỏ giữ dữ liệu. Xác nhận thanh toán mô phỏng: mở dialog, giỏ trống; không có giao dịch.
6. Nhập email sai, khoảng trắng, mật khẩu không khớp; kiểm tra lỗi và focus, sau đó dùng dữ liệu giả hợp lệ.
7. Thử FAQ và đọc thêm bằng bàn phím; menu ở 320/375px bằng Tab và Escape.
8. Kiểm tra 320, 375, 768, 1024, 1280 và 1920px; bật giảm chuyển động và kiểm tra tương tác.

## Chưa xác minh / giới hạn

- Chrome, Edge, Firefox bản cài riêng; điện thoại cảm ứng vật lý và trình đọc màn hình chưa được xác minh trong môi trường này.
- Google Maps cần Internet; chưa xác nhận bản đồ ngoài tải thành công. Địa chỉ, cửa hàng và dữ liệu là minh họa.
- Một số ảnh dùng chung; quyền riêng từng ảnh chưa được xác minh. Xem `images/SOURCES.md`.
- Không có backend, xác thực, gửi email/hồ sơ, giao hàng hoặc thanh toán thật.
