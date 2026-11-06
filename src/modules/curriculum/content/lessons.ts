/**
 * NỘI DUNG KIẾN THỨC MẪU CHO 16 BÀI (KHTN 9 – Kết nối tri thức với cuộc sống)
 *
 * Dữ liệu được nạp vào database qua seed `supabase/seed/03_lesson_content.sql`
 * (sinh tự động – npm run seed:generate). Sau khi nạp, giáo viên có thể chỉnh sửa trong database.
 * Quy ước: trọng lượng P = 10.m (lấy g ≈ 10 m/s²) như SGK.
 */

export type ContentBlock = {
  kind: "text" | "formula" | "example";
  title: string;
  body: string;
};

export type LessonContent = {
  lessonNumber: number;
  summary: string;
  objectives: string[];
  requirements: string[];
  knowledge: ContentBlock[];
};

export const LESSON_CONTENT: LessonContent[] = [
  // ------------------------------------------------------------------ CHƯƠNG I
  {
    lessonNumber: 2,
    summary: "Tìm hiểu năng lượng của vật do chuyển động (động năng) và do vị trí so với mặt đất (thế năng trọng trường).",
    objectives: [
      "Nêu được khái niệm động năng và thế năng trọng trường.",
      "Viết được công thức tính động năng, thế năng và đơn vị của các đại lượng.",
      "Vận dụng công thức để tính động năng, thế năng trong một số trường hợp đơn giản.",
    ],
    requirements: [
      "Viết được biểu thức tính động năng của vật: Wđ = ½mv².",
      "Viết được biểu thức tính thế năng của vật ở gần mặt đất: Wt = Ph.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Động năng",
        body:
          "Năng lượng mà vật có được do chuyển động gọi là động năng.\n" +
          "Động năng của vật phụ thuộc vào khối lượng và tốc độ của vật: vật có khối lượng càng lớn, chuyển động càng nhanh thì động năng càng lớn.\n" +
          "Vật đứng yên thì động năng bằng 0.",
      },
      {
        kind: "formula",
        title: "Công thức động năng",
        body: "Wđ = ½·m·v²\n\nTrong đó: Wđ – động năng (J); m – khối lượng của vật (kg); v – tốc độ của vật (m/s).",
      },
      {
        kind: "text",
        title: "2. Thế năng trọng trường",
        body:
          "Năng lượng mà vật có được do ở một độ cao nào đó so với mặt đất (hoặc so với một vị trí được chọn làm mốc) gọi là thế năng trọng trường.\n" +
          "Vật có trọng lượng càng lớn, ở càng cao thì thế năng trọng trường càng lớn. Vật nằm trên mặt đất (vị trí mốc) có thế năng bằng 0.",
      },
      {
        kind: "formula",
        title: "Công thức thế năng trọng trường",
        body: "Wt = P·h = 10·m·h\n\nTrong đó: Wt – thế năng (J); P – trọng lượng của vật (N), P = 10·m; h – độ cao của vật so với mốc (m).",
      },
      {
        kind: "example",
        title: "Ví dụ",
        body:
          "Một quả bóng khối lượng 0,5 kg bay với tốc độ 4 m/s ở độ cao 2 m so với mặt đất.\n" +
          "• Động năng: Wđ = ½·0,5·4² = 4 J.\n" +
          "• Thế năng: Wt = 10·0,5·2 = 10 J.",
      },
    ],
  },
  {
    lessonNumber: 3,
    summary: "Cơ năng là tổng động năng và thế năng; khi chỉ chịu tác dụng của trọng lực, cơ năng của vật được bảo toàn.",
    objectives: [
      "Nêu được khái niệm cơ năng.",
      "Phân tích được sự chuyển hoá giữa động năng và thế năng của vật trong một số trường hợp đơn giản.",
      "Vận dụng định luật bảo toàn cơ năng để giải bài tập đơn giản.",
    ],
    requirements: [
      "Nêu được cơ năng là tổng động năng và thế năng của vật.",
      "Vận dụng khái niệm cơ năng phân tích được sự chuyển hoá năng lượng trong một số trường hợp đơn giản.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Cơ năng",
        body: "Tổng động năng và thế năng của vật gọi là cơ năng của vật.",
      },
      { kind: "formula", title: "Công thức cơ năng", body: "W = Wđ + Wt\n\nĐơn vị của cơ năng là jun (J)." },
      {
        kind: "text",
        title: "2. Sự chuyển hoá động năng – thế năng",
        body:
          "Khi vật rơi từ trên cao xuống: độ cao giảm → thế năng giảm; tốc độ tăng → động năng tăng. Thế năng đã chuyển hoá thành động năng.\n" +
          "Khi vật được ném lên cao: động năng chuyển hoá dần thành thế năng.\n" +
          "Với con lắc dao động: ở vị trí cao nhất thế năng lớn nhất, động năng bằng 0; ở vị trí thấp nhất động năng lớn nhất, thế năng nhỏ nhất.",
      },
      {
        kind: "text",
        title: "3. Bảo toàn cơ năng",
        body:
          "Khi vật chuyển động chỉ chịu tác dụng của trọng lực (bỏ qua ma sát, lực cản của không khí) thì cơ năng của vật được bảo toàn: động năng và thế năng chuyển hoá qua lại nhưng tổng của chúng không đổi.\n" +
          "Nếu có ma sát hoặc lực cản, một phần cơ năng chuyển hoá thành nhiệt năng nên cơ năng giảm dần.",
      },
      {
        kind: "example",
        title: "Ví dụ",
        body:
          "Thả rơi một vật 2 kg từ độ cao 5 m (bỏ qua lực cản). Chọn mốc thế năng tại mặt đất.\n" +
          "• Cơ năng ban đầu: W = Wt = 10·2·5 = 100 J (Wđ = 0).\n" +
          "• Ngay trước khi chạm đất: Wt = 0 nên Wđ = W = 100 J → ½·2·v² = 100 → v = 10 m/s.",
      },
    ],
  },
  {
    lessonNumber: 4,
    summary: "Công cơ học đo bằng tích của lực và quãng đường dịch chuyển theo hướng của lực; công suất cho biết tốc độ thực hiện công.",
    objectives: [
      "Nêu được khi nào có công cơ học.",
      "Viết được công thức tính công, công suất và đơn vị.",
      "Vận dụng công thức tính công, công suất trong các trường hợp đơn giản.",
    ],
    requirements: [
      "Liệt kê được một số đơn vị thường dùng đo công.",
      "Tính được công và công suất trong một số trường hợp đơn giản.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Công cơ học",
        body:
          "Khi có lực tác dụng vào vật làm vật dịch chuyển theo phương của lực thì lực đó thực hiện công cơ học.\n" +
          "Nếu vật không dịch chuyển, hoặc lực vuông góc với hướng dịch chuyển thì lực không thực hiện công.",
      },
      {
        kind: "formula",
        title: "Công thức tính công",
        body:
          "A = F·s\n\nTrong đó: A – công (J); F – lực tác dụng (N); s – quãng đường vật dịch chuyển theo hướng của lực (m).\n" +
          "1 J = 1 N·m; 1 kJ = 1 000 J. Đơn vị năng lượng thường dùng khác: 1 cal ≈ 4,2 J; 1 kWh = 3 600 000 J.",
      },
      {
        kind: "text",
        title: "2. Công suất",
        body: "Công suất là đại lượng đặc trưng cho tốc độ thực hiện công, được đo bằng công thực hiện trong một đơn vị thời gian.",
      },
      {
        kind: "formula",
        title: "Công thức công suất",
        body: "P = A / t\n\nTrong đó: P – công suất (W); A – công thực hiện (J); t – thời gian thực hiện công (s).\n1 W = 1 J/s; 1 kW = 1 000 W; 1 MW = 1 000 000 W.",
      },
      {
        kind: "example",
        title: "Ví dụ",
        body:
          "Một cần cẩu nâng thùng hàng 200 kg lên cao 15 m trong 20 s.\n" +
          "• Lực nâng bằng trọng lượng: F = P = 10·200 = 2 000 N.\n" +
          "• Công: A = F·s = 2 000·15 = 30 000 J.\n" +
          "• Công suất: P = A/t = 30 000/20 = 1 500 W.",
      },
    ],
  },
  // ------------------------------------------------------------------ CHƯƠNG II
  {
    lessonNumber: 5,
    summary: "Ánh sáng bị gãy khúc khi truyền qua mặt phân cách giữa hai môi trường trong suốt khác nhau – hiện tượng khúc xạ.",
    objectives: [
      "Nêu được hiện tượng khúc xạ ánh sáng.",
      "Nêu được chiết suất của môi trường và định luật khúc xạ ánh sáng.",
      "Vận dụng định luật khúc xạ để giải thích một số hiện tượng và giải bài tập đơn giản.",
    ],
    requirements: [
      "Thực hiện thí nghiệm chứng tỏ được ánh sáng bị khúc xạ khi truyền qua mặt phân cách giữa hai môi trường.",
      "Phát biểu được định luật khúc xạ ánh sáng; nêu được chiết suất có giá trị bằng tỉ số tốc độ ánh sáng trong không khí (hoặc chân không) với tốc độ ánh sáng trong môi trường.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Hiện tượng khúc xạ ánh sáng",
        body:
          "Khúc xạ ánh sáng là hiện tượng tia sáng bị gãy khúc tại mặt phân cách khi truyền xiên góc từ môi trường trong suốt này sang môi trường trong suốt khác.\n" +
          "Các khái niệm: tia tới SI, điểm tới I, pháp tuyến NN' tại điểm tới, tia khúc xạ IR, góc tới i (giữa tia tới và pháp tuyến), góc khúc xạ r (giữa tia khúc xạ và pháp tuyến).\n" +
          "Tia sáng chiếu vuông góc với mặt phân cách (i = 0) thì truyền thẳng, không bị gãy khúc.\n" +
          "Thí nghiệm mở đầu: đặt đồng xu ở đáy cốc, đặt mắt sao cho vừa không nhìn thấy đồng xu; đổ nước vào cốc thì lại nhìn thấy đồng xu – do ánh sáng từ đồng xu bị khúc xạ khi ra khỏi mặt nước.",
      },
      {
        kind: "formula",
        title: "Chiết suất của môi trường",
        body:
          "Chiết suất tuyệt đối: n = c / v\nChiết suất tỉ đối của môi trường 2 đối với môi trường 1: n₂₁ = n₂ / n₁\n\nTrong đó: c ≈ 3·10⁸ m/s – tốc độ ánh sáng trong chân không; v – tốc độ ánh sáng trong môi trường.\n" +
          "Chiết suất một số môi trường: không khí ≈ 1,00; nước ≈ 1,33; thuỷ tinh ≈ 1,5; kim cương ≈ 2,42.",
      },
      {
        kind: "formula",
        title: "Định luật khúc xạ ánh sáng",
        body:
          "• Tia khúc xạ nằm trong mặt phẳng tới và ở phía bên kia pháp tuyến so với tia tới.\n" +
          "• Với hai môi trường trong suốt nhất định, tỉ số giữa sin góc tới và sin góc khúc xạ là một hằng số:\n" +
          "  sin i / sin r = n₂ / n₁   (hay n₁·sin i = n₂·sin r)\n\n" +
          "Ánh sáng đi từ môi trường chiết suất nhỏ sang môi trường chiết suất lớn (ví dụ không khí → nước) thì r < i: tia khúc xạ lệch lại gần pháp tuyến.",
      },
      {
        kind: "example",
        title: "Ví dụ",
        body:
          "Chiếu tia sáng từ không khí (n₁ = 1) vào nước (n₂ = 1,33) với góc tới 45°.\n" +
          "sin r = n₁·sin i / n₂ = 1·sin 45° / 1,33 ≈ 0,707 / 1,33 ≈ 0,532 → r ≈ 32°.",
      },
    ],
  },
  {
    lessonNumber: 6,
    summary: "Khi ánh sáng đi từ môi trường chiết quang hơn sang môi trường chiết quang kém và góc tới đủ lớn, toàn bộ ánh sáng bị phản xạ trở lại.",
    objectives: [
      "Nêu được hiện tượng phản xạ toàn phần và điều kiện xảy ra.",
      "Tính được góc tới hạn (góc giới hạn phản xạ toàn phần).",
      "Nêu được một số ứng dụng của phản xạ toàn phần (sợi quang).",
    ],
    requirements: [
      "Thực hiện thí nghiệm để rút ra được điều kiện để có phản xạ toàn phần và xác định được góc tới hạn.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Hiện tượng phản xạ toàn phần",
        body:
          "Phản xạ toàn phần là hiện tượng toàn bộ tia sáng bị phản xạ trở lại môi trường cũ khi gặp mặt phân cách giữa hai môi trường trong suốt, không có tia khúc xạ.",
      },
      {
        kind: "text",
        title: "2. Điều kiện xảy ra phản xạ toàn phần",
        body:
          "• Ánh sáng truyền từ môi trường có chiết suất lớn sang môi trường có chiết suất nhỏ hơn (n₁ > n₂).\n" +
          "• Góc tới lớn hơn hoặc bằng góc tới hạn: i ≥ i_th.",
      },
      {
        kind: "formula",
        title: "Góc tới hạn",
        body:
          "sin i_th = n₂ / n₁   (n₁ > n₂)\n\n" +
          "Ví dụ: từ nước (n = 1,33) ra không khí: sin i_th = 1/1,33 ≈ 0,75 → i_th ≈ 48,8°.\n" +
          "Từ thuỷ tinh (n = 1,5) ra không khí: sin i_th = 1/1,5 ≈ 0,667 → i_th ≈ 41,8°.",
      },
      {
        kind: "text",
        title: "3. Ứng dụng: sợi quang (cáp quang)",
        body:
          "Sợi quang gồm lõi có chiết suất lớn và vỏ có chiết suất nhỏ hơn. Ánh sáng đi vào lõi bị phản xạ toàn phần liên tiếp tại mặt tiếp giáp lõi – vỏ nên truyền đi rất xa mà ít bị mất mát.\n" +
          "Ứng dụng: truyền tín hiệu Internet, điện thoại; nội soi trong y học.",
      },
    ],
  },
  {
    lessonNumber: 7,
    summary: "Lăng kính làm lệch tia sáng về phía đáy và phân tích ánh sáng trắng thành dải màu biến thiên liên tục từ đỏ đến tím.",
    objectives: [
      "Mô tả được đường truyền của tia sáng đơn sắc qua lăng kính.",
      "Nêu được hiện tượng tán sắc ánh sáng trắng qua lăng kính.",
      "Giải thích được một cách định tính màu sắc của các vật.",
    ],
    requirements: [
      "Thực hiện thí nghiệm với lăng kính tạo được quang phổ của ánh sáng trắng qua lăng kính.",
      "Vẽ được sơ đồ đường truyền của tia sáng qua lăng kính.",
      "Nêu được khái niệm về ánh sáng màu; giải thích được một cách định tính sự tán sắc ánh sáng Mặt Trời qua lăng kính.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Lăng kính",
        body:
          "Lăng kính là một khối chất trong suốt, đồng chất (thuỷ tinh, nhựa…) thường có dạng lăng trụ tam giác.\n" +
          "Đặc trưng quang học của lăng kính: góc chiết quang A và chiết suất n của chất làm lăng kính.\n" +
          "Hai mặt bên mà ánh sáng đi qua; góc hợp bởi hai mặt bên gọi là góc chiết quang A; mặt còn lại là đáy.",
      },
      {
        kind: "text",
        title: "2. Đường truyền của tia sáng đơn sắc qua lăng kính",
        body:
          "Tia sáng bị khúc xạ hai lần: khi đi vào mặt bên thứ nhất và khi ló ra ở mặt bên thứ hai.\n" +
          "Kết quả: tia ló bị lệch về phía đáy lăng kính so với tia tới. Góc hợp bởi tia tới và tia ló gọi là góc lệch D.",
      },
      {
        kind: "text",
        title: "3. Tán sắc ánh sáng",
        body:
          "Chiếu chùm ánh sáng trắng qua lăng kính, ta thu được dải màu biến thiên liên tục: đỏ, da cam, vàng, lục, lam, chàm, tím (quang phổ).\n" +
          "Nguyên nhân: chiết suất của lăng kính đối với các ánh sáng màu khác nhau là khác nhau – nhỏ nhất với ánh sáng đỏ, lớn nhất với ánh sáng tím. Vì vậy tia tím bị lệch nhiều nhất, tia đỏ lệch ít nhất.\n" +
          "Ánh sáng trắng là hỗn hợp của nhiều ánh sáng màu. Cầu vồng được tạo thành do ánh sáng Mặt Trời bị tán sắc qua các giọt nước.\n" +
          "Ánh sáng đơn sắc là ánh sáng có một màu nhất định và không bị tán sắc khi đi qua lăng kính (thí nghiệm: chiếu ánh sáng qua kính lọc sắc đỏ hoặc tím rồi qua lăng kính – chùm sáng chỉ bị lệch, không tách màu; tia tím lệch nhiều hơn tia đỏ).",
      },
      {
        kind: "text",
        title: "4. Màu sắc của vật",
        body:
          "Vật có màu nào thì tán xạ (hắt lại) mạnh ánh sáng màu đó và hấp thụ các ánh sáng màu khác.\n" +
          "Vật màu trắng tán xạ tốt mọi ánh sáng màu; vật màu đen hấp thụ tất cả các ánh sáng màu, không có ánh sáng phản xạ – ta nhận ra vật màu đen vì nó được đặt bên cạnh những vật có màu khác.\n" +
          "Ví dụ: lá cây dưới ánh sáng trắng có màu xanh lục vì lá tán xạ mạnh ánh sáng lục.",
      },
    ],
  },
  {
    lessonNumber: 8,
    summary: "Thấu kính hội tụ và thấu kính phân kì: các khái niệm, đường truyền của tia sáng đặc biệt và cách dựng ảnh.",
    objectives: [
      "Nhận biết được thấu kính hội tụ, thấu kính phân kì.",
      "Nêu được các khái niệm: trục chính, quang tâm, tiêu điểm, tiêu cự.",
      "Vẽ được đường truyền của các tia sáng đặc biệt và dựng được ảnh của vật qua thấu kính.",
    ],
    requirements: [
      "Thực hiện thí nghiệm để rút ra được: thấu kính hội tụ làm hội tụ chùm sáng song song, thấu kính phân kì làm phân kì chùm sáng song song.",
      "Vẽ được ảnh qua thấu kính; nêu được đặc điểm ảnh tạo bởi thấu kính.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Thấu kính hội tụ và thấu kính phân kì",
        body:
          "Thấu kính là khối chất trong suốt giới hạn bởi hai mặt cong hoặc một mặt cong và một mặt phẳng.\n" +
          "• Thấu kính hội tụ: phần rìa mỏng hơn phần giữa; chùm tia tới song song với trục chính cho chùm tia ló hội tụ tại một điểm.\n" +
          "• Thấu kính phân kì: phần rìa dày hơn phần giữa; chùm tia tới song song cho chùm tia ló loe rộng ra (phân kì).",
      },
      {
        kind: "text",
        title: "2. Các khái niệm",
        body:
          "• Trục chính: đường thẳng vuông góc với mặt thấu kính, đi qua quang tâm.\n" +
          "• Quang tâm O: điểm chính giữa thấu kính; tia sáng qua O truyền thẳng.\n" +
          "• Tiêu điểm F, F': nằm trên trục chính, cách đều hai bên quang tâm.\n" +
          "• Tiêu cự f = OF = OF'.",
      },
      {
        kind: "text",
        title: "3. Ba tia sáng đặc biệt (thấu kính hội tụ)",
        body:
          "• Tia tới qua quang tâm O → tia ló truyền thẳng.\n" +
          "• Tia tới song song với trục chính → tia ló đi qua tiêu điểm F'.\n" +
          "• Tia tới đi qua tiêu điểm F → tia ló song song với trục chính.\n" +
          "Với thấu kính phân kì: tia tới song song với trục chính cho tia ló có đường kéo dài đi qua tiêu điểm F.",
      },
      {
        kind: "text",
        title: "4. Đặc điểm ảnh",
        body:
          "Thấu kính hội tụ:\n" +
          "• Vật đặt ngoài khoảng tiêu cự (d > f): ảnh thật, ngược chiều với vật (d > 2f: ảnh nhỏ hơn vật; d = 2f: ảnh bằng vật; f < d < 2f: ảnh lớn hơn vật).\n" +
          "• Vật đặt trong khoảng tiêu cự (d < f): ảnh ảo, cùng chiều, lớn hơn vật.\n" +
          "• Vật đặt tại tiêu điểm: không cho ảnh (tia ló song song).\n" +
          "Thấu kính phân kì: vật đặt ở mọi vị trí luôn cho ảnh ảo, cùng chiều, nhỏ hơn vật và nằm trong khoảng tiêu cự.",
      },
      {
        kind: "formula",
        title: "Công thức liên hệ (rút ra từ tam giác đồng dạng)",
        body:
          "Thấu kính hội tụ, ảnh thật:  1/f = 1/d + 1/d'      h'/h = d'/d\n\n" +
          "Trong đó: d – khoảng cách từ vật đến thấu kính; d' – khoảng cách từ ảnh đến thấu kính; h, h' – chiều cao vật, ảnh.",
      },
    ],
  },
  {
    lessonNumber: 9,
    summary: "Đo tiêu cự của thấu kính hội tụ bằng phương pháp đối xứng (phương pháp Silbermann): tạo ảnh thật cao bằng vật (d = d' = 2f).",
    objectives: [
      "Đo được tiêu cự của thấu kính hội tụ bằng dụng cụ thực hành.",
      "Xử lí số liệu, tính giá trị trung bình và nhận xét kết quả đo.",
    ],
    requirements: ["Đo được tiêu cự của thấu kính hội tụ bằng dụng cụ thực hành."],
    knowledge: [
      {
        kind: "text",
        title: "1. Dụng cụ",
        body:
          "Thấu kính hội tụ cần đo tiêu cự; vật sáng (chữ F trên tấm chắn được chiếu sáng); màn ảnh; giá quang học có thước đo; nguồn sáng.",
      },
      {
        kind: "text",
        title: "2. Cơ sở lí thuyết",
        body:
          "Khi vật sáng đặt cách thấu kính hội tụ một khoảng d = 2f thì ảnh thật cách thấu kính d' = 2f và có độ cao bằng vật (h' = h).\n" +
          "Khi đó khoảng cách giữa vật và màn ảnh là L = d + d' = 4f.",
      },
      { kind: "formula", title: "Công thức tính tiêu cự", body: "f = (d + d') / 4 = L / 4" },
      {
        kind: "text",
        title: "3. Các bước tiến hành",
        body:
          "Phương pháp đối xứng (Silbermann):\n" +
          "Bước 1: Đo chiều cao h của vật hình chữ F.\n" +
          "Bước 2: Đặt vật và màn sát thấu kính, dịch đồng thời vật và màn ra xa dần thấu kính những khoảng bằng nhau cho đến khi quan sát được ảnh rõ nét trên màn; ghi lại d và d'.\n" +
          "Bước 3: Đo chiều cao h' của ảnh (kiểm tra h' = h). Tính f = (d + d')/4.\n" +
          "Bước 4: Lặp lại phép đo 3 lần, tính giá trị trung bình của tiêu cự.",
      },
      {
        kind: "example",
        title: "Ví dụ xử lí số liệu",
        body: "Ba lần đo khoảng cách vật – màn: L₁ = 60,4 cm; L₂ = 59,8 cm; L₃ = 60,2 cm.\nf₁ = 15,10 cm; f₂ = 14,95 cm; f₃ = 15,05 cm → f trung bình ≈ 15,03 cm.",
      },
    ],
  },
  {
    lessonNumber: 10,
    summary: "Kính lúp là thấu kính hội tụ có tiêu cự ngắn giúp quan sát vật nhỏ; vận dụng tam giác đồng dạng giải bài tập thấu kính.",
    objectives: [
      "Nêu được cấu tạo, công dụng của kính lúp và số bội giác.",
      "Sử dụng kính lúp đúng cách để quan sát vật nhỏ.",
      "Giải được bài tập xác định vị trí, độ lớn ảnh qua thấu kính bằng hình học.",
    ],
    requirements: [
      "Nêu được công dụng và cách sử dụng kính lúp; nêu được số bội giác của kính lúp.",
      "Giải được bài tập về thấu kính bằng cách vẽ ảnh và sử dụng hình học (tam giác đồng dạng).",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Kính lúp",
        body:
          "Cấu tạo: kính lúp là thấu kính hội tụ có tiêu cự ngắn (f < 25 cm).\n" +
          "Công dụng: dùng để quan sát các vật nhỏ – kính lúp làm tăng góc trông vật.\n" +
          "Cách quan sát: đặt vật trong khoảng tiêu cự của kính lúp (d < f) để thu được ảnh ảo, cùng chiều, lớn hơn vật và ảnh nằm trong khoảng nhìn rõ của mắt.",
      },
      {
        kind: "formula",
        title: "Số bội giác",
        body:
          "G = 25 / f   (f tính bằng cm)\n\n" +
          "Số bội giác là tỉ số giữa góc trông ảnh qua kính và góc trông vật (khi đặt vật ở điểm nhìn rõ gần mắt nhất, cách mắt khoảng 25 cm).\n" +
          "Số bội giác được ghi trên vành kính, ví dụ 2x, 3x, 5x. Kính có số bội giác càng lớn thì tiêu cự càng ngắn và cho ảnh quan sát càng lớn.",
      },
      {
        kind: "text",
        title: "2. Phương pháp giải bài tập thấu kính",
        body:
          "Cách vẽ sơ đồ tạo ảnh theo tỉ lệ:\n" +
          "Bước 1: Chọn tỉ lệ xích thích hợp.\n" +
          "Bước 2: Biểu diễn tiêu cự f, khoảng cách d, d' và độ cao h, h' theo cùng tỉ lệ xích.\n" +
          "Bước 3: Vẽ ảnh bằng hai trong ba tia sáng đặc biệt; đo trên hình rồi đổi ra giá trị thật.\n" +
          "Có thể tính bằng hình học: xác định các cặp tam giác đồng dạng, lập tỉ số các cạnh tương ứng để tìm d' và h'.",
      },
      {
        kind: "example",
        title: "Ví dụ",
        body:
          "Vật AB cao 2 cm đặt vuông góc trục chính của thấu kính hội tụ tiêu cự f = 10 cm, cách thấu kính d = 30 cm.\n" +
          "Từ tam giác đồng dạng: 1/f = 1/d + 1/d' → 1/d' = 1/10 − 1/30 = 2/30 → d' = 15 cm.\n" +
          "h' = h·d'/d = 2·15/30 = 1 cm. Ảnh thật, ngược chiều, nhỏ hơn vật.",
      },
    ],
  },
  // ------------------------------------------------------------------ CHƯƠNG III
  {
    lessonNumber: 11,
    summary: "Điện trở đặc trưng cho mức độ cản trở dòng điện; định luật Ohm liên hệ cường độ dòng điện, hiệu điện thế và điện trở.",
    objectives: [
      "Nêu được khái niệm điện trở và đơn vị đo.",
      "Phát biểu và viết được hệ thức của định luật Ohm.",
      "Vận dụng công thức R = ρl/S và định luật Ohm để giải bài tập.",
    ],
    requirements: [
      "Thực hiện thí nghiệm để xây dựng được định luật Ohm: cường độ dòng điện đi qua một đoạn dây dẫn tỉ lệ thuận với hiệu điện thế giữa hai đầu đoạn dây.",
      "Nêu được điện trở có tác dụng cản trở dòng điện trong mạch; sử dụng công thức R = U/I.",
      "Thực hiện thí nghiệm để nêu được điện trở có tác dụng cản trở dòng điện; nêu được công thức tính điện trở của dây dẫn R = ρl/S.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Điện trở",
        body:
          "Điện trở của dây dẫn biểu thị mức độ cản trở dòng điện nhiều hay ít của dây dẫn.\n" +
          "Đơn vị: ôm (Ω); 1 kΩ = 1 000 Ω; 1 MΩ = 1 000 000 Ω.",
      },
      {
        kind: "formula",
        title: "Định luật Ohm",
        body:
          "I = U / R\n\nCường độ dòng điện chạy qua dây dẫn tỉ lệ thuận với hiệu điện thế đặt vào hai đầu dây và tỉ lệ nghịch với điện trở của dây.\n" +
          "Trong đó: I – cường độ dòng điện (A); U – hiệu điện thế (V); R – điện trở (Ω).",
      },
      {
        kind: "text",
        title: "2. Đồ thị I – U",
        body:
          "Với một dây dẫn có điện trở không đổi, đồ thị biểu diễn sự phụ thuộc của I vào U là đường thẳng đi qua gốc toạ độ.\n" +
          "Đường thẳng càng dốc thì điện trở càng nhỏ.",
      },
      {
        kind: "formula",
        title: "Điện trở của dây dẫn",
        body:
          "R = ρ · l / S\n\nTrong đó: ρ – điện trở suất của vật liệu (Ω·m); l – chiều dài dây (m); S – tiết diện dây (m²).\n" +
          "Điện trở dây tỉ lệ thuận với chiều dài, tỉ lệ nghịch với tiết diện và phụ thuộc vật liệu làm dây. Ví dụ ρ đồng ≈ 1,7·10⁻⁸ Ω·m, ρ nichrome ≈ 1,1·10⁻⁶ Ω·m.",
      },
      {
        kind: "example",
        title: "Ví dụ",
        body: "Đặt hiệu điện thế 12 V vào hai đầu điện trở 24 Ω. Cường độ dòng điện: I = U/R = 12/24 = 0,5 A.",
      },
    ],
  },
  {
    lessonNumber: 12,
    summary: "Đặc điểm cường độ dòng điện, hiệu điện thế và điện trở tương đương trong đoạn mạch nối tiếp và song song.",
    objectives: [
      "Nêu được đặc điểm của đoạn mạch nối tiếp, đoạn mạch song song.",
      "Tính được điện trở tương đương của đoạn mạch gồm hai điện trở.",
      "Vận dụng giải bài tập về đoạn mạch nối tiếp, song song.",
    ],
    requirements: [
      "Thực hiện thí nghiệm để rút ra được: Trong đoạn mạch điện mắc nối tiếp, cường độ dòng điện là như nhau cho mọi điểm; trong đoạn mạch song song, tổng cường độ dòng điện trong các nhánh bằng cường độ dòng điện chạy trong mạch chính.",
      "Tính được điện trở tương đương của đoạn mạch một chiều nối tiếp, song song trong một số trường hợp đơn giản.",
    ],
    knowledge: [
      {
        kind: "formula",
        title: "1. Đoạn mạch nối tiếp (R₁ nt R₂)",
        body:
          "I = I₁ = I₂\nU = U₁ + U₂\nR_tđ = R₁ + R₂\nU₁ / U₂ = R₁ / R₂\n\n" +
          "Điện trở tương đương của đoạn mạch nối tiếp lớn hơn mỗi điện trở thành phần.",
      },
      {
        kind: "formula",
        title: "2. Đoạn mạch song song (R₁ // R₂)",
        body:
          "U = U₁ = U₂\nI = I₁ + I₂\n1/R_tđ = 1/R₁ + 1/R₂   →   R_tđ = R₁·R₂ / (R₁ + R₂)\nI₁ / I₂ = R₂ / R₁\n\n" +
          "Điện trở tương đương của đoạn mạch song song nhỏ hơn mỗi điện trở thành phần.",
      },
      {
        kind: "text",
        title: "3. Ứng dụng",
        body:
          "Các thiết bị điện trong gia đình được mắc song song để cùng hoạt động ở hiệu điện thế định mức 220 V và có thể bật/tắt độc lập.\n" +
          "Cầu chì, công tắc được mắc nối tiếp với thiết bị cần điều khiển, bảo vệ.",
      },
      {
        kind: "example",
        title: "Ví dụ",
        body:
          "R₁ = 6 Ω, R₂ = 3 Ω, U = 12 V.\n" +
          "• Nối tiếp: R_tđ = 9 Ω; I = 12/9 ≈ 1,33 A; U₁ = 8 V; U₂ = 4 V.\n" +
          "• Song song: R_tđ = 6·3/(6+3) = 2 Ω; I = 6 A; I₁ = 2 A; I₂ = 4 A.",
      },
    ],
  },
  {
    lessonNumber: 13,
    summary: "Dòng điện mang năng lượng; công suất điện cho biết năng lượng điện tiêu thụ trong một đơn vị thời gian.",
    objectives: [
      "Nêu được dòng điện có năng lượng và năng lượng điện chuyển hoá thành các dạng năng lượng khác.",
      "Viết được công thức tính năng lượng điện và công suất điện.",
      "Tính được điện năng tiêu thụ và tiền điện; đề xuất biện pháp tiết kiệm điện.",
    ],
    requirements: [
      "Lấy ví dụ để chứng tỏ được dòng điện có năng lượng.",
      "Nêu được công suất điện định mức của dụng cụ điện (công suất mà dụng cụ tiêu thụ khi hoạt động bình thường).",
      "Tính được năng lượng của dòng điện và công suất điện trong trường hợp đơn giản.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Năng lượng của dòng điện",
        body:
          "Dòng điện có năng lượng vì nó có thể thực hiện công và cung cấp nhiệt lượng.\n" +
          "Ví dụ: quạt điện (điện năng → cơ năng), bàn là (→ nhiệt năng), đèn LED (→ quang năng), sạc pin (→ hoá năng).",
      },
      {
        kind: "formula",
        title: "Năng lượng điện",
        body:
          "W = U · I · t = P · t\n\nTrong đó: W – năng lượng điện (J); U – hiệu điện thế (V); I – cường độ dòng điện (A); t – thời gian (s).\n" +
          "Đơn vị thực tế: kilôoát giờ (kWh); 1 kWh = 3,6·10⁶ J. Mỗi \"số điện\" trên công tơ là 1 kWh.",
      },
      {
        kind: "formula",
        title: "Công suất điện",
        body:
          "P = U · I\n\nVới đoạn mạch chỉ có điện trở: P = I²·R = U²/R.\n" +
          "Số oát ghi trên dụng cụ điện là công suất định mức – công suất khi dụng cụ hoạt động ở hiệu điện thế định mức.",
      },
      {
        kind: "example",
        title: "Ví dụ",
        body:
          "Một bóng đèn 220 V – 40 W thắp sáng 5 giờ mỗi ngày trong 30 ngày.\n" +
          "W = P·t = 0,04 kW · (5·30) h = 6 kWh.\n" +
          "Cường độ dòng điện qua đèn khi sáng bình thường: I = P/U = 40/220 ≈ 0,18 A.",
      },
    ],
  },
  // ------------------------------------------------------------------ CHƯƠNG IV
  {
    lessonNumber: 14,
    summary: "Dòng điện cảm ứng xuất hiện khi số đường sức từ qua cuộn dây kín biến thiên – cơ sở tạo ra dòng điện xoay chiều.",
    objectives: [
      "Mô tả được thí nghiệm tạo ra dòng điện cảm ứng.",
      "Nêu được điều kiện xuất hiện dòng điện cảm ứng.",
      "Nêu được nguyên tắc tạo ra dòng điện xoay chiều và cấu tạo, hoạt động của máy phát điện xoay chiều.",
    ],
    requirements: [
      "Thực hiện thí nghiệm để nêu được các cách tạo ra dòng điện cảm ứng.",
      "Thực hiện thí nghiệm để nêu được nguyên tắc tạo ra dòng điện xoay chiều (dòng điện luân phiên đổi chiều).",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Hiện tượng cảm ứng điện từ",
        body:
          "Đưa một cực của nam châm lại gần hoặc ra xa cuộn dây dẫn kín (có mắc điện kế) thì kim điện kế lệch: trong cuộn dây xuất hiện dòng điện. Dòng điện này gọi là dòng điện cảm ứng; hiện tượng gọi là cảm ứng điện từ.\n" +
          "Khi nam châm đứng yên so với cuộn dây thì không có dòng điện cảm ứng.",
      },
      {
        kind: "text",
        title: "2. Điều kiện xuất hiện dòng điện cảm ứng",
        body:
          "Trong cuộn dây dẫn kín xuất hiện dòng điện cảm ứng khi số đường sức từ xuyên qua tiết diện S của cuộn dây biến thiên (tăng hoặc giảm).\n" +
          "Khi số đường sức từ tăng và khi giảm, dòng điện cảm ứng có chiều ngược nhau.",
      },
      {
        kind: "text",
        title: "3. Dòng điện xoay chiều",
        body:
          "Dòng điện xoay chiều là dòng điện luân phiên đổi chiều.\n" +
          "Cách tạo ra: cho cuộn dây dẫn kín quay trong từ trường của nam châm, hoặc cho nam châm quay trước cuộn dây. Khi đó số đường sức từ qua cuộn dây luân phiên tăng, giảm nên dòng điện cảm ứng luân phiên đổi chiều.",
      },
      {
        kind: "text",
        title: "4. Máy phát điện xoay chiều",
        body:
          "Gồm hai bộ phận chính: nam châm và cuộn dây. Bộ phận đứng yên gọi là stato, bộ phận quay gọi là rôto.\n" +
          "Máy phát điện xoay chiều biến đổi cơ năng thành điện năng. Lưới điện ở Việt Nam có tần số 50 Hz (dòng điện đổi chiều 100 lần mỗi giây).",
      },
    ],
  },
  {
    lessonNumber: 15,
    summary: "Dòng điện xoay chiều có các tác dụng nhiệt, phát sáng, từ và sinh lí; đo bằng ampe kế, vôn kế xoay chiều.",
    objectives: [
      "Nêu được các tác dụng của dòng điện xoay chiều và lấy ví dụ.",
      "Nhận biết ampe kế, vôn kế xoay chiều và cách sử dụng.",
      "Có ý thức an toàn khi sử dụng điện.",
    ],
    requirements: ["Lấy ví dụ để chứng tỏ dòng điện xoay chiều có tác dụng: nhiệt, phát sáng, tác dụng từ, tác dụng sinh lí."],
    knowledge: [
      {
        kind: "text",
        title: "1. Các tác dụng của dòng điện xoay chiều",
        body:
          "• Tác dụng nhiệt: bàn là, nồi cơm điện, ấm siêu tốc nóng lên khi có dòng điện chạy qua.\n" +
          "• Tác dụng phát sáng (quang): bóng đèn sợi đốt, đèn LED, đèn huỳnh quang phát sáng.\n" +
          "• Tác dụng từ: nam châm điện dùng dòng xoay chiều hút được sắt; lực từ đổi chiều khi dòng điện đổi chiều (kim nam châm đặt gần dây dẫn sẽ dao động, rung, không quay hẳn về một phía).\n" +
          "• Tác dụng sinh lí: dòng điện xoay chiều qua cơ thể người gây co giật cơ, có thể gây nguy hiểm đến tính mạng.",
      },
      {
        kind: "text",
        title: "2. Đo cường độ dòng điện và hiệu điện thế xoay chiều",
        body:
          "Dùng ampe kế và vôn kế xoay chiều (có kí hiệu AC hoặc dấu ~). Giá trị đo được là giá trị hiệu dụng; khi mắc vào mạch không cần phân biệt chốt (+) và (−).\n" +
          "Hiệu điện thế hiệu dụng của mạng điện gia đình ở Việt Nam là 220 V.",
      },
      {
        kind: "text",
        title: "3. An toàn điện",
        body:
          "Không chạm vào dây điện trần, ổ cắm khi tay ướt; dùng thiết bị có vỏ cách điện, nối đất; lắp cầu dao chống giật (aptomat chống dòng rò).",
      },
    ],
  },
  // ------------------------------------------------------------------ CHƯƠNG V
  {
    lessonNumber: 16,
    summary: "Năng lượng trên Trái Đất chủ yếu có nguồn gốc từ Mặt Trời; năng lượng hoá thạch có hạn và gây ô nhiễm môi trường.",
    objectives: [
      "Mô tả sơ lược vòng năng lượng trên Trái Đất.",
      "Nêu được nguồn gốc, ưu điểm, nhược điểm của năng lượng hoá thạch.",
      "Đề xuất biện pháp sử dụng năng lượng tiết kiệm, hiệu quả.",
    ],
    requirements: [
      "Dựa vào sơ đồ (hoặc hình ảnh) mô tả được sơ lược vòng năng lượng trên Trái Đất.",
      "Nêu được sơ lược về nhiên liệu hoá thạch; lấy ví dụ chứng tỏ việc khai thác, sử dụng nhiên liệu hoá thạch có thể gây ô nhiễm môi trường.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Vòng năng lượng trên Trái Đất",
        body:
          "Mặt Trời là nguồn năng lượng chủ yếu của Trái Đất. Năng lượng Mặt Trời:\n" +
          "• làm nóng mặt đất, nước bay hơi tạo thành mây, mưa → năng lượng của dòng nước (thuỷ năng);\n" +
          "• làm không khí nóng không đều → gió (phong năng);\n" +
          "• được thực vật hấp thụ qua quang hợp → năng lượng hoá học trong sinh vật; xác sinh vật bị chôn vùi hàng triệu năm → nhiên liệu hoá thạch.\n" +
          "Năng lượng luôn được chuyển hoá từ dạng này sang dạng khác và cuối cùng phần lớn trở thành nhiệt toả ra môi trường.",
      },
      {
        kind: "text",
        title: "2. Năng lượng hoá thạch",
        body:
          "Nhiên liệu hoá thạch gồm than đá, dầu mỏ, khí tự nhiên – hình thành từ xác sinh vật qua hàng triệu năm.\n" +
          "Ưu điểm: dễ khai thác, sử dụng; năng suất toả nhiệt cao; công nghệ phổ biến.\n" +
          "Nhược điểm: không tái tạo được, đang cạn kiệt; khi đốt cháy sinh ra CO₂ (khí nhà kính), SO₂, bụi mịn… gây ô nhiễm môi trường, biến đổi khí hậu, mưa axit.",
      },
      {
        kind: "formula",
        title: "Nhiệt lượng toả ra khi đốt nhiên liệu",
        body:
          "Q = q · m\n\nTrong đó: Q – nhiệt lượng toả ra (J); q – năng suất toả nhiệt của nhiên liệu (J/kg); m – khối lượng nhiên liệu bị đốt cháy hoàn toàn (kg).\n" +
          "Năng suất toả nhiệt (giá trị tham khảo): than đá ≈ 27·10⁶ J/kg; dầu hoả ≈ 44·10⁶ J/kg; khí đốt ≈ 44·10⁶ J/kg.",
      },
      {
        kind: "text",
        title: "3. Sử dụng năng lượng tiết kiệm",
        body: "Tắt thiết bị khi không dùng; dùng đèn LED, thiết bị có nhãn năng lượng; đi xe đạp, phương tiện công cộng; tăng cường sử dụng năng lượng tái tạo.",
      },
    ],
  },
  {
    lessonNumber: 17,
    summary: "Năng lượng tái tạo được bổ sung liên tục từ tự nhiên: Mặt Trời, gió, nước, sóng, địa nhiệt, sinh khối.",
    objectives: [
      "Kể tên và nêu được ưu, nhược điểm của một số dạng năng lượng tái tạo.",
      "Giải thích được vai trò của năng lượng tái tạo đối với phát triển bền vững.",
      "Tính được công suất của một số hệ thống năng lượng tái tạo đơn giản.",
    ],
    requirements: [
      "Lấy được ví dụ về một số dạng năng lượng tái tạo và cách khai thác chúng (năng lượng Mặt Trời, gió, sóng biển, thuỷ điện, địa nhiệt…).",
      "Nêu được ưu điểm, nhược điểm của năng lượng tái tạo.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Năng lượng tái tạo",
        body:
          "Năng lượng tái tạo là năng lượng từ những nguồn liên tục được bổ sung trong tự nhiên, gần như không cạn kiệt: năng lượng Mặt Trời, gió, nước (thuỷ điện), sóng biển, thuỷ triều, địa nhiệt, sinh khối.",
      },
      {
        kind: "text",
        title: "2. Một số dạng năng lượng tái tạo",
        body:
          "• Năng lượng Mặt Trời: pin quang điện biến quang năng thành điện năng; bình nước nóng năng lượng Mặt Trời.\n" +
          "• Năng lượng gió: tua-bin gió biến động năng của gió thành điện năng.\n" +
          "• Thuỷ điện: nước từ hồ chứa trên cao chảy xuống làm quay tua-bin (thế năng → động năng → điện năng).\n" +
          "• Sóng biển, thuỷ triều; địa nhiệt (nhiệt trong lòng đất); sinh khối (gỗ, phụ phẩm nông nghiệp, khí sinh học).",
      },
      {
        kind: "text",
        title: "3. Ưu điểm và nhược điểm",
        body:
          "Ưu điểm: nguồn gần như vô tận; ít phát thải khí nhà kính, ít ô nhiễm; góp phần bảo đảm an ninh năng lượng.\n" +
          "Nhược điểm: phụ thuộc thời tiết, địa hình (không có nắng, gió liên tục); chi phí đầu tư ban đầu cao; cần diện tích lớn; thuỷ điện có thể ảnh hưởng đến hệ sinh thái.",
      },
      {
        kind: "formula",
        title: "Một số công thức tham khảo",
        body:
          "• Pin Mặt Trời: P = H · S · η   (H – cường độ bức xạ, W/m²; S – diện tích tấm pin, m²; η – hiệu suất).\n" +
          "• Thuỷ điện: P = η · 10 · m · h / t   (công của trọng lực khi khối nước m rơi độ cao h trong thời gian t).",
      },
    ],
  },
];
