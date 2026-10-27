# Các dự án Thiết kế Web

## Mới: sisimimi — Thế giới nhỏ dành cho bé yêu

Website bán đồ **dành riêng cho chó và cún con**, có **11 trang**, giao diện hồng pastel, HTML/CSS/JavaScript thuần. Mở **[sisimimi/index.html](sisimimi/index.html)** bằng Live Server sau khi tải kho mã về máy.

Bản sisimimi đã được chỉnh theo cách triển khai trong ZIP **S-Chicken (2).zip**: bố cục trang chủ, điều hướng, thẻ sản phẩm HTML có sẵn và ba tệp JavaScript tách riêng. Bộ 12 ảnh sản phẩm dùng PNG nền trong suốt theo phong cách ảnh chụp. Xem [đối chiếu mẫu tham chiếu](sisimimi/docs/THAM_CHIEU.md).

- [Mã nguồn và hướng dẫn chạy](sisimimi/README.md)
- [Hướng dẫn học theo 9 giai đoạn](sisimimi/docs/HUONG_DAN.md)
- [PowerPoint báo cáo](sisimimi/docs/BAO_CAO.pptx) · [Excel phân công](sisimimi/docs/PHAN_CONG.xlsx)
- [Kết quả kiểm thử](sisimimi/docs/KIEM_THU.md)

Thư mục `sisimimi/` độc lập với dự án S Chicken bên dưới. Có thể tải riêng gói `NhomX_sisimimi.zip` trong kho mã, giải nén và mở thư mục `sisimimi` bằng Visual Studio Code. Thay `X` bằng số nhóm thật trước khi nộp bài.

---

# S Chicken — Website Thiết kế Web

Bản thiết kế lại gồm **10 trang HTML**, dùng HTML5, CSS3 và JavaScript thuần. Website không dùng framework, backend, cơ sở dữ liệu, npm hay công cụ build. Logo, 15 món, ID, giá bán và dữ liệu minh họa của dự án ban đầu được giữ lại.

## Chạy dự án

1. Mở thư mục dự án trong Visual Studio Code.
2. Cài tiện ích **Live Server** của Ritwick Dey.
3. Nhấp phải `index.html` → **Open with Live Server**.
4. Dùng cùng địa chỉ và cổng khi thử các trang để localStorage dùng chung.

Nếu máy đã có Python, có thể phục vụ tệp tĩnh bằng lệnh sau, chạy trong thư mục chứa `index.html`:

```sh
python3 -m http.server 8000
```

Mở địa chỉ mà công cụ thông báo trong trình duyệt. Đây là máy chủ tệp phục vụ kiểm thử, không phải backend. Không cần cài Python, Node hoặc bất kỳ gói npm nào khi chạy bằng Live Server. Mở HTML trực tiếp vẫn hiển thị giao diện, nhưng hành vi localStorage với `file:` khác nhau giữa các trình duyệt.

## Cấu trúc

```text
index.html                 Trang chủ
about.html                 Giới thiệu, sứ mệnh, đội ngũ minh họa
products.html              15 món, 5 danh mục, tìm kiếm
product-detail.html        Chi tiết theo ?id=, số lượng, món liên quan
blog.html                  6 bài viết có mở rộng nội dung
contact.html               Thông tin liên hệ mẫu, form và bản đồ
faq.html                   9 câu hỏi mở/đóng
login.html                 Đăng nhập/đăng ký mô phỏng
cart.html                  Giỏ hàng, tổng tiền, thanh toán mô phỏng
careers.html               3 vị trí và form ứng tuyển
css/style.css              Bố cục và thành phần của 10 trang
css/tokens.css             Màu, chữ, khoảng cách, kích thước, thời gian
css/base.css               Nền tảng, font, trợ năng, container
js/products.js             Dữ liệu 15 món và hàm định dạng giá
js/cart.js                 localStorage, thêm/xóa, số lượng và tổng tiền
js/main.js                 Menu, lọc, chi tiết, FAQ, biểu mẫu
fonts/                     Be Vietnam Pro cục bộ + giấy phép OFL
images/                    14 ảnh/SVG của dự án và thông tin nguồn
docs/                      Báo cáo, phân công, kiểm thử, đối chiếu đề bài
```

HTML chỉ liên kết `css/style.css`; tệp này nhập `tokens.css` và `base.css` bằng CSS `@import`. Cả 10 trang dùng chung hệ thống, không cần bước biên dịch. Header/footer có sẵn trong từng HTML để nội dung điều hướng vẫn hiện khi JavaScript bị tắt.

## Hệ thống thiết kế

