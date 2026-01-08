export type WasteCategory = "plastic" | "paper" | "metal" | "glass" | "organic" | "hazardous" | "other"

export interface WasteAdvice {
  displayName: string
  title: string
  description: string
  steps: string[]
  icon: string
  color: string
}

export const WASTE_ADVICE: Record<WasteCategory, WasteAdvice> = {
  plastic: {
    displayName: "Nhựa",
    title: "Nhựa – có thể tái chế (nếu còn sạch)",
    description: "Phần lớn chai, hộp, túi nhựa sạch đều có thể tái chế. Tránh lẫn với rác hữu cơ.",
    steps: [
      "Đổ sạch nước/thức ăn còn lại.",
      "Rửa sơ nếu quá bẩn, để ráo.",
      "Tháo nắp, nén gọn (nếu có thể).",
      "Bỏ vào thùng rác tái chế/nhựa.",
    ],
    icon: "🧴",
    color: "bg-blue-500",
  },
  paper: {
    displayName: "Giấy / bìa carton",
    title: "Giấy – rất dễ tái chế",
    description: "Giữ giấy khô, không dính dầu mỡ để tái chế tốt hơn.",
    steps: [
      "Loại bỏ thức ăn/dầu mỡ dính trên giấy (nếu có).",
      "Gấp gọn hoặc buộc lại theo bó.",
      "Không trộn với rác ướt.",
      "Bỏ vào thùng rác tái chế/giấy.",
    ],
    icon: "📄",
    color: "bg-amber-500",
  },
  metal: {
    displayName: "Kim loại (lon, hộp…)",
    title: "Kim loại – tái chế được nhiều lần",
    description: "Lon nhôm, lon sắt là nguồn tái chế rất tốt.",
    steps: [
      "Đổ hết nước bên trong.",
      "Rửa sơ nếu bám nhiều cặn.",
      "Nén lại nếu có thể.",
      "Bỏ vào thùng rác tái chế/kim loại.",
    ],
    icon: "🥫",
    color: "bg-gray-500",
  },
  glass: {
    displayName: "Thủy tinh",
    title: "Thủy tinh – bền, tái chế tốt nhưng dễ vỡ",
    description: "Cẩn thận khi xử lý chai, lọ, mảnh vỡ thủy tinh.",
    steps: [
      "Đổ sạch chất lỏng còn lại.",
      "Rửa sơ nếu bẩn.",
      "Bọc kỹ nếu đã vỡ để tránh gây thương tích.",
      "Đem đến điểm thu gom thủy tinh hoặc bỏ vào thùng chuyên dụng nếu có.",
    ],
    icon: "🍾",
    color: "bg-cyan-500",
  },
  organic: {
    displayName: "Rác hữu cơ",
    title: "Hữu cơ – nên ủ hoặc xử lý riêng",
    description: "Rác hữu cơ có thể ủ làm phân, giảm lượng rác thải ra môi trường.",
    steps: [
      "Tách riêng khỏi nhựa, kim loại, giấy.",
      "Nếu có điều kiện, ủ làm phân hữu cơ.",
      "Nếu không, bỏ vào thùng rác hữu cơ theo quy định địa phương.",
    ],
    icon: "🍃",
    color: "bg-green-500",
  },
  hazardous: {
    displayName: "Rác nguy hại",
    title: "Rác nguy hại – tuyệt đối không bỏ chung với rác thường",
    description: "Pin, bóng đèn, hóa chất… cần xử lý đặc biệt để tránh ô nhiễm.",
    steps: [
      "Không đập vỡ, không tháo rời.",
      "Đựng riêng trong hộp/túi chắc chắn.",
      "Đem tới điểm thu gom rác nguy hại (siêu thị lớn, trung tâm thu gom…).",
    ],
    icon: "☢️",
    color: "bg-red-500",
  },
  other: {
    displayName: "Khác / khó xác định",
    title: "Chưa xác định rõ loại rác",
    description: "Rác này khó phân loại tự động, hãy kiểm tra thêm trên bao bì hoặc hỏi quy định địa phương.",
    steps: [
      "Tìm biểu tượng tái chế hoặc chữ 'recyclable/có thể tái chế'.",
      "Nếu dính nhiều dầu mỡ / thức ăn → có thể coi như rác thường hoặc hữu cơ.",
      "Ưu tiên tách riêng nhựa, kim loại, giấy nếu còn sạch.",
    ],
    icon: "❓",
    color: "bg-slate-500",
  },
}

