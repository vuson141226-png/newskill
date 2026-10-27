# Hướng dẫn học và chỉnh sửa website sisimimi

Đây là hướng dẫn đọc **bộ mã nguồn hoàn chỉnh đi kèm**, không yêu cầu bạn chép lại một website từ nhiều đoạn rời. Mở mỗi tệp được nêu bằng Visual Studio Code, đọc chú thích tiếng Việt theo từng phần, sửa một thay đổi nhỏ rồi kiểm tra ngay. Không cần cài Node.js, npm hoặc cơ sở dữ liệu.

## Giai đoạn 1 — Chuẩn bị và hiểu cấu trúc

Mục tiêu của sisimimi là giới thiệu và mô phỏng mua sắm đồ dành cho chó, mèo. Người xem có thể tìm sản phẩm, xem chi tiết, quản lý giỏ và thử các biểu mẫu. Không có đặt hàng thật.

### 1.1. Tìm đúng thư mục

1. Tải kho mã từ GitHub bằng **Code → Download ZIP**.
2. Giải nén ZIP vào thư mục dễ tìm, ví dụ `Documents/BaiTapWeb`.
3. Mở Visual Studio Code → **File → Open Folder** → chọn thư mục con `sisimimi`.
4. Trong cột tệp bên trái, bạn phải thấy trực tiếp `index.html`, `css`, `js` và `images`. Nếu thấy website S Chicken thì bạn đang ở thư mục gốc cũ, hãy mở tiếp `sisimimi`.

### 1.2. Vai trò của các tệp

```text
sisimimi/
├── index.html
├── about.html
├── products.html
├── product-detail.html
├── news.html
├── news-detail.html
├── contact.html
├── faq.html
├── login.html
├── cart.html
├── careers.html
├── css/style.css
├── js/products.js
├── js/cart.js
├── js/main.js
├── images/
├── fonts/
├── docs/
└── README.md
```

HTML xác định nội dung và vị trí các khối. CSS quyết định màu, kích thước, khoảng cách và bố cục. JavaScript phản hồi khi người dùng tìm kiếm, bấm nút hoặc gửi biểu mẫu. `images/` chứa các minh họa SVG, cũng là tệp hình ảnh và có thể mở bằng trình duyệt. `fonts/` chứa phông chữ cục bộ và giấy phép nếu được phân phối cùng dự án. `docs/` chứa tài liệu học và bàn giao, không tham gia xử lý giỏ hàng.

### 1.3. Bố cục và bảng màu

Các trang đều dùng: **header → menu → main → footer**. Trang chủ theo bố cục bản ZIP tham chiếu: hero lớn, các dải lợi ích, 4 danh mục, 4 sản phẩm nổi bật, khuyến mãi, câu chuyện thương hiệu, lý do lựa chọn và tin tức. Màu hồng pastel và nội dung thú cưng được giữ thống nhất. Trang sản phẩm dùng lưới; trang chi tiết dùng ảnh và nội dung cạnh nhau trên màn hình rộng; trang thông tin dùng nội dung và biểu mẫu.

| Mục đích | Màu |
|---|---|
| Hồng pastel | `#FFD6E5` |
| Hồng chủ đạo | `#F4A7C1` |
| Hồng đậm | `#D95A87` |
| Trắng hồng | `#FFF8FB` |
| Kem | `#FFF1E6` |
| Chữ | `#49343D` |

Bản bố cục tham chiếu là tệp **`S-Chicken(2).zip`** do người dùng cung cấp. Chỉ dùng cách tổ chức và bố cục làm mẫu; không đổi thương hiệu sisimimi thành S Chicken và không giữ dữ liệu gà rán. [Ghi chú tham chiếu](THAM_CHIEU.md) giải thích điểm giữ lại và những lỗi không sao chép.

**Tự kiểm tra:** đếm 11 tệp HTML ở gốc `sisimimi`, mở `index.html` và nhận diện header, main, footer. Không tính 11 phần trong một trang là 11 trang.

## Giai đoạn 2 — HTML trang chủ, giới thiệu và sản phẩm

