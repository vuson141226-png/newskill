# Ghi chú bố cục và mã tham chiếu

## Tệp tham chiếu

Bản cập nhật sisimimi này dùng tệp **`S-Chicken (2).zip`** do người dùng cung cấp làm mẫu bố cục và cách tổ chức mã. Đây là bản ZIP cụ thể được yêu cầu đối chiếu; không coi một website S Chicken khác trong kho mã là cùng một bản thiết kế. Tệp ZIP tham chiếu không phải phụ thuộc để mở website và không được đóng gói vào sản phẩm sisimimi.

## Những điểm được chuyển sang sisimimi

- Header/footer có sẵn trong từng HTML, menu phụ và menu điện thoại.
- Nhịp bố cục trang chủ: hero lớn, dải thông điệp, danh mục, sản phẩm nổi bật, khuyến mãi, câu chuyện thương hiệu, lý do lựa chọn và tin tức.
- Thẻ danh sách sản phẩm và tin tức được viết sẵn trong HTML để dễ đọc và chỉnh sửa. Bộ lọc dùng thuộc tính `hidden` của `.product-wrapper`.
- Ba tệp JavaScript có nhiệm vụ riêng: `products.js` cho dữ liệu/tên danh mục/định dạng/tìm ID; `cart.js` cho giỏ; `main.js` cho hàm tạo card liên quan, menu, bộ lọc, chi tiết và biểu mẫu.
- Trang chi tiết có ô số lượng nhập trực tiếp từ 1–99, nút cộng/trừ và tối đa 4 sản phẩm liên quan.

Đây là chuyển thể cửa hàng thú cưng: giữ tên **sisimimi**, slogan, màu hồng pastel, 11 trang, 12 sản phẩm, 4 bài viết và các hình SVG cục bộ. Không chuyển dữ liệu món ăn, màu đỏ/vàng hoặc tên thương hiệu S Chicken thành nội dung cửa hàng thú cưng. Trang `news-detail.html` được giữ để đáp ứng yêu cầu riêng của sisimimi.

## Những sửa chữa có chủ ý

Mẫu là tài liệu tham khảo, không phải lý do giữ nguyên lỗi. Khi chuyển thể:

- Chuẩn hóa thẻ đóng/mở, dấu nháy và thuộc tính HTML bị hỏng hoặc có khoảng trắng sai trong bản tham chiếu; giữ đường dẫn sạch và cấu trúc ngữ nghĩa.
- Dùng một luồng xử lý thêm giỏ cho mỗi lần bấm, tránh cùng nút bị xử lý bởi nhiều listener rồi tăng số lượng hai lần.
- Giữ kiểm tra dữ liệu giỏ, bắt lỗi JSON, kiểm tra ID/số lượng và xử lý trường hợp localStorage bị chặn. Không dùng nguyên thao tác đọc JSON thiếu kiểm tra của mã mẫu.
- Giữ giới hạn số lượng nguyên 1–99, thông báo ID không tìm thấy và nội dung lỗi dễ hiểu.
- Giữ thông báo mô phỏng trung thực; không gửi email, CV, tạo tài khoản hoặc thanh toán thật. Không lưu mật khẩu hay dữ liệu cá nhân vào localStorage.
- Giữ header/footer và biểu mẫu trong HTML để điều hướng còn dùng được khi tắt JavaScript; nút gửi mô phỏng chỉ được bật khi có xử lý JavaScript.

Các điểm trên mô tả chủ đích triển khai. Kết quả chạy và giới hạn kiểm tra của phiên bản bàn giao phải đọc tại [KIEM_THU.md](KIEM_THU.md) và báo cáo JSON của lần chạy tương ứng, không suy từ kết quả cũ của bản tham chiếu.

## Khi tự chỉnh sửa

Giữ nhất quán **dữ liệu `products.js` + thẻ `products.html` + thẻ nổi bật `index.html`**. Với bài viết, đồng bộ **nội dung `main.js` + thẻ `news.html` + phần tin tức `index.html`**. Kiểm tra giá giỏ, ID và đường dẫn sau mỗi lần sửa. Nạp ba script theo thứ tự dữ liệu → giỏ → tương tác trang.
