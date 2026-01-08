import { WASTE_ADVICE, mapImageNetLabelToBaseType } from "./waste-data"

interface AIResponse {
  text: string
  category?: string
}

// Extended knowledge base for waste classification
const WASTE_KNOWLEDGE = {
  plastics: {
    keywords: [
      "nhựa",
      "plastic",
      "chai",
      "bottle",
      "pet",
      "hdpe",
      "pp",
      "pvc",
      "ldpe",
      "ps",
      "túi nilon",
      "bao bì",
      "hộp nhựa",
      "ly nhựa",
      "ống hút",
    ],
    info: `♻️ **NHỰA - Rác tái chế**

📌 **Các loại nhựa phổ biến:**
• PET (1): Chai nước, chai ngọt → Tái chế tốt
• HDPE (2): Chai sữa, can dầu → Tái chế tốt  
• PVC (3): Ống nước, màng bọc → Khó tái chế
• LDPE (4): Túi nilon, màng co → Tái chế hạn chế
• PP (5): Hộp cơm, nắp chai → Tái chế tốt
• PS (6): Ly xốp, hộp xốp → Khó tái chế

🗑️ **Cách xử lý:**
1. Rửa sạch, làm khô
2. Bóc nhãn nếu có thể
3. Nén/gấp gọn để tiết kiệm không gian
4. Bỏ vào thùng rác tái chế (thường màu xanh dương)

⚠️ **Lưu ý:** Túi nilon bẩn, nhựa dính thức ăn nhiều → bỏ rác thường`,
  },
  organic: {
    keywords: [
      "hữu cơ",
      "thức ăn",
      "rau",
      "củ",
      "quả",
      "trái cây",
      "vỏ",
      "lá",
      "cơm",
      "bánh mì",
      "xương",
      "thịt",
      "cá",
      "trứng",
      "food",
      "organic",
      "compost",
      "phân",
      "cành cây",
      "hoa",
    ],
    info: `🌱 **RÁC HỮU CƠ**

📌 **Bao gồm:**
• Thức ăn thừa, cơm nguội, bánh mì
• Vỏ trái cây, rau củ hư
• Lá cây, cành nhỏ, hoa héo
• Bã trà, cà phê
• Vỏ trứng (đập nhỏ)

🗑️ **Cách xử lý:**
1. Tách riêng khỏi rác khác
2. Bỏ vào thùng rác hữu cơ (thường màu xanh lá)
3. Hoặc làm phân compost tại nhà

💡 **Mẹo:** Rác hữu cơ có thể biến thành phân bón cực tốt cho cây trồng! Một gia đình 4 người có thể tạo ra 20-30kg phân compost/tháng.

⚠️ **Không bỏ vào rác hữu cơ:** Xương lớn, dầu mỡ nhiều, thịt/cá sống (có thể gây mùi hôi)`,
  },
  hazardous: {
    keywords: [
      "pin",
      "battery",
      "ắc quy",
      "thuốc",
      "medicine",
      "hóa chất",
      "chemical",
      "bóng đèn",
      "light bulb",
      "sơn",
      "paint",
      "dầu",
      "oil",
      "nguy hại",
      "độc",
      "toxic",
      "thuốc trừ sâu",
      "keo",
      "dung môi",
    ],
    info: `☠️ **RÁC NGUY HẠI - Cần xử lý đặc biệt!**

📌 **Bao gồm:**
• Pin các loại (AA, AAA, pin điện thoại, ắc quy)
• Bóng đèn huỳnh quang, đèn compact
• Thuốc hết hạn, kim tiêm
• Sơn, dung môi, keo dán
• Thuốc trừ sâu, hóa chất tẩy rửa mạnh
• Nhiệt kế thủy ngân

🗑️ **Cách xử lý:**
1. KHÔNG bỏ chung với rác thường!
2. Giữ nguyên bao bì nếu có
3. Mang đến điểm thu gom rác nguy hại
4. Liên hệ công ty môi trường địa phương

📍 **Điểm thu gom:** Thường có tại UBND phường/xã, siêu thị lớn, hoặc các điểm thu gom di động

⚠️ **NGUY HIỂM:** Pin chứa chì, thủy ngân; bóng đèn huỳnh quang chứa thủy ngân - rất độc hại cho môi trường và sức khỏe!`,
  },
  electronics: {
    keywords: [
      "điện tử",
      "electronic",
      "điện thoại",
      "phone",
      "laptop",
      "máy tính",
      "computer",
      "tivi",
      "tv",
      "tủ lạnh",
      "máy giặt",
      "dây điện",
      "sạc",
      "charger",
      "tai nghe",
      "earphone",
      "chuột",
      "bàn phím",
    ],
    info: `📱 **RÁC THẢI ĐIỆN TỬ (E-waste)**

📌 **Bao gồm:**
• Điện thoại, tablet, laptop cũ
• Máy tính để bàn, màn hình
• Tivi, đầu DVD, loa
• Dây điện, sạc, adapter
• Thiết bị điện gia dụng nhỏ

🗑️ **Cách xử lý:**
1. Xóa dữ liệu cá nhân trước khi bỏ
2. Tháo pin riêng (xử lý như rác nguy hại)
3. Bán cho cửa hàng thu mua đồ cũ
4. Mang đến điểm thu gom e-waste
5. Một số hãng có chương trình thu đổi (Apple, Samsung...)

💰 **Mẹo:** Nhiều linh kiện trong đồ điện tử có giá trị (vàng, bạc, đồng) - có thể bán lại được tiền!

♻️ **Tái chế:** Kim loại, nhựa từ đồ điện tử có thể tái chế 90%+`,
  },
  paper: {
    keywords: [
      "giấy",
      "paper",
      "bìa",
      "cardboard",
      "carton",
      "sách",
      "book",
      "báo",
      "newspaper",
      "tạp chí",
      "magazine",
      "hộp giấy",
      "vở",
      "notebook",
      "tissue",
      "khăn giấy",
    ],
    info: `📄 **GIẤY - Rác tái chế**

📌 **Tái chế được:**
• Giấy văn phòng, giấy in
• Báo, tạp chí, sách cũ
• Bìa carton, hộp giấy
• Vở, sổ tay (bỏ phần gáy kim loại)

📌 **KHÔNG tái chế được:**
• Giấy dính mỡ/thức ăn
• Khăn giấy, giấy vệ sinh đã dùng
• Giấy ảnh, giấy fax
• Giấy tráng nhựa/kim loại

🗑️ **Cách xử lý:**
1. Gấp gọn, buộc lại
2. Giữ khô ráo
3. Bỏ vào thùng rác tái chế
4. Hoặc bán cho vựa ve chai

🌲 **Fun fact:** 1 tấn giấy tái chế = cứu 17 cây xanh + tiết kiệm 7000 lít nước!`,
  },
  metal: {
    keywords: [
      "kim loại",
      "metal",
      "lon",
      "can",
      "nhôm",
      "aluminum",
      "sắt",
      "iron",
      "thép",
      "steel",
      "đồng",
      "copper",
      "inox",
      "hộp thiếc",
      "nắp chai",
    ],
    info: `🥫 **KIM LOẠI - Rác tái chế**

📌 **Bao gồm:**
• Lon nước ngọt, lon bia (nhôm)
• Hộp thiếc, lon đồ hộp
• Nắp chai kim loại
• Đồ gia dụng bằng kim loại
• Dây điện (phần kim loại)

🗑️ **Cách xử lý:**
1. Rửa sạch thức ăn còn sót
2. Nén/dẹp lon để tiết kiệm không gian
3. Bỏ vào thùng rác tái chế
4. Hoặc bán cho vựa ve chai

💰 **Giá trị:** 
• Nhôm: 25,000-35,000đ/kg
• Đồng: 150,000-200,000đ/kg
• Sắt/thép: 5,000-8,000đ/kg

♻️ **Ưu điểm:** Kim loại có thể tái chế vô hạn lần mà không giảm chất lượng!`,
  },
  glass: {
    keywords: ["thủy tinh", "glass", "chai thủy tinh", "lọ", "kính", "gương", "bình"],
    info: `🫙 **THỦY TINH - Rác tái chế**

📌 **Bao gồm:**
• Chai thủy tinh (bia, nước, rượu)
• Lọ thủy tinh (mứt, gia vị)
• Bình thủy tinh

📌 **KHÔNG tái chế được:**
• Kính cửa, gương (thành phần khác)
• Bóng đèn (xử lý như rác nguy hại)
• Thủy tinh chịu nhiệt (pyrex)
• Pha lê

🗑️ **Cách xử lý:**
1. Rửa sạch
2. Bỏ nắp riêng (thường là kim loại/nhựa)
3. Bỏ vào thùng rác tái chế
4. Chai còn nguyên có thể bán/đổi

⚠️ **An toàn:** Nếu thủy tinh vỡ, gói cẩn thận trong giấy báo và ghi "THỦY TINH VỠ" bên ngoài`,
  },
  textile: {
    keywords: [
      "vải",
      "quần áo",
      "clothes",
      "textile",
      "giày",
      "shoes",
      "túi xách",
      "bag",
      "chăn",
      "màn",
      "rèm",
      "khăn",
      "cotton",
      "polyester",
      "jean",
    ],
    info: `👕 **VẢI/QUẦN ÁO**

📌 **Còn sử dụng được:**
• Quyên góp cho từ thiện
• Bán đồ secondhand
• Trao đổi với bạn bè

📌 **Không còn dùng được:**
• Cắt làm giẻ lau
• Làm đồ handmade (túi, thảm...)
• Bỏ vào thùng thu gom quần áo cũ

🗑️ **Điểm thu gom:**
• Thùng thu gom tại các siêu thị
• Chương trình H&M Garment Collecting
• Các tổ chức từ thiện

💡 **Mẹo:** 1 chiếc áo cotton cần 2,700 lít nước để sản xuất. Hãy sử dụng hết tuổi thọ của quần áo!

♻️ **Tái chế:** Vải có thể nghiền thành sợi để làm vải mới, vật liệu cách nhiệt, giẻ công nghiệp`,
  },
  symbols: {
    keywords: ["ký hiệu", "symbol", "logo", "số", "mũi tên", "tam giác", "recycling", "tái chế"],
    info: `♻️ **KÝ HIỆU TRÊN BAO BÌ**

📌 **Ký hiệu nhựa (số trong tam giác):**
1️⃣ PET - Chai nước, chai ngọt ✅ Tái chế tốt
2️⃣ HDPE - Chai sữa, can dầu ✅ Tái chế tốt
3️⃣ PVC - Ống nước ⚠️ Khó tái chế
4️⃣ LDPE - Túi nilon ⚠️ Tái chế hạn chế
5️⃣ PP - Hộp cơm, nắp chai ✅ Tái chế tốt
6️⃣ PS - Xốp, ly nhựa ❌ Khó tái chế
7️⃣ OTHER - Nhựa khác ❌ Thường không tái chế

📌 **Ký hiệu khác:**
♻️ Có thể tái chế (tùy địa phương)
🌱 Có thể phân hủy sinh học
FSC - Giấy/gỗ từ nguồn bền vững
Điểm xanh - Nhà sản xuất đóng góp cho tái chế

💡 **Mẹo:** Kiểm tra đáy sản phẩm nhựa để tìm số tái chế!`,
  },
}