### 2.1. Đọc `index.html`

`<!DOCTYPE html>` khai báo HTML5. `<html lang="vi">` cho biết ngôn ngữ tiếng Việt. `<head>` chứa thông tin tài liệu, không phải khối banner nhìn thấy. `<meta charset="UTF-8">` giúp tiếng Việt hiển thị đúng. Thẻ viewport giúp điện thoại dùng đúng chiều rộng thiết bị. `<title>` là tên tab trình duyệt; `<body>` chứa phần người xem thấy.

`<header>` chứa thương hiệu và điều hướng đầu trang. `<nav>` đánh dấu nhóm liên kết điều hướng. `<main>` chứa nội dung chính riêng của trang. `<section>` nhóm một chủ đề và thường có tiêu đề. `<article>` là một khối tương đối độc lập như thẻ sản phẩm hay bài viết. `<footer>` chứa thông tin cuối trang.

`<h1>` là tiêu đề chính; `<h2>` là nhóm nội dung lớn, sau đó đến `<h3>`. Không dùng thẻ tiêu đề chỉ để làm chữ to: đổi kích thước bằng CSS. `<p>` là đoạn văn; `<div>` là hộp nhóm chung khi không có ý nghĩa nội dung riêng.

### 2.2. Đọc `about.html`

Xem cách ảnh đi cùng đoạn văn, rồi cách các thẻ giá trị và đội ngũ lặp lại cấu trúc. Đội ngũ trong website là nhân vật minh họa, không thay cho tên thành viên nhóm trong báo cáo. Khi sửa văn bản, chỉ sửa nội dung giữa thẻ mở và đóng; giữ nguyên cấu trúc và đường dẫn.

### 2.3. Đọc `products.html`

Trang chứa ô tìm kiếm, các nút danh mục và 12 thẻ sản phẩm **viết sẵn trong HTML**. Mỗi thẻ nằm trong một `.product-wrapper`; JavaScript ở `js/main.js` đặt thuộc tính `hidden` để ẩn/hiện thẻ phù hợp từ khóa và danh mục. Bốn thẻ nổi bật cũng có sẵn trong `index.html`. Mảng `products` trong `js/products.js` là nguồn cho chi tiết, card liên quan và tính giá giỏ. Khi đổi tên, giá hoặc ảnh, cập nhật cả mảng này và các thẻ HTML tương ứng; không chỉ sửa chữ trong Inspect.

### 2.4. Các điểm dễ nhầm

| Khái niệm | Cách hiểu và dùng |
|---|---|
| `class` | Nhóm nhiều phần tử cùng kiểu; ví dụ các nút cùng lớp `button` |
| `id` | Tên riêng duy nhất trong một trang; JavaScript dùng để tìm đúng ô hoặc vùng nội dung |
| `<div>` và `<section>` | `div` nhóm để bố trí; `section` là phần nội dung theo chủ đề |
| `<a>` và `<button>` | `a` chuyển đến địa chỉ khác; `button` thực hiện thao tác như thêm giỏ |
| `<img src="…" alt="…">` | `src` chỉ tệp ảnh, `alt` mô tả ảnh cho người không nhìn được ảnh |
| Đường dẫn tương đối | `images/logo.svg` tính từ vị trí tệp HTML; phù hợp khi nén gửi máy khác |
| Đường dẫn tuyệt đối | Địa chỉ đầy đủ như `https://…`; đường dẫn máy cá nhân như `C:\…` không dùng để chia sẻ website |

**Tự kiểm tra:** bấm logo về trang chủ, bấm mục sản phẩm, xem các tên tab khác nhau. Kiểm tra menu đánh dấu đúng trang hiện tại. Tắt JavaScript để xem phần điều hướng và nội dung HTML vẫn có; các tương tác động cần bật lại JavaScript.

## Giai đoạn 3 — Chi tiết sản phẩm và tin tức theo ID

### 3.1. `product-detail.html`

