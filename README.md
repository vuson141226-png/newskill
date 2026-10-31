# Chấm công lương — 1.0.0

Bản phát hành đã kiểm thử, có giới hạn dữ liệu và chốt hiển thị số tiền an toàn. Chi tiết trong `RELEASE_NOTES.md`.

App cá nhân React + Vite + TypeScript + Tailwind. Chấm SEO/Marketing theo buổi, tính phí đi quay và tổng ngày/tuần/tháng. Không đăng nhập, không backend, không gửi dữ liệu chấm công ra ngoài. Không bơm dữ liệu mẫu vào app.

## Chạy và build

Yêu cầu Node.js 22.12+ hoặc 24 LTS.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Bản triển khai nằm trong `dist/`. Màu sáng/tối theo hệ thống. Font Be Vietnam Pro và IBM Plex Mono nằm trong dự án, giấy phép được đóng gói vào `dist/licenses/` từ `public/licenses/`.

## Kiểm thử

```sh
npm test
npx playwright install chromium
npm run test:e2e
```

`npm test`: 157 test đơn vị, gồm logic tiền, giới hạn dữ liệu, kiểm tra file, lưu trữ và phòng thủ hiển thị. `npm run test:e2e`: build rồi chạy 28 test trình duyệt Chromium, gồm thao tác nhập kịch bản, bàn phím, 360/400/768/1280px, sáng/tối, axe WCAG AA và quyền riêng tư. Không cần chạy server riêng; test tự mở/tắt server preview ở cổng 4173.

Nếu đã có Chromium của hệ thống, có thể dùng `CHAMCONG_CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e` trên Linux. Các phụ thuộc Playwright/axe chỉ dùng khi phát triển và kiểm thử, không có trong bản app.

Kiểm tra múi giờ và mã thừa bằng shell hỗ trợ biến môi trường:

```sh
TZ=UTC npm test
TZ=America/Los_Angeles npm test
TZ=Asia/Ho_Chi_Minh npm test
npx tsc --noEmit --noUnusedLocals --noUnusedParameters
```

Hai file `src/logic.ts`, `src/logic.test.ts` giữ nguyên. Test hồi quy phát hành nằm trong `src/release.test.ts` và `tests/release.spec.ts`; giới hạn dữ liệu được kiểm tra trong `src/money-limit.test.ts`, `src/money-display.test.ts` và `tests/limits.spec.ts`. Xem kết quả và giới hạn kiểm tra trong `RELEASE_NOTES.md`.

## Đổi mức tiền

Mở “Mức lương và phí hỗ trợ”, nhập số nguyên đồng từ 0 đến 100.000.000, không có dấu phân cách nghìn, rồi rời ô để lưu. Mức mới tính lại mọi ngày, kể cả tháng cũ. Giá trị sai trở về mức trước đó và có thông báo. Khôi phục mặc định có xác nhận ngay trong trang và không xóa ngày chấm công.

Mốc km cố định: dưới 5 không có phí; 5–10 (gồm đúng 10) dùng mức 1; trên 10 đến dưới 20 dùng mức 2; từ 20 dùng mức 3. Ô km chấp nhận dấu phẩy hoặc dấu chấm; số âm thành 0, chuỗi sai thành trống khi rời ô.

## Giới hạn dữ liệu

Các hằng số được khai báo duy nhất tại `src/limits.ts` và dùng chung cho UI, store, nhập file và đọc localStorage:

- Mỗi mức tiền trong 5 mức: số nguyên từ **0 đến 100.000.000 ₫**, gồm cả hai đầu.
- Khoảng cách: **0 đến 1.000 km**, cho phép thập phân hoặc trống (`null`). Ô nhập vẫn giữ quy tắc chuẩn hóa trước đó: số âm thành 0, chữ không hợp lệ thành trống; số vượt trần bị từ chối và trả lại km cũ.
- Mỗi ngày tối đa **20 lần đi quay**. Bấm thêm lần thứ 21 không tạo dòng hay ghi dữ liệu và hiện giới hạn ngay tại nút.

Ô Cài đặt vượt trần trả về mức trước đó và báo giới hạn. File vi phạm bị từ chối nguyên bộ, có đường dẫn trường sai trong thông báo. Dữ liệu đã lưu sẵn vi phạm, kể cả sau chuyển đổi định dạng cũ, được bảo toàn nguyên văn sang khóa sao lưu trước khi khởi tạo mới. Bản hoàn tác không hợp lệ cũng được giữ sang khóa sao lưu, không đưa lại vào app. Giới hạn áp dụng cả khi app chỉ chạy trong bộ nhớ do localStorage bị chặn.

Một tháng 31 ngày với hai buổi/ngày, 20 lần quay/ngày và mọi mức tiền đều ở trần có tổng tối đa **68.200.000.000 ₫**, vẫn là số nguyên an toàn. Lớp phòng thủ hiển thị kiểm tra `Number.isSafeInteger` cho tổng tháng, tuần, ngày và các số tiền chi tiết; nếu nhận số không an toàn, app hiện cảnh báo thay cho số sai và không sao chép bảng tiền đó. Hai file logic cũ không sửa.

## Sao lưu và khôi phục

