# Chuẩn bị báo cáo S Chicken

`BAO_CAO.pptx` gồm 10 slide đã tạo từ nội dung dưới đây và ảnh chụp website. Điền số nhóm, lớp, thành viên trước khi nộp; kiểm tra kết quả mới nhất trong `KIEM_THU.md`. Không dùng số kiểm thử của phiên bản cũ để báo cáo bản redesign.

## Dàn ý PowerPoint 10 slide

| Slide | Nội dung đề xuất | Minh họa / người trình bày |
| --- | --- | --- |
| 1 | Tên S Chicken, môn học, nhóm, thành viên, thông điệp | Logo, ảnh trang chủ |
| 2 | Mục tiêu, đối tượng học sinh/sinh viên; giới hạn website tĩnh | Bảng mục tiêu |
| 3 | Công cụ: VS Code, Live Server, DevTools; HTML5/CSS3/JS | Vai trò từng công cụ; không dùng framework |
| 4 | Sơ đồ 10 trang và thanh điều hướng | Sơ đồ liên kết từ trang chủ |
| 5 | Bộ nhận diện: màu đỏ/vàng/kem, logo SVG, Be Vietnam Pro cục bộ, Grid/Flexbox | Ảnh 375/768/1440 px |
| 6 | Trang chủ, giới thiệu và tuyển dụng | Hero, 4 món bán chạy, form ứng tuyển |
| 7 | Thực đơn và trang chi tiết | Lọc 5 nhóm, tìm món, URL ?id=3 |
| 8 | Giỏ hàng và localStorage | Demo 2 burger + 1 gà = 137.000 ₫, tăng/giảm/xóa |
| 9 | Form, FAQ, tin tức; kiểm tra dữ liệu và giới hạn mô phỏng | Thử mật khẩu không khớp, mở FAQ |
| 10 | Phân công, kết quả kiểm thử, hạn chế và hướng phát triển | Tóm tắt đóng góp, nguồn ảnh, lời cảm ơn |

Mỗi slide chỉ nên có 3–5 ý ngắn. Dùng ảnh chụp thật của website, ghi rõ dữ liệu demo và nguồn ảnh. Không trình bày đăng nhập mô phỏng như hệ thống xác thực thực tế. Đề xuất hướng phát triển có thể nhắc backend/thanh toán, nhưng ghi rõ chưa triển khai và ngoài phạm vi bài tập hiện tại.

## Excel phân công nhiệm vụ

Dùng `PHAN_CONG.xlsx` đã tạo sẵn; `PHAN_CONG.csv` giữ dữ liệu gợi ý ban đầu. Mẫu gồm 4 vai trò; họ tên, ngày, điểm và tỷ lệ đóng góp trong XLSX được để trống. Nhóm điền theo công việc thực tế, thêm/bớt thành viên nếu cần. Đối chiếu mẫu Excel riêng của giảng viên trước khi nộp nếu đã được cung cấp.

Các cột nên có:

- Mã thành viên, họ tên, vai trò, nhiệm vụ cụ thể và tệp phụ trách.
- Ngày bắt đầu, hạn hoàn thành, trạng thái, liên kết/minh chứng kết quả.
- Điểm tự đánh giá, điểm nhóm đánh giá, tỷ lệ đóng góp thực tế và ghi chú.

Sau khi nhóm thống nhất, nhập điểm và tỷ lệ dựa trên minh chứng; tổng tỷ lệ cần bằng 100%. Trong XLSX, cột K là tỷ lệ phần trăm từ 0 đến 100; ô tổng chỉ hiển thị sau khi nhập ít nhất một tỷ lệ. Tổng cần bằng 100. Không định dạng cột này thành Percentage lần nữa. Không dùng tỷ lệ chia đều trong mẫu làm kết luận đóng góp thực tế. Mỗi người nên nắm được cấu trúc chung, không chỉ trang mình phụ trách.

## Phân vai demo gợi ý

1. **Thành viên 1 — HTML & thương hiệu:** giải thích cấu trúc HTML, header/footer, liên kết thật, title, logo SVG và nội dung demo.
2. **Thành viên 2 — CSS & responsive:** chỉ vị trí biến màu, Grid/Flexbox, hover, animation, media query và menu di động.
3. **Thành viên 3 — Sản phẩm & giỏ:** giải thích mảng `products`, ID trên URL, `find`, `filter`, tính tổng, localStorage, giới hạn số lượng.
4. **Thành viên 4 — Tương tác & kiểm thử:** chuyển tab tài khoản, kiểm tra form, FAQ, bài viết mở rộng; chứng minh không lưu mật khẩu, trình bày kết quả kiểm thử.

Demo theo thứ tự: trang chủ → thực đơn → lọc/tìm → chi tiết → thêm giỏ → tăng/giảm/xóa → tải lại → xác nhận giả lập → form sai/đúng → responsive. Chuẩn bị sẵn dữ liệu giả, tránh gõ thông tin cá nhân khi thuyết trình.

## Câu hỏi giảng viên và câu trả lời cơ bản

**1. HTML, CSS và JavaScript khác nhau thế nào?**  
HTML tạo cấu trúc và nội dung; CSS quy định cách hiển thị; JavaScript xử lý hành động như lọc món, thêm vào giỏ.

**2. Vì sao dùng thẻ header, main, footer?**  
Các thẻ mô tả đúng vai trò của từng vùng, giúp cấu trúc dễ đọc và hỗ trợ công cụ trợ năng.

**3. Class khác ID thế nào?**  
Class có thể dùng cho nhiều phần tử có chung kiểu. ID phải duy nhất trong một trang, thường dùng để chọn một vùng cụ thể.