Ví dụ liên kết `product-detail.html?id=1` gồm tên tệp và phần truy vấn `?id=1`. `URLSearchParams` trong JavaScript đọc giá trị `id`, đổi thành số rồi tìm sản phẩm có ID tương ứng trong mảng. Thay số `1` bằng `2` phải hiển thị sản phẩm khác. ID không tồn tại phải hiện thông báo thay vì làm trang lỗi.

Trang chi tiết có vùng ảnh, tên, giá, mã, danh mục, mô tả, thuộc tính và đánh giá mẫu. Ô số lượng `type="number"` nhận số từ 1–99; người xem có thể nhập trực tiếp hoặc dùng nút cộng/trừ trước khi thêm giỏ. Có tối đa 4 sản phẩm liên quan bên dưới. Giới hạn và kiểm tra số nguyên giúp tránh số không hợp lệ. Nút tư vấn liên kết sang `contact.html`.

### 3.2. `news.html`

Đây là danh sách 4 bài viết, các thẻ được viết sẵn trong `news.html`. Mỗi thẻ có ảnh, tên tác giả minh họa, ngày đăng mẫu, tóm tắt và liên kết đọc thêm. Nội dung đầy đủ theo ID nằm trong `js/main.js`; khi sửa tiêu đề, ảnh hoặc tóm tắt, cần sửa cả thẻ HTML và dữ liệu tương ứng. Các thẻ tin tức nổi bật trên trang chủ cũng được cập nhật cùng lúc. Nội dung chăm sóc thú cưng mang tính tham khảo; khi thú cưng có dấu hiệu bệnh cần hỏi bác sĩ thú y.

### 3.3. `news-detail.html`

Liên kết `news-detail.html?id=1` dùng cùng ý tưởng như chi tiết sản phẩm nhưng tìm trong dữ liệu bài viết. Nội dung gồm tiêu đề, thông tin tác giả, ảnh và các tiêu đề phụ. ID của bài viết và ID của sản phẩm thuộc hai danh sách riêng, không cần trùng ý nghĩa.

**Tự kiểm tra:** mở `product-detail.html?id=1`, `?id=2`, `?id=999`; mở từng bài từ danh sách tin tức và thử `news-detail.html?id=999`. Kiểm tra nút quay lại và nút tư vấn.

## Giai đoạn 4 — Liên hệ, FAQ và tài khoản

### 4.1. `contact.html`

`<form>` gom các trường nhập. `<label for="ten-id">` gắn nhãn với `<input id="ten-id">`. `name` đặt tên dữ liệu của trường. `type="email"` kiểm tra cấu trúc email cơ bản; `type="tel"` hỗ trợ bàn phím số trên điện thoại. `required` yêu cầu điền; `minlength` giới hạn độ dài tối thiểu; `pattern` mô tả mẫu ký tự. `<textarea>` dành cho nội dung dài; `<select>` là danh sách chọn.

JavaScript chặn gửi mặc định bằng `event.preventDefault()`, kiểm tra chuỗi trắng và dữ liệu rồi hiển thị thông báo mô phỏng. Không có máy chủ nhận email. Các nút gửi chỉ được bật khi JavaScript hoạt động để hạn chế việc gửi nhầm biểu mẫu lúc tắt JavaScript.

`<iframe>` nhúng một trang bản đồ bên ngoài. Địa chỉ là minh họa tại Hà Nội, không phải cam kết cửa hàng thật. Bản đồ cần Internet; các tệp ảnh sản phẩm vẫn dùng tệp cục bộ.

### 4.2. `faq.html`

Mỗi `<details>` chứa một `<summary>` và phần trả lời. Trình duyệt tự mở/đóng khi bấm hoặc dùng bàn phím, nên không cần viết JavaScript riêng để làm accordion. Các nhóm mua hàng, thanh toán, vận chuyển, đổi trả và chăm sóc giúp dễ tìm nội dung.

### 4.3. `login.html`

Hai biểu mẫu đăng nhập/đăng ký được chuyển bằng nút tab. `hidden` ẩn biểu mẫu chưa dùng. Ô mật khẩu dùng `type="password"`, nhưng che ký tự trên màn hình không tạo ra hệ thống bảo mật máy chủ. Mật khẩu xác nhận phải trùng mật khẩu. Website chỉ kiểm tra và báo mô phỏng; không tạo tài khoản hay lưu mật khẩu.

