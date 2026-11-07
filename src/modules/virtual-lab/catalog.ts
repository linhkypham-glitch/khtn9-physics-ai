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
  /** book: bám thí nghiệm trong SGK (đã đối chiếu); support: mô phỏng bổ trợ vì SGK bài này không có thí nghiệm thực hành. */
  basis?: "book" | "support"; // không gắn nhãn khi bài chỉ có hoạt động thực hành đơn giản trong SGK
};

export const EXPERIMENTS: ExperimentDef[] = [
  {
    key: "kinetic-potential", lessonNumber: 2, basis: "support",
    title: "Động năng và thế năng của quả bóng",
    summary: "Thay đổi khối lượng, tốc độ, độ cao và quan sát động năng, thế năng thay đổi.",
    guide: ["Chọn khối lượng m của quả bóng.", "Điều chỉnh tốc độ v và độ cao h.", "Bấm Bắt đầu để quả bóng chuyển động; đọc giá trị Wđ, Wt.", "Bấm Ghi số liệu để lưu vào bảng, thay đổi một đại lượng và lặp lại."],
    questions: ["Khi tăng gấp đôi tốc độ, động năng thay đổi thế nào?", "Thế năng phụ thuộc vào những đại lượng nào?"],
  },
  {
    key: "mechanical-energy", lessonNumber: 3, basis: "book",
    title: "Bảo toàn cơ năng của con lắc",
    summary: "Quan sát sự chuyển hoá động năng – thế năng của con lắc, có và không có ma sát.",
    guide: ["Chọn khối lượng vật nặng và góc thả ban đầu.", "Bấm Bắt đầu để thả con lắc.", "Quan sát cột năng lượng và đồ thị theo thời gian.", "Bật ma sát để thấy cơ năng giảm dần."],
    questions: ["Ở vị trí nào động năng lớn nhất? Thế năng lớn nhất?", "Vì sao khi có ma sát con lắc dừng lại dần?"],
  },
  {
    key: "work-power", lessonNumber: 4, basis: "support",
    title: "Cần cẩu nâng hàng – Công và công suất",
    summary: "Nâng thùng hàng với khối lượng, độ cao và thời gian khác nhau để so sánh công và công suất.",
    guide: ["Chọn khối lượng thùng hàng, độ cao cần nâng và thời gian nâng.", "Bấm Bắt đầu để cần cẩu nâng hàng.", "Đọc lực nâng, công và công suất.", "Ghi số liệu và so sánh các lần nâng."],
    questions: ["Nâng cùng thùng hàng lên cùng độ cao nhưng nhanh hơn thì công và công suất thay đổi thế nào?"],
  },
  {
    key: "refraction", lessonNumber: 5, basis: "book",
    title: "Khúc xạ ánh sáng qua mặt phân cách",
    summary: "Thay đổi góc tới và cặp môi trường; đo góc khúc xạ và kiểm chứng định luật khúc xạ.",
    guide: ["Chọn môi trường 1 (không khí) và môi trường 2 (thuỷ tinh) như thí nghiệm của SGK.", "Bấm Bật nguồn sáng, chọn góc tới 0°, 20°, 40°, 60°, 80° (Bảng 5.1).", "Đọc góc khúc xạ r, ghi số liệu vào bảng.", "Tính sin i / sin r và so sánh với n₂/n₁."],
    questions: ["Khi ánh sáng đi từ không khí vào nước, r lớn hơn hay nhỏ hơn i?", "Tỉ số sin i / sin r có thay đổi khi đổi góc tới không?"],
  },
  {
    key: "total-reflection", lessonNumber: 6, basis: "book",
    title: "Phản xạ toàn phần và góc tới hạn",
    summary: "Chiếu ánh sáng từ môi trường chiết quang hơn ra môi trường kém chiết quang, tìm góc tới hạn.",
    guide: ["Chọn môi trường chứa nguồn sáng (nước, thuỷ tinh, kim cương).", "Bật nguồn sáng, tăng dần góc tới.", "Quan sát tia khúc xạ yếu dần và biến mất.", "Ghi lại góc tới khi bắt đầu phản xạ toàn phần, so sánh với góc tới hạn tính theo công thức."],
    questions: ["Điều kiện nào để xảy ra phản xạ toàn phần?", "Môi trường có chiết suất càng lớn thì góc tới hạn càng lớn hay càng nhỏ?"],
  },
  {
    key: "prism", lessonNumber: 7, basis: "book",
    title: "Đường truyền ánh sáng qua lăng kính",
    summary: "Quan sát tia sáng lệch về phía đáy và ánh sáng trắng bị tán sắc thành dải màu.",
    guide: ["Chọn loại ánh sáng: đơn sắc (đỏ, lục, tím) hoặc ánh sáng trắng.", "Điều chỉnh góc chiết quang A và góc tới.", "Bật nguồn sáng, quan sát tia ló và góc lệch D.", "So sánh góc lệch của các màu."],
    questions: ["Tia ló lệch về phía nào của lăng kính?", "Màu nào bị lệch nhiều nhất? Vì sao?"],
  },
  {
    key: "lens", lessonNumber: 8, basis: "book",
    title: "Dựng ảnh qua thấu kính hội tụ và phân kì",
    summary: "Di chuyển vật, thay đổi tiêu cự; quan sát ba tia sáng đặc biệt và đặc điểm ảnh.",
    guide: ["Chọn loại thấu kính.", "Kéo thanh trượt để thay đổi khoảng cách vật d và tiêu cự f.", "Quan sát các tia đặc biệt và vị trí ảnh.", "Ghi lại đặc điểm ảnh (thật/ảo, cùng/ngược chiều, lớn/nhỏ) ở các vị trí khác nhau."],
    questions: ["Đặt vật ở đâu để thấu kính hội tụ cho ảnh ảo?", "Thấu kính phân kì có bao giờ cho ảnh thật của vật thật không?"],
  },
  {
    key: "focal-length", lessonNumber: 9, basis: "book",
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
    key: "ohm-law", lessonNumber: 11, basis: "book",
    title: "Thí nghiệm định luật Ohm",
    summary: "Thay đổi hiệu điện thế nguồn, đo cường độ dòng điện; vẽ đồ thị I – U.",
    guide: ["Chọn vật dẫn (R₁ = 6 Ω khớp Bảng 11.2 của SGK) rồi bấm Đóng khoá K.", "Quan sát độ sáng bóng đèn với R₁, R₂, R₃ (thí nghiệm 1 của SGK).", "Thay đổi U = 0, 3, 6, 9, 12 V; đọc số chỉ ampe kế và vôn kế (thí nghiệm 2).", "Ghi 5 cặp số liệu để vẽ đồ thị I – U."],
    questions: ["Đồ thị I – U có dạng gì?", "Từ bảng số liệu, tính U/I. Nhận xét kết quả."],
  },
  {
    key: "series-parallel", lessonNumber: 12, basis: "book",
    title: "Đoạn mạch nối tiếp và song song",
    summary: "Tái hiện hai thí nghiệm SGK: nối tiếp (nguồn 12 V, R₁ = 6 Ω, R₂ = 10 Ω, R₃ = 16 Ω) và song song (nguồn 6 V, R₁ = 10 Ω, R₂ = 6 Ω).",
    guide: ["Chọn một phép đo trong SGK (Bảng 12.1 hoặc Bảng 12.2), hoặc tự chọn R₁, R₂, U.", "Đóng khoá K, đọc số chỉ các ampe kế, vôn kế.", "So sánh với số liệu trong SGK.", "Kiểm chứng I = I₁ = I₂ (nối tiếp) và I = I₁ + I₂ (song song)."],
    questions: ["Trong đoạn mạch nối tiếp, cường độ dòng điện qua các điện trở có bằng nhau không?", "Điện trở tương đương của đoạn mạch song song lớn hơn hay nhỏ hơn mỗi điện trở thành phần?"],
  },
  {
    key: "electric-power", lessonNumber: 13, basis: "support",
    title: "Công suất điện và điện năng tiêu thụ",
    summary: "Bật các thiết bị trong gia đình, quan sát công suất, điện năng tiêu thụ và tiền điện.",
    guide: ["Bật/tắt các thiết bị điện.", "Chọn số giờ sử dụng mỗi ngày cho từng thiết bị.", "Bấm Bắt đầu để công tơ chạy; đọc tổng công suất và điện năng.", "Đề xuất cách giảm điện năng tiêu thụ."],
    questions: ["Thiết bị nào tiêu thụ nhiều điện năng nhất trong tháng?", "Nêu hai cách tiết kiệm điện trong gia đình em."],
  },
  {
    key: "induction", lessonNumber: 14, basis: "book",
    title: "Cảm ứng điện từ – Máy phát điện xoay chiều",
    summary: "Các thí nghiệm SGK về cảm ứng điện từ: nam châm vĩnh cửu, nam châm điện, thay đổi tiết diện cuộn dây và mô hình máy phát điện xoay chiều.",
    guide: ["TN 1: kéo thanh trượt đưa nam châm lại gần, ra xa cuộn dây; quan sát kim điện kế.", "TN 2: đóng, mở khoá K của nam châm điện; quan sát kim điện kế.", "TN 4: bóp, kéo giãn cuộn dây trong từ trường; quan sát kim điện kế.", "TN 3 và mô hình máy phát: quay chậm, quay nhanh; quan sát hai đèn LED và đồ thị dòng điện."],
    questions: ["Khi nào kim điện kế lệch, khi nào không lệch?", "Điều kiện chung để xuất hiện dòng điện cảm ứng trong cuộn dây kín là gì?", "Vì sao dòng điện do máy phát tạo ra là dòng điện xoay chiều?"],
  },
  {
    key: "ac-effects", lessonNumber: 15, basis: "book",
    title: "Các tác dụng của dòng điện xoay chiều",
    summary: "So sánh tác dụng nhiệt, phát sáng, từ (cuộn dây hút đinh sắt – SGK Hình 15.4) của dòng điện một chiều và xoay chiều.",
    guide: ["Chọn nguồn: một chiều (DC) hoặc xoay chiều (AC).", "Bấm Bắt đầu, quan sát bóng đèn, dây nung và cuộn dây hút đinh sắt.", "Thay đổi tần số dòng xoay chiều để quan sát; đổi sang dòng một chiều và so sánh."],
    questions: ["Khi đóng công tắc K cho dòng điện xoay chiều chạy qua cuộn dây, đinh sắt bị hút lên chứng tỏ dòng điện có tác dụng gì?", "Hiện tượng có gì khác nếu thay dòng điện xoay chiều bằng dòng điện một chiều?", "Kể tên các tác dụng của dòng điện xoay chiều."],
  },
  {
    key: "fossil-energy", lessonNumber: 16, basis: "support",
    title: "Vòng năng lượng và đốt nhiên liệu hoá thạch",
    summary: "Đốt các loại nhiên liệu, tính nhiệt lượng toả ra và lượng khí CO₂ ước tính phát thải.",
    guide: ["Chọn loại nhiên liệu và khối lượng đốt.", "Bấm Bắt đầu để đốt nhiên liệu.", "Đọc nhiệt lượng toả ra Q = q·m và lượng CO₂ ước tính.", "So sánh các loại nhiên liệu."],
    questions: ["Nhiên liệu nào toả nhiều nhiệt nhất trên 1 kg?", "Vì sao cần hạn chế sử dụng nhiên liệu hoá thạch?"],
  },
  {
    key: "renewable", lessonNumber: 17, basis: "support",
    title: "Nhà máy điện năng lượng tái tạo",
    summary: "Mô phỏng pin Mặt Trời, tua-bin gió và thuỷ điện; thay đổi điều kiện tự nhiên và quan sát công suất.",
    guide: ["Chọn loại nguồn: Mặt Trời, gió hoặc thuỷ điện.", "Điều chỉnh các thông số (cường độ nắng, tốc độ gió, lưu lượng nước…).", "Bấm Bắt đầu, đọc công suất điện tạo ra.", "So sánh ưu, nhược điểm các nguồn."],
    questions: ["Công suất tua-bin gió thay đổi thế nào khi tốc độ gió tăng gấp đôi?", "Vì sao cần kết hợp nhiều nguồn năng lượng tái tạo?"],
  },
  /* ----------------------------- Hoá học 9 (Bài 18 – 35) ----------------------------- */
  {
    key: "metal-reactions", lessonNumber: 18, basis: "book",
    title: "Tính chất hoá học của kim loại",
    summary: "Tái hiện các thí nghiệm của SGK: kim loại tác dụng với oxygen, chlorine, lưu huỳnh, nước, dung dịch HCl và dung dịch muối.",
    guide: ["Chọn chất tác dụng với kim loại (oxygen, chlorine, lưu huỳnh, nước, HCl, CuSO₄).", "Chọn kim loại rồi bấm Tiến hành, quan sát hiện tượng.", "Đọc phương trình hoá học và ghi vào bảng số liệu.", "So sánh các kim loại: kim loại nào phản ứng, kim loại nào không."],
    questions: ["Vì sao đồ vật bằng sắt, nhôm, kẽm, đồng để lâu trong không khí bị mất ánh kim, còn đồ trang sức bằng vàng vẫn sáng đẹp?", "Kim loại nào tác dụng được với nước ở nhiệt độ thường, kim loại nào chỉ tác dụng với hơi nước ở nhiệt độ cao?", "Viết phương trình hoá học của phản ứng giữa kim loại và dung dịch muối mà em đã quan sát."],
  },
  {
    key: "activity-series", lessonNumber: 19, basis: "book",
    title: "Xây dựng và sử dụng dãy hoạt động hoá học",
    summary: "Làm lại các thí nghiệm của SGK (nước, dung dịch HCl, dung dịch AgNO₃) để sắp xếp mức độ hoạt động hoá học của kim loại; đối chiếu với dãy hoạt động.",
    guide: ["Chọn một thí nghiệm (nước, HCl, H₂SO₄ loãng, AgNO₃, CuSO₄).", "Chọn kim loại, bấm Tiến hành và quan sát.", "Xem vị trí kim loại trong dãy hoạt động hoá học và đọc giải thích.", "Dự đoán trước khi bấm Tiến hành rồi kiểm tra."],
    questions: ["Sắp xếp Na, Fe, Cu, Ag theo chiều giảm dần mức độ hoạt động hoá học và giải thích bằng thí nghiệm đã làm.", "Kim loại nào đứng trước H trong dãy tác dụng với dung dịch acid? Cho ví dụ.", "Khi nào kim loại đẩy được kim loại khác ra khỏi dung dịch muối?"],
  },
  {
    key: "metal-extraction", lessonNumber: 20, basis: "support",
    title: "Phương pháp tách kim loại theo mức độ hoạt động",
    summary: "Chọn nhóm kim loại và xem phương pháp tách phù hợp: điện phân nóng chảy, nhiệt luyện hoặc thuỷ luyện, kèm phương trình hoá học.",
    guide: ["Chọn nhóm kim loại theo mức độ hoạt động hoá học.", "Chọn kim loại cần tách.", "Bấm Xem quá trình tách để đọc phương pháp và phương trình hoá học.", "Rút ra quy tắc chọn phương pháp tách."],
    questions: ["Phương pháp nào thường dùng để tách các kim loại hoạt động hoá học mạnh như K, Na, Al?", "Vì sao natri không thể tách bằng phương pháp nhiệt luyện như tách kẽm?", "Nêu các bước cơ bản trong quy trình tách kim loại từ quặng."],
  },
  {
    key: "charcoal-adsorption", lessonNumber: 21, basis: "book",
    title: "Tính hấp phụ của than gỗ",
    summary: "Rót nước màu qua phễu có bột than gỗ và quan sát sự mất màu – tính hấp phụ của carbon.",
    guide: ["Chọn thí nghiệm rồi bấm Rót nước màu qua phễu.", "Quan sát màu của dung dịch trước và sau khi đi qua bột than.", "Giải thích hiện tượng bằng khái niệm hấp phụ."],
    questions: ["Vì sao dung dịch thu được trong cốc bị mất màu?", "Nêu ứng dụng của than hoạt tính dựa vào tính hấp phụ."],
  },
  {
    key: "alkane-combustion", lessonNumber: 23, basis: "book",
    title: "Phản ứng cháy của alkane",
    summary: "Đốt butane (và các alkane C1 – C4), thử sản phẩm bằng thành bình khô và nước vôi trong; so sánh nhiệt lượng toả ra.",
    guide: ["Chọn alkane (methane, ethane, propane, butane).", "Chọn cách quan sát: thành bình mờ, nước vôi trong, cháy không hoàn toàn.", "Bấm Đốt alkane, đọc phương trình và nhiệt lượng toả ra.", "Ghi số liệu để so sánh các alkane."],
    questions: ["Thành bình mờ đi và nước vôi trong vẩn đục cho biết sản phẩm nào tạo thành?", "Viết phương trình hoá học tổng quát đốt cháy hoàn toàn alkane.", "Đốt cháy 1 gam alkane nào toả ra nhiều nhiệt nhất?"],
  },
  {
    key: "ethylene", lessonNumber: 24, basis: "book",
    title: "Tính chất hoá học của ethylene",
    summary: "Đốt ethylene, dẫn ethylene vào nước bromine và quan sát phản ứng trùng hợp; so sánh với propylene.",
    guide: ["Chọn chất (ethylene hoặc propylene).", "Chọn phép thử: đốt cháy, nước bromine, trùng hợp.", "Bấm Tiến hành, quan sát và đọc phương trình.", "Ghi nhận xét về liên kết đôi C=C."],
    questions: ["Vì sao nước bromine bị mất màu khi dẫn ethylene vào?", "Phản ứng nào giúp tạo ra nhựa polyethylene (PE)?", "Propylene có tính chất hoá học tương tự ethylene không? Vì sao?"],
  },
  {
    key: "ethanol", lessonNumber: 26, basis: "book",
    title: "Tính chất hoá học của ethylic alcohol",
    summary: "Đốt ethylic alcohol, cho natri tác dụng với ethylic alcohol; so sánh với methyl alcohol.",
    guide: ["Chọn chất (ethylic alcohol hoặc methyl alcohol).", "Chọn thí nghiệm: đốt cháy, cho natri vào, hoà vào nước.", "Bấm Tiến hành, quan sát hiện tượng và đọc phương trình.", "Giải thích vai trò của nhóm –OH."],
    questions: ["Dựa vào dấu hiệu nào để nhận biết phản ứng đốt cháy ethylic alcohol là phản ứng toả nhiệt?", "Khí nào thoát ra khi cho natri vào ethylic alcohol? Nhóm nguyên tử nào gây ra phản ứng này?", "Vì sao cồn y tế 70° dùng để sát khuẩn?"],
  },
  {
    key: "acetic-acid", lessonNumber: 27, basis: "book",
    title: "Tính chất hoá học của acetic acid",
    summary: "Acetic acid với quỳ tím, Mg, CuO, NaOH, CaCO₃, phản ứng ester hoá với ethylic alcohol và phản ứng cháy.",
    guide: ["Chọn thí nghiệm trong danh sách.", "Bấm Tiến hành và quan sát hiện tượng.", "Đọc phương trình hoá học, ghi vào bảng.", "Rút ra tính chất hoá học của acetic acid."],
    questions: ["Từ các thí nghiệm, nêu tính chất hoá học của acetic acid.", "Vì sao có thể dùng giấm ăn để loại bỏ lớp cặn trong ấm đun nước?", "Viết phương trình phản ứng ester hoá giữa acetic acid và ethylic alcohol."],
  },
  {
    key: "glucose-saccharose", lessonNumber: 29, basis: "book",
    title: "Tính chất hoá học của glucose và saccharose",
    summary: "Phản ứng tráng bạc và lên men rượu của glucose; phản ứng thuỷ phân của saccharose.",
    guide: ["Chọn chất (glucose hoặc saccharose).", "Chọn phản ứng cần thực hiện.", "Bấm Tiến hành, quan sát hiện tượng và đọc phương trình.", "So sánh tính chất của hai chất."],
    questions: ["Phản ứng nào phân biệt được glucose với saccharose?", "Phản ứng lên men rượu của glucose được ứng dụng để làm gì?", "Sản phẩm thuỷ phân saccharose là những chất nào?"],
  },
  {
    key: "starch-cellulose", lessonNumber: 30, basis: "book",
    title: "Tính chất của tinh bột và cellulose",
    summary: "Phản ứng màu của hồ tinh bột với iodine; thuỷ phân tinh bột và cellulose.",
    guide: ["Chọn chất (hồ tinh bột hoặc cellulose).", "Chọn thí nghiệm: thử iodine hoặc thuỷ phân.", "Bấm Tiến hành, quan sát màu sắc và đọc phương trình.", "So sánh tinh bột với cellulose."],
    questions: ["Hồ tinh bột phản ứng với iodine tạo hợp chất có màu gì?", "Ở thí nghiệm thuỷ phân tinh bột, ống nghiệm nào đã có phản ứng hoá học xảy ra? Giải thích.", "Điểm khác nhau của tinh bột và cellulose khi gặp iodine là gì?"],
  },
  {
    key: "protein", lessonNumber: 31, basis: "book",
    title: "Tính chất của protein",
    summary: "Lòng trắng trứng với acid, nhiệt độ, đun nóng mạnh; đốt thử sợi vải để phân biệt tơ tự nhiên với tơ nylon.",
    guide: ["Chọn mẫu thử (lòng trắng trứng hoặc sợi vải).", "Chọn tác nhân.", "Bấm Tiến hành và quan sát hiện tượng.", "Rút ra tính chất của protein."],
    questions: ["Điều gì xảy ra với lòng trắng trứng khi gặp acid hoặc khi hơ nóng?", "Vì sao đốt tơ tằm có mùi khét còn tơ nylon thì không?", "Nêu một số ứng dụng của tính chất đông tụ của protein trong chế biến thực phẩm."],
  },
];

export function experimentForLesson(lessonNumber: number) {
  return EXPERIMENTS.find((e) => e.lessonNumber === lessonNumber) ?? null;
}
