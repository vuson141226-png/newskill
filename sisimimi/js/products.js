/* SISIMIMI — Dữ liệu sản phẩm dùng chung, theo cấu trúc S-Chicken.
   Mỗi object là một sản phẩm; id phải duy nhất và giá tính bằng đồng Việt Nam.
   Cập nhật thẻ HTML trong index.html/products.html khi thay dữ liệu này. */

const products = [
    {
        "id": 1,
        "code": "SI001",
        "name": "Vòng cổ mèo nơ hồng",
        "price": 89000,
        "category": "phu-kien",
        "image": "images/product-1.svg",
        "description": "Một chiếc nơ nhỏ xinh cho những buổi dạo chơi cùng bé.",
        "features": "Khóa an toàn, điều chỉnh được độ rộng",
        "material": "Vải cotton và khóa nhựa",
        "color": "Hồng pastel",
        "size": "Vòng cổ 18–28 cm"
    },
    {
        "id": 2,
        "code": "SI002",
        "name": "Áo hoodie cho chó",
        "price": 159000,
        "category": "quan-ao",
        "image": "images/product-2.svg",
        "description": "Chiếc áo mềm mại giúp bé ấm áp khi thời tiết se lạnh.",
        "features": "Mũ liền áo, dễ mặc và tháo",
        "material": "Nỉ cotton mềm",
        "color": "Hồng phấn",
        "size": "S / M / L; liên hệ để chọn cỡ"
    },
    {
        "id": 3,
        "code": "SI003",
        "name": "Bát ăn hình gấu",
        "price": 129000,
        "category": "phu-kien",
        "image": "images/product-3.svg",
        "description": "Góc ăn uống đáng yêu hơn với chiếc bát hình gấu.",
        "features": "Đế chống trượt, dễ vệ sinh",
        "material": "Gốm phủ men",
        "color": "Kem",
        "size": "Đường kính 14 cm"
    },
    {
        "id": 4,
        "code": "SI004",
        "name": "Đồ chơi bóng len",
        "price": 49000,
        "category": "do-choi",
        "image": "images/product-4.svg",
        "description": "Quả bóng nhỏ cho mèo đuổi bắt và vận động mỗi ngày.",
        "features": "Nhẹ, mềm; dùng khi có người giám sát",
        "material": "Sợi cotton",
        "color": "Hồng và kem",
        "size": "Đường kính 6 cm"
    },
    {
        "id": 5,
        "code": "SI005",
        "name": "Giường ngủ cho mèo",
        "price": 329000,
        "category": "phu-kien",
        "image": "images/product-5.svg",
        "description": "Chiếc tổ êm ái dành cho những giấc ngủ tròn xoe.",
        "features": "Đệm tháo rời, đáy chống trượt",
        "material": "Vải nhung và bông",
        "color": "Hồng sữa",
        "size": "45 × 40 × 18 cm"
    },
    {
        "id": 6,
        "code": "SI006",
        "name": "Túi vận chuyển thú cưng",
        "price": 459000,
        "category": "phu-kien",
        "image": "images/product-6.svg",
        "description": "Đưa bé đi khám hay đi chơi thật gọn gàng và thoải mái.",
        "features": "Cửa lưới thoáng khí, dây đeo chỉnh được",
        "material": "Vải polyester và lưới",
        "color": "Kem hồng",
        "size": "42 × 25 × 28 cm; tối đa 5 kg"
    },
    {
        "id": 7,
        "code": "SI007",
        "name": "Lược chải lông",
        "price": 79000,
        "category": "phu-kien",
        "image": "images/product-7.svg",
        "description": "Chải lông nhẹ nhàng cũng là một cách dành thời gian bên bé.",
        "features": "Đầu răng tròn, tay cầm dễ nắm",
        "material": "Nhựa ABS và răng thép đầu tròn",
        "color": "Hồng pastel",
        "size": "Dài 17 cm"
    },
    {
        "id": 8,
        "code": "SI008",
        "name": "Snack thưởng cho chó",
        "price": 65000,
        "category": "thuc-an",
        "image": "images/product-8.svg",
        "description": "Một phần thưởng nhỏ sau những bài tập vui cùng bé.",
        "features": "Thức ăn bổ sung; không thay thế bữa chính",
        "material": "Thịt gà và tinh bột (mô tả mẫu)",
        "color": "Bao bì hồng",
        "size": "Gói 80 g"
    },
    {
        "id": 9,
        "code": "SI009",
        "name": "Hạt dinh dưỡng cho mèo",
        "price": 189000,
        "category": "thuc-an",
        "image": "images/product-9.svg",
        "description": "Bữa ăn mỗi ngày cho mèo trưởng thành với hạt vừa miệng.",
        "features": "Tham khảo khẩu phần trên bao bì, luôn có nước sạch",
        "material": "Cá, thịt và ngũ cốc (mô tả mẫu)",
        "color": "Bao bì kem hồng",
        "size": "Túi 1 kg"
    },
    {
        "id": 10,
        "code": "SI010",
        "name": "Cần câu lông vũ",
        "price": 59000,
        "category": "do-choi",
        "image": "images/product-10.svg",
        "description": "Cùng bé mèo bật nhảy và khám phá một trò chơi mới.",
        "features": "Cán nhẹ; cất sau khi chơi, không để bé nuốt lông",
        "material": "Gỗ, dây cotton và lông nhân tạo",
        "color": "Hồng và trắng",
        "size": "Cán dài 40 cm"
    },
    {
        "id": 11,
        "code": "SI011",
        "name": "Áo yếm hoa nhí",
        "price": 139000,
        "category": "quan-ao",
        "image": "images/product-11.svg",
        "description": "Một chút điệu đà cho những bức ảnh cuối tuần của bé.",
        "features": "Vải thoáng, dây cài dễ điều chỉnh",
        "material": "Cotton họa tiết hoa",
        "color": "Kem và hồng",
        "size": "S / M / L; đo vòng ngực trước khi chọn"
    },
    {
        "id": 12,
        "code": "SI012",
        "name": "Pate cá ngừ cho mèo",
        "price": 35000,
        "category": "thuc-an",
        "image": "images/product-12.svg",
        "description": "Thêm một lựa chọn mềm ngon cho thực đơn của mèo.",
        "features": "Thức ăn bổ sung; bảo quản lạnh sau khi mở",
        "material": "Cá ngừ và nước dùng (mô tả mẫu)",
        "color": "Bao bì hồng",
        "size": "Hộp 85 g"
    }
];

// Mã danh mục dùng cho URL và thuộc tính data-category trong HTML.
const categoryNames = {
    "thuc-an": "Thức ăn",
    "do-choi": "Đồ chơi",
    "quan-ao": "Quần áo",
    "phu-kien": "Phụ kiện"
};

function formatPrice(price) {
    return price.toLocaleString('vi-VN') + ' ₫';
}

function findProduct(id) {
    return products.find(function (product) {
        return product.id === id;
    });
}