**Tự kiểm tra:** gửi form trống, email sai, số điện thoại sai và chuỗi toàn khoảng trắng; thử mật khẩu xác nhận khác nhau. Sau đó dùng dữ liệu giả hợp lệ, đọc kỹ thông báo mô phỏng. Mở ít nhất 10 câu FAQ. Không nhập mật khẩu thật vào bài tập.

## Giai đoạn 5 — Giỏ hàng và tuyển dụng

### 5.1. `cart.html`

Trang hiển thị các dòng sản phẩm, đơn giá, số lượng, thành tiền và tổng đơn. Một khóa `sisimimi-cart` được dùng chung trên toàn bộ website. Chỉ lưu ID và số lượng; giá được lấy lại từ dữ liệu sản phẩm để có một nguồn thống nhất.

Công thức: **thành tiền = đơn giá × số lượng**; **tổng đơn = tổng thành tiền của mọi dòng**. Đổi số lượng hoặc xóa món phải cập nhật cả tổng tiền và huy hiệu giỏ ở header. Hộp xác nhận thanh toán ghi rõ đây là mô phỏng; không có giao dịch tiền.

`localStorage` tồn tại theo **origin**: giao thức + tên miền + cổng. `localhost` và `127.0.0.1`, hoặc cổng 5500 và 8000, là những nơi lưu khác nhau. Đây là lý do nên dùng một địa chỉ nhất quán khi demo.

### 5.2. `careers.html`

Ba vị trí là dữ liệu tuyển dụng giả lập. Nút ứng tuyển chuyển người xem đến biểu mẫu và chọn trước vị trí. `<input type="file">` cho phép người dùng chọn CV; việc chọn một tệp không đồng nghĩa nó được tải lên. Website không có điểm nhận tệp trên máy chủ.

**Tự kiểm tra:** thêm 2 vòng cổ 89.000 ₫ và 1 áo hoodie 159.000 ₫: tổng **337.000 ₫**. Tăng áo lên 2: **496.000 ₫**. Xóa vòng cổ: **318.000 ₫**. Tải lại trang phải giữ giỏ nếu trình duyệt cho phép lưu trữ. Thử hủy rồi xác nhận hộp thanh toán. Bấm ứng tuyển từng vị trí, kiểm tra ô chọn tương ứng.

## Giai đoạn 6 — Đọc và sửa CSS

Mở `css/style.css`, đọc các phần chú thích từ thiết lập chung đến responsive. Một stylesheet dùng chung giúp đổi màu hoặc nút một lần cho 11 trang. CSS không cần biên dịch.

| Thuộc tính/khái niệm | Vai trò |
|---|---|
| `margin` | Khoảng trống bên ngoài phần tử |
| `padding` | Khoảng đệm từ nội dung đến viền |
| `width`, `height` | Chiều rộng, chiều cao; ảnh thường dùng chiều rộng linh hoạt và giữ tỷ lệ |
| `background-color`, `color` | Màu nền và màu chữ |
| `font-size` | Cỡ chữ; `rem` dựa trên cỡ chữ gốc |
| `display` | Cách phần tử tham gia bố cục, như `block`, `flex`, `grid` |
| Flexbox | Sắp xếp một hàng/cột; `justify-content` và `align-items` căn các phần tử |
| Grid | Chia vùng thành hàng/cột; `grid-template-columns` quyết định số cột |
| `gap` | Khoảng cách giữa các phần tử trong Flexbox/Grid |
| `border` | Viền với độ dày, kiểu nét và màu |
| `border-radius` | Bo góc, có thể dùng cho card và nút |
| `box-shadow` | Bóng đổ để phân biệt card với nền |
| `transition` | Chuyển dần giữa hai trạng thái, như đổi màu khi rê chuột |
| `:hover` | Trạng thái khi con trỏ nằm trên phần tử; điện thoại không dựa vào hover để thao tác |
| `:focus-visible` | Đường viền cho người điều khiển bằng bàn phím |
| `@keyframes`, `animation` | Mô tả và chạy chuyển động nhẹ |
| `@media` | Áp dụng quy tắc khi màn hình hoặc sở thích người dùng thỏa điều kiện |