**4. Vì sao dùng file CSS chung?**  
Để 10 trang thống nhất màu sắc và thành phần. Đổi một quy tắc dùng chung sẽ ảnh hưởng tất cả trang liên quan.

**5. Grid khác Flexbox thế nào?**  
Grid thuận tiện khi chia lưới hàng và cột như danh sách sản phẩm. Flexbox thuận tiện để xếp và căn một hàng hoặc cột, như thanh menu.

**6. Media query là gì?**  
Là điều kiện CSS theo độ rộng hoặc đặc điểm thiết bị. Ví dụ dưới 600 px, lưới tin tức chuyển về một cột.

**7. DOM là gì?**  
Là mô hình các phần tử của trang mà JavaScript có thể chọn và thay đổi, ví dụ thay chữ tổng tiền.

**8. addEventListener dùng để làm gì?**  
Gắn hàm xử lý cho sự kiện như click, input hoặc submit mà không cần viết onclick trong HTML.

**9. Trang chi tiết biết món nào đang được chọn như thế nào?**  
Đọc `id` trong URL bằng `URLSearchParams`, rồi dùng `find` tìm món có ID tương ứng trong mảng `products`.

**10. Lọc danh mục hoạt động ra sao?**  
Lưu danh mục đang chọn; so sánh với `data-category` của mỗi thẻ. Món không khớp được ẩn bằng thuộc tính `hidden`; từ khóa tên món được kiểm tra thêm.

**11. Vì sao giỏ hàng còn sau khi tải lại?**  
Mảng ID và số lượng được chuyển thành chuỗi JSON bằng `JSON.stringify`, lưu trong localStorage. Khi mở trang, dùng `JSON.parse` để đọc lại.

**12. localStorage có phải cơ sở dữ liệu thật không?**  
Không. Nó nằm trong trình duyệt, theo từng địa chỉ website, người dùng có thể sửa hoặc xóa. Không đồng bộ giữa thiết bị và không bảo đảm tin cậy cho giao dịch thật.

**13. Tổng tiền tính như thế nào?**  
Với từng dòng: đơn giá nhân số lượng. Cộng tất cả dòng. Giá lấy từ dữ liệu sản phẩm; ví dụ 2 × 49.000 + 39.000 = 137.000 đồng.

**14. Nếu dữ liệu giỏ bị hỏng?**  
Dùng `try/catch` khi đọc JSON; kiểm tra ID tồn tại và số lượng là số nguyên dương. Dữ liệu sai không được dùng để tính tổng.

**15. Kiểm tra form ở đâu?**  
HTML kiểm tra trường bắt buộc, email, độ dài và mẫu số điện thoại; JavaScript kiểm tra khoảng trắng và hai mật khẩu trùng nhau rồi hiện thông báo giả lập.

**16. Vì sao không lưu mật khẩu trong localStorage?**  
JavaScript trong trang có thể đọc localStorage; nó không phù hợp để lưu mật khẩu. Bài tập không có xác thực thật nên không lưu tài khoản hay mật khẩu.

**17. preventDefault có tác dụng gì?**  
Ngăn hành vi gửi biểu mẫu mặc định, để JavaScript kiểm tra dữ liệu và hiển thị kết quả ngay trên trang.

**18. textContent khác innerHTML thế nào?**  
textContent đặt nội dung dưới dạng chữ; innerHTML phân tích thẻ HTML. Dự án dùng textContent cho thông báo; các mẫu innerHTML chỉ ghép dữ liệu món được viết sẵn, không ghép dữ liệu nhập vào form.

**19. Vì sao không coi thanh toán là thanh toán thật?**  
Chỉ mở hộp thông báo và xóa giỏ trong trình duyệt, không gửi đến máy chủ và không kết nối dịch vụ thanh toán.

**20. Vì sao một số thẻ HTML sản phẩm và dữ liệu JS phải cập nhật cùng lúc?**  
Thẻ thực đơn viết sẵn để dễ học và vẫn hiển thị nội dung khi không có JavaScript; dữ liệu JS phục vụ chi tiết và giỏ. Đây là đánh đổi về sự đơn giản, nên phải kiểm tra tính nhất quán khi chỉnh sửa.

**21. Em đã kiểm tra trình duyệt nào?**  
Trong môi trường phát triển đã kiểm tra bằng Chromium. Chrome, Edge và Firefox cần được chạy riêng trên máy của nhóm trước khi nộp, không tuyên bố đã kiểm tra nếu chưa chạy.

**22. Website cần Internet không?**  
HTML, CSS, JS và ảnh đều là tệp cục bộ, không có thư viện CDN. Bản đồ Google Maps và các liên kết mạng xã hội cần Internet; có thể bị chặn ở một số môi trường.

## Các tệp mới cần giải thích khi bảo vệ

- `css/tokens.css`: biến màu, chữ, khoảng cách và thời gian; sửa ở một nơi để 10 trang thống nhất.
- `css/base.css`: font, reset, container và quy tắc trợ năng dùng chung.
- `css/style.css`: nhập hai tệp trên rồi định nghĩa các thành phần website. Đây là CSS chuẩn, không có bước build.
- `fonts/`: Be Vietnam Pro cục bộ, có SIL OFL; vẫn đọc được khi không có mạng.
- Giỏ vẽ lại nội dung bằng DOM nên mã cần khôi phục focus để người dùng bàn phím tiếp tục thao tác.
- `aria-expanded` mô tả trạng thái menu/FAQ; `aria-invalid` đánh dấu trường nhập sai; nhãn giỏ cập nhật số món.
