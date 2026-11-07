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
      title: "Hoạt động SGK 2: Quan sát và giải thích (bài này không có thí nghiệm thực hành)",
      body:
        "SGK Bài 2 gồm các hoạt động quan sát hình và câu hỏi, không có thí nghiệm thực hành. Ứng dụng cung cấp mô phỏng bổ trợ để minh hoạ.\n" +
        "• Hình 2.1 – búa đập vào thanh thép: búa có khối lượng lớn và chuyển động càng nhanh thì làm thanh thép biến dạng càng nhiều → động năng của búa càng lớn.\n" +
        "• Hình 2.2 – quả bóng bay tới rổ, ô tô đang di chuyển trên đường cao tốc, máy bay đang chuyển động trên bầu trời: vật nào có động năng lớn nhất? Giải thích.\n" +
        "• Hình 2.3 – sơ đồ đập thuỷ điện: giải thích vì sao khai thác được tối đa thế năng của nước khi đặt máy phát điện càng thấp so với mực nước hồ chứa.\n" +
        "• Câu hỏi: động năng của ô tô thay đổi thế nào nếu tốc độ tăng gấp đôi? Tính động năng của quả bóng đá 0,45 kg bay với tốc độ 10 m/s.",
    },
  ],
  3: [
    {
      kind: "text",
      title: "Thí nghiệm SGK 3: Sự chuyển hoá động năng – thế năng của con lắc đơn (Hình 3.2)",
      body:
        "Chuẩn bị: con lắc đơn (gồm vật nặng, sợi dây không dãn) được treo vào giá thí nghiệm.\n" +
        "Tiến hành:\n" +
        "• Kéo vật nặng đến vị trí A ở độ cao h rồi thả nhẹ; vật nặng chuyển động đến vị trí thấp nhất O, rồi tiếp tục đi lên và dừng lại ở điểm B, sau đó chuyển động ngược lại.\n" +
        "• So sánh độ cao của điểm B với độ cao của điểm A.\n" +
        "• Quan sát vật nặng chuyển động qua lại điểm O sau một khoảng thời gian.\n" +
        "Câu hỏi: nhận xét sự chuyển hoá giữa động năng và thế năng của vật nặng; vì sao sau một thời gian chuyển động, độ cao của vật nặng giảm dần?",
    },
    {
      kind: "text",
      title: "Hoạt động SGK 3: Xe thế năng (Hình 3.4)",
      body:
        "Quả nặng nối với trục xe qua ròng rọc cố định bởi một sợi dây mềm, không dãn; khi thả, quả nặng chuyển động từ trên xuống, sợi dây kéo trục xe làm bánh xe lăn.\n" +
        "• Mô tả sự chuyển hoá năng lượng từ khi thả quả nặng đến khi quả nặng chạm sàn xe.\n" +
        "• Cho độ cao ban đầu của quả nặng so với sàn xe là 8 cm, khối lượng quả nặng 20 g, khối lượng xe 50 g: tính tốc độ của xe ngay khi quả nặng chạm sàn xe, nếu coi toàn bộ thế năng của quả nặng chuyển hoá thành động năng của xe.\n" +
        "• Trong thực tế, tốc độ thu được nhỏ hơn giá trị tính toán – hãy giải thích.",
    },
  ],
  4: [
    {
      kind: "text",
      title: "Hoạt động SGK 4: Công và công suất (bài này không có thí nghiệm thực hành)",
      body:
        "SGK Bài 4 gồm các hoạt động quan sát hình và tính toán, không có thí nghiệm thực hành. Ứng dụng cung cấp mô phỏng bổ trợ để minh hoạ.\n" +
        "• Hình 4.1 – người đẩy xe hàng: công của lực F làm xe dịch chuyển quãng đường s theo hướng của lực: A = Fs.\n" +
        "• Hình 4.2 – các ví dụ có và không thực hiện công cơ học (đưa vật nặng lên cao, vận động viên ném lao, học sinh ngồi học, vận động viên đứng yên giữ tạ): xác định lực tác dụng lên vật và quãng đường vật dịch chuyển theo hướng của lực.\n" +
        "• Hình 4.4 – hai xe nâng nâng hai thùng hàng từ mặt đất lên sàn xe cao 1 m: xe thứ nhất nâng thùng 500 N hết 10 s; xe thứ hai nâng thùng 700 N hết 15 s. Công: A₁ = 500·1 = 500 J; A₂ = 700·1 = 700 J. Công suất: P₁ = 500/10 = 50 W; P₂ = 700/15 ≈ 46,7 W → xe thứ nhất thực hiện công nhanh hơn.\n" +
        "• Bảng 4.1 – một số giá trị công suất (ngựa, ô tô, đầu máy xe lửa, tên lửa, nhà máy thuỷ điện Hoà Bình, Mặt Trời).",
    },
  ],
  5: [
    {
      kind: "text",
      title: "Thí nghiệm SGK 5.1: Tìm hiểu hiện tượng khúc xạ ánh sáng (Hình 5.1, 5.2)",
      body:
        "Chuẩn bị: bảng thí nghiệm có gắn tấm nhựa in vòng tròn chia độ; một bản bán trụ bằng thuỷ tinh; đèn 12 V – 21 W có khe cài bản chắn sáng; nguồn điện (biến áp nguồn).\n" +
        "Tiến hành: bố trí thí nghiệm như Hình 5.1; chiếu một chùm sáng tới SI (điểm tới I là tâm của bản bán trụ); quan sát đường đi của chùm sáng.\n" +
        "Câu hỏi: chùm sáng truyền từ không khí vào thuỷ tinh bị gãy khúc (lệch khỏi phương truyền) tại đâu?",
    },
    {
      kind: "text",
      title: "Thí nghiệm SGK 5.2: Mối liên hệ giữa góc khúc xạ và góc tới (Bảng 5.1)",
      body:
        "Tiến hành: chiếu tia sáng tới mặt phân cách tại điểm I (tâm của đường tròn chia độ) lần lượt với góc tới 0°, 20°, 40°, 60°, 80°; đọc giá trị góc khúc xạ tương ứng và hoàn thành vào vở theo mẫu Bảng 5.1.\n" +
        "Số liệu mẫu trong SGK: i = 0° → r = 0°; i = 20° → r = 13°; i = 40° → r = 25°; i = 60° → r = 35°; i = 80° → r = 41°.\n" +
        "Yêu cầu: tia khúc xạ nằm ở phía nào của pháp tuyến so với tia tới; so sánh độ lớn góc tới và góc khúc xạ; nhận xét tỉ số giữa sin i và sin r.",
    },
    {
      kind: "text",
      title: "Thí nghiệm SGK 5.3: Khảo sát phương của tia khúc xạ (Hình 5.4)",
      body:
        "Chuẩn bị: bản bán trụ bằng thuỷ tinh trong suốt; một tấm xốp mỏng có gắn bảng chia độ; bốn chiếc đinh ghim giống nhau; một tấm nhựa phẳng.\n" +
        "Tiến hành: bố trí như Hình 5.4. Cắm các đinh ghim ở O và A để xác định pháp tuyến OA; cắm đinh ghim ở B để xác định tia tới BO. Đặt mắt nhìn vào mặt phẳng của bản bán trụ sao cho đầu mũ đinh ghim ở O che khuất ảnh đầu mũ đinh ghim ở B; cắm đinh ghim ở C trên đường truyền sáng từ O tới mắt sao cho đầu mũ đinh ghim ở C che khuất ảnh của các đinh ghim ở B và O. Khi đó tia khúc xạ là tia OC.\n" +
        "Dùng tấm nhựa phẳng đặt vuông góc với bản bán trụ để kiểm tra các tia BO, OA, OC có đồng phẳng không.\n" +
        "Kết luận: tia khúc xạ nằm trong mặt phẳng tới và ở phía bên kia pháp tuyến so với tia tới; sin i / sin r = hằng số (định luật khúc xạ ánh sáng).",
    },
    {
      kind: "text",
      title: "Quan sát SGK 5: Đồng xu trong cốc (Hình 5.6)",
      body:
        "Khi trong cốc không có nước thì không nhìn thấy đồng xu ở đáy; đổ nước vào cốc thì nhìn thấy đồng xu. Dựa vào đường truyền của tia sáng phát ra từ đồng xu (bị khúc xạ khi ra khỏi mặt nước) để giải thích.",
    },
  ],
  6: [
    {
      kind: "text",
      title: "Thí nghiệm SGK 6: Phản xạ toàn phần (Hình 6.1, Bảng 6.1)",
      body:
        "Chuẩn bị: bảng thí nghiệm có gắn tấm nhựa in vòng tròn chia độ; một bản bán trụ bằng thuỷ tinh; đèn 12 V – 21 W có khe cài bản chắn sáng; nguồn điện (biến áp nguồn).\n" +
        "Tiến hành: bố trí như Hình 6.1; chiếu chùm sáng hẹp truyền từ bản bán trụ ra không khí, tăng dần góc tới i và quan sát chùm sáng phản xạ và chùm sáng khúc xạ ra không khí; ghi đặc điểm nhìn thấy vào vở theo mẫu Bảng 6.1.\n" +
        "Kết quả mẫu (Bảng 6.1): i nhỏ – tia khúc xạ có độ sáng giảm dần khi tăng i, tia phản xạ có độ sáng tăng dần; i = i_th – bắt đầu không nhìn thấy tia khúc xạ, tia phản xạ rất sáng; i lớn hơn i_th – không còn nhìn thấy tia khúc xạ, tia phản xạ rất sáng.\n" +
        "Câu hỏi: góc khúc xạ lớn hơn hay nhỏ hơn góc tới? Khi nào xảy ra hiện tượng chỉ có tia phản xạ?\n" +
        "Hoạt động: tính góc tới hạn khi tia sáng chiếu từ bản bán trụ thuỷ tinh (n₁ = 1,5) ra không khí (n₂ = 1): sin i_th = 1/1,5 → i_th ≈ 41,8°; dùng dụng cụ thí nghiệm ở Hình 6.1 xác định i_th, so sánh kết quả và rút ra nhận xét.",
    },
    {
      kind: "text",
      title: "Hoạt động SGK 6: Ảo ảnh và cáp quang (Hình 6.2 – 6.4)",
      body:
        "• Ảo ảnh trên mặt đường nhựa nóng (Hình 6.2, 6.3): lớp không khí càng gần mặt đường càng nóng nên chiết suất càng nhỏ; tia sáng từ ngọn cây bị khúc xạ liên tiếp rồi phản xạ toàn phần, đến mắt như phát ra từ phía dưới mặt đường.\n" +
        "• Cáp quang (Hình 6.4): sợi quang có lõi chiết suất n₁ lớn hơn lớp vỏ n₂; tia sáng bị phản xạ toàn phần nhiều lần tại mặt tiếp giáp lõi – vỏ. Sợi quang dùng để truyền dữ liệu trong công nghệ thông tin và trong y học.",
    },
  ],
  7: [
    {
      kind: "text",
      title: "Thí nghiệm SGK 7.1: Tìm hiểu hiện tượng tán sắc ánh sáng (Hình 7.4)",
      body:
        "Chuẩn bị: lăng kính gắn trên giá (1); đèn chiếu ánh sáng trắng có khe hẹp (2); màn hứng chùm sáng (3); nguồn điện và dây nối (4); tấm kính lọc sắc màu đỏ và tấm kính lọc sắc màu tím (5).\n" +
        "Tiến hành: bố trí như Hình 7.4; chiếu chùm ánh sáng trắng từ đèn vào mặt bên của lăng kính, dùng màn chắn dịch chuyển phía sau lăng kính để hứng vệt sáng trên màn.\n" +
        "Yêu cầu: mô tả đường đi của tia sáng qua lăng kính mà em quan sát được; viết ra thứ tự các màu xuất hiện trên màn; những màu sắc khác nhau cho biết điều gì về thành phần của chùm ánh sáng trắng chiếu tới?\n" +
        "Kết luận: chiếu chùm sáng trắng hẹp qua lăng kính thu được dải màu từ đỏ đến tím – quang phổ của ánh sáng trắng; đó là hiện tượng tán sắc ánh sáng.",
    },
    {
      kind: "text",
      title: "Thí nghiệm SGK 7.2: Ánh sáng đơn sắc qua lăng kính",
      body:
        "Chuẩn bị: dụng cụ như thí nghiệm 1.\n" +
        "Tiến hành: bố trí như Hình 7.4; chiếu ánh sáng trắng từ đèn vào mặt bên của lăng kính; lần lượt dùng kính lọc sắc màu đỏ và màu tím chắn vào khe hẹp của nguồn sáng; dùng màn chắn hứng vệt sáng trên màn.\n" +
        "Câu hỏi: khi chiếu ánh sáng qua tấm kính lọc sắc đến mặt bên của lăng kính, ánh sáng có bị tách thành nhiều màu không? So sánh góc lệch của tia sáng màu đỏ và màu tím.\n" +
        "Kết luận: ánh sáng đơn sắc là ánh sáng có một màu nhất định và không bị tán sắc khi đi qua lăng kính.",
    },
    {
      kind: "text",
      title: "Hoạt động SGK 7: Màu sắc của vật (Hình 7.8 – 7.12)",
      body:
        "Màu sắc của một vật phụ thuộc vào màu sắc của ánh sáng bị vật đó hấp thụ và phản xạ. Dưới ánh sáng trắng, vật có màu nào là do nó phản xạ ánh sáng màu đó vào mắt ta và hấp thụ những màu còn lại; vật màu đen hấp thụ tất cả ánh sáng màu nên không có ánh sáng phản xạ.\n" +
        "Em có thể chế tạo dụng cụ đơn giản để trộn màu ánh sáng (Hình 7.12): bìa cứng tròn, bút màu (đỏ, da cam, vàng, lục, lam, chàm, tím), sợi dây, kéo – khi quay nhanh, bảy màu hoà vào nhau cho ánh sáng trắng.",
    },
  ],
  8: [
    {
      kind: "text",
      title: "Thí nghiệm SGK 8.1: Đường truyền của tia sáng qua thấu kính (Hình 8.6)",
      body:
        "Chuẩn bị: nguồn sáng; thấu kính hội tụ, thấu kính phân kì.\n" +
        "Tiến hành: bố trí như Hình 8.6 với thấu kính hội tụ; lần lượt chiếu tia sáng song song với trục chính tới thấu kính, và tia sáng qua quang tâm O; quan sát tia ló trong mỗi trường hợp và rút ra nhận xét; lặp lại thí nghiệm trên thấu kính phân kì.\n" +
        "Yêu cầu: biểu diễn đường đi của tia sáng qua thấu kính bằng hình vẽ; đường đi của các tia sáng tới quang tâm và tia sáng song song với trục chính có đặc điểm gì?",
    },
    {
      kind: "text",
      title: "Thí nghiệm SGK 8.2: Kiểm tra đặc điểm ảnh của vật qua thấu kính (Hình 8.12)",
      body:
        "Chuẩn bị: bộ thí nghiệm như Hình 8.12 gồm đèn chiếu sáng (1); vật sáng bằng kính mờ hình chữ F (2); thấu kính hội tụ hoặc thấu kính phân kì (3); màn chắn (4); giá quang học (5); nguồn điện và dây nối (6).\n" +
        "Thí nghiệm 1 (thấu kính hội tụ): đặt vật ở vị trí d > f; từ từ dịch chuyển màn chắn đến khi thu được ảnh rõ nét trên màn, nhận xét đặc điểm ảnh; lặp lại thí nghiệm khi d < f và rút ra nhận xét.\n" +
        "Câu hỏi: đặt vật trong khoảng nào thì hứng được ảnh rõ nét trên màn chắn, ảnh đó là ảnh thật hay ảnh ảo? Khi đặt vật trong khoảng tiêu cự, quan sát ảnh ảo bằng cách nào, ảnh ảo có hứng được trên màn không?\n" +
        "Thí nghiệm 2 (thấu kính phân kì): thay thấu kính hội tụ bằng thấu kính phân kì; đặt vật ở các vị trí d > f và d < f; đặt mắt quan sát ảnh của vật qua thấu kính.\n" +
        "Yêu cầu: ảnh ảo tạo bởi thấu kính hội tụ và thấu kính phân kì giống và khác nhau thế nào? Nêu các cách phân biệt thấu kính hội tụ và thấu kính phân kì.",
    },
    {
      kind: "text",
      title: "Hoạt động SGK 8: Dựng ảnh qua thấu kính (Hình 8.10, 8.11; Bảng 8.1, 8.2)",
      body:
        "Để vẽ ảnh của điểm sáng S qua thấu kính: tia sáng từ S tới quang tâm O thì đi thẳng; tia sáng từ S song song với trục chính thì tia ló (hoặc đường kéo dài của tia ló) đi qua tiêu điểm chính F. Giao điểm S' của chùm tia ló (hoặc đường kéo dài) là ảnh của S.\n" +
        "Dựng ảnh của vật nhỏ AB vuông góc với trục chính (A nằm trên trục chính): dựng ảnh B' của điểm B rồi hạ B'A' vuông góc với trục chính. Quy tắc: ảnh thật vẽ bằng mũi tên nét liền, ảnh ảo vẽ bằng mũi tên nét đứt.\n" +
        "Yêu cầu: dựng ảnh của vật AB trong các trường hợp d > f và d < f (thấu kính hội tụ), rồi với thấu kính phân kì; nhận xét đặc điểm ảnh (thật hay ảo, cùng hay ngược chiều, lớn hơn hay nhỏ hơn vật) theo mẫu Bảng 8.1, 8.2.",
    },
  ],
  9: [
    {
      kind: "text",
      title: "Thực hành SGK 9: Đo tiêu cự thấu kính hội tụ bằng phương pháp đối xứng – Silbermann (Hình 9.1, Bảng 9.1)",
      body:
        "Chuẩn bị: nguồn sáng (1); vật sáng bằng kính mờ hình chữ F (2); thấu kính hội tụ (3); màn chắn (4); giá quang học đồng trục (5); nguồn điện, dây nối (6).\n" +
        "Cơ sở: vật AB vuông góc với trục chính, cách thấu kính một khoảng d = 2f thì ảnh thật cũng cách thấu kính d' = d và cao bằng vật; khi đó f = (d + d')/4.\n" +
        "Cách tiến hành: Bước 1 – đo chiều cao h của vật hình chữ F. Bước 2 – bố trí như Hình 9.1: đặt vật và màn chắn sát thấu kính, dịch đồng thời vật và màn ra xa dần thấu kính những khoảng bằng nhau cho đến khi quan sát được ảnh rõ nét trên màn thì ghi giá trị d và d' vào vở theo mẫu Bảng 9.1. Bước 3 – đo chiều cao h' của ảnh. Lặp lại thí nghiệm hai lần nữa, ghi kết quả; tính giá trị trung bình của d và d', rồi tiêu cự f = (d̄ + d̄')/4.\n" +
        "Báo cáo: nhận xét chiều cao h của vật và h' của ảnh; so sánh f với số liệu ghi trên thấu kính; so sánh ưu, nhược điểm của phương pháp Silbermann với phương án đo trực tiếp khoảng cách từ quang tâm O đến tiêu điểm chính F.\n" +
        "Em có biết: phương pháp Bessel (hoán vị) xác định tiêu cự bằng công thức f = (L² − l²)/(4L), với L là khoảng cách vật – màn, l là khoảng cách giữa hai vị trí của thấu kính cho ảnh rõ nét.",
    },
  ],
  10: [
    {
      kind: "text",
      title: "Hoạt động SGK 10: Quan sát vật nhỏ qua kính lúp (Hình 10.4, 10.5, 10.6)",
      body:
        "SGK Bài 10 không có thí nghiệm có bảng số liệu; gồm các hoạt động sau.\n" +
        "• Cách quan sát một vật nhỏ qua kính lúp: đặt vật trong khoảng từ quang tâm O đến tiêu điểm F để nhìn thấy ảnh ảo; đặt kính sát vật rồi từ từ dịch chuyển kính ra xa đến khi quan sát được rõ vật.\n" +
        "• Ngắm chừng ở điểm cực cận (ảnh ở điểm cực cận) và ngắm chừng ở vô cực (vật đặt tại tiêu điểm d = f, ảnh ở xa vô cực – Hình 10.5).\n" +
        "• Số bội giác G = 25/f (f tính bằng cm), được ghi trên khung kính bằng các kí hiệu 2x, 5x, 10x, 20x…\n" +
        "• Vẽ sơ đồ tạo ảnh theo tỉ lệ (Hình 10.6): vật AB cao 2 cm đặt vuông góc với trục chính của thấu kính hội tụ, cách thấu kính khoảng 7,5 cm, tiêu cự f = 5 cm → ảnh thật, ngược chiều với vật, cách thấu kính d' = 15 cm và cao h' = 4 cm.",
    },
  ],
  11: [
    {
      kind: "text",
      title: "Thí nghiệm SGK 11.1: Tìm hiểu tính chất của điện trở (Hình 11.1, Bảng 11.1)",
      body:
        "Chuẩn bị: nguồn điện một chiều 12 V; một bóng đèn 2,5 V; ba vật dẫn là ba điện trở R₁, R₂, R₃; công tắc, các dây nối.\n" +
        "Tiến hành: mắc điện trở R₁ vào mạch điện theo sơ đồ Hình 11.1; đóng công tắc, quan sát độ sáng của bóng đèn và ghi vào vở theo mẫu Bảng 11.1; lần lượt thay điện trở R₁ bằng điện trở R₂ và R₃, trong mỗi trường hợp quan sát độ sáng của bóng đèn và ghi vào vở.\n" +
        "Kết luận: điện trở có tác dụng cản trở dòng điện; các điện trở khác nhau có tác dụng cản trở dòng điện khác nhau.",
    },
    {
      kind: "text",
      title: "Thí nghiệm SGK 11.2: Sự phụ thuộc của cường độ dòng điện vào hiệu điện thế (Bảng 11.2, Hình 11.2)",
      body:
        "Chuẩn bị: nguồn điện một chiều 12 V; một biến trở R_b; một ampe kế và một vôn kế; vật dẫn là một điện trở; công tắc, các dây nối.\n" +
        "Tiến hành: mắc mạch điện theo sơ đồ Hình 11.1 (kèm biến trở, ampe kế, vôn kế); đóng khoá K, điều chỉnh biến trở để hiệu điện thế giữa hai đầu đoạn mạch AB lần lượt là 0 V, 3 V, 6 V, 9 V, 12 V; ghi số chỉ của ampe kế mỗi lần đo vào vở theo mẫu Bảng 11.2.\n" +
        "Số liệu mẫu trong SGK: U = 0 V → I = 0,0 A; U = 3 V → I = 0,5 A; U = 9 V → I = 1,5 A (các ô U = 6 V và U = 12 V để học sinh dự đoán).\n" +
        "Yêu cầu: nhận xét sự thay đổi của cường độ dòng điện khi thay đổi hiệu điện thế giữa hai đầu vật dẫn; rút ra mối quan hệ giữa I và U; dự đoán giá trị I ở các ô còn trống; vẽ đồ thị biểu diễn sự phụ thuộc của I vào U (Hình 11.2) – đồ thị là một đường thẳng đi qua gốc toạ độ.\n" +
        "Từ số liệu: thương số U/I không đổi với mỗi vật dẫn – gọi là điện trở R của vật dẫn (ở đây U/I = 3/0,5 = 6 Ω).",
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
        "Lưu ý: đèn LED chỉ sáng khi dòng điện chạy theo chiều từ cực dương đến cực âm của nó (Hình 14.5).\n" +
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
        "Chuẩn bị: bộ thí nghiệm mô hình máy phát điện xoay chiều gồm cuộn dây dẫn đặt trong từ trường của nam châm; hai đầu cuộn dây nối với hai vành khuyên, hai chổi quét tì lên vành khuyên và nối với hai đèn LED thành mạch kín (Hình 14.8, 14.9).\n" +
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