// Greeting patterns
const GREETINGS = {
  keywords: ["xin chào", "hello", "hi", "chào", "hey", "alo", "helu", "helo"],
  responses: [
    "Xin chào! 👋 Tôi là trợ lý AI phân loại rác. Bạn muốn hỏi về loại rác nào?",
    "Chào bạn! 🌿 Tôi sẵn sàng giúp bạn phân loại rác. Hãy mô tả hoặc hỏi về bất kỳ loại rác nào nhé!",
    "Hello! 🌍 Bạn cần giúp phân loại loại rác nào hôm nay?",
  ],
}

// Thank you patterns
const THANKS = {
  keywords: ["cảm ơn", "thanks", "thank", "tks", "cám ơn", "cam on"],
  responses: [
    "Không có gì! 😊 Hãy tiếp tục phân loại rác đúng cách để bảo vệ môi trường nhé!",
    "Rất vui được giúp bạn! 🌱 Mỗi hành động nhỏ đều góp phần bảo vệ Trái Đất!",
    "Cảm ơn bạn đã quan tâm đến môi trường! ♻️ Có thắc mắc gì thêm cứ hỏi nhé!",
  ],
}

// Environmental tips
const ECO_TIPS = {
  keywords: ["mẹo", "tip", "gợi ý", "lời khuyên", "sống xanh", "bảo vệ môi trường", "eco", "green"],
  info: `🌍 **MẸO SỐNG XANH**

1. **3R: Reduce - Reuse - Recycle**
   • Giảm thiểu: Mang túi riêng, từ chối đồ nhựa dùng 1 lần
   • Tái sử dụng: Chai lọ làm bình hoa, hộp đựng
   • Tái chế: Phân loại rác đúng cách

2. **Thói quen hàng ngày:**
   • Mang bình nước riêng
   • Dùng túi vải khi đi chợ
   • Từ chối ống hút nhựa
   • Chọn sản phẩm ít bao bì

3. **Tại nhà:**
   • Làm phân compost từ rác hữu cơ
   • Sửa chữa thay vì vứt bỏ
   • Quyên góp đồ không dùng

4. **Mua sắm thông minh:**
   • Chọn sản phẩm có bao bì tái chế
   • Mua đồ secondhand
   • Ủng hộ thương hiệu thân thiện môi trường

💪 Mỗi ngày bạn có thể giảm 1-2kg rác chỉ với những thay đổi nhỏ!`,
}

