# Kiểm thử website sisimimi

## Kết quả lần chạy hiện tại

Ngày 28/10/2026, đã chạy bộ kiểm thử `tests/smoke.cjs` bằng Chromium headless qua Playwright trong môi trường Linux. Kết quả **80 lượt đạt, 0 lỗi, 0 bỏ qua**: 55 tổ hợp **11 trang × 5 chiều rộng** (320, 375, 768, 1280, 1920px) và 25 nhóm kiểm tra còn lại. Đây không phải 80 kịch bản nghiệp vụ độc lập. Bằng chứng chi tiết của lần chạy nằm trong [ket-qua-kiem-thu.json](ket-qua-kiem-thu.json).

Đã xác minh: title riêng, mỗi trang một `h1`, ảnh tải thành công, không tràn ngang kể cả giỏ có dữ liệu; 29 liên kết cục bộ trả HTTP 200; tìm kiếm có/không dấu, lọc danh mục, chi tiết và ID lạ; ô nhập số lượng và giới hạn 1–99, bốn sản phẩm liên quan ưu tiên cùng danh mục (mỗi lần bấm chỉ thêm một món), lưu giỏ và tổng 337.000 → 496.000 → 318.000 ₫; hủy/xác nhận thanh toán; dữ liệu lưu trữ hỏng; bốn bài viết; FAQ và menu bàn phím; kiểm tra biểu mẫu, CV sai định dạng/quá lớn; giảm chuyển động và biểu mẫu khi tắt JavaScript; 12 thẻ danh sách, 4 thẻ nổi bật và 4 thẻ tin tức vẫn hiện khi tắt JavaScript. Giá, tên và ảnh trong thẻ HTML đã được đối chiếu với dữ liệu dùng để tính giỏ hàng. Không ghi nhận lỗi JavaScript, tài nguyên cục bộ HTTP 4xx/5xx, POST hoặc lưu mật khẩu/thông tin biểu mẫu. Các yêu cầu ngoài đã được chặn để kiểm tra phần cục bộ.

Đã xem ảnh chụp giao diện trang chủ, danh sách sản phẩm và chi tiết túi vận chuyển ở 1280px và 375px. Đã xem thêm cả 12 ảnh sản phẩm trên nền hồng để phát hiện khung nền thừa hoặc viền tách nền lỗi. Kiểm tra tự động bên trên bao phủ bố cục cả 11 trang ở năm chiều rộng. Không thấy nút bị cắt, ảnh vỡ hay lỗi bố cục cần sửa. Ảnh [trang chủ](giao-dien-trang-chu.png) và [sản phẩm](giao-dien-san-pham.png) được lưu để thuyết trình. Không sử dụng báo cáo S Chicken trong thư mục gốc làm bằng chứng cho sisimimi.

| Môi trường | Trạng thái |
|---|---|
| Chromium tự động trong môi trường phát triển | 80/80 lượt đạt; xem JSON để biết từng nhóm |
| Google Chrome trên máy nhóm | Chưa xác minh |
| Microsoft Edge trên máy nhóm | Chưa xác minh |
| Mozilla Firefox | Chưa xác minh |
| Điện thoại cảm ứng vật lý | Chưa xác minh |
| Google Maps qua Internet | Chưa xác minh |

Bản kiểm tra này áp dụng cho phiên bản **chỉ bán đồ cho chó và cún con**, giữ bố cục tham khảo **S-Chicken (2).zip** và ba tệp `products.js`, `cart.js`, `main.js`. Cả 11 trang và các chi tiết sản phẩm/bài viết được mở trong bộ kiểm tra đều được kiểm tra không còn nội dung về loài khác. 12 thẻ sản phẩm dùng đúng ảnh PNG và dữ liệu tên/giá tương ứng. Không dùng kết quả của phiên bản cũ thay thế cho lần chạy hiện tại.


## Kiểm tra ảnh nền trong suốt

Đã kiểm tra riêng **13/13 PNG** (12 sản phẩm và banner hai cún): đều có kênh RGBA, alpha từ 0 đến 255 và trên 15% điểm ảnh hoàn toàn trong suốt. Kết quả kèm kích thước và mã SHA-256 nằm tại [kiem-tra-anh.json](kiem-tra-anh.json). Đây là kiểm tra tệp ảnh độc lập, không cộng vào 80 lượt trình duyệt. Ảnh minh họa được tạo theo phong cách chụp sản phẩm; không phải ảnh hàng thật đã được xác minh.

Ảnh sản phẩm SVG cũ và các hình không còn phù hợp đã được bỏ khỏi gói hiện tại. Font, logo và ba chân dung nhân vật mẫu vẫn lưu cục bộ.

## Chuẩn bị

Chạy lại tự động từ thư mục gốc `newskill` (cần Node.js, Playwright và Chromium **chỉ cho kiểm thử**, website không cần các công cụ này):

```sh
python3 -m http.server 8000
# Mở terminal thứ hai tại cùng thư mục:
node sisimimi/tests/smoke.cjs
```

Nếu mở server ngay trong thư mục `sisimimi`, đặt `SISIMIMI_BASE_URL=http://127.0.0.1:8000/` khi chạy script. Có thể đặt `CHROMIUM_PATH` theo đường dẫn Chromium trên máy. Script ghi đè báo cáo JSON bằng kết quả lần chạy mới và trả mã lỗi khác 0 khi kiểm tra thất bại.