export function mapImageNetLabelToBaseType(label: string): WasteCategory {
  const l = label.toLowerCase()

  if (
    ["plastic bottle", "water bottle", "pop bottle", "soda bottle", "bottle", "plastic bag"].some((k) => l.includes(k))
  ) {
    return "plastic"
  }

  if (
    ["paper towel", "toilet tissue", "tissue", "envelope", "carton", "cardboard", "paper"].some((k) => l.includes(k))
  ) {
    return "paper"
  }

  if (["tin can", "can", "soda can", "beer can", "aluminum", "steel drum"].some((k) => l.includes(k))) {
    return "metal"
  }

  if (["beer bottle", "wine bottle", "glass", "goblet", "cup", "jar"].some((k) => l.includes(k))) {
    return "glass"
  }

  if (
    [
      "banana",
      "apple",
      "orange",
      "lemon",
      "pineapple",
      "mango",
      "grape",
      "cabbage",
      "carrot",
      "broccoli",
      "food",
      "bread",
      "sandwich",
    ].some((k) => l.includes(k))
  ) {
    return "organic"
  }

  if (["battery", "light bulb", "syringe", "medicine", "pill", "chemical", "spray"].some((k) => l.includes(k))) {
    return "hazardous"
  }

  return "other"
}

export function inferCategoryFromText(text: string): WasteCategory {
  const t = text.toLowerCase()

  if (["pet", "pp", "hdpe", "ldpe", "pvc", "nhựa", "plastic"].some((k) => t.includes(k))) {
    return "plastic"
  }
  if (["giấy", "paper", "carton", "cardboard"].some((k) => t.includes(k))) {
    return "paper"
  }
  if (["nhôm", "aluminium", "aluminum", "lon", "metal", "kim loại", "steel", "thiếc"].some((k) => t.includes(k))) {
    return "metal"
  }
  if (["thủy tinh", "thuy tinh", "glass"].some((k) => t.includes(k))) {
    return "glass"
  }
  if (
    [
      "hữu cơ",
      "huu co",
      "organic",
      "compostable",
      "phân hủy sinh học",
      "bio-degradable",
      "rau",
      "trái cây",
      "thức ăn",
    ].some((k) => t.includes(k))
  ) {
    return "organic"
  }
  if (["pin", "ắc quy", "ac quy", "battery", "toxic", "nguy hại", "hoa chat", "hóa chất"].some((k) => t.includes(k))) {
    return "hazardous"
  }

  return "other"
}

export function formatAdviceText(advice: WasteAdvice): string {
  const stepsText = advice.steps.map((s) => "• " + s).join("\n")
  return advice.description + "\n\n" + stepsText
}

