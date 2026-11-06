/**
 * MÔ TẢ THÍ NGHIỆM TRONG SÁCH GIÁO KHOA (KHTN 9 – Kết nối tri thức)
 * Đối chiếu với kế hoạch bài dạy KHTN 9 KNTT (Bài 2 – Bài 11); Bài 12 – 17 theo chương trình.
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
      title: "Thí nghiệm SGK: Đoạn mạch nối tiếp và song song",
      body:
        "Dụng cụ: nguồn điện, hai điện trở, ampe kế, vôn kế, công tắc, dây nối.\n" +
        "Nối tiếp: mắc ampe kế ở các vị trí khác nhau trong mạch → số chỉ như nhau; đo U₁, U₂, U → U = U₁ + U₂.\n" +
        "Song song: đo cường độ dòng điện trong các nhánh và mạch chính → I = I₁ + I₂; hiệu điện thế hai đầu mỗi nhánh bằng nhau.",
    },
  ],
  13: [
    {
      kind: "text",
      title: "Hoạt động SGK: Năng lượng điện và công suất điện",
      body:
        "Quan sát các dụng cụ điện trong gia đình và số ghi trên chúng (ví dụ 220 V – 1000 W). Tìm hiểu sự chuyển hoá năng lượng điện thành nhiệt năng, cơ năng, quang năng.\n" +
        "Đọc công tơ điện: số chỉ của công tơ tính bằng kWh. Tính năng lượng điện tiêu thụ W = P·t và tiền điện của gia đình trong một tháng.",
    },
  ],
  14: [
    {
      kind: "text",
      title: "Thí nghiệm SGK: Cảm ứng điện từ",
      body:
        "Dụng cụ: cuộn dây dẫn có mắc đèn LED (hoặc điện kế), nam châm vĩnh cửu.\n" +
        "Tiến hành: đưa nam châm lại gần, ra xa, giữ yên trong lòng cuộn dây; quay nam châm trước cuộn dây.\n" +
        "Quan sát: đèn sáng (kim điện kế lệch) chỉ khi nam châm chuyển động so với cuộn dây – tức là khi số đường sức từ qua cuộn dây biến thiên. Dùng hai đèn LED mắc song song ngược chiều để thấy dòng điện cảm ứng đổi chiều khi nam châm quay.",
    },
  ],
  15: [
    {
      kind: "text",
      title: "Thí nghiệm SGK: Tác dụng của dòng điện xoay chiều",
      body:
        "Tác dụng nhiệt, phát sáng: mắc bóng đèn vào nguồn xoay chiều → đèn nóng lên và sáng.\n" +
        "Tác dụng từ: đặt kim nam châm gần cuộn dây có dòng điện xoay chiều → kim nam châm dao động; nam châm điện dùng dòng xoay chiều vẫn hút được đinh sắt.\n" +
        "Đo: dùng vôn kế, ampe kế xoay chiều (kí hiệu AC hoặc ~).",
    },
  ],
  16: [
    {
      kind: "text",
      title: "Hoạt động SGK: Sơ đồ vòng năng lượng",
      body:
        "Dựa vào sơ đồ, mô tả đường đi của năng lượng Mặt Trời: chiếu tới Trái Đất → làm nóng không khí, đất, nước (gió, mưa, dòng chảy) → thực vật quang hợp → động vật → nhiên liệu hoá thạch; cuối cùng năng lượng toả ra môi trường dưới dạng nhiệt.\n" +
        "Thảo luận: ảnh hưởng của việc khai thác, sử dụng than đá, dầu mỏ, khí tự nhiên đến môi trường.",
    },
  ],
  17: [
    {
      kind: "text",
      title: "Hoạt động SGK: Tìm hiểu năng lượng tái tạo",
      body:
        "Tìm hiểu nguyên tắc hoạt động của pin Mặt Trời, tua-bin gió, nhà máy thuỷ điện; so sánh ưu, nhược điểm.\n" +
        "Liên hệ Việt Nam: các nhà máy điện Mặt Trời, điện gió ở Ninh Thuận, Bình Thuận; thuỷ điện Hoà Bình, Sơn La.",
    },
  ],
};