- “Xuất dữ liệu” tải `chamcong-YYYY-MM-DD.json` theo ngày địa phương, chứa đúng `schemaVersion`, `rates`, `days`.
- “Nhập dữ liệu” chỉ nhận file `.json`, `schemaVersion: 1`, đủ trường, ngày có thật, buổi hợp lệ, km không âm hoặc null, tiền nguyên không âm. File lỗi không thay đổi dữ liệu.
- File đúng hiện bản xem trước. Chỉ bấm “Thay thế toàn bộ dữ liệu hiện tại” mới thay cả ngày và mức tiền; có thể hủy trước đó.
- Trước khi thay, bản hiện tại được giữ và xác minh trong khóa hoàn tác riêng. “Hoàn tác lần nhập gần nhất” khôi phục cả ngày và mức tiền, thay thế cả các sửa đổi sau lần nhập. Hoàn tác vẫn có sau tải lại trang; lần nhập tiếp theo thay bản hoàn tác bằng dữ liệu ngay trước lần nhập mới.

Dữ liệu lưu trong trình duyệt, theo từng **origin (giao thức + tên miền + cổng)**. Đổi HTTP/HTTPS, miền hoặc cổng sẽ dùng vùng lưu trữ khác. Các đường dẫn trên cùng origin dùng chung khóa app; đặt hai bản ở hai đường dẫn cùng miền không tạo hai bộ dữ liệu độc lập. Hãy xuất file trước khi chuyển địa chỉ, trình duyệt hoặc thiết bị, và trước khi xóa dữ liệu trình duyệt.

Khóa chính: `cham-cong-ca-nhan:v1`; bản trước nhập: `cham-cong-ca-nhan:before-import:v1`. Nếu dữ liệu chính hỏng, phiên bản lạ hoặc vượt giới hạn, app giữ nguyên văn ở khóa `cham-cong-ca-nhan:corrupt:<thời-gian>-<số>`, xác minh xong mới khởi tạo mới; không ghi đè bản sao cũ. Tên khóa hiện trong thông báo và có thể xem ở DevTools → Application/Storage → Local Storage.

Nếu localStorage bị chặn/đầy hoặc chưa sao lưu an toàn được bản gốc, app vẫn chạy trong bộ nhớ và báo “Dữ liệu sẽ mất khi đóng trang, hãy xuất file sao lưu”. Xuất/nhập và hoàn tác vẫn dùng được trong phiên; phải xuất trước khi tải lại/đóng trang. Dữ liệu bình thường chỉ được ghi khi bấm nút hoặc rời ô; ngoại lệ là quá trình sao lưu/khởi tạo dữ liệu hỏng lúc mở app.

## Triển khai

- **Netlify:** kết nối kho mã; build command `npm run build`; publish directory `dist`. Dùng HTTPS do Netlify cấp.
- **GitHub Pages:** Settings → Pages → Source: GitHub Actions. Workflow chạy `npm ci`, `npm run build`, tải `dist` bằng `actions/upload-pages-artifact` rồi triển khai bằng `actions/deploy-pages`; cấp quyền `pages: write`, `id-token: write`, môi trường `github-pages`.
- Vite hiện dùng `base: './'`, hỗ trợ gốc miền và đường dẫn con như `/cham-cong/`. Nếu dùng base tuyệt đối cho kho `ten-kho`, chạy `npm run build -- --base=/ten-kho/` hoặc đặt `base: '/ten-kho/'` trong `vite.config.ts`. Miền riêng ở gốc dùng `/` hoặc giữ `./`.
- Kiểm tra đường dẫn con bằng `npm run preview -- --base /cham-cong/`. Manifest, icon, start URL và scope đều dùng đường dẫn tương đối.

## Thêm vào màn hình chính

Có manifest “Chấm công lương”, `display: standalone`, icon 192/512, maskable, Apple touch icon và theme-color theo hệ thống. Sau khi triển khai HTTPS, dùng “Thêm vào màn hình chính”/“Cài đặt ứng dụng” của trình duyệt nếu hỗ trợ; Safari iOS dùng menu Chia sẻ. Không có service worker, không cam kết chạy ngoại tuyến.

## Quy ước

- Hàm thuần nhận tháng từ 0 đến 11; khóa ngày vẫn là `YYYY-MM-DD` địa phương, không dùng `toISOString`.
- Ngày chỉ đi quay cũng là ngày có làm, kể cả phí bằng 0; đi quay không tự thêm buổi Marketing. Km là số đã nhập, không tự nhân đôi.
- Gợi ý vị trí lấy mọi tháng, so khớp tên sau bỏ khoảng trắng đầu/cuối. Khi km trống, nhớ km đã biết ở ngày mới nhất, rồi lần cuối trong ngày. Không ghi đè km đã có, kể cả 0.
- File v1 xuất–nhập giữ nguyên cả ngày trống và khoảng trắng vị trí. Khi chấm nghỉ/xóa lần quay làm một ngày không còn dữ liệu, ngày đó được xóa khỏi lưu trữ.
- Dữ liệu đếm buổi cũ trong localStorage còn được chuyển bằng `normalize`: xếp SEO trước rồi Marketing; ngày hơn 2 buổi không bị cắt bỏ âm thầm. Nhập file qua giao diện bắt buộc phiên bản 1.