- Đỏ `#C62828`, đỏ đậm `#991B1B`, vàng `#FFB800`, nền kem `#FFF8EF`.
- Be Vietnam Pro 400/700/800 được lưu cục bộ; Arial/sans-serif dự phòng; `font-display: swap`.
- Container tối đa 1280px; Grid/Flexbox; kích thước chữ dùng `clamp()`.
- Nút đặt món, thẻ sản phẩm, biểu mẫu, header/footer dùng chung kiểu.
- Menu SVG trên điện thoại, trạng thái focus rõ, nhãn trợ năng cho giỏ hàng.
- Hover/zoom nhẹ, mở FAQ và menu; `prefers-reduced-motion` giảm chuyển động.
- Mỗi trang có title riêng và cách tổ chức nội dung phù hợp. Trang chủ ưu tiên món ăn, thực đơn ưu tiên lọc, giỏ ưu tiên tổng tiền, form ưu tiên khả năng nhập.

Xem [nhật ký thay đổi và đối chiếu đề bài](docs/THAY_DOI.md).

## Giải thích mã quan trọng

**Dữ liệu món:** `js/products.js` chứa các đối tượng `id`, `name`, `category`, `price`, `image`, `description`, `ingredients`. Giá là số nguyên đồng Việt Nam. Trang chi tiết đọc ID qua `URLSearchParams` và dùng `find` để tìm món. Khi sửa tên, giá hoặc ảnh, cập nhật cả dữ liệu JS lẫn thẻ món tĩnh trong `products.html`/`index.html`.

**Giỏ hàng:** khóa `schicken-cart` chỉ lưu `{ id, quantity }`. Giá tính từ `products.js`; số lượng giới hạn 1–99. Dữ liệu null, ID lạ, số âm và JSON lỗi được xử lý. Sau tăng/giảm/xóa, DOM được vẽ lại và focus bàn phím chuyển về điều khiển phù hợp. Nếu lưu trữ bị chặn, giỏ vẫn dùng trong trang hiện tại, nhưng không bảo đảm giữ khi chuyển trang.

**Biểu mẫu:** thuộc tính HTML `required`, `type`, `pattern`, `minlength` mô tả quy tắc. JavaScript kiểm tra tính hợp lệ, chuỗi trắng và mật khẩu xác nhận; thêm `aria-invalid`, hiện lỗi bằng `textContent`, đưa focus đến trường sai. Không lưu mật khẩu hoặc tạo tài khoản thật.

**FAQ/menu:** sự kiện cập nhật `aria-expanded` cùng trạng thái hiển thị; Escape đóng menu; animation dùng opacity/transform và tôn trọng giảm chuyển động.

**Mô phỏng:** thanh toán mở hộp xác nhận rồi xóa giỏ, không thu tiền hoặc gửi đơn. Form liên hệ/ứng tuyển không gửi dữ liệu. Liên kết mạng xã hội dẫn tới nền tảng, không phải kênh chính thức của thương hiệu.

## Hình ảnh và font

Giữ 14 hình cục bộ của dự án (8 raster + 6 SVG, gồm logo). Các biến thể gà/burger có thể dùng chung ảnh minh họa; đồ uống, khoai và đội ngũ là SVG gốc. Nên thay bằng ảnh tự chụp đúng từng món khi có tư liệu.

Nguồn ảnh Foodie/Grilli, thông tin cấp phép hiện có và giới hạn nằm trong [images/SOURCES.md](images/SOURCES.md). Giấy phép Grilli MIT được giữ lại. **Quyền riêng từng ảnh chưa được xác minh**; không coi giấy phép mã nguồn là chứng nhận quyền thương mại cho tất cả ảnh. Nguồn ảnh là tư liệu của dự án gửi ban đầu.

Be Vietnam Pro được phân phối theo SIL Open Font License; giữ [fonts/OFL.txt](fonts/OFL.txt) cùng font. Font cục bộ giúp giao diện không phụ thuộc dịch vụ font ngoài. Bản đồ Google Maps vẫn cần Internet; địa chỉ Chùa Bộc là minh họa.

## Kiểm tra và bàn giao

Xem [docs/KIEM_THU.md](docs/KIEM_THU.md) để biết kết quả thực tế và phần chưa xác minh. Công cụ kiểm thử phát triển là Chromium qua Playwright, không phải phụ thuộc của website. Cần chạy Chrome, Edge và Firefox riêng trên máy của nhóm trước khi nộp.

Các tệp hỗ trợ nộp bài:

- `docs/BAO_CAO.pptx`: báo cáo 10 slide, có ảnh chụp giao diện thực tế.
- `docs/BAO_CAO.md`: dàn ý, kịch bản demo và câu hỏi bảo vệ.
- `docs/PHAN_CONG.xlsx`: mẫu phân công/đánh giá; họ tên, điểm và tỷ lệ đóng góp để trống cho nhóm điền.
- `docs/PHAN_CONG.csv`: dữ liệu phân công ban đầu để tham khảo.
- `docs/THAY_DOI.md`: thay đổi, hạn chế, bảng đối chiếu yêu cầu giảng viên.

Điền thông tin nhóm, tên thành viên và đánh giá thực tế; đối chiếu bảng phân công mẫu của giảng viên nếu có. Nén toàn bộ dự án kèm báo cáo và bảng phân công theo tên **NhomX_TenWeb.zip** sau khi thay X bằng số nhóm thật.