Nếu thấy `:root { --pink: …; }`, đây là biến CSS: định nghĩa một giá trị dùng nhiều lần bằng `var(--pink)`. Đổi biến màu sẽ đổi các vị trí dùng biến ấy. Đọc đúng tên biến trong tệp trước khi sửa.

Lưới sản phẩm chuyển từ 4 cột ở màn hình lớn sang 2 hoặc 1 cột ở màn hình nhỏ. Nên đổi số cột bằng media query, không đặt chiều rộng cố định lớn hơn điện thoại. `object-fit` giữ hình trong khung; `max-width: 100%` giúp ảnh không tràn. Chế độ `prefers-reduced-motion` giảm chuyển động khi người dùng yêu cầu.

**Tự kiểm tra:** đổi một biến màu rồi tải lại và hoàn tác. Kéo hẹp cửa sổ; kiểm tra menu, card và form. Dùng phím Tab để thấy vị trí focus. Không giải quyết tràn bố cục bằng cách cắt toàn bộ nội dung cần đọc.

## Giai đoạn 7 — Hiểu JavaScript theo chức năng

Đọc lần lượt **`js/products.js` → `js/cart.js` → `js/main.js`**. `products.js` khai báo dữ liệu sản phẩm, tên danh mục, hàm định dạng tiền và hàm tìm sản phẩm theo ID. `cart.js` quản lý giỏ và kiểm tra dữ liệu lưu. `main.js` chứa hàm tạo card liên quan và xử lý bộ lọc, chi tiết, menu, biểu mẫu và chi tiết tin tức. Các tệp được chú thích bằng tiếng Việt và chạy trực tiếp trong trình duyệt; không dùng Node.js để phục vụ cửa hàng.

| Khái niệm | Cách hiểu trong dự án |
|---|---|
| `const` | Khai báo biến không gán lại tên biến; mảng khai báo const vẫn có thể được cập nhật phần tử |
| `let` | Dùng khi cần gán lại giá trị, ví dụ số lượng đang chọn |
| `function` | Gom một nhiệm vụ có tên, như tính tổng hoặc vẽ giỏ |
| `if/else` | Chọn cách xử lý, như có sản phẩm hay không tìm thấy |
| Mảng `[]` | Danh sách nhiều sản phẩm hoặc dòng giỏ |
| Object `{}` | Một sản phẩm có các thuộc tính ID, tên, giá, ảnh |
| Vòng lặp/`forEach` | Thực hiện một thao tác cho từng phần tử trong danh sách |
| `find` | Tìm một sản phẩm theo ID |
| `filter` | Tạo danh sách chỉ gồm những sản phẩm thỏa từ khóa/danh mục |
| `getElementById()` | Tìm một phần tử theo ID |
| `querySelector()` | Tìm phần tử đầu tiên khớp bộ chọn CSS |
| `querySelectorAll()` | Tìm nhiều phần tử cùng khớp bộ chọn |
| `addEventListener()` | Đăng ký hàm chạy khi có sự kiện |
| `click` | Bấm nút thêm, xóa hoặc đổi số lượng |
| `input` | Xảy ra khi nội dung ô tìm kiếm thay đổi |
| `submit` | Xảy ra khi gửi biểu mẫu, cả bấm nút lẫn Enter |
| `textContent` | Gán văn bản thuần; phù hợp thông báo và dữ liệu người nhập |
| `innerHTML` | Gán cấu trúc HTML; chỉ dùng dữ liệu mẫu do dự án kiểm soát, không đưa trực tiếp nội dung người nhập vào đây |
| `localStorage` | Kho lưu chuỗi ở trình duyệt, không phải cơ sở dữ liệu máy chủ |
| `JSON.stringify()` | Đổi mảng/object thành chuỗi để lưu |
| `JSON.parse()` | Đổi chuỗi JSON trở lại dữ liệu; cần bắt lỗi khi chuỗi bị hỏng |