Mở đúng thư mục `sisimimi` bằng Live Server hoặc máy chủ tệp Python. Giữ cùng địa chỉ/cổng, dùng dữ liệu giả. Mở Developer Tools → Console và Network. Xóa riêng khóa `sisimimi-cart` để bắt đầu giỏ trống; không xóa dữ liệu website khác.

## Bộ kịch bản

| Mã | Thao tác | Kết quả mong đợi |
|---|---|---|
| HTML-01 | Mở đủ 11 HTML | Trang tải, title riêng, nội dung đúng loại trang |
| NAV-01 | Bấm logo, menu, footer | Đích tồn tại, trang hiện tại được đánh dấu |
| IMG-01 | Xem mọi ảnh/đợi tải lazy khi cuộn | Không ảnh vỡ; tỷ lệ hợp lý, có alt |
| PROD-01 | Mở sản phẩm | Ít nhất 8 sản phẩm; 4 danh mục có dữ liệu |
| PROD-02 | Lọc từng danh mục | Chỉ đúng sản phẩm thuộc nhóm |
| PROD-03 | Tìm tên rồi từ không tồn tại | Kết quả đúng, trạng thái không có kết quả rõ |
| PROD-04 | Mở `?id=1`, `?id=2`, `?id=999` | Hai sản phẩm khác nhau; ID lạ có thông báo |
| PROD-05 | Giảm dưới 1, tăng trên 99 | Giữ giới hạn, thêm đúng số lượng đã chọn |
| CART-01 | ID1×2 + ID2×1 | 3 món, tổng 337.000 ₫ |
| CART-02 | Tăng ID2 lên 2 | 4 món, tổng 496.000 ₫ |
| CART-03 | Xóa ID1 | 2 món, tổng 318.000 ₫ |
| CART-04 | Tải lại và chuyển trang | Giỏ và huy hiệu đồng nhất tại cùng origin |
| CART-05 | Hủy hộp thanh toán | Giỏ còn dữ liệu |
| CART-06 | Xác nhận thanh toán mô phỏng | Thông báo mô phỏng, giỏ trống, không thu tiền |
| CART-07 | Lưu JSON hỏng, null, ID lạ, lượng âm vào khóa giỏ | Không lỗi JavaScript; dữ liệu không hợp lệ không xuất hiện |
| NEWS-01 | Mở 4 bài từ danh sách | Đúng tiêu đề/ảnh/nội dung/tác giả/ngày mẫu |
| NEWS-02 | ID bài viết không tồn tại | Thông báo không tìm thấy, có đường quay lại |
| FAQ-01 | Mở/đóng ít nhất 10 câu hỏi | Trả lời đúng câu, dùng được bằng Enter/Space |
| FORM-01 | Gửi trống/toàn khoảng trắng | Báo lỗi và chỉ trường cần sửa |
| FORM-02 | Email/điện thoại sai | Không báo thành công, hiển thị lỗi |
| AUTH-01 | Chuyển tab đăng nhập/đăng ký | Hiển thị đúng biểu mẫu |
| AUTH-02 | Mật khẩu xác nhận khác | Báo lỗi; không lưu mật khẩu |
| FORM-03 | Gửi dữ liệu giả hợp lệ | Chỉ thông báo mô phỏng, không gửi mạng |
| JOB-01 | Bấm từng nút ứng tuyển | Chọn trước vị trí và đến đúng biểu mẫu |
| JOB-02 | Chọn CV và gửi hợp lệ | Không tải CV lên máy chủ, thông báo mô phỏng |
| MOBILE-01 | Menu ở 320/375px, Escape | Mở/đóng đúng và aria-expanded đồng bộ |
| LAYOUT-01 | 11 trang ở 320,375,768,1280px | Không tràn ngang; form/card đọc và thao tác được |
| A11Y-01 | Tab qua menu/nút/form | Focus nhìn thấy, không bị kẹt |
| MOTION-01 | Bật giảm chuyển động hệ thống | Chuyển động được giảm theo CSS |
| JS-01 | Sử dụng các chức năng bình thường | Không có lỗi JavaScript Console |
| OFFLINE-01 | Chặn yêu cầu ngoài | Tệp cục bộ và giỏ hoạt động; bản đồ có thể không tải |
| NOJS-01 | Tắt JavaScript rồi mở form | Không gửi mật khẩu/biểu mẫu bằng GET; điều hướng HTML còn dùng được |

Các số tổng dựa trên giá mẫu ID1 = 89.000 ₫, ID2 = 159.000 ₫. Nếu nhóm sửa giá, cập nhật cả dữ liệu kiểm thử.

## Cách ghi bằng chứng

Ghi theo mẫu: `Ngày | trình duyệt/phiên bản | mã kịch bản | đạt/lỗi/chưa chạy | bằng chứng/ghi chú`. Đạt nghĩa là đã thực hiện thao tác và đối chiếu kết quả; một trang mở được không chứng minh toàn bộ giỏ hàng hoạt động. Không gộp kiểm tra bị bỏ qua với kiểm tra đã đạt.

| Ngày | Môi trường | Mã | Kết quả | Ghi chú |
|---|---|---|---|---|
| | | | | |

## Giới hạn cần trình bày

Website không có backend, xác thực, email, tải CV hoặc thanh toán thật. Không thể kiểm chứng những luồng thật đó bằng bài tập hiện tại. Bản đồ là dịch vụ bên ngoài và cần Internet. Ảnh sản phẩm là minh họa PNG tách nền theo phong cách ảnh chụp; logo và chân dung là SVG. Đánh giá và nhân sự là mẫu. Kiểm thử responsive bằng trình duyệt không thay cho kiểm thử điện thoại vật lý hoặc trình đọc màn hình.
