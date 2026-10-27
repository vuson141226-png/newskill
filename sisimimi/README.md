# sisimimi — Thế giới nhỏ dành cho bé yêu

Website bài tập nhóm bán đồ dùng, thức ăn, quần áo và phụ kiện cho chó, mèo. Dự án có **11 trang HTML**, dùng **HTML5, CSS3 và JavaScript thuần**, không có framework, công cụ build hoặc cơ sở dữ liệu.

Website nằm riêng trong thư mục `sisimimi/` của kho mã; website S Chicken ở thư mục gốc được giữ nguyên. Khi chạy, hãy mở đúng `sisimimi/index.html`. Bản thiết kế này tham chiếu bố cục và cách chia mã của tệp người dùng cung cấp **`S-Chicken(2).zip`**; màu sắc, nội dung và hình minh họa được chuyển sang cửa hàng thú cưng. Xem [ghi chú đối chiếu](docs/THAM_CHIEU.md).

## Mở trên máy tính

1. Trên GitHub, chọn **Code → Download ZIP** và giải nén.
2. Trong Visual Studio Code, chọn **File → Open Folder** và mở thư mục `sisimimi`.
3. Cài tiện ích **Live Server** của Ritwick Dey nếu chưa có.
4. Nhấp phải `index.html` → **Open with Live Server**.
5. Giữ nguyên tên miền và cổng khi thử các trang để dùng chung giỏ hàng.

Cũng có thể nhấp đúp `index.html` để xem giao diện. Tuy nhiên, trình duyệt có thể xử lý `localStorage` khác nhau với địa chỉ `file:`; dùng Live Server khi kiểm tra chuyển trang và giỏ hàng.

Nếu máy đã có Python, mở terminal trong **thư mục `sisimimi`** rồi chạy:

```sh
python3 -m http.server 8000
```

Trên Windows, có thể dùng `py -m http.server 8000`. Dùng địa chỉ máy chủ in ra trong terminal. Đây chỉ là công cụ phục vụ tệp khi phát triển, không phải backend của cửa hàng. **Không cần Node.js, npm hay cài thư viện để chạy website.**

## Các tệp chính

| Tệp | Nội dung |
|---|---|
| `index.html` | Trang chủ, danh mục và sản phẩm nổi bật |
| `about.html` | Câu chuyện, giá trị và đội ngũ minh họa |
| `products.html` | Tìm kiếm và lọc sản phẩm |
| `product-detail.html?id=1` | Chi tiết theo ID, chọn số lượng |
| `news.html` | Danh sách 4 bài viết |
| `news-detail.html?id=1` | Nội dung bài viết theo ID |
| `contact.html` | Thông tin mẫu, biểu mẫu và bản đồ |
| `faq.html` | Câu hỏi thường gặp đóng/mở |
| `login.html` | Đăng nhập, đăng ký mô phỏng |
| `cart.html` | Giỏ hàng dùng chung, tổng tiền và xác nhận mô phỏng |
| `careers.html` | Vị trí tuyển dụng và biểu mẫu ứng tuyển mô phỏng |
| `css/style.css` | Màu sắc, bố cục và responsive chung |
| `js/products.js` | Dữ liệu 12 sản phẩm, tên danh mục, định dạng tiền và tìm sản phẩm |
| `js/cart.js` | Đọc/lưu giỏ dùng chung, số lượng và tổng tiền |
| `js/main.js` | Card liên quan, bộ lọc, chi tiết, menu, biểu mẫu và bài viết |
| `images/` | Minh họa SVG cục bộ; xem `images/SOURCES.md` |
| `docs/` | Hướng dẫn, báo cáo và bảng phân công |

Danh sách sản phẩm, sản phẩm nổi bật và danh sách tin tức được viết sẵn trong HTML để dễ đọc và giữ nội dung khi tắt JavaScript. Bộ lọc chỉ ẩn/hiện các `.product-wrapper`. Khi đổi tên, giá hoặc ảnh, cập nhật **cả dữ liệu trong `products.js` lẫn các thẻ HTML tương ứng**. Nội dung chi tiết và giá tính giỏ lấy từ dữ liệu JavaScript dùng chung.

