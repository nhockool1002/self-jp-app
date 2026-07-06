// One-off script to build the 214 Kangxi radicals (bộ thủ) reference table.
//
// Structural data (traditional character, stroke count, variant forms) comes
// from @nahanil/bushou (MIT), fetched from jsdelivr so this stays
// reproducible without vendoring the npm package. Hán Việt names and short
// Vietnamese meaning glosses are hand-curated below (Hán Việt names
// cross-checked against vi.wikipedia.org/wiki/Bộ_thủ_Khang_Hy).
//
// Run with `node scripts/build-radicals.mjs`.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SOURCE_URL = "https://cdn.jsdelivr.net/npm/@nahanil/bushou/data/radicals.json";

// Hán Việt name for each of the 214 radicals, keyed by Kangxi radical number.
const HAN_VIET = {
  1: "Nhất", 2: "Cổn", 3: "Chủ", 4: "Phiệt", 5: "Ất", 6: "Quyết", 7: "Nhị", 8: "Đầu",
  9: "Nhân", 10: "Nhân", 11: "Nhập", 12: "Bát", 13: "Quynh", 14: "Mịch", 15: "Băng", 16: "Kỷ",
  17: "Khảm", 18: "Đao", 19: "Lực", 20: "Bao", 21: "Chủy", 22: "Phương", 23: "Hệ", 24: "Thập",
  25: "Bốc", 26: "Tiết", 27: "Hán", 28: "Tư", 29: "Hựu", 30: "Khẩu", 31: "Vi", 32: "Thổ",
  33: "Sĩ", 34: "Trĩ", 35: "Tuy", 36: "Tịch", 37: "Đại", 38: "Nữ", 39: "Tử", 40: "Miên",
  41: "Thốn", 42: "Tiểu", 43: "Uông", 44: "Thi", 45: "Triệt", 46: "Sơn", 47: "Xuyên", 48: "Công",
  49: "Kỷ", 50: "Cân", 51: "Can", 52: "Yêu", 53: "Nghiễm", 54: "Dẫn", 55: "Củng", 56: "Dặc",
  57: "Cung", 58: "Ký", 59: "Sam", 60: "Sách", 61: "Tâm", 62: "Qua", 63: "Hộ", 64: "Thủ",
  65: "Chi", 66: "Phộc", 67: "Văn", 68: "Đẩu", 69: "Cân", 70: "Phương", 71: "Vô", 72: "Nhật",
  73: "Viết", 74: "Nguyệt", 75: "Mộc", 76: "Khiếm", 77: "Chỉ", 78: "Đãi", 79: "Thù", 80: "Vô",
  81: "Tỷ", 82: "Mao", 83: "Thị", 84: "Khí", 85: "Thủy", 86: "Hỏa", 87: "Trảo", 88: "Phụ",
  89: "Hào", 90: "Tường", 91: "Phiến", 92: "Nha", 93: "Ngưu", 94: "Khuyển", 95: "Huyền", 96: "Ngọc",
  97: "Qua", 98: "Ngõa", 99: "Cam", 100: "Sinh", 101: "Dụng", 102: "Điền", 103: "Thất", 104: "Nạch",
  105: "Bát", 106: "Bạch", 107: "Bì", 108: "Mãnh", 109: "Mục", 110: "Mâu", 111: "Thỉ", 112: "Thạch",
  113: "Thị", 114: "Nhựu", 115: "Hòa", 116: "Huyệt", 117: "Lập", 118: "Trúc", 119: "Mễ", 120: "Mịch",
  121: "Phẫu", 122: "Võng", 123: "Dương", 124: "Vũ", 125: "Lão", 126: "Nhi", 127: "Lỗi", 128: "Nhĩ",
  129: "Duật", 130: "Nhục", 131: "Thần", 132: "Tự", 133: "Chí", 134: "Cữu", 135: "Thiệt", 136: "Suyễn",
  137: "Chu", 138: "Cấn", 139: "Sắc", 140: "Thảo", 141: "Hô", 142: "Trùng", 143: "Huyết", 144: "Hành",
  145: "Y", 146: "Á", 147: "Kiến", 148: "Giác", 149: "Ngôn", 150: "Cốc", 151: "Đậu", 152: "Thỉ",
  153: "Trãi", 154: "Bối", 155: "Xích", 156: "Tẩu", 157: "Túc", 158: "Thân", 159: "Xa", 160: "Tân",
  161: "Thần", 162: "Sước", 163: "Ấp", 164: "Dậu", 165: "Biện", 166: "Lý", 167: "Kim", 168: "Trường",
  169: "Môn", 170: "Phụ", 171: "Đãi", 172: "Chuy", 173: "Vũ", 174: "Thanh", 175: "Phi", 176: "Diện",
  177: "Cách", 178: "Vi", 179: "Cửu", 180: "Âm", 181: "Hiệt", 182: "Phong", 183: "Phi", 184: "Thực",
  185: "Thủ", 186: "Hương", 187: "Mã", 188: "Cốt", 189: "Cao", 190: "Bưu", 191: "Đấu", 192: "Sưởng",
  193: "Cách", 194: "Quỷ", 195: "Ngư", 196: "Điểu", 197: "Lỗ", 198: "Lộc", 199: "Mạch", 200: "Ma",
  201: "Hoàng", 202: "Thử", 203: "Hắc", 204: "Chỉ", 205: "Mãnh", 206: "Đỉnh", 207: "Cổ", 208: "Thử",
  209: "Tị", 210: "Tề", 211: "Xỉ", 212: "Long", 213: "Quy", 214: "Dược",
};

