/**
 * MÔ TẢ THÍ NGHIỆM TRONG SÁCH GIÁO KHOA (KHTN 9 – Kết nối tri thức)
 * Đối chiếu với kế hoạch bài dạy KHTN 9 KNTT (Bài 2 – Bài 11) và với các trang SGK (Bài 12 – Bài 17).
 * Được nạp vào khu vực "Thí nghiệm" của từng bài (seed 03), hiển thị cạnh thí nghiệm ảo.
 */
import type { ContentBlock } from "./lessons";

export const BOOK_EXPERIMENTS: Record<number, ContentBlock[]> = {
  2: [
    {
      kind: "text",
      title: "Thí nghiệm SGK: Tìm hiểu động năng",
      body:
        "Dụng cụ: máng trượt (máng nghiêng dài khoảng 30 cm ghép với máng ngang 20–30 cm), quả bóng bi-a, quả bóng golf, miếng gỗ nhỏ (~50 g).\n" +
        "Tiến hành: thả quả bóng từ trên máng nghiêng để nó lăn xuống, va vào miếng gỗ đặt trên máng ngang; đo quãng đường miếng gỗ dịch chuyển.\n" +
        "• Thả cùng một quả bóng từ các độ cao khác nhau (tốc độ khi va chạm khác nhau).\n" +
        "• Thả hai quả bóng khối lượng khác nhau từ cùng độ cao.\n" +
        "Kết luận: quả bóng có tốc độ càng lớn, khối lượng càng lớn thì đẩy miếng gỗ đi càng xa – động năng càng lớn.",
    },
  ],
  3: [
    {
      kind: "text",
      title: "Thí nghiệm SGK: Con lắc đơn",
      body:
        "Dụng cụ: con lắc đơn (vật nặng, sợi dây không dãn), giá thí nghiệm.\n" +
        "Tiến hành: kéo vật lệch khỏi vị trí cân bằng một góc khoảng 50°–60° rồi thả nhẹ cho con lắc dao động trong mặt phẳng thẳng đứng.\n" +
        "Quan sát: từ vị trí cao nhất đến vị trí thấp nhất, tốc độ vật tăng (thế năng → động năng); từ vị trí thấp nhất lên cao, tốc độ giảm (động năng → thế năng).\n" +
        "Vận dụng: xe thế năng – quả nặng treo trên cao có thế năng; khi thả, thế năng chuyển hoá thành động năng của quả nặng và của xe.",
    },
  ],
  4: [
    {
      kind: "text",
      title: "Tình huống SGK: Ai làm việc khoẻ hơn?",
      body:
        "Dùng ròng rọc đưa gạch lên tầng 2 cao 3,5 m, mỗi viên gạch nặng 18 N. Anh Lâm kéo 10 viên trong 1 phút, anh An kéo 12 viên trong 90 giây.\n" +
        "• Công anh Lâm: A = 10·18·3,5 = 630 J → P = 630/60 = 10,5 W.\n" +
        "• Công anh An: A = 12·18·3,5 = 756 J → P = 756/90 = 8,4 W.\n" +
        "Anh Lâm làm việc khoẻ hơn (công suất lớn hơn). Để so sánh làm việc nhanh hay chậm, ta so sánh công thực hiện trong cùng một đơn vị thời gian – công suất.",
    },
  ],
  5: [
    {
      kind: "text",
      title: "Thí nghiệm SGK: Khúc xạ ánh sáng qua bản bán trụ",
      body:
        "Dụng cụ: bảng thí nghiệm có vòng tròn chia độ, bản bán trụ bằng thuỷ tinh, đèn 12 V – 21 W có khe chắn sáng, nguồn điện.\n" +
        "Tiến hành: đặt mặt phẳng của bản bán trụ trùng với đường kính vòng chia độ; chiếu tia sáng tới tâm I với các góc tới i khác nhau; đọc góc khúc xạ r.\n" +
        "Ghi kết quả vào bảng (i, r, sin i, sin r) và tính tỉ số sin i / sin r – tỉ số này gần như không đổi.\n" +
        "Thí nghiệm mở đầu: đồng xu trong cốc – đổ nước vào cốc thì nhìn thấy đồng xu.",
    },
  ],
  6: [
    {
      kind: "text",
      title: "Thí nghiệm SGK: Điều kiện phản xạ toàn phần",
      body:
        "Dụng cụ: bảng thí nghiệm có vòng chia độ, bản bán trụ thuỷ tinh (chiết suất 1,5), đèn 12 V – 21 W có khe chắn sáng.\n" +
        "Tiến hành: chiếu tia sáng qua mặt cong vào tâm bản bán trụ để ánh sáng đi từ thuỷ tinh ra không khí; tăng dần góc tới.\n" +
        "Quan sát: góc khúc xạ lớn hơn góc tới; khi tăng i, tia khúc xạ mờ dần, tia phản xạ sáng dần. Khi i đạt khoảng 42° thì bắt đầu không thấy tia khúc xạ; i lớn hơn nữa thì chỉ còn tia phản xạ – phản xạ toàn phần.",
    },
  ],
  7: [
    {
      kind: "text",
      title: "Thí nghiệm SGK: Tán sắc ánh sáng qua lăng kính",
      body:
        "Dụng cụ: lăng kính gắn trên giá, đèn chiếu ánh sáng trắng có khe hẹp, màn hứng, kính lọc sắc đỏ và tím.\n" +
        "Thí nghiệm 1: chiếu chùm sáng trắng qua lăng kính → trên màn thu được dải màu từ đỏ đến tím.\n" +
        "Thí nghiệm 2: đặt kính lọc sắc đỏ (rồi tím) trước khe sáng → chùm sáng màu qua lăng kính chỉ bị lệch về phía đáy, không bị tách màu; tia tím lệch nhiều hơn tia đỏ.",
    },
  ],
  8: [
    {
      kind: "text",
      title: "Thí nghiệm SGK: Đường truyền tia sáng và ảnh qua thấu kính",
      body:
        "Bộ 1: nguồn laser tạo 3 chùm sáng song song, thấu kính hội tụ, thấu kính phân kì, bảng từ – quan sát chùm tia ló hội tụ (thấu kính hội tụ) hoặc loe rộng (thấu kính phân kì).\n" +
        "Bộ 2: đèn, vật phẳng, thấu kính, màn hứng ảnh, giá quang học – đặt vật ở các vị trí khác nhau, dịch màn để thu ảnh, nhận xét đặc điểm ảnh (thật/ảo, cùng/ngược chiều, lớn/nhỏ hơn vật).",
    },
  ],
  9: [
    {
      kind: "text",
      title: "Mẫu báo cáo thực hành",
      body:
        "Dụng cụ: nguồn sáng, vật sáng bằng kính mờ hình chữ F, thấu kính hội tụ, màn ảnh, giá quang học đồng trục.\n" +
        "Bảng kết quả (3 lần đo): d (mm) · d' (mm) · h (mm) · h' (mm) · f = (d + d')/4 (mm).\n" +
        "Tính giá trị trung bình của tiêu cự và nhận xét sai số.",
    },
  ],
  10: [
    {
      kind: "text",
      title: "Hoạt động SGK: Quan sát qua kính lúp",
      body:
        "Dụng cụ: kính lúp, mẩu giấy in chữ nhỏ (cỡ 5).\n" +
        "Tiến hành: đặt kính lúp sát mẩu giấy rồi từ từ đưa kính ra xa đến khi nhìn thấy chữ rõ nét và to. Nếu đưa kính ra quá xa (vật ra ngoài khoảng tiêu cự) thì không quan sát được ảnh phóng to cùng chiều.",
    },
  ],
  11: [
    {
      kind: "text",
      title: "Thí nghiệm SGK: Xây dựng định luật Ohm",
      body:
        "Dụng cụ: nguồn điện một chiều 12 V, ba điện trở R₁ < R₂ < R₃, biến trở, ampe kế, vôn kế, công tắc, dây nối.\n" +
        "Tiến hành: mắc ampe kế nối tiếp, vôn kế song song với điện trở; thay đổi hiệu điện thế lần lượt 0 V, 3 V, 6 V, 9 V, 12 V và đọc cường độ dòng điện.\n" +
        "Xử lí: tính tỉ số U/I ở mỗi lần đo → tỉ số gần như không đổi với cùng một điện trở; vẽ đồ thị I theo U là đường thẳng đi qua gốc toạ độ.",
    },
  ],
  12: [
    {
      kind: "text",
      title: "Thí nghiệm SGK 12.1: Đặc điểm của đoạn mạch nối tiếp (Hình 12.2, Bảng 12.1)",
      body:
        "Chuẩn bị: nguồn điện một chiều 12 V; ba điện trở R₁ = 6 Ω, R₂ = 10 Ω, R₃ = 16 Ω; hai ampe kế có giới hạn đo 3 A, độ chia nhỏ nhất 0,01 A; công tắc, dây nối.\n" +
        "Tiến hành: mắc hai điện trở R₁ và R₂ cùng hai ampe kế vào mạch theo sơ đồ Hình 12.2; đóng công tắc, đọc số chỉ của các ampe kế và ghi vào vở theo mẫu Bảng 12.1. Lặp lại thí nghiệm với R₁ và R₃, rồi R₂ và R₃.\n" +
        "Số liệu mẫu trong SGK: R₁ và R₂: A₁ = A₂ = 0,75 A; R₁ và R₃: 0,54 A; R₂ và R₃: 0,46 A.\n" +
        "Kết luận: cường độ dòng điện tại mọi điểm trong đoạn mạch nối tiếp bằng nhau: I = I₁ = I₂ (với n điện trở: I = I₁ = I₂ = … = Iₙ).",
    },
    {
      kind: "text",
      title: "Thí nghiệm SGK 12.2: Đặc điểm của đoạn mạch song song (Hình 12.4, Bảng 12.2)",
      body:
        "Chuẩn bị: nguồn điện một chiều 6 V; hai điện trở R₁ = 10 Ω, R₂ = 6 Ω; ba ampe kế có giới hạn đo 3 A, độ chia nhỏ nhất 0,01 A; công tắc, dây nối.\n" +
        "Tiến hành: mắc hai điện trở và ba ampe kế theo sơ đồ Hình 12.4; đóng công tắc, đọc cường độ dòng điện trong mạch chính (ampe kế A) và trong các mạch nhánh (A₁, A₂), ghi vào vở theo mẫu Bảng 12.2.\n" +
        "Số liệu mẫu trong SGK: I = 1,60 A; I₁ = 0,60 A; I₂ = 1,00 A.\n" +
        "Yêu cầu: so sánh cường độ dòng điện trong mạch chính với tổng cường độ dòng điện trong các mạch nhánh.\n" +
        "Kết luận: I = I₁ + I₂ (với n điện trở: I = I₁ + I₂ + … + Iₙ).",
    },
  ],
  13: [
    {
      kind: "text",
      title: "Hoạt động SGK 13: Năng lượng điện, công suất điện (bài này không có thí nghiệm thực hành)",
      body:
        "SGK Bài 13 gồm các hoạt động và câu hỏi, không có thí nghiệm thực hành. Ứng dụng cung cấp mô phỏng bổ trợ để minh hoạ.\n" +
        "• Năng lượng điện: W = UIt (W – J; U – V; I – A; t – s). Ví dụ: động cơ một chiều 12 V, 0,5 A trong 30 phút; dây tóc bóng đèn 3,5 V, 12 Ω trong 4 phút.\n" +
        "• Công suất điện: 𝒫 = UI. Ví dụ: bóng đèn 220 V, cường độ 0,3 A trong 3 h.\n" +
        "• Công suất điện định mức: số ghi trên thiết bị, chẳng hạn bóng đèn 220 V – 60 W. Giải thích các số ghi: đèn pin 2,5 V – 2,5 W; bàn là 220 V – 1 000 W; bóng đèn sợi đốt 110 V – 100 W.\n" +
        "• Em có thể: tính năng lượng điện tiêu thụ hằng tháng của gia đình và tiền điện phải trả; tìm hiểu công tơ điện (1 kWh = 3,6·10⁶ J).",
    },
  ],
  14: [
    {
      kind: "text",
      title: "Thí nghiệm SGK 14.1: Cảm ứng điện từ với thanh nam châm vĩnh cửu (Hình 14.1)",
      body:
        "Chuẩn bị: thanh nam châm vĩnh cửu, cuộn dây dẫn, điện kế và các dây nối.\n" +
        "Tiến hành: nối hai đầu cuộn dây với điện kế; quan sát kim điện kế khi đưa cực Bắc của thanh nam châm lại gần hoặc ra xa cuộn dây.\n" +
        "Nhận xét: kim điện kế lệch khi nam châm chuyển động so với cuộn dây → xuất hiện dòng điện cảm ứng.",
    },
    {
      kind: "text",
      title: "Thí nghiệm SGK 14.2: Cảm ứng điện từ với nam châm điện (Hình 14.3)",
      body:
        "Chuẩn bị: cuộn dây (1), nam châm điện (2), nguồn điện (3), điện kế (4), công tắc (5) và dây nối.\n" +
        "Tiến hành: lắp mạch như Hình 14.3; quan sát kim điện kế khi đóng, khi mở công tắc.\n" +
        "Yêu cầu: nêu sự biến thiên số đường sức từ xuyên qua tiết diện cuộn dây khi đóng, mở công tắc; đề xuất giả thuyết về nguyên nhân xuất hiện dòng điện cảm ứng.",
    },
    {
      kind: "text",
      title: "Thí nghiệm SGK 14.3: Cảm ứng điện từ khi quay nam châm (Hình 14.4)",
      body:
        "Chuẩn bị: cuộn dây dẫn có mắc hai đèn LED (đỏ và vàng) ngược cực nhau, thanh nam châm vĩnh cửu có trục quay ở giữa.\n" +
        "Tiến hành: bố trí như Hình 14.4; quan sát sự sáng của hai đèn LED khi quay nam châm.\n" +
        "Nhận xét: khi nam châm quay, số đường sức từ xuyên qua tiết diện cuộn dây biến thiên; trong cuộn dây xuất hiện dòng điện cảm ứng có chiều luân phiên thay đổi (hai đèn LED sáng luân phiên).",
    },
    {
      kind: "text",
      title: "Thí nghiệm SGK 14.4: Thay đổi tiết diện cuộn dây (Hình 14.6)",
      body:
        "Chuẩn bị: cuộn dây dẫn mềm có hai đầu nối với điện kế, nam châm vĩnh cửu.\n" +
        "Tiến hành: bố trí như Hình 14.6; bóp cuộn dây để làm giảm tiết diện, quan sát kim điện kế; kéo giãn lại và quan sát tiếp.\n" +
        "Kết luận chung: khi số đường sức từ xuyên qua tiết diện của cuộn dây dẫn kín biến thiên thì trong cuộn dây xuất hiện dòng điện cảm ứng – hiện tượng cảm ứng điện từ.",
    },
    {
      kind: "text",
      title: "Thí nghiệm SGK: Tạo dòng điện xoay chiều bằng mô hình máy phát điện (Hình 14.8)",
      body:
        "Chuẩn bị: bộ thí nghiệm mô hình máy phát điện xoay chiều (nam châm, cuộn dây quay, hai đèn LED ngược cực).\n" +
        "Tiến hành: quay chậm rồi quay nhanh cuộn dây (hoặc nam châm); quan sát độ sáng, tối luân phiên của hai đèn LED.\n" +
        "Kết luận: nguyên tắc tạo dòng điện xoay chiều – khi số đường sức từ xuyên qua tiết diện cuộn dây kín biến thiên luân phiên (tăng, giảm) theo thời gian thì trong cuộn dây xuất hiện dòng điện xoay chiều. Dòng điện xoay chiều có cường độ và chiều thay đổi luân phiên theo thời gian (dòng điện gia đình 50 Hz đổi chiều 100 lần trong 1 giây).",
    },
  ],
  15: [
    {
      kind: "text",
      title: "Quan sát SGK 15: Tác dụng nhiệt và tác dụng phát sáng (Hình 15.1 – 15.3)",
      body:
        "Tác dụng nhiệt: quan sát máy sấy tóc đang hoạt động (Hình 15.1) – vỏ nhựa và dây điện trở nóng lên; năng lượng điện chuyển hoá thành nhiệt năng. Dòng điện xoay chiều chạy qua vật dẫn làm vật nóng lên.\n" +
        "Tác dụng phát sáng: quan sát đèn huỳnh quang và đèn sợi đốt khi có dòng điện xoay chiều chạy qua (Hình 15.2, 15.3).",
    },
    {
      kind: "text",
      title: "Thí nghiệm SGK 15: Tác dụng từ của dòng điện xoay chiều (Hình 15.4)",
      body:
        "Bố trí: nguồn điện xoay chiều, công tắc K, cuộn dây có lõi sắt và đinh sắt (Hình 15.4a, sơ đồ Hình 15.4b).\n" +
        "Tiến hành: đóng công tắc K cho dòng điện xoay chiều chạy qua cuộn dây; quan sát đinh sắt.\n" +
        "Yêu cầu: cho biết dòng điện xoay chiều có tác dụng gì; hiện tượng có khác không nếu thay dòng điện xoay chiều bằng dòng điện một chiều?\n" +
        "Tác dụng sinh lí: dòng điện đi qua cơ thể có thể làm co cơ; máy khử rung tim dùng tác dụng này để chữa bệnh (Hình 15.6).",
    },
  ],
  16: [
    {
      kind: "text",
      title: "Hoạt động SGK 16: Quan sát sơ đồ vòng năng lượng (bài này không có thí nghiệm thực hành)",
      body:
        "SGK Bài 16 gồm các hoạt động quan sát hình và thảo luận, không có thí nghiệm thực hành. Ứng dụng cung cấp mô phỏng bổ trợ để minh hoạ.\n" +
        "• Hình 16.1 – Vòng năng lượng trên Trái Đất: mô tả sự chuyển hoá năng lượng giữa các vật sống (quang hợp, chuỗi thức ăn); chỉ ra năng lượng từ Mặt Trời.\n" +
        "• Hình 16.2 – Vòng năng lượng theo vòng tuần hoàn của nước: mô tả sự chuyển hoá giữa các dạng năng lượng.\n" +
        "• Năng lượng hoá thạch (than, dầu mỏ, khí tự nhiên – Hình 16.3 quá trình hình thành dầu mỏ): vì sao nhiên liệu hoá thạch bổ sung chậm và sẽ dần cạn kiệt; ảnh hưởng đến môi trường.",
    },
  ],
  17: [
    {
      kind: "text",
      title: "Hoạt động SGK 17: Năng lượng tái tạo (bài này không có thí nghiệm thực hành)",
      body:
        "SGK Bài 17 gồm các hoạt động quan sát hình, tìm hiểu thông tin và thảo luận, không có thí nghiệm thực hành. Ứng dụng cung cấp mô phỏng bổ trợ để minh hoạ.\n" +
        "• Hình 17.1: các dạng năng lượng trên Trái Đất – dạng nào là năng lượng tái tạo.\n" +
        "• Ưu, nhược điểm của năng lượng Mặt Trời (Hình 17.2), năng lượng gió (Hình 17.3), năng lượng sóng biển (Hình 17.4) và năng lượng dòng sông – thuỷ điện (Hình 17.5).\n" +
        "• Một số biện pháp sử dụng hiệu quả năng lượng và bảo vệ môi trường.",
    },
  ],
};
