# Báo cáo phát hành 1.0.0

Ngày chốt: 31/10/2026. Đã hoàn tất rà soát và giới hạn dữ liệu theo phê duyệt. Bản build tĩnh nằm trong `dist/`; chưa triển khai lên dịch vụ hosting.

## Giới hạn dữ liệu

Lỗi mất chính xác khi tổng vượt miền số nguyên an toàn đã được xử lý bằng giới hạn đầu vào, đúng hướng được duyệt. Không sửa `logic.ts` hoặc `logic.test.ts`.

| Dữ liệu | Miền được nhận |
| --- | --- |
| 5 mức tiền | Số nguyên từ 0 đến 100.000.000 ₫ |
| Km mỗi lần quay | Số từ 0 đến 1.000 hoặc null |
| Số lần quay mỗi ngày | Tối đa 20 |

Các hằng số nằm duy nhất ở `src/limits.ts`. Cài đặt, nhập JSON, đọc localStorage, đọc bản hoàn tác, chuyển đổi dữ liệu cũ, ô km và nút thêm quay dùng chung kiểm tra. Store xác minh dữ liệu trước khi cập nhật bộ nhớ hoặc ghi đĩa; việc localStorage bị chặn không bỏ qua giới hạn.

- Vượt trần ở Cài đặt hoặc km: giữ dữ liệu cũ, trả lại giá trị ô và hiện giới hạn. Bấm thêm lần thứ 21 giữ nguyên 20 dòng, focus và dữ liệu.
- File vi phạm bị từ chối nguyên bộ; thông báo chứa trường lỗi và giới hạn. Không ghi cả khóa chính lẫn khóa hoàn tác.
- Dữ liệu localStorage vượt giới hạn, kể cả dữ liệu cũ và bản hoàn tác, được giữ nguyên văn sang khóa sao lưu, xác minh xong mới khởi tạo/xóa khóa nguồn không hợp lệ. Nếu không sao lưu được, giữ nguyên khóa nguồn và dùng bộ nhớ theo quy tắc cũ.
- `SafeMoney` kiểm tra số nguyên an toàn trước hiển thị tổng tháng/tuần/ngày và tiền chi tiết. Tổng không an toàn hiện cảnh báo, không định dạng hoặc sao chép thành số sai. Có test giả lập kết quả tính upstream lỗi để chứng minh cả ba vị trí tổng đều được bảo vệ.

`src/money-limit.test.ts` đã bỏ ca tiền ngoài miền dữ liệu cũ, thay bằng 27 test cho các cửa vào và ca biên, bao gồm đúng 100.000.000 ₫, 1.000 km, 20 lần. Tháng 31 ngày tại trần cho đúng **68.200.000.000 ₫** (đối chiếu BigInt trong test); tổng tháng, tuần, ngày đều an toàn. `tests/limits.spec.ts` có 11 test Chromium kiểm tra từ chối/giữ giá trị, không ghi khi sai, bảo toàn localStorage, nhập và hoàn tác tại trần, và trường hợp chỉ chạy trong bộ nhớ.

## Lỗi tìm thấy và đã sửa

| Lỗi | Bằng chứng trước sửa | Sửa và test hồi quy |
| --- | --- | --- |
| Ô lịch quá nhỏ ở 360px | Rộng 39,71875px, dưới yêu cầu 44px | Giảm lề/khoảng cách lịch dưới 400px; E2E đo tất cả nút ở 360/400/768/1280px, sáng/tối |
| Chữ nhạt chưa đạt AA ở giao diện sáng | Cuối tuần: 3,92:1; tuần trống: 3,59:1; nền ngày chọn còn thấp hơn | Chỉnh biến màu chữ phụ; màu nhạt trên nền chọn đạt khoảng 4,63:1; axe không còn vi phạm WCAG A/AA trong 8 tổ hợp kích thước/giao diện |
| Focus rơi về trang sau hủy/nhập/hoàn tác | Test `toBeFocused` thất bại sau “Hủy nhập”; nút vừa thao tác bị gỡ khỏi DOM | Trả focus về “Nhập dữ liệu” sau cả ba thao tác; test dùng Enter/Space và kiểm tra focus |
| Giấy phép font thiếu trong bản build | Font có trong `dist/assets` nhưng không có bản giấy phép trong output | Chuyển giấy phép sang `public/licenses`, Vite đóng gói vào `dist/licenses`; E2E đọc hai file từ bản build và kiểm tra nội dung OFL |

Các test hồi quy đã được chạy để xác nhận lỗi trước khi sửa; sau sửa đều đạt. Lỗi tổng tiền rất lớn được chặn theo mục Giới hạn dữ liệu ở trên. Bỏ re-export không dùng ở hook. Không có console/debug hoặc API mạng trong mã chạy app; không phát hiện phụ thuộc app thừa. Chỉ thêm công cụ test vào devDependencies.

## Kết quả kiểm tra