// Short Vietnamese meaning gloss for each radical, keyed by Kangxi radical number.
const MEANING_VI = {
  1: "một", 2: "nét sổ", 3: "dấu chấm", 4: "nét phẩy", 5: "(thiên can) Ất", 6: "nét móc",
  7: "hai", 8: "nắp đậy", 9: "người", 10: "chân người", 11: "đi vào", 12: "tám",
  13: "khung hở trên", 14: "trùm lên", 15: "băng giá", 16: "cái ghế nhỏ", 17: "hố, miệng hố", 18: "dao",
  19: "sức mạnh", 20: "bao bọc", 21: "cái thìa", 22: "hộp vuông hở", 23: "nơi ẩn giấu", 24: "mười",
  25: "bói toán", 26: "ấn tín", 27: "vách núi", 28: "riêng tư", 29: "lại, tay phải", 30: "miệng",
  31: "vây quanh", 32: "đất", 33: "kẻ sĩ", 34: "đi, đến", 35: "đi chậm", 36: "buổi tối",
  37: "to lớn", 38: "con gái, phụ nữ", 39: "con", 40: "mái nhà", 41: "tấc (đơn vị đo)", 42: "nhỏ",
  43: "khập khiễng", 44: "xác chết, thây", 45: "mầm cây", 46: "núi", 47: "sông", 48: "công việc, thợ",
  49: "bản thân", 50: "khăn", 51: "khô", 52: "sợi tơ nhỏ", 53: "vách núi có mái che", 54: "bước dài",
  55: "hai tay", 56: "bắn (tên)", 57: "cây cung", 58: "đầu con nhím", 59: "lông dài, tóc", 60: "bước chân",
  61: "tim, lòng", 62: "cây mác (vũ khí)", 63: "cửa một cánh", 64: "tay", 65: "nhánh, chi", 66: "gõ nhẹ",
  67: "văn, chữ viết", 68: "cái đấu (đong)", 69: "cái rìu, cân", 70: "hình vuông, phương hướng", 71: "không, chẳng", 72: "mặt trời, ngày",
  73: "nói rằng", 74: "mặt trăng, tháng", 75: "cây gỗ", 76: "thiếu, ngáp", 77: "dừng lại", 78: "chết chóc",
  79: "binh khí", 80: "chớ, đừng", 81: "so sánh", 82: "lông", 83: "dòng họ", 84: "hơi nước, khí",
  85: "nước", 86: "lửa", 87: "móng vuốt", 88: "cha", 89: "hào (trong Kinh Dịch)", 90: "mảnh gỗ (giường)",
  91: "miếng ván mỏng", 92: "răng nanh", 93: "trâu, bò", 94: "chó", 95: "sâu xa, huyền bí", 96: "ngọc",
  97: "quả dưa", 98: "ngói", 99: "ngọt", 100: "sự sống, sinh ra", 101: "sử dụng", 102: "ruộng",
  103: "tấm vải", 104: "bệnh tật", 105: "bước chân dang ra", 106: "trắng", 107: "da", 108: "cái bát, chậu",
  109: "mắt", 110: "cây mâu (giáo)", 111: "mũi tên", 112: "đá", 113: "thần linh, chỉ bảo", 114: "dấu chân thú",
  115: "lúa, ngũ cốc", 116: "hang, lỗ hổng", 117: "đứng", 118: "tre, trúc", 119: "gạo", 120: "tơ, sợi nhỏ",
  121: "cái vò sành", 122: "cái lưới", 123: "con dê, cừu", 124: "lông vũ, cánh", 125: "già", 126: "mà (liên từ)",
  127: "cái cày", 128: "tai", 129: "cây bút", 130: "thịt", 131: "bề tôi, quan", 132: "tự mình",
  133: "đến nơi", 134: "cối giã gạo", 135: "cái lưỡi", 136: "trái ngược nhau", 137: "thuyền", 138: "dừng lại (quẻ Cấn)",
  139: "màu sắc, sắc đẹp", 140: "cỏ", 141: "vằn hổ", 142: "sâu bọ, côn trùng", 143: "máu", 144: "đi, hàng lối",
  145: "áo quần", 146: "phía tây, che úp", 147: "nhìn thấy", 148: "sừng", 149: "lời nói", 150: "hang, khe núi",
  151: "hạt đậu", 152: "con lợn", 153: "loài thú không chân", 154: "vỏ sò, tiền", 155: "màu đỏ", 156: "chạy",
  157: "bàn chân", 158: "thân người", 159: "xe cộ", 160: "cay, vị cay", 161: "buổi sáng sớm", 162: "đi (chợt đi chợt dừng)",
  163: "ấp, thành", 164: "rượu", 165: "phân biệt", 166: "làng, dặm", 167: "vàng, kim loại", 168: "dài",
  169: "cổng, cửa hai cánh", 170: "gò đất", 171: "nô lệ, kịp", 172: "chim đuôi ngắn", 173: "mưa", 174: "xanh",
  175: "sai, trái", 176: "khuôn mặt", 177: "da thuộc", 178: "da thuộc mềm", 179: "rau hẹ", 180: "âm thanh",
  181: "đầu, trang", 182: "gió", 183: "bay", 184: "ăn", 185: "đầu", 186: "thơm",
  187: "ngựa", 188: "xương", 189: "cao", 190: "tóc dài", 191: "đánh nhau", 192: "rượu cúng tế",
  193: "cái vạc, nồi", 194: "ma quỷ", 195: "cá", 196: "chim", 197: "muối", 198: "hươu, nai",
  199: "lúa mạch", 200: "cây gai dầu", 201: "màu vàng", 202: "kê (ngũ cốc)", 203: "màu đen", 204: "thêu thùa",
  205: "ếch nhái", 206: "cái vạc ba chân", 207: "cái trống", 208: "con chuột", 209: "cái mũi", 210: "ngay ngắn, đều",
  211: "răng", 212: "rồng", 213: "rùa", 214: "ống sáo",
};