## Học, sửa và thuyết trình

- [Hướng dẫn theo 9 giai đoạn](docs/HUONG_DAN.md): cách đọc HTML, CSS, JavaScript; chạy và sửa dự án.
- [Dàn ý báo cáo và kịch bản demo](docs/BAO_CAO.md), kèm [PowerPoint](docs/BAO_CAO.pptx).
- [Bảng phân công Excel](docs/PHAN_CONG.xlsx), kèm [CSV](docs/PHAN_CONG.csv). Nhóm tự điền họ tên, mã sinh viên, tiến độ và điểm đánh giá.
- [Kịch bản và kết quả kiểm thử](docs/KIEM_THU.md): phân biệt phần đã chạy và phần còn cần kiểm tra trên máy nhóm.

## Kiểm thử tự động dành cho phát triển

`tests/smoke.cjs` là công cụ kiểm tra tùy chọn, **không phải mã chạy website**. Công cụ này cần Node.js, gói Playwright và Chromium trong môi trường phát triển. Người chỉ muốn mở website bằng Live Server không cần các công cụ đó.

Trong môi trường đã có công cụ kiểm thử, mở terminal tại **thư mục gốc kho mã `newskill`**, chạy máy chủ:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Giữ terminal đó chạy, mở terminal thứ hai tại cùng thư mục rồi chạy:

```sh
node sisimimi/tests/smoke.cjs
```

Mặc định, bài kiểm tra dùng địa chỉ `http://127.0.0.1:8000/sisimimi/` và Chromium ở `/usr/bin/chromium`. Có thể đặt biến môi trường `SISIMIMI_BASE_URL` và `CHROMIUM_PATH` nếu máy bạn dùng địa chỉ hoặc đường dẫn khác. Ví dụ trên Bash, nếu máy chủ chạy ngay trong thư mục `sisimimi`:

```sh
SISIMIMI_BASE_URL=http://127.0.0.1:8000/ node tests/smoke.cjs
```

Kết quả được ghi tại `docs/ket-qua-kiem-thu.json`; lệnh trả trạng thái lỗi nếu có kiểm tra thất bại. Công cụ chặn dịch vụ ngoài để kiểm tra các tệp và chức năng cục bộ; không dùng kết quả này để tuyên bố bản đồ Google Maps đã tải được hoặc các trình duyệt khác đã được kiểm tra.

## Phạm vi mô phỏng

Giỏ hàng chỉ lưu ID và số lượng trong `localStorage`. Không lưu mật khẩu, dữ liệu biểu mẫu hay CV. Đăng nhập, đăng ký, liên hệ, ứng tuyển và xác nhận đơn hàng là mô phỏng tại trình duyệt; không gửi email, tạo tài khoản, tải CV hoặc thu tiền. Khuyến mãi, đánh giá, thông tin cửa hàng và nhân sự là dữ liệu minh họa.

Google Maps cần mạng và có thể bị chặn trong một số môi trường. Các hình minh họa của cửa hàng được lưu cục bộ. Không suy diễn kết quả Chromium thành kết quả của Chrome, Edge hoặc Firefox bản cài riêng; xem báo cáo kiểm thử.

## Đóng gói để nộp

Điền thông tin nhóm trong PowerPoint và Excel. Nén toàn bộ thư mục `sisimimi` thành `NhomX_sisimimi.zip`, thay `X` bằng số nhóm thật. Thư mục `docs` đã chứa báo cáo PowerPoint và bảng Excel. Giải nén bản ZIP ra một thư mục khác, mở lại `index.html` bằng Live Server và thử giỏ hàng trước khi nộp. Không nén kèm `.git`, dữ liệu tài khoản hoặc thư mục cài công cụ phát triển.
