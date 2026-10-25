// Dữ liệu món ăn dùng chung; giá tính bằng đồng Việt Nam.
const products = [
  {
    "id": 1,
    "name": "Gà giòn nguyên bản",
    "category": "Gà rán",
    "price": 39000,
    "image": "food-menu-3.png",
    "description": "Lớp vỏ giòn rụm, thịt gà mềm ngọt, đậm vị S Chicken.",
    "ingredients": "Thịt gà, bột mì, trứng, gia vị; có gluten và trứng."
  },
  {
    "id": 2,
    "name": "Gà sốt cay Hàn Quốc",
    "category": "Gà sốt",
    "price": 45000,
    "image": "food-menu-3.png",
    "description": "Gà giòn phủ sốt cay ngọt, thêm mè rang thơm bùi.",
    "ingredients": "Thịt gà, tương ớt, mè, bột mì; có gluten, đậu nành và mè."
  },
  {
    "id": 3,
    "name": "Burger gà đặc biệt",
    "category": "Burger & món kèm",
    "price": 49000,
    "image": "hero-banner.png",
    "description": "Burger gà, rau tươi và sốt kem cho bữa ăn đầy năng lượng.",
    "ingredients": "Bánh mì, thịt gà, xà lách, cà chua, sốt; có gluten, trứng và sữa."
  },
  {
    "id": 4,
    "name": "Combo một mình vui",
    "category": "Combo",
    "price": 79000,
    "image": "about-banner.png",
    "description": "Một burger, khoai tây và nước uống — đủ đầy cho một bữa ngon.",
    "ingredients": "Burger gà, khoai tây, nước ngọt; có gluten, trứng và sữa."
  },
  {
    "id": 5,
    "name": "Gà giòn đôi bạn",
    "category": "Gà rán",
    "price": 75000,
    "image": "food-menu-3.png",
    "description": "Hai phần gà giòn cho cuộc hẹn vui hơn.",
    "ingredients": "Thịt gà, bột mì, trứng, gia vị; có gluten và trứng."
  },
  {
    "id": 6,
    "name": "Cánh gà giòn rụm",
    "category": "Gà rán",
    "price": 59000,
    "image": "food-menu-3.png",
    "description": "Cánh gà giòn thơm, dùng cùng sốt chấm đặc trưng.",
    "ingredients": "Cánh gà, bột mì, gia vị; có gluten."
  },
  {
    "id": 7,
    "name": "Gà sốt mật ong",
    "category": "Gà sốt",
    "price": 45000,
    "image": "food-menu-3.png",
    "description": "Vị mật ong ngọt dịu quyện cùng lớp gà giòn.",
    "ingredients": "Thịt gà, mật ong, bột mì, nước tương; có gluten và đậu nành."
  },
  {
    "id": 8,
    "name": "Gà sốt tỏi",
    "category": "Gà sốt",
    "price": 45000,
    "image": "food-menu-3.png",
    "description": "Sốt tỏi thơm lừng, đậm đà mà không quá cay.",
    "ingredients": "Thịt gà, tỏi, nước tương, bột mì; có gluten và đậu nành."
  },
  {
    "id": 9,
    "name": "Khoai tây chiên",
    "category": "Burger & món kèm",
    "price": 25000,
    "image": "fries.svg",
    "description": "Khoai vàng giòn, thêm chút muối, ngon đến miếng cuối.",
    "ingredients": "Khoai tây, dầu thực vật, muối."
  },
  {
    "id": 10,
    "name": "Burger gà phô mai",
    "category": "Burger & món kèm",
    "price": 55000,
    "image": "hero-banner.png",
    "description": "Thêm phô mai béo ngậy cho chiếc burger yêu thích.",
    "ingredients": "Bánh mì, gà, phô mai, rau, sốt; có gluten, sữa và trứng."
  },
  {
    "id": 11,
    "name": "Combo hội bạn",
    "category": "Combo",
    "price": 159000,
    "image": "about-banner.png",
    "description": "Hai burger, hai phần khoai và hai nước để cùng chia sẻ.",
    "ingredients": "Burger gà, khoai tây, nước ngọt; có gluten, trứng và sữa."
  },
  {
    "id": 12,
    "name": "Combo no nê",
    "category": "Combo",
    "price": 99000,
    "image": "food-menu-2.png",
    "description": "Gà, khoai, rau và món kèm cho một bữa thật trọn vẹn.",
    "ingredients": "Gà, khoai tây, rau, sốt; có gluten, trứng và sữa."
  },
  {
    "id": 13,
    "name": "Nước ngọt mát lạnh",
    "category": "Đồ uống",
    "price": 19000,
    "image": "soda.svg",
    "description": "Một ly nước ngọt mát lạnh, bạn đồng hành của gà giòn.",
    "ingredients": "Nước ngọt có gas, đá."
  },
  {
    "id": 14,
    "name": "Trà chanh tươi",
    "category": "Đồ uống",
    "price": 25000,
    "image": "lemon-tea.svg",
    "description": "Trà chanh thanh mát giúp cân bằng vị giác.",
    "ingredients": "Trà, chanh, đường, đá."
  },
  {
    "id": 15,
    "name": "Trà đào",
    "category": "Đồ uống",
    "price": 29000,
    "image": "peach-tea.svg",
    "description": "Trà đào thơm nhẹ, ngọt dịu, dễ uống.",
    "ingredients": "Trà, siro đào, đào, đường, đá."
  }
];

function formatPrice(price) {
  return price.toLocaleString("vi-VN") + " ₫";
}