// The upstream variants field mixes in Mandarin pinyin annotations (e.g.
// "乀(fu2), 乁(yi2)") and English left/right notes — strip the former and
// translate the latter so nothing non-Vietnamese/Japanese leaks into the UI.
function cleanVariants(raw) {
  if (!raw) return null;
  const cleaned = raw
    .replace(/\([a-z]+\d\)/gi, "")
    .replace(/\(right\)/i, "(bên phải)")
    .replace(/\(left\)/i, "(bên trái)")
    .replace(/\s+,/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();
  return cleaned || null;
}

async function main() {
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`Failed to fetch radicals source: ${res.status}`);
  const source = await res.json();

  const radicals = source.map((r) => {
    const hanviet = HAN_VIET[r.no];
    const meaning = MEANING_VI[r.no];
    if (!hanviet || !meaning) throw new Error(`Missing Vietnamese data for radical #${r.no}`);
    return {
      no: r.no,
      char: r.radical,
      strokes: r.strokes,
      hanviet,
      meaning,
      variants: cleanVariants(r.variants),
    };
  });

  if (radicals.length !== 214) throw new Error(`Expected 214 radicals, got ${radicals.length}`);

  const outPath = join(__dirname, "..", "src", "data", "radicals.json");
  writeFileSync(outPath, JSON.stringify(radicals, null, 2) + "\n", "utf8");
  console.log(`Wrote ${radicals.length} radicals to ${outPath}`);
}

main();
