/**
 * Danh mục thí nghiệm ảo – mỗi bài học một mô phỏng tương tác.
 * `key` khớp với component trong `src/modules/virtual-lab/experiments`.
 * Danh mục được nạp vào bảng `experiments` qua seed 05.
 */
export type ExperimentDef = {
  key: string;
  lessonNumber: number;
  title: string;
  summary: string;
  guide: string[];
  questions: string[];
};

export const EXPERIMENTS: ExperimentDef[] = [
  {
    key: "kinetic-potential", lessonNumber: 2,
    title: "Động năng và thế năng của quả bóng",
    summary: "Thay đổi khối lượng, tốc độ, độ cao và quan sát động năng, thế năng thay đổi.",
    guide: ["Chọn khối lượng m của quả bóng.", "Điều chỉnh tốc độ v và độ cao h.", "Bấm Bắt đầu để quả bóng chuyển động; đọc giá trị Wđ, Wt.", "Bấm Ghi số liệu để lưu vào bảng, thay đổi một đại lượng và lặp lại."],
    questions: ["Khi tăng gấp đôi tốc độ, động năng thay đổi thế nào?", "Thế năng phụ thuộc vào những đại lượng nào?"],
  },
  {
    key: "mechanical-energy", lessonNumber: 3,
    title: "Bảo toàn cơ năng của con lắc",
    summary: "Quan sát sự chuyển hoá động năng – thế năng của con lắc, có và không có ma sát.",
    guide: ["Chọn khối lượng vật nặng và góc thả ban đầu.", "Bấm Bắt đầu để thả con lắc.", "Quan sát cột năng lượng và đồ thị theo thời gian.", "Bật ma sát để thấy cơ năng giảm dần."],
    questions: ["Ở vị trí nào động năng lớn nhất? Thế năng lớn nhất?", "Vì sao khi có ma sát con lắc dừng lại dần?"],
  },
  {
    key: "work-power", lessonNumber: 4,
    title: "Cần cẩu nâng hàng – Công và công suất",
    summary: "Nâng thùng hàng với khối lượng, độ cao và thời gian khác nhau để so sánh công và công suất.",
    guide: ["Chọn khối lượng thùng hàng, độ cao cần nâng và thời gian nâng.", "Bấm Bắt đầu để cần cẩu nâng hàng.", "Đọc lực nâng, công và công suất.", "Ghi số liệu và so sánh các lần nâng."],
    questions: ["Nâng cùng thùng hàng lên cùng độ cao nhưng nhanh hơn thì công và công suất thay đổi thế nào?"],
  },
  {
    key: "refraction", lessonNumber: 5,
    title: "Khúc xạ ánh sáng qua mặt phân cách",
    summary: "Thay đổi góc tới và cặp môi trường; đo góc khúc xạ và kiểm chứng định luật khúc xạ.",
    guide: ["Chọn môi trường 1 và môi trường 2.", "Bấm Bật nguồn sáng, điều chỉnh góc tới i.", "Đọc góc khúc xạ r, ghi số liệu vào bảng.", "Tính sin i / sin r và so sánh với n₂/n₁."],
    questions: ["Khi ánh sáng đi từ không khí vào nước, r lớn hơn hay nhỏ hơn i?", "Tỉ số sin i / sin r có thay đổi khi đổi góc tới không?"],
  },
  {
    key: "total-reflection", lessonNumber: 6,
    title: "Phản xạ toàn phần và góc tới hạn",
    summary: "Chiếu ánh sáng từ môi trường chiết quang hơn ra môi trường kém chiết quang, tìm góc tới hạn.",
    guide: ["Chọn môi trường chứa nguồn sáng (nước, thuỷ tinh, kim cương).", "Bật nguồn sáng, tăng dần góc tới.", "Quan sát tia khúc xạ yếu dần và biến mất.", "Ghi lại góc tới khi bắt đầu phản xạ toàn phần, so sánh với góc tới hạn tính theo công thức."],
    questions: ["Điều kiện nào để xảy ra phản xạ toàn phần?", "Môi trường có chiết suất càng lớn thì góc tới hạn càng lớn hay càng nhỏ?"],
  },
  {
    key: "prism", lessonNumber: 7,
    title: "Đường truyền ánh sáng qua lăng kính",
    summary: "Quan sát tia sáng lệch về phía đáy và ánh sáng trắng bị tán sắc thành dải màu.",
    guide: ["Chọn loại ánh sáng: đơn sắc (đỏ, lục, tím) hoặc ánh sáng trắng.", "Điều chỉnh góc chiết quang A và góc tới.", "Bật nguồn sáng, quan sát tia ló và góc lệch D.", "So sánh góc lệch của các màu."],
    questions: ["Tia ló lệch về phía nào của lăng kính?", "Màu nào bị lệch nhiều nhất? Vì sao?"],
  },
  {
    key: "lens", lessonNumber: 8,
    title: "Dựng ảnh qua thấu kính hội tụ và phân kì",
    summary: "Di chuyển vật, thay đổi tiêu cự; quan sát ba tia sáng đặc biệt và đặc điểm ảnh.",
    guide: ["Chọn loại thấu kính.", "Kéo thanh trượt để thay đổi khoảng cách vật d và tiêu cự f.", "Quan sát các tia đặc biệt và vị trí ảnh.", "Ghi lại đặc điểm ảnh (thật/ảo, cùng/ngược chiều, lớn/nhỏ) ở các vị trí khác nhau."],
    questions: ["Đặt vật ở đâu để thấu kính hội tụ cho ảnh ảo?", "Thấu kính phân kì có bao giờ cho ảnh thật của vật thật không?"],
  },
  {
    key: "focal-length", lessonNumber: 9,
    title: "Thực hành đo tiêu cự thấu kính hội tụ",
    summary: "Dịch vật và màn cách đều thấu kính đến khi ảnh rõ nét, cao bằng vật; tính f = L/4.",
    guide: ["Thấu kính có tiêu cự chưa biết được đặt giữa giá quang học.", "Dịch chuyển vật và màn (luôn cách đều thấu kính).", "Khi ảnh rõ nét và cao bằng vật, bấm Ghi lần đo.", "Đo 3 lần, tính tiêu cự trung bình."],
    questions: ["Vì sao phải giữ vật và màn cách đều thấu kính?", "Kết quả ba lần đo có giống nhau không? Nguyên nhân sai số?"],
  },
  {
    key: "magnifier", lessonNumber: 10,
    title: "Quan sát vật nhỏ qua kính lúp",
    summary: "Chọn kính lúp có số bội giác khác nhau, di chuyển vật để quan sát ảnh ảo phóng to.",
    guide: ["Chọn số bội giác của kính lúp (2x – 10x).", "Di chuyển vật lại gần kính.", "Quan sát ảnh khi vật trong khoảng tiêu cự và khi vật ngoài khoảng tiêu cự.", "Ghi số bội giác, tiêu cự và độ phóng đại ảnh."],
    questions: ["Muốn nhìn rõ ảnh phóng to, phải đặt vật ở đâu?", "Kính lúp 10x có tiêu cự bao nhiêu?"],
  },
  {
    key: "ohm-law", lessonNumber: 11,
    title: "Thí nghiệm định luật Ohm",
    summary: "Thay đổi hiệu điện thế nguồn, đo cường độ dòng điện; vẽ đồ thị I – U.",
    guide: ["Chọn điện trở R cần khảo sát.", "Bấm Đóng khoá K để dòng điện chạy trong mạch.", "Thay đổi hiệu điện thế U, đọc số chỉ ampe kế và vôn kế.", "Ghi ít nhất 5 cặp số liệu để vẽ đồ thị I – U."],
    questions: ["Đồ thị I – U có dạng gì?", "Từ bảng số liệu, tính U/I. Nhận xét kết quả."],
  },
  {
    key: "series-parallel", lessonNumber: 12,
    title: "Đoạn mạch nối tiếp và song song",
    summary: "Mắc hai điện trở nối tiếp hoặc song song, đo cường độ dòng điện và hiệu điện thế.",
    guide: ["Chọn cách mắc: nối tiếp hoặc song song.", "Điều chỉnh R₁, R₂ và hiệu điện thế U.", "Đóng khoá K, đọc số chỉ các ampe kế, vôn kế.", "Kiểm chứng các hệ thức của đoạn mạch."],
    questions: ["Trong đoạn mạch nối tiếp, cường độ dòng điện qua các điện trở có bằng nhau không?", "Điện trở tương đương của đoạn mạch song song lớn hơn hay nhỏ hơn mỗi điện trở thành phần?"],
  },
  {
    key: "electric-power", lessonNumber: 13,
    title: "Công suất điện và điện năng tiêu thụ",
    summary: "Bật các thiết bị trong gia đình, quan sát công suất, điện năng tiêu thụ và tiền điện.",
    guide: ["Bật/tắt các thiết bị điện.", "Chọn số giờ sử dụng mỗi ngày cho từng thiết bị.", "Bấm Bắt đầu để công tơ chạy; đọc tổng công suất và điện năng.", "Đề xuất cách giảm điện năng tiêu thụ."],
    questions: ["Thiết bị nào tiêu thụ nhiều điện năng nhất trong tháng?", "Nêu hai cách tiết kiệm điện trong gia đình em."],
  },
  {
    key: "induction", lessonNumber: 14,
    title: "Cảm ứng điện từ – Máy phát điện xoay chiều",
    summary: "Di chuyển nam châm qua cuộn dây hoặc quay cuộn dây trong từ trường, quan sát điện kế và đồ thị dòng điện.",
    guide: ["Chế độ 1: kéo thanh trượt để đưa nam châm vào/ra cuộn dây, quan sát kim điện kế.", "Chế độ 2: bấm Bắt đầu để quay cuộn dây (máy phát điện), thay đổi tốc độ quay.", "Quan sát đồ thị dòng điện theo thời gian."],
    questions: ["Khi nào kim điện kế không lệch?", "Vì sao dòng điện do máy phát tạo ra là dòng điện xoay chiều?"],
  },
  {
    key: "ac-effects", lessonNumber: 15,
    title: "Các tác dụng của dòng điện xoay chiều",
    summary: "So sánh tác dụng nhiệt, phát sáng, từ của dòng điện một chiều và xoay chiều.",
    guide: ["Chọn nguồn: một chiều (DC) hoặc xoay chiều (AC).", "Bấm Bắt đầu, quan sát bóng đèn, dây nung và kim nam châm.", "Thay đổi tần số dòng xoay chiều để quan sát kim nam châm."],
    questions: ["Kim nam châm đặt gần dây dẫn có dòng điện xoay chiều chuyển động thế nào?", "Kể tên các tác dụng của dòng điện xoay chiều."],
  },
  {
    key: "fossil-energy", lessonNumber: 16,
    title: "Vòng năng lượng và đốt nhiên liệu hoá thạch",
    summary: "Đốt các loại nhiên liệu, tính nhiệt lượng toả ra và lượng khí CO₂ ước tính phát thải.",
    guide: ["Chọn loại nhiên liệu và khối lượng đốt.", "Bấm Bắt đầu để đốt nhiên liệu.", "Đọc nhiệt lượng toả ra Q = q·m và lượng CO₂ ước tính.", "So sánh các loại nhiên liệu."],
    questions: ["Nhiên liệu nào toả nhiều nhiệt nhất trên 1 kg?", "Vì sao cần hạn chế sử dụng nhiên liệu hoá thạch?"],
  },
  {
    key: "renewable", lessonNumber: 17,
    title: "Nhà máy điện năng lượng tái tạo",
    summary: "Mô phỏng pin Mặt Trời, tua-bin gió và thuỷ điện; thay đổi điều kiện tự nhiên và quan sát công suất.",
    guide: ["Chọn loại nguồn: Mặt Trời, gió hoặc thuỷ điện.", "Điều chỉnh các thông số (cường độ nắng, tốc độ gió, lưu lượng nước…).", "Bấm Bắt đầu, đọc công suất điện tạo ra.", "So sánh ưu, nhược điểm các nguồn."],
    questions: ["Công suất tua-bin gió thay đổi thế nào khi tốc độ gió tăng gấp đôi?", "Vì sao cần kết hợp nhiều nguồn năng lượng tái tạo?"],
  },
];

export function experimentForLesson(lessonNumber: number) {
  return EXPERIMENTS.find((e) => e.lessonNumber === lessonNumber) ?? null;
}