// Default response when no match
const DEFAULT_RESPONSES = [
  "Tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi cụ thể hơn về loại rác cần phân loại không?\n\n💡 **Gợi ý:** Hãy thử hỏi về: nhựa, giấy, kim loại, rác hữu cơ, pin, đồ điện tử...",
  "Hmm, tôi cần thêm thông tin để giúp bạn. Bạn muốn biết về loại rác nào?\n\n📝 **Ví dụ câu hỏi:**\n• Chai nhựa bỏ đâu?\n• Pin cũ xử lý thế nào?\n• Ký hiệu PET là gì?",
]

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .trim()
}

function findBestMatch(query: string): AIResponse | null {
  const normalizedQuery = normalizeText(query)

  // Check greetings
  for (const keyword of GREETINGS.keywords) {
    if (normalizedQuery.includes(normalizeText(keyword))) {
      return {
        text: GREETINGS.responses[Math.floor(Math.random() * GREETINGS.responses.length)],
      }
    }
  }

  // Check thanks
  for (const keyword of THANKS.keywords) {
    if (normalizedQuery.includes(normalizeText(keyword))) {
      return {
        text: THANKS.responses[Math.floor(Math.random() * THANKS.responses.length)],
      }
    }
  }

  // Check eco tips
  for (const keyword of ECO_TIPS.keywords) {
    if (normalizedQuery.includes(normalizeText(keyword))) {
      return { text: ECO_TIPS.info }
    }
  }

  // Check waste categories
  let bestMatch: { category: string; score: number } | null = null

  for (const [category, data] of Object.entries(WASTE_KNOWLEDGE)) {
    let score = 0
    for (const keyword of data.keywords) {
      if (normalizedQuery.includes(normalizeText(keyword))) {
        // Longer keyword matches get higher scores
        score += keyword.length
      }
    }

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { category, score }
    }
  }

  if (bestMatch) {
    const categoryData = WASTE_KNOWLEDGE[bestMatch.category as keyof typeof WASTE_KNOWLEDGE]
    return {
      text: categoryData.info,
      category: bestMatch.category,
    }
  }

  return null
}

export function generateAIResponse(query: string): string {
  const match = findBestMatch(query)

  if (match) {
    return match.text
  }

  // Check if it's an image recognition result
  if (query.includes("hệ thống nhận diện được")) {
    // Extract the recognized item
    const labelMatch = query.match(/"([^"]+)"/)
    if (labelMatch) {
      const label = labelMatch[1].toLowerCase()
      const category = mapImageNetLabelToBaseType(label)
      const advice = WASTE_ADVICE[category]

      return `📷 **Kết quả nhận diện ảnh**

Vật thể: ${label}
Phân loại: ${advice.icon} ${advice.displayName}

${advice.text}

${advice.tips}

💡 Nếu kết quả chưa chính xác, bạn có thể mô tả thêm về vật thể để tôi hỗ trợ tốt hơn!`
    }
  }

  return DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)]
}