Luồng danh sách: **card HTML có sẵn → từ khóa/danh mục → ẩn/hiện product-wrapper → URL ID**. Luồng chi tiết: **ID → mảng products → nội dung chi tiết và card liên quan → giỏ**. Luồng giỏ: **đọc dữ liệu → kiểm tra ID/số lượng → thao tác → tính tổng → lưu → cập nhật giao diện**. Với biểu mẫu: **chặn gửi mặc định → kiểm tra → hiện lỗi hoặc thông báo mô phỏng**.

Các vùng chỉ có trên một số trang phải được kiểm tra tồn tại trước khi dùng. Ví dụ, trang giới thiệu không có ô tìm kiếm; script chung không được báo lỗi vì thiếu ô đó. Lưu trữ có thể bị chặn hoặc chứa JSON hỏng, nên cần `try/catch` và kiểm tra dữ liệu. Không sửa mã để bỏ qua lỗi bằng cách tắt kiểm tra.

**Tự kiểm tra:** theo dấu một lần bấm thêm giỏ trong mã; chỉ ra ID truyền từ nút, chỗ tìm sản phẩm, chỗ lưu và chỗ cập nhật huy hiệu. Mở Developer Tools → Console, kiểm tra không có lỗi đỏ khi chuyển qua 11 trang.

## Giai đoạn 8 — Kiểm tra có bằng chứng

Xem [KIEM_THU.md](KIEM_THU.md) để chạy từng kịch bản. Báo cáo của một lần kiểm thử không bảo đảm mọi trình duyệt và mọi thiết bị. Nhóm nên chạy Chrome và Edge trên máy của mình, thêm Firefox nếu có điều kiện.

1. Mở đủ 11 trang; kiểm tra title, menu và liên kết cuối trang.
2. Kiểm tra tất cả ảnh; chọn từng danh mục và tìm tên có dấu/không có kết quả.
3. Thử ID đúng, ID sai và số lượng 1–99.
4. Chạy phép tính giỏ ở giai đoạn 5, tải lại, chuyển trang rồi thanh toán mô phỏng.
5. Thử biểu mẫu sai và đúng bằng dữ liệu giả, kiểm tra không gửi dữ liệu ra ngoài.
6. Kiểm tra ở chiều rộng 320, 375, 768, 1280px và màn hình lớn; không để xuất hiện tràn ngang.
7. Dùng bàn phím mở menu, FAQ và đóng hộp thoại bằng Escape.
8. Tắt Internet và kiểm tra các tệp cục bộ; bản đồ ngoài được phép không tải.

Nếu CSS không chạy: kiểm tra tên `css/style.css`, vị trí thư mục, chữ hoa/thường và tab Network. Nếu JavaScript không chạy: kiểm tra ba đường dẫn `js/products.js`, `js/cart.js`, `js/main.js`, đúng thứ tự, thuộc tính `defer`, Console và việc đã bật JavaScript trong trình duyệt. Sau khi sửa, dùng tải lại mạnh để tránh giữ bộ nhớ đệm cũ.

## Giai đoạn 9 — Chạy, chỉnh sửa và đóng gói

### 9.1. Liên kết tệp

Trong các tệp HTML ở gốc `sisimimi`, liên kết CSS bằng:

```html
<link rel="stylesheet" href="css/style.css">
```

Liên kết JavaScript bằng:

```html
<script src="js/products.js" defer></script>
<script src="js/cart.js" defer></script>
<script src="js/main.js" defer></script>
```

`href` chỉ địa chỉ tài nguyên được liên kết, `src` chỉ nguồn tệp cần nạp. `defer` tải script cùng lúc với HTML nhưng chỉ chạy sau khi trình duyệt phân tích xong tài liệu; nhờ vậy script tìm được các phần tử. Ba script dùng `defer` theo đúng thứ tự: dữ liệu phải có trước khi giỏ và chi tiết sử dụng. Không đổi tệp HTML sang thư mục khác mà quên cập nhật đường dẫn.

### 9.2. Chạy bằng Live Server