- **157/157 test đơn vị** đạt riêng dưới `TZ=UTC`, `TZ=America/Los_Angeles`, `TZ=Asia/Ho_Chi_Minh`. Không còn test thất bại.
- **28/28 test E2E Chromium** đạt, chạy trên bản build production: nhập qua UI, đổi tháng, dữ liệu, bàn phím, bố cục, axe và quyền riêng tư.
- TypeScript với `--noEmit --noUnusedLocals --noUnusedParameters` đạt. Build Vite thành công, không có cảnh báo app đáng kể. Cảnh báo NO_COLOR/FORCE_COLOR trong log test đến từ biến môi trường màu của trình chạy, không phải app.
- `src/logic.ts` và `src/logic.test.ts` giữ nguyên, kiểm tra SHA-256 trước/sau. Kịch bản nghiệm thu và các test giới hạn dữ liệu đều đạt; không còn lỗi chặn phát hành đã biết trong phạm vi kiểm tra.

### Kịch bản nghiệm thu

Đã nhập bằng giao diện với mức mặc định: 01/11 sáng SEO; 02/11 SEO/Marketing; 03/11 sáng Marketing và quay 8/25 km; 04/11 chiều SEO; 30/11 chiều Marketing; 30/10 SEO cả hai buổi.

| Chỉ tiêu tháng 11/2026 | Kết quả |
| --- | --- |
| SEO | 3 buổi: 2 sáng, 1 chiều |
| Marketing | 3 buổi: 1 sáng, 2 chiều |
| Phí đi quay | 250.000 ₫ |
| Tổng tháng | 790.000 ₫ |
| Tuần 1–6 | 80.000 / 610.000 / 0 / 0 / 0 / 100.000 ₫ |
| Tổng các tuần | 790.000 ₫, bằng tổng tháng |
| Tháng 10 | 160.000 ₫, không lẫn vào tháng 11 |

Test dữ liệu mẫu chỉ nằm trong test; không đưa vào dữ liệu thật của app.

### Các mục khác

- Chuyển 12→1 và 1→12 qua năm; tháng 2/2027 có 28 ngày, 2/2028 có 29; 11/2026 bắt đầu Chủ nhật, 6/2026 bắt đầu Thứ hai.
- Khóa ngày và tên file đúng tại 00:15 địa phương trong cả ba múi giờ, gồm kiểm tra các ngày gần đổi DST. Mã app không dùng `toISOString` tạo khóa ngày.
- Các mốc 4,999 / 5 / 10 / 10,001 / 19,999 / 20 km cho phí 0 / 50.000 / 50.000 / 100.000 / 100.000 / 200.000 đồng. Tiền tính theo số nguyên đồng, không dùng chia/nhân km để tính lương.
- Xóa một lần quay ở giữa giữ đúng nội dung, ID và phần tử DOM của dòng sau. Ngày mất cả buổi và lần quay được xóa khỏi localStorage. Nhập → tải lại → hoàn tác → tải lại giữ đúng dữ liệu trước nhập.
- Bốn độ rộng 360/400/768/1280px × sáng/tối: không tràn ngang trang, nút tối thiểu 44px, ô nhập chữ 16px; kiểm tra bảng 42 lần quay và vị trí rất dài. Đã xem ảnh mô phỏng tại các kích thước này.
- Đi qua chuyển tháng, lịch/khung ngày, nhóm buổi, thêm/xóa quay, bảng, sao chép thủ công, Cài đặt/khôi phục, xuất, chọn file, nhập và hoàn tác bằng Tab/Enter/Space. Nhóm buổi có aria-pressed, thông báo aria-live, focus nhìn thấy rõ. Hộp chọn file được điều khiển bằng Playwright, không phải hộp hệ điều hành thật.
- Kiểm tra mã nguồn và request trình duyệt trên bản production: chỉ GET tài nguyên app cùng origin; không XHR/fetch/WebSocket/beacon gửi dữ liệu. Font tải cục bộ, không gọi Google Fonts, không analytics, không backend. Công cụ test không được đưa vào bundle.

## Giả định và giới hạn

- Kỳ lương theo tháng dương lịch, tiền trước thuế/bảo hiểm. Đổi mức tiền áp dụng cả ngày lịch sử. Ngày chỉ đi quay vẫn tính là ngày có làm; km không tự nhân đôi.
- “Lần gần nhất” của vị trí ưu tiên ngày mới nhất rồi lần cuối trong ngày có km đã biết. Dữ liệu cũ chỉ đếm buổi xếp SEO trước Marketing vì không có thông tin sáng/chiều; trường hợp hơn hai buổi cần đối chiếu, không tự cắt.
- Dữ liệu theo origin, không theo đường dẫn con; không đồng bộ thiết bị. Khi localStorage bị chặn, xuất file là cách giữ dữ liệu phiên. Hoàn tác khôi phục toàn bộ bản trước nhập, gồm các sửa đổi phát sinh sau lần nhập đó.
- Chưa kiểm tra bằng mắt trên điện thoại thật, Safari, Firefox, trình đọc màn hình, popup datalist/hộp chọn và lưu file của từng hệ điều hành, thêm app lên màn hình chính hoặc dán trực tiếp vào Excel. Kiểm tra axe không thay thế việc sử dụng trình đọc màn hình thực tế.
- Không thêm service worker, không kiểm tra/cam kết chạy ngoại tuyến. Lỗi tổng tiền rất lớn đã được chặn bằng giới hạn dữ liệu được duyệt; không còn lỗi đã biết chưa xử lý trong phạm vi kiểm tra.

Lệnh chạy, test, build, triển khai GitHub Pages/Netlify và sao lưu/khôi phục nằm trong README.
