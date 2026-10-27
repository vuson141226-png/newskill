/* SISIMIMI — Dữ liệu sản phẩm dùng chung, theo cấu trúc S-Chicken.
   Mỗi object là một sản phẩm; id phải duy nhất và giá tính bằng đồng Việt Nam.
   Cập nhật thẻ HTML trong index.html/products.html khi thay dữ liệu này. */

const products = [
    {
        "id": 1,
        "code": "SI001",
        "name": "Vòng cổ nơ hồng cho chó",
        "price": 89000,
        "category": "phu-kien",
        "image": "images/product-1.png",
        "description": "Chiếc nơ hồng nhỏ xinh cho những buổi dạo chơi cùng cún.",
        "features": "Khóa bấm, dây chỉnh độ rộng; kiểm tra độ vừa trước khi đeo",
        "material": "Vải dệt và khóa nhựa (mô tả minh họa)",
        "color": "Hồng pastel",
        "size": "Vòng cổ 18–28 cm (kích thước minh họa)"
    },
    {
        "id": 2,
        "code": "SI002",
        "name": "Áo hoodie cho chó",
        "price": 159000,
        "category": "quan-ao",
        "image": "images/product-2.png",
        "description": "Một chiếc hoodie hồng mềm mại cho cún trong ngày se lạnh.",
        "features": "Mũ liền áo; chọn cỡ để cún đi lại thoải mái, không bó cổ",
        "material": "Vải nỉ cotton (mô tả minh họa)",
        "color": "Hồng phấn",
        "size": "S / M / L; đo vòng ngực và chiều dài lưng trước khi chọn"
    },
    {
        "id": 3,
        "code": "SI003",
        "name": "Bát ăn hình gấu cho chó",
        "price": 129000,
        "category": "phu-kien",
        "image": "images/product-3.png",
        "description": "Chiếc bát màu kem với tai gấu tạo điểm nhấn cho góc ăn của cún.",
        "features": "Dáng bát thấp; rửa sạch và kiểm tra vết nứt trước khi dùng",
        "material": "Gốm phủ men (mô tả minh họa)",
        "color": "Kem",
        "size": "Đường kính 14 cm (kích thước minh họa)"
    },
    {
        "id": 4,
        "code": "SI004",
        "name": "Bóng cao su cho chó",
        "price": 49000,
        "category": "do-choi",
        "image": "images/product-4.png",
        "description": "Quả bóng hồng cho những trò đuổi bắt vui vẻ cùng cún.",
        "features": "Chọn bóng lớn hơn miệng bé; chơi có giám sát và bỏ khi hỏng",
        "material": "Cao su (mô tả minh họa)",
        "color": "Hồng pastel",
        "size": "Đường kính 6 cm (kích thước minh họa; chọn theo cỡ chó)"
    },
    {
        "id": 5,
        "code": "SI005",
        "name": "Giường ngủ êm cho chó",
        "price": 329000,
        "category": "phu-kien",
        "image": "images/product-5.png",
        "description": "Một góc ngủ hồng êm ái để cún cuộn tròn sau giờ chơi.",
        "features": "Thành đệm cao; chọn kích thước đủ để bé nằm duỗi thoải mái",
        "material": "Vải nhung và bông đệm (mô tả minh họa)",
        "color": "Hồng sữa",
        "size": "55 × 45 × 18 cm (kích thước minh họa)"
    },
    {
        "id": 6,
        "code": "SI006",
        "name": "Túi vận chuyển chó nhỏ",
        "price": 459000,
        "category": "phu-kien",
        "image": "images/product-6.png",
        "description": "Chiếc túi hồng cho những chuyến đi ngắn cùng cún nhỏ.",
        "features": "Ô lưới thoáng, quai xách; không để cún một mình trong túi kín",
        "material": "Vải polyester và lưới (mô tả minh họa)",
        "color": "Hồng phấn",
        "size": "42 × 25 × 28 cm (minh họa); đo bé trước khi chọn"
    },
    {
        "id": 7,
        "code": "SI007",
        "name": "Lược chải lông cho chó",
        "price": 79000,
        "category": "phu-kien",
        "image": "images/product-7.png",
        "description": "Dành một chút thời gian chải lông và làm quen nhẹ nhàng cùng cún.",
        "features": "Chải theo chiều lông; ngừng nếu da đỏ hoặc bé khó chịu",
        "material": "Tay cầm nhựa và răng kim loại (mô tả minh họa)",
        "color": "Hồng pastel",
        "size": "Dài 17 cm (kích thước minh họa)"
    },
    {
        "id": 8,
        "code": "SI008",
        "name": "Snack thưởng cho chó",
        "price": 65000,
        "category": "thuc-an",
        "image": "images/product-8.png",
        "description": "Một phần thưởng nhỏ cho những lúc cún học điều mới.",
        "features": "Thức ăn bổ sung; chia miếng phù hợp, không thay thế bữa chính",
        "material": "Thịt gà và tinh bột (thành phần minh họa)",
        "color": "Bao bì hồng",
        "size": "Gói 80 g (khối lượng minh họa)"
    },
    {
        "id": 9,
        "code": "SI009",
        "name": "Hạt dinh dưỡng cho chó",
        "price": 189000,
        "category": "thuc-an",
        "image": "images/product-9.png",
        "description": "Lựa chọn hạt khô minh họa cho thực đơn của chó trưởng thành.",
        "features": "Đọc độ tuổi và khẩu phần trên nhãn; luôn chuẩn bị nước sạch",
        "material": "Thịt gà và ngũ cốc (thành phần minh họa)",
        "color": "Bao bì hồng và kem",
        "size": "Túi 1 kg (khối lượng minh họa)"
    },
    {
        "id": 10,
        "code": "SI010",
        "name": "Dây thừng gặm cho chó",
        "price": 59000,
        "category": "do-choi",
        "image": "images/product-10.png",
        "description": "Sợi dây hồng thắt nút cho giờ chơi kéo co nhẹ cùng cún.",
        "features": "Chơi có giám sát; cất sau khi chơi, bỏ khi dây tưa hoặc đứt",
        "material": "Sợi cotton bện (mô tả minh họa)",
        "color": "Hồng pastel",
        "size": "Dài 25 cm (kích thước minh họa)"
    },
    {
        "id": 11,
        "code": "SI011",
        "name": "Áo yếm hoa nhí cho chó",
        "price": 139000,
        "category": "quan-ao",
        "image": "images/product-11.png",
        "description": "Chiếc yếm hồng hoa nhí cho những bức ảnh đáng yêu của cún.",
        "features": "Kiểm tra độ vừa ở cổ và ngực; tháo nếu bé nóng hoặc khó chịu",
        "material": "Vải cotton họa tiết hoa (mô tả minh họa)",
        "color": "Hồng hoa nhí",
        "size": "S / M / L; đo vòng ngực và chiều dài lưng trước khi chọn"
    },
    {
        "id": 12,
        "code": "SI012",
        "name": "Pate thịt gà cho chó",
        "price": 35000,
        "category": "thuc-an",
        "image": "images/product-12.png",
        "description": "Một lựa chọn mềm cho bữa ăn thêm đa dạng của cún.",
        "features": "Thức ăn bổ sung; bảo quản và sử dụng theo hướng dẫn trên nhãn",
        "material": "Thịt gà và nước dùng (thành phần minh họa)",
        "color": "Hộp hồng",
        "size": "Hộp 85 g (khối lượng minh họa)"
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