Mở thư mục `sisimimi` trong VS Code → cài tiện ích Live Server của Ritwick Dey → nhấp phải `index.html` → **Open with Live Server**. Không cần mở terminal hoặc chạy lệnh npm. Dùng một địa chỉ thống nhất cho cả phiên demo. Nhấp đúp HTML vẫn xem được, nhưng không nên dùng `file:` để kết luận giỏ hoạt động giống HTTP.

### 9.3. Chạy bằng Python nếu đã có

Mở terminal trong `sisimimi`, chạy `python3 -m http.server 8000` (Windows có thể dùng `py -m http.server 8000`), rồi dùng địa chỉ máy chủ in ra. Để dừng, nhấn Ctrl+C. Đây là lựa chọn thay Live Server; không cần chạy cả hai.

### 9.4. Đổi nội dung

- **Đổi sản phẩm:** mở mảng `products` trong `js/products.js`; sửa `name`, `price`, `description` và các thuộc tính liên quan. Sau đó sửa thẻ tương ứng trong `products.html`, và trong `index.html` nếu là sản phẩm nổi bật. Giá JavaScript ghi dạng số nguyên, ví dụ `89000`, không ghi chuỗi `"89.000 ₫"`; phần chữ giá trong HTML được định dạng để đọc.
- **Thêm sản phẩm:** sao chép một object sản phẩm đầy đủ trong mảng, đặt ID mới chưa có, bổ sung tệp ảnh vào `images`, sửa đường dẫn ảnh tương đối. Giữ dấu phẩy giữa các object; bổ sung một `.product-wrapper` có đúng tên/danh mục/ID trong `products.html` để bộ lọc tìm thấy sản phẩm mới. Không đổi ID cũ nếu muốn giỏ đã lưu còn đúng món. Đặt danh mục theo một khóa hiện có: `thuc-an`, `do-choi`, `quan-ao`, `phu-kien`.
- **Đổi ảnh:** lưu tệp vào `images`, đặt tên đơn giản không dấu, rồi sửa trường ảnh tương ứng trong `products.js` và các `src` ở HTML. SVG, PNG và JPG đều là tệp ảnh hợp lệ. Sửa cả nội dung `alt` nếu ý nghĩa ảnh thay đổi.
- **Đổi màu:** sửa biến màu ở đầu `css/style.css`, giữ màu chữ đủ đậm và kiểm tra focus.
- **Đổi bài viết:** sửa dữ liệu bài viết trong `js/main.js` và các thẻ tương ứng trong `news.html`/`index.html`, giữ ID duy nhất và kiểm tra cả danh sách lẫn chi tiết.
- **Đổi trang giới thiệu, FAQ, tuyển dụng:** sửa đoạn văn trong tệp HTML tương ứng. Header/footer lặp lại để dễ học; khi đổi thông tin chung phải cập nhật nhất quán cả 11 trang.

### 9.5. Chuẩn bị bài nộp

1. Điền số nhóm, tên môn, lớp và thành viên vào `docs/BAO_CAO.pptx` theo thông tin thật.
2. Điền `docs/PHAN_CONG.xlsx`; không tự chấm điểm người khác khi nhóm chưa thống nhất.
3. Chạy lại checklist và ghi kết quả thực tế vào `docs/KIEM_THU.md`.
4. Đóng terminal máy chủ; không cần lưu tiến trình khi nén.
5. Nhấp phải thư mục `sisimimi` → nén ZIP, đổi tên `NhomX_sisimimi.zip` theo số nhóm.
6. Giải nén ZIP ra vị trí mới; kiểm tra 11 HTML, `css`, `js`, `images`, PowerPoint và Excel đều có.
7. Chạy lại bằng Live Server từ thư mục vừa giải nén, thử ảnh, tìm kiếm và giỏ trước khi nộp.

Không cần nộp `.git`, bộ cài trình duyệt, Node.js hoặc mã kiểm thử của công cụ phát triển. Không có thông tin cá nhân hay mật khẩu trong bản nộp. Chỉ ghi “đã kiểm tra Chrome/Edge/Firefox” sau khi thực sự chạy các trình duyệt đó.
