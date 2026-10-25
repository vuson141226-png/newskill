# Bàn giao thiết kế lại S Chicken

## Những gì thay đổi

| Nhóm tệp | Kết quả |
| --- | --- |
| 10 trang HTML | Giữ đủ tuyến trang; phân cấp chữ và nội dung rõ hơn; header/footer đồng nhất; từng trang có bố cục riêng |
| `css/style.css` | Thiết kế lại trang chủ, thẻ món, banner, trang nội dung, form và giỏ; responsive và trạng thái tương tác |
| `css/tokens.css` (mới) | Tập trung bảng màu, font, khoảng cách, container, bo góc và thời gian chuyển động |
| `css/base.css` (mới) | Nền tảng dùng chung, Grid an toàn, tiêu đề xuống dòng và focus; font ở tokens.css, giảm chuyển động ở style.css |
| `fonts/` (mới) | Be Vietnam Pro cục bộ với giấy phép SIL OFL, không cần CDN |
| `js/main.js` | Menu SVG và Escape; lỗi form rõ ràng; FAQ có chuyển động nhẹ; giữ lọc, tìm kiếm, chi tiết và ứng tuyển |
| `js/cart.js` | Lọc dữ liệu giỏ hỏng; cập nhật nhãn trợ năng; giữ focus sau tăng/giảm/xóa; đóng dialog bằng Escape |
| `docs/`, `README.md` | Hướng dẫn chạy, bảng đối chiếu, báo cáo PowerPoint và mẫu Excel |

Giữ lại logo SVG, 15 ID món, danh mục, giá bán, nội dung minh họa, các biểu mẫu và cơ chế localStorage. Không thêm backend hoặc thư viện giao diện. Hình gốc có ghi nguồn vẫn được sử dụng; một số món dùng chung ảnh.

## Đối chiếu yêu cầu giảng viên

| Yêu cầu | Bằng chứng trong dự án |
| --- | --- |
| Khoảng/tối thiểu 10 trang, front-end thuần | 10 HTML ở thư mục gốc, 3 JS, CSS dùng chung; không framework/build/database |
| Trang chủ và logo SVG | `index.html`, `images/logo.svg` |
| Giới thiệu công ty/nhóm | `about.html`: câu chuyện, sứ mệnh, giá trị, đội ngũ minh họa |
| Sản phẩm/dịch vụ | `products.html`: 15 món, ảnh, tên, giá, mô tả, lọc và tìm kiếm |
| Chi tiết sản phẩm | `product-detail.html?id=1`: ảnh, giá, mô tả, thành phần, số lượng, thêm giỏ |
| Tin tức/blog | `blog.html`: 6 bài, ảnh, thời gian, tóm tắt và nội dung mở rộng |
| Liên hệ và bản đồ | `contact.html`: thông tin mẫu, form, Google Maps khu vực minh họa; bản đồ ngoài chưa xác minh tải |
| FAQ | `faq.html`: 9 câu hỏi mở/đóng |
| Đăng nhập/đăng ký | `login.html`: hai form, kiểm tra dữ liệu; chỉ mô phỏng |
| Giỏ hàng | `cart.html`: thêm/xóa/tăng giảm, tổng tiền và xác nhận thanh toán mô phỏng |
| Tuyển dụng | `careers.html`: 3 vị trí, yêu cầu/quyền lợi và form |
| CSS Layout, màu/font thống nhất | Grid/Flexbox; `style.css` nhập `tokens.css` và `base.css` cho cả 10 trang |
| Title riêng và thanh điều hướng nhất quán | Thẻ title từng trang; menu chính, menu Khám phá, footer và trạng thái trang hiện hành |
| Tối thiểu 8 hình | 14 tệp ảnh/SVG cục bộ, gồm logo; `images/SOURCES.md` ghi nguồn |
| Hiệu ứng animation/transition | Hover nút/thẻ món, zoom ảnh, menu/FAQ, reduced motion |
| Responsive nhiều kích thước | Media query, Grid đổi số cột, menu di động; kết quả ở `KIEM_THU.md` |
| Nhiều trình duyệt | Chromium đã dùng kiểm thử; Chrome/Edge/Firefox cần nhóm thử riêng trước khi nộp |
| Mã nguồn + PowerPoint + Excel | Mã nguồn, `BAO_CAO.pptx`, `PHAN_CONG.xlsx`; điền thông tin nhóm thực tế |
| Tệp nén đúng tên | Nhóm nén theo `NhomX_TenWeb.zip`, thay X bằng nhóm thật |

## Phần cần nhóm hoàn thiện

- Điền họ tên, lớp, số nhóm và tên người thuyết trình vào PowerPoint.
- Điền phân công, minh chứng, điểm và tỷ lệ đóng góp thực tế vào Excel. Không có điểm/tỷ lệ đánh giá tự tạo.
- Kiểm tra lại mẫu Excel đính kèm riêng của giảng viên nếu có; tài liệu ảnh chỉ cho biết yêu cầu, không kèm mẫu đó.
- Thử trên Chrome, Edge, Firefox và điện thoại thật; cập nhật `KIEM_THU.md` theo kết quả.
- Thay ảnh minh họa bằng ảnh đúng món có quyền sử dụng rõ ràng nếu xuất bản thương mại.

Website không có đăng nhập, gửi liên hệ/hồ sơ, đặt hàng hoặc thanh toán thật. Các thông báo trên trang nêu rõ phạm vi mô phỏng.

## Các chỉnh sửa nội dung và tài sản

- Tiêu đề hero từ “GIÒN NGON TỪNG MIẾNG. VUI TRỌN TỪNG PHÚT!” thành “Giòn ngon. Trọn niềm vui.”; bỏ nhãn trang trí, ngôi sao và sticker 100%.
- Giá dưới ảnh hero là 45.000 ₫ của món gà sốt cay ID 2; giá gà nguyên bản ID 1 vẫn là 39.000 ₫ trong thực đơn.
- Tiêu đề khuyến mãi thành “Cả hội cùng ăn. Càng thêm vui.”, giữ combo 159.000 ₫; câu chuyện thành “Một bữa ngon. Một câu chuyện vui.”
- Chuyển tiêu đề in hoa thành kiểu câu, danh mục xuống dưới tên món; chuẩn hóa dấu câu và bỏ mũi tên chữ trang trí. Các thông báo mô phỏng vẫn rõ ràng.
- Ảnh gốc kích thước nhỏ và dùng chung còn hạn chế độ sắc nét. Thay `images/food-menu-3.png` bằng ảnh gà thực tế ít nhất 1200px là nâng cấp hữu ích nhất; giữ tỷ lệ và cập nhật alt khi thay.
- Font từ Google Fonts: https://github.com/google/fonts/tree/main/ofl/bevietnampro (SIL OFL, bản quyền/giấy phép trong fonts/OFL.txt).