export const QUIZ_DATA = [
  {
    question: "Pin đã dùng xong nên xử lý thế nào?",
    options: [
      "Bỏ vào rác hữu cơ",
      "Bỏ vào rác tái chế (nhựa/kim loại)",
      "Đem tới điểm thu gom rác nguy hại hoặc nơi thu gom pin",
      "Vứt xuống cống cho trôi đi",
    ],
    correctIndex: 2,
    explanation:
      "Pin là rác nguy hại, chứa kim loại nặng. Cần đem tới điểm thu gom pin hoặc rác nguy hại, không bỏ lẫn rác thường.",
  },
  {
    question: "Ly nhựa dùng một lần (uống trà sữa) thường được xếp vào loại rác nào?",
    options: ["Nhựa", "Hữu cơ", "Thủy tinh", "Giấy"],
    correctIndex: 0,
    explanation:
      "Ly nhựa dùng một lần là nhựa. Nếu còn sạch có thể tái chế, nhưng thực tế thường bị bẩn nên khó tái chế.",
  },
  {
    question: "Vỏ rau, vỏ trái cây, thức ăn thừa thuộc nhóm rác nào?",
    options: ["Nhựa", "Kim loại", "Hữu cơ", "Nguy hại"],
    correctIndex: 2,
    explanation: "Vỏ rau, trái cây, thức ăn thừa là rác hữu cơ, có thể ủ làm phân.",
  },
  {
    question: "Vỏ hộp sữa giấy (Tetra Pak) thường nên làm gì trước khi bỏ?",
    options: [
      "Giữ nguyên, bỏ thẳng vào rác thải sinh hoạt",
      "Rửa sơ, làm phẳng, bỏ vào rác tái chế (giấy/bìa)",
      "Đốt ngay trong nhà",
      "Xé nhỏ trộn với rác hữu cơ",
    ],
    correctIndex: 1,
    explanation:
      "Vỏ hộp sữa nên đổ hết sữa còn lại, rửa sơ, làm phẳng và bỏ vào rác tái chế (tuỳ quy định địa phương).",
  },
  {
    question: "Thủy tinh (chai, lọ) có đặc điểm tái chế nào sau đây là đúng?",
    options: [
      "Chỉ tái chế được 1 lần",
      "Không thể tái chế",
      "Có thể tái chế nhiều lần nếu còn sạch",
      "Chỉ tái chế nếu trộn chung với nhựa",
    ],
    correctIndex: 2,
    explanation: "Thủy tinh có thể tái chế nhiều lần, nhưng cần được thu gom và xử lý đúng cách.",
  },

  // === KÝ HIỆU TÁI CHẾ ===
  {
    question: "Ký hiệu tam giác với số 1 (PET/PETE) thường có trên sản phẩm nào?",
    options: ["Ống nước PVC", "Chai nước suối, chai nước ngọt", "Túi nilon siêu thị", "Hộp xốp đựng thức ăn"],
    correctIndex: 1,
    explanation: "PET (số 1) thường dùng cho chai nước, nước ngọt. Đây là loại nhựa dễ tái chế nhất.",
  },
  {
    question: "Ký hiệu số 5 (PP - Polypropylene) thường dùng cho sản phẩm nào?",
    options: ["Chai dầu ăn", "Hộp đựng thực phẩm, nắp chai", "Ống nước", "Túi nilon mỏng"],
    correctIndex: 1,
    explanation: "PP (số 5) chịu nhiệt tốt, thường dùng cho hộp đựng thực phẩm, nắp chai, hộp sữa chua.",
  },
  {
    question: "Ký hiệu số 3 (PVC) cần lưu ý gì khi xử lý?",
    options: [
      "An toàn, có thể tái chế dễ dàng",
      "Nên đốt để tiêu hủy nhanh",
      "Khó tái chế và có thể gây hại môi trường khi đốt",
      "Có thể bỏ chung với rác hữu cơ",
    ],
    correctIndex: 2,
    explanation:
      "PVC (số 3) khó tái chế và khi đốt có thể sinh ra chất độc hại. Nên hạn chế sử dụng và xử lý đúng cách.",
  },
  {
    question: "Ký hiệu 'Möbius Loop' (tam giác mũi tên) có ý nghĩa gì?",
    options: [
      "Sản phẩm đã được tái chế 100%",
      "Sản phẩm có thể tái chế được",
      "Sản phẩm tự phân hủy sinh học",
      "Sản phẩm an toàn cho sức khỏe",
    ],
    correctIndex: 1,
    explanation:
      "Ký hiệu Möbius Loop (3 mũi tên tạo tam giác) nghĩa là vật liệu CÓ THỂ tái chế, không phải đã được tái chế.",
  },
  {
    question: "Ký hiệu số 6 (PS - Polystyrene) thường có trên sản phẩm nào?",
    options: ["Chai nước suối", "Hộp xốp, ly xốp, đĩa nhựa dùng một lần", "Túi nilon siêu thị", "Chai dầu gội"],
    correctIndex: 1,
    explanation: "PS (số 6) là xốp/styrofoam, rất khó tái chế và gây ô nhiễm lâu dài. Nên hạn chế sử dụng.",
  },

  // === 3R: REDUCE - REUSE - RECYCLE ===
  {
    question: "Trong nguyên tắc 3R, hành động nào nên được ưu tiên nhất?",
    options: ["Recycle (Tái chế)", "Reuse (Tái sử dụng)", "Reduce (Giảm thiểu)", "Cả 3 đều quan trọng như nhau"],
    correctIndex: 2,
    explanation:
      "Reduce (Giảm thiểu) luôn được ưu tiên nhất vì ngăn rác từ đầu nguồn, hiệu quả hơn tái sử dụng hay tái chế.",
  },
  {
    question: "Hành động nào sau đây thuộc về 'Reduce' (Giảm thiểu)?",
    options: [
      "Dùng chai thủy tinh cũ làm bình hoa",
      "Mang theo túi vải khi đi chợ thay vì lấy túi nilon",
      "Đem giấy báo cũ đi bán ve chai",
      "Rửa sạch lon nước ngọt để tái chế",
    ],
    correctIndex: 1,
    explanation: "Mang túi vải để không phải lấy túi nilon mới = Reduce. Các đáp án khác thuộc Reuse hoặc Recycle.",
  },
  {
    question: "Hành động nào sau đây thuộc về 'Reuse' (Tái sử dụng)?",
    options: [
      "Từ chối lấy ống hút nhựa",
      "Dùng lọ thủy tinh cũ để đựng đồ khô trong bếp",
      "Phân loại rác để đem đi tái chế",
      "Mua sản phẩm có bao bì tối giản",
    ],
    correctIndex: 1,
    explanation:
      "Dùng lọ cũ cho mục đích khác = Reuse. Từ chối ống hút và mua bao bì tối giản = Reduce. Phân loại = Recycle.",
  },
  {
    question: "Để thực hiện 'Reduce' khi mua sắm, bạn nên làm gì?",
    options: [
      "Mua nhiều đồ để dự trữ",
      "Chọn sản phẩm có bao bì đẹp mắt",
      "Mua vừa đủ nhu cầu, chọn bao bì tối giản hoặc không bao bì",
      "Luôn chọn đồ dùng một lần cho tiện",
    ],
    correctIndex: 2,
    explanation: "Reduce nghĩa là giảm từ đầu nguồn: mua vừa đủ, tránh bao bì thừa, hạn chế đồ dùng một lần.",
  },

  // === RÁC NGUY HẠI ===
  {
    question: "Bóng đèn huỳnh quang (đèn tuýp) đã hỏng nên xử lý như thế nào?",
    options: [
      "Bỏ vào thùng rác thường",
      "Đập vỡ rồi bỏ vào thùng rác",
      "Bọc kỹ và đem đến điểm thu gom rác nguy hại",
      "Chôn xuống đất",
    ],
    correctIndex: 2,
    explanation:
      "Bóng đèn huỳnh quang chứa thủy ngân, là rác nguy hại. Cần bọc kỹ tránh vỡ và đem đến điểm thu gom chuyên dụng.",
  },
  {
    question: "Thuốc đã hết hạn nên xử lý thế nào?",
    options: [
      "Bỏ vào thùng rác thường",
      "Xả xuống bồn cầu",
      "Đem trả lại nhà thuốc hoặc điểm thu gom thuốc hết hạn",
      "Đốt cháy",
    ],
    correctIndex: 2,
    explanation:
      "Thuốc hết hạn là rác nguy hại, có thể ô nhiễm nguồn nước nếu xả bừa bãi. Nên trả lại nhà thuốc để xử lý đúng cách.",
  },
  {
    question: "Vỏ bình xịt (aerosol) đã hết nên xử lý như thế nào?",
    options: [
      "Đâm thủng rồi bỏ thùng rác",
      "Để nguyên, bỏ vào thùng rác tái chế kim loại (nếu địa phương cho phép)",
      "Đốt trong nhà",
      "Bỏ vào thùng rác hữu cơ",
    ],
    correctIndex: 1,
    explanation:
      "Vỏ bình xịt kim loại có thể tái chế nếu đã hết hoàn toàn. Không đâm thủng vì nguy hiểm. Kiểm tra quy định địa phương.",
  },
  {
    question: "Điện thoại, laptop cũ nên xử lý thế nào?",
    options: [
      "Bỏ vào thùng rác thường",
      "Đem đến điểm thu gom rác điện tử hoặc cửa hàng điện máy có chương trình thu hồi",
      "Chôn xuống đất",
      "Đốt để lấy kim loại quý",
    ],
    correctIndex: 1,
    explanation:
      "Rác điện tử chứa nhiều kim loại nặng độc hại nhưng cũng có kim loại quý có thể thu hồi. Cần xử lý chuyên nghiệp.",
  },

  // === KIẾN THỨC MÔI TRƯỜNG ===
  {
    question: "Túi nilon thông thường mất bao lâu để phân hủy trong tự nhiên?",
    options: ["1-2 năm", "10-20 năm", "100-500 năm", "Không bao giờ phân hủy"],
    correctIndex: 2,
    explanation: "Túi nilon mất khoảng 100-500 năm để phân hủy và trong quá trình đó gây ô nhiễm nghiêm trọng.",
  },
  {
    question: "Chai nhựa PET mất khoảng bao lâu để phân hủy trong tự nhiên?",
    options: ["10 năm", "50 năm", "450 năm", "1000 năm"],
    correctIndex: 2,
    explanation:
      "Chai nhựa PET mất khoảng 450 năm để phân hủy. Tái chế 1 chai nhựa tiết kiệm đủ năng lượng để thắp sáng bóng đèn 3 giờ.",
  },
  {
    question: "Rác thải nhựa trong đại dương chủ yếu gây hại cho sinh vật biển như thế nào?",
    options: [
      "Làm nước biển nóng lên",
      "Sinh vật nuốt phải hoặc bị mắc kẹt, dẫn đến chết",
      "Làm nước biển mặn hơn",
      "Không gây hại gì đáng kể",
    ],
    correctIndex: 1,
    explanation: "Hàng triệu động vật biển chết mỗi năm vì nuốt phải nhựa hoặc bị mắc kẹt trong rác thải nhựa.",
  },
  {
    question: "Vi nhựa (microplastic) là gì?",
    options: [
      "Nhựa dùng trong y tế",
      "Mảnh nhựa nhỏ hơn 5mm, có thể xâm nhập vào chuỗi thức ăn",
      "Loại nhựa mới thân thiện môi trường",
      "Nhựa dùng một lần",
    ],
    correctIndex: 1,
    explanation: "Vi nhựa là mảnh nhựa < 5mm, đã được tìm thấy trong nước uống, thực phẩm, và cơ thể người.",
  },
  {
    question: "Giấy mất khoảng bao lâu để phân hủy trong tự nhiên?",
    options: ["1-2 tuần", "2-6 tuần", "1 năm", "10 năm"],
    correctIndex: 1,
    explanation:
      "Giấy thông thường phân hủy trong 2-6 tuần nếu điều kiện thuận lợi. Tuy nhiên tái chế vẫn tốt hơn vì tiết kiệm cây và năng lượng.",
  },
  {
    question: "Lon nhôm mất bao lâu để phân hủy trong tự nhiên?",
    options: ["50 năm", "80-200 năm", "500 năm", "1000 năm"],
    correctIndex: 1,
    explanation: "Lon nhôm mất 80-200 năm để phân hủy. Tái chế nhôm tiết kiệm 95% năng lượng so với sản xuất nhôm mới.",
  },

  // === MẸO THỰC TẾ ===
  {
    question: "Khi đặt đồ ăn online, bạn có thể làm gì để giảm rác thải?",
    options: [
      "Đặt thêm nhiều món để gom đơn",
      "Ghi chú 'Không cần đũa/thìa nhựa, khăn giấy' nếu không cần",
      "Yêu cầu đóng gói thêm cho chắc",
      "Không làm gì được vì nhà hàng quyết định",
    ],
    correctIndex: 1,
    explanation: "Nhiều app đặt đồ ăn cho phép ghi chú. Từ chối đồ nhựa dùng một lần giúp giảm rác đáng kể.",
  },
  {
    question: "Cách tốt nhất để xử lý quần áo cũ còn tốt là gì?",
    options: ["Bỏ vào thùng rác thường", "Đốt bỏ", "Quyên góp, bán lại, hoặc trao đổi", "Chôn xuống đất"],
    correctIndex: 2,
    explanation:
      "Quần áo cũ còn tốt nên quyên góp hoặc bán lại. Nếu không còn mặc được, một số nơi nhận vải cũ để tái chế.",
  },
  {
    question: "Hộp pizza bẩn dính dầu mỡ nên xử lý thế nào?",
    options: [
      "Bỏ vào thùng rác tái chế giấy",
      "Xé phần sạch bỏ tái chế, phần bẩn bỏ rác thường hoặc hữu cơ",
      "Rửa sạch rồi tái chế",
      "Đốt bỏ",
    ],
    correctIndex: 1,
    explanation: "Giấy/bìa dính dầu mỡ khó tái chế. Nên tách phần còn sạch để tái chế, phần bẩn bỏ rác thường.",
  },
  {
    question: "Chai nước nhựa nên làm gì trước khi bỏ vào thùng tái chế?",
    options: [
      "Bỏ nguyên vào thùng",
      "Đổ hết nước, nén gọn, tháo nắp riêng",
      "Rửa thật sạch bằng xà phòng",
      "Cắt nhỏ thành nhiều mảnh",
    ],
    correctIndex: 1,
    explanation: "Đổ hết nước, nén gọn giúp tiết kiệm không gian. Nắp chai có thể để riêng vì làm từ nhựa khác.",
  },
  {
    question: "Túi nilon đựng thực phẩm còn sạch có thể làm gì?",
    options: [
      "Bỏ luôn vào thùng rác",
      "Giữ lại tái sử dụng nhiều lần trước khi bỏ",
      "Bỏ vào thùng rác hữu cơ",
      "Đốt bỏ",
    ],
    correctIndex: 1,
    explanation: "Túi nilon còn sạch có thể tái sử dụng nhiều lần. Mỗi lần tái sử dụng là giảm 1 túi nilon mới.",
  },

  // === CÂU HỎI NÂNG CAO ===
  {
    question: "Nhựa sinh học (bioplastic) có phải luôn thân thiện môi trường không?",
    options: [
      "Có, vì làm từ thực vật",
      "Không hẳn, vì cần điều kiện đặc biệt để phân hủy",
      "Có, vì tự phân hủy trong vài ngày",
      "Không, vì độc hơn nhựa thường",
    ],
    correctIndex: 1,
    explanation:
      "Nhiều loại nhựa sinh học cần nhiệt độ cao (50-60°C) trong nhà máy ủ công nghiệp mới phân hủy được, không tự phân hủy trong tự nhiên.",
  },
  {
    question: "Tại sao nên ưu tiên mua sản phẩm có bao bì đơn giản?",
    options: ["Vì rẻ hơn", "Vì ít rác thải hơn và dễ tái chế hơn", "Vì đẹp hơn", "Vì bảo quản tốt hơn"],
    correctIndex: 1,
    explanation: "Bao bì đơn giản, ít lớp, ít màu sắc dễ tái chế hơn và tạo ít rác thải hơn.",
  },
  {
    question: "Compost (phân ủ) từ rác hữu cơ có lợi ích gì?",
    options: [
      "Chỉ giảm lượng rác, không có lợi ích khác",
      "Cung cấp dinh dưỡng cho đất, giảm rác ra bãi rác, giảm khí metan",
      "Chỉ dùng được cho ruộng lúa",
      "Gây ô nhiễm không khí",
    ],
    correctIndex: 1,
    explanation:
      "Compost giàu dinh dưỡng cho cây, giảm rác ra bãi rác, và ngăn rác hữu cơ phân hủy kỵ khí sinh khí metan gây hiệu ứng nhà kính.",
  },
  {
    question: "Tại sao không nên đốt rác tại nhà?",
    options: [
      "Vì mất công",
      "Vì sinh ra khói độc (dioxin, furan) và bụi mịn gây hại sức khỏe",
      "Vì tốn tiền ga",
      "Vì pháp luật cấm nên không có lý do khác",
    ],
    correctIndex: 1,
    explanation:
      "Đốt rác ở nhiệt độ thấp sinh ra dioxin, furan và bụi mịn cực kỳ độc hại. Nhà máy đốt rác có hệ thống xử lý khói.",
  },
]
