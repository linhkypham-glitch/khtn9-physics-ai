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
          "Thế năng trọng trường (gọi tắt là thế năng) là năng lượng của một vật khi nó ở một độ cao nhất định so với mặt đất hoặc so với một vật được chọn làm gốc để tính độ cao.\n" +
          "Vật có trọng lượng càng lớn, ở càng cao thì thế năng trọng trường càng lớn. Giá trị của thế năng phụ thuộc vào gốc chọn để tính độ cao (gọi là gốc thế năng); người ta thường chọn mặt đất làm gốc, khi đó vật nằm trên mặt đất có thế năng bằng 0.",
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
      {
        kind: "text",
        title: "Em có biết: các dạng thế năng khác",
        body:
          "Ngoài thế năng trọng trường, trong thực tiễn vật còn có thể dự trữ năng lượng dưới dạng:\n" +
          "• Thế năng đàn hồi: xuất hiện khi một vật bị biến dạng đàn hồi (ví dụ cây cung đang bị kéo căng).\n" +
          "• Thế năng tĩnh điện: khi một điện tích đặt cạnh một điện tích khác, lực tương tác giữa các điện tích tạo ra thế năng của hệ điện tích.",
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
          "Nếu cơ năng của vật không chuyển hoá thành dạng năng lượng khác thì tổng động năng và thế năng của vật luôn không đổi: cơ năng của vật được bảo toàn (ví dụ khi bỏ qua ma sát và lực cản của không khí).\n" +
          "Trong nhiều trường hợp, cơ năng có thể chuyển hoá thành các dạng năng lượng khác (như nhiệt năng do ma sát, lực cản của không khí); khi đó cơ năng không được bảo toàn nhưng năng lượng vẫn được bảo toàn.",
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
          "Khi F = 1 N và s = 1 m thì A = 1 N·m = 1 J. Bội của jun: 1 kJ = 10³ J; 1 MJ = 10⁶ J.\n" +
          "Trong thực tế còn dùng các đơn vị: 1 BTU = 1 055 J; 1 cal = 4,186 J; 1 kcal = 1 000 cal = 4 186 J.\n" +
          "Mở rộng: nếu vật dịch chuyển không theo phương của lực thì A = F·s·cosα (α là góc giữa hướng của lực và hướng dịch chuyển); khi lực vuông góc với hướng dịch chuyển thì công bằng 0.",
      },
      {
        kind: "text",
        title: "2. Công suất",
        body: "Công suất là đại lượng đặc trưng cho tốc độ thực hiện công, được đo bằng công thực hiện trong một đơn vị thời gian.",
      },
      {
        kind: "formula",
        title: "Công thức công suất",
        body: "P = A / t\n\nTrong đó: P – công suất (W); A – công thực hiện (J); t – thời gian thực hiện công (s).\n1 W = 1 J/s; 1 kW = 10³ W; 1 MW = 10⁶ W; 1 GW = 10⁹ W.\nĐơn vị khác: 1 mã lực (HP) = 746 W; 1 BTU/h = 0,293 W.",
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
          "Chiết suất của chân không là 1; của không khí là 1,00029 (rất gần với chân không) nên thường được làm tròn là 1.\n" +
          "Chiết suất một số môi trường (Bảng 5.2): nước đá 1,309; muối ăn (NaCl) 1,544; kim cương 2,419; thuỷ tinh crown 1,464 – 1,532; thuỷ tinh flint 1,603 – 1,865; nước 1,333; ethylic alcohol 1,361; không khí 1,00029; khí carbon dioxide 1,00045.\n" +
          "Nếu n₂₁ > 1 thì r < i: tia khúc xạ bị lệch lại gần pháp tuyến; nếu n₂₁ < 1 thì r > i: tia khúc xạ bị lệch xa pháp tuyến.",
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
          "sin r = n₁·sin i / n₂ = 1·sin 45° / 1,33 ≈ 0,707 / 1,33 ≈ 0,532 → r ≈ 32°.\n\n" +
          "Bài tập SGK: tính chiết suất của nước, biết tia sáng truyền từ không khí với góc tới i = 60° thì góc khúc xạ r = 40°.\n" +
          "n = sin i / sin r = sin 60° / sin 40° ≈ 0,866 / 0,643 ≈ 1,35.",
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
          "Từ thuỷ tinh (n = 1,5) ra không khí: sin i_th = 1/1,5 ≈ 0,667 → i_th ≈ 41,8°.\n\n" +
          "Giải thích: khi ánh sáng đi từ môi trường chiết suất lớn n₁ sang môi trường chiết suất nhỏ n₂ thì r > i. Tăng góc tới i thì góc khúc xạ r cũng tăng; khi r = 90° thì i đạt giá trị i_th. Khi i ≥ i_th không còn tia khúc xạ, toàn bộ tia sáng bị phản xạ ở mặt phân cách.",
      },
      {
        kind: "text",
        title: "3. Ứng dụng: sợi quang (cáp quang)",
        body:
          "Sợi quang gồm lõi có chiết suất lớn và vỏ có chiết suất nhỏ hơn. Ánh sáng đi vào lõi bị phản xạ toàn phần liên tiếp tại mặt tiếp giáp lõi – vỏ nên truyền đi rất xa mà ít bị mất mát.\n" +
          "Ứng dụng: truyền dữ liệu trong công nghệ thông tin; trong y học (SGK).",
      },
      {
        kind: "text",
        title: "4. Giải thích hiện tượng ảo ảnh",
        body:
          "Vào ngày nắng nóng, trên mặt đường nhựa ta có thể thấy như có lớp nước phản xạ ánh sáng (ảo ảnh).\n" +
          "Lớp không khí càng gần mặt đường càng nóng nên chiết suất càng nhỏ. Tia sáng từ ngọn cây đi xuống bị khúc xạ liên tiếp qua các lớp không khí; khi góc tới ở lớp dưới đạt giá trị lớn hơn góc tới hạn thì tia sáng bị phản xạ toàn phần và hắt lên, đến mắt ta như phát ra từ phía dưới mặt đường – ta có cảm giác như có lớp nước phản xạ ánh sáng.",
      },
      {
        kind: "example",
        title: "Bài tập SGK",
        body:
          "Chiếu một tia sáng từ nước (n₁ = 4/3) tới mặt phân cách với không khí (n₂ = 1).\n" +
          "a) Góc tới 30°: sin r = (4/3)·sin 30° = 2/3 → r ≈ 41,8°.\n" +
          "b) Góc tới 60°: sin r = (4/3)·sin 60° ≈ 1,155 > 1 → không có tia khúc xạ, xảy ra phản xạ toàn phần.",
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
          "Màu sắc của một vật mà ta nhìn thấy phụ thuộc vào màu sắc của ánh sáng bị vật đó hấp thụ và phản xạ.\n" +
          "Dưới ánh sáng trắng, vật có màu là do nó phản xạ ánh sáng màu đó vào mắt ta và hấp thụ những màu còn lại.\n" +
          "Vật màu đen hấp thụ tất cả các ánh sáng màu và không có ánh sáng phản xạ – ta nhận ra vật màu đen vì nó được đặt bên cạnh những vật có màu sắc khác.\n" +
          "Ví dụ: cánh hoa hướng dương màu vàng vì phản xạ ánh sáng vàng; lá màu xanh vì phản xạ ánh sáng lục.",
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
          "• Tiêu điểm chính F: chùm tia tới song song với trục chính cho chùm tia ló hội tụ tại một điểm F nằm trên trục chính (thấu kính hội tụ); hoặc đường kéo dài của chùm tia ló hội tụ tại một điểm F nằm trên trục chính (thấu kính phân kì).\n" +
          "• Tiêu cự f = OF: khoảng cách từ quang tâm O đến tiêu điểm chính F.",
      },
      {
        kind: "text",
        title: "3. Hai tia sáng đặc biệt dùng để vẽ ảnh",
        body:
          "• Tia sáng tới quang tâm O thì đi thẳng.\n" +
          "• Tia sáng tới song song với trục chính thì tia ló đi qua tiêu điểm chính F (thấu kính hội tụ), hoặc có đường kéo dài đi qua tiêu điểm chính F (thấu kính phân kì).\n" +
          "Giao điểm S' của chùm tia ló (hoặc đường kéo dài) là ảnh của điểm sáng S. Quy tắc vẽ: ảnh thật vẽ bằng mũi tên nét liền, ảnh ảo vẽ bằng mũi tên nét đứt.\n" +
          "Mở rộng: tia tới đi qua tiêu điểm vật thì tia ló song song với trục chính.",
      },
      {
        kind: "text",
        title: "4. Đặc điểm ảnh",
        body:
          "Thấu kính hội tụ:\n" +
          "• Vật đặt ngoài khoảng tiêu cự (d > f): ảnh thật, ngược chiều với vật.\n" +
          "• Vật đặt trong khoảng tiêu cự (d < f): ảnh ảo, lớn hơn vật và cùng chiều với vật.\n" +
          "Thấu kính phân kì: vật đặt ở mọi vị trí luôn cho ảnh ảo, cùng chiều và nhỏ hơn vật.\n" +
          "Ảnh thật hứng được trên màn chắn; ảnh ảo không hứng được trên màn chắn.\n" +
          "Mở rộng: với thấu kính hội tụ, d > 2f thì ảnh nhỏ hơn vật; d = 2f thì ảnh bằng vật; f < d < 2f thì ảnh lớn hơn vật.",
      },
      {
        kind: "formula",
        title: "Mở rộng (không bắt buộc trong SGK): công thức thấu kính",
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
        title: "Em có biết: phương pháp Bessel (hoán vị)",
        body:
          "Đặt vật và màn cố định, cách nhau khoảng L; dịch chuyển thấu kính để tìm hai vị trí cho ảnh rõ nét trên màn. Gọi l là khoảng cách giữa hai vị trí đó thì tiêu cự f = (L² − l²) / (4L).",
      },
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
          "Ngắm chừng ở vô cực: đặt vật tại tiêu điểm (d = f), ảnh ở xa vô cực; ngắm chừng ở cực cận: ảnh ở điểm cực cận của mắt.\n" +
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
        title: "Bài tập SGK (Hình 10.6)",
        body:
          "Vật AB cao 2 cm đặt vuông góc với trục chính của thấu kính hội tụ, cách thấu kính khoảng 7,5 cm (A nằm trên trục chính); tiêu cự f = 5 cm. Vẽ ảnh theo tỉ lệ 1 cạnh ô vuông ứng với 1 cm.\n" +
          "Cách vẽ: tia từ B tới quang tâm O đi thẳng; tia từ B song song trục chính cho tia ló qua tiêu điểm F; giao điểm hai tia ló là B', hạ B'A' vuông góc trục chính.\n" +
          "Kết quả: ảnh thật, ngược chiều với vật, cách thấu kính d' = 15 cm và cao h' = 4 cm (kiểm tra bằng tam giác đồng dạng hoặc 1/f = 1/d + 1/d').",
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
          "Thương số U/I có giá trị không đổi với mỗi đoạn dây dẫn và đặc trưng cho sự cản trở dòng điện của đoạn dây đó, gọi là điện trở R = U/I.\n" +
          "Đơn vị: ôm (Ω), 1 Ω = 1 V / 1 A; 1 mΩ = 0,001 Ω; 1 kΩ = 1 000 Ω; 1 MΩ = 1 000 000 Ω.",
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
          "Điện trở dây tỉ lệ thuận với chiều dài, tỉ lệ nghịch với tiết diện và phụ thuộc vật liệu làm dây. Điện trở suất (Bảng 11.3, ở 20 °C, đơn vị Ω·m): bạc 1,47·10⁻⁸; đồng 1,70·10⁻⁸; vàng 2,35·10⁻⁸; nhôm 2,80·10⁻⁸; tungsten 5,50·10⁻⁸; sắt 12,00·10⁻⁸; nikelin 40,00·10⁻⁸; manganin 43,00·10⁻⁸; constantan 50,00·10⁻⁸; nicrom 110,00·10⁻⁸.",
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
          "• Song song: R_tđ = 6·3/(6+3) = 2 Ω; I = 6 A; I₁ = 2 A; I₂ = 4 A.\n\n" +
          "Bài tập SGK: hai điện trở 20 Ω và 40 Ω mắc song song vào hiệu điện thế 24 V: R_tđ = 20·40/(20+40) ≈ 13,3 Ω; I = 24/13,3 ≈ 1,8 A (I₁ = 1,2 A; I₂ = 0,6 A).",
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
          "Dòng điện có năng lượng, gọi là điện năng. Tác dụng nhiệt của dòng điện chứng tỏ điện năng chuyển hoá thành nhiệt năng; tác dụng phát sáng chứng tỏ điện năng chuyển hoá thành quang năng.\n" +
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
          "P = U · I\n\nCông suất điện là năng lượng của dòng điện chạy qua một đoạn mạch trong một đơn vị thời gian.\n" +
          "Công suất định mức của một thiết bị tiêu thụ điện là công suất mà thiết bị tiêu thụ khi hoạt động bình thường; số ghi trên thiết bị, ví dụ 220 V – 60 W nghĩa là để đèn sáng bình thường phải mắc vào hiệu điện thế 220 V, khi đó công suất của bóng đèn là 60 W.\n" +
          "Công tơ điện đo năng lượng điện tiêu thụ; mỗi số đếm ứng với 1 kWh (1 kWh = 3,6·10⁶ J).\n" +
          "Mở rộng: với đoạn mạch chỉ có điện trở, P = I²·R = U²/R.",
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
          "Trong các thí nghiệm, kim điện kế lệch sang phải hoặc sang trái: dòng điện cảm ứng khi số đường sức từ tăng và khi giảm có chiều ngược nhau.\n" +
          "Các cách làm biến thiên số đường sức từ: đưa nam châm lại gần hoặc ra xa cuộn dây; đóng, mở công tắc của nam châm điện; quay nam châm trước cuộn dây; thay đổi tiết diện của cuộn dây.",
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
        title: "4. Mô hình máy phát điện xoay chiều",
        body:
          "Mô hình máy phát điện xoay chiều (Hình 14.8, 14.9): khung dây quay trong từ trường đều của nam châm; hai đầu cuộn dây được nối với hai vành khuyên (vòng tròn bằng đồng), hai chổi quét tì vào hai vành khuyên rồi nối với mạch ngoài (đèn LED) tạo thành mạch kín.\n" +
          "Quay chậm cuộn dây thì hai đèn LED sáng, tối luân phiên; số đường sức từ xuyên qua tiết diện cuộn dây biến thiên (tăng, giảm luân phiên) theo thời gian nên trong cuộn dây xuất hiện dòng điện xoay chiều.\n" +
          "Dòng điện xoay chiều tần số 50 Hz dùng trong lưới điện và gia đình có cường độ tăng, giảm tuần tự và chiều luân phiên thay đổi; dòng điện đổi chiều 100 lần trong 1 giây.",
      },
    ],
  },
  {
    lessonNumber: 15,
    summary: "Dòng điện xoay chiều có các tác dụng nhiệt, phát sáng, từ và sinh lí; mỗi tác dụng có ứng dụng trong đời sống và y học.",
    objectives: [
      "Lấy ví dụ chứng tỏ dòng điện xoay chiều có tác dụng nhiệt, tác dụng phát sáng, tác dụng từ, tác dụng sinh lí.",
      "Nêu được một số ứng dụng của các tác dụng của dòng điện xoay chiều (máy khử rung tim, nam châm điện…).",
      "Có ý thức an toàn khi sử dụng điện.",
    ],
    requirements: ["Lấy được ví dụ chứng tỏ dòng điện xoay chiều có tác dụng nhiệt, phát sáng, tác dụng từ, tác dụng sinh lí."],
    knowledge: [
      {
        kind: "text",
        title: "1. Tác dụng nhiệt",
        body:
          "Dòng điện xoay chiều chạy qua vật dẫn làm vật nóng lên, chứng tỏ dòng điện xoay chiều có tác dụng nhiệt.\n" +
          "Ví dụ: máy sấy tóc (hơi nóng thổi ra từ đầu sấy cho thấy năng lượng điện được chuyển hoá thành nhiệt năng), bình nước nóng, ấm đun nước, bàn là, bếp từ.",
      },
      {
        kind: "text",
        title: "2. Tác dụng phát sáng",
        body:
          "Dòng điện xoay chiều chạy qua đèn sợi đốt làm đèn phát sáng chứng tỏ dòng điện xoay chiều có tác dụng phát sáng.\n" +
          "Ví dụ: đèn huỳnh quang (đèn ống) khi có dòng điện xoay chiều chạy qua; đèn sợi đốt.",
      },
      {
        kind: "text",
        title: "3. Tác dụng từ",
        body:
          "Dòng điện xoay chiều chạy trong dây dẫn thẳng hay trong cuộn dây dẫn sinh ra từ trường, chứng tỏ dòng điện xoay chiều có tác dụng từ.\n" +
          "Thí nghiệm (Hình 15.4): đóng công tắc K để dòng điện xoay chiều chạy qua cuộn dây thì đinh sắt bị hút lên. Nếu thay dòng điện xoay chiều bằng dòng điện một chiều thì đinh sắt cũng bị hút – tác dụng từ có ở cả hai loại dòng điện.\n" +
          "Ứng dụng: nam châm điện xoay chiều có từ trường mạnh để di chuyển bột sắt; tạo nam châm điện, rơ le điện từ, động cơ điện, máy chụp cộng hưởng từ trong y học, tàu đệm từ…",
      },
      {
        kind: "text",
        title: "4. Tác dụng sinh lí",
        body:
          "Nếu cho dòng điện xoay chiều đi qua cơ thể thì dòng điện sẽ làm các cơ co giật, có thể làm tim ngừng đập, ngạt thở, thần kinh bị tê liệt – chứng tỏ dòng điện xoay chiều có tác dụng sinh lí.\n" +
          "Trong y học, người ta ứng dụng tác dụng sinh lí của dòng điện xoay chiều thích hợp để điều trị một số bệnh. Máy khử rung tim là một trong số các thiết bị ứng dụng tác dụng sinh lí của dòng điện xoay chiều.\n" +
          "Lưu ý: dòng điện xoay chiều có thể gây nguy hiểm tới tính mạng con người. Cần thận trọng khi sử dụng dòng điện xoay chiều ở gia đình và không được lại gần các trạm biến thế điện.",
      },
      {
        kind: "text",
        title: "Mở rộng: an toàn điện và đo dòng điện xoay chiều",
        body:
          "Không chạm vào dây điện trần, ổ cắm khi tay ướt; dùng thiết bị có vỏ cách điện, nối đất; lắp cầu dao chống giật.\n" +
          "Dòng điện xoay chiều được đo bằng ampe kế, vôn kế xoay chiều (kí hiệu AC hoặc dấu ~); hiệu điện thế hiệu dụng của mạng điện gia đình là 220 V.",
      },
    ],
  },
  // ------------------------------------------------------------------ CHƯƠNG V
  {
    lessonNumber: 16,
    summary: "Năng lượng trên Trái Đất có nguồn gốc từ Mặt Trời; năng lượng hoá thạch có ưu điểm nhưng cạn kiệt dần và gây ô nhiễm môi trường.",
    objectives: [
      "Dựa vào sơ đồ (hoặc hình ảnh) mô tả được vòng năng lượng trên Trái Đất, rút ra được: năng lượng của Trái Đất đến từ Mặt Trời.",
      "Nêu được ưu điểm và nhược điểm của năng lượng hoá thạch.",
      "Lấy được ví dụ chứng tỏ việc đốt cháy các nhiên liệu hoá thạch có thể gây ô nhiễm môi trường.",
      "Thảo luận để chỉ ra được giá nhiên liệu phụ thuộc chi phí khai thác nó.",
    ],
    requirements: [
      "Dựa vào sơ đồ (hoặc hình ảnh) mô tả được sơ lược vòng năng lượng trên Trái Đất.",
      "Nêu được sơ lược về năng lượng hoá thạch; lấy ví dụ chứng tỏ việc đốt cháy nhiên liệu hoá thạch có thể gây ô nhiễm môi trường.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Vòng năng lượng giữa các vật sống (Hình 16.1)",
        body:
          "Quá trình trao đổi chất và chuyển hoá năng lượng giữa các vật sống tạo thành một vòng năng lượng trên Trái Đất.\n" +
          "Thực vật hấp thụ năng lượng mặt trời (quang hợp) để chuyển khí CO₂ và nước thành các phân tử đường, lưu trữ năng lượng hoá học trong lục lạp. Các phân tử đường cung cấp năng lượng cho động vật khi chúng ăn thực vật. Quá trình hô hấp giải phóng năng lượng, chuyển phân tử đường (hữu cơ) thành vật liệu vô cơ là khí CO₂, hơi nước và ATP.",
      },
      {
        kind: "text",
        title: "2. Vòng năng lượng theo vòng tuần hoàn của nước (Hình 16.2)",
        body:
          "Năng lượng mặt trời chiếu xuống mặt đất và biển làm nóng nước và khí quyển; sự nóng lên không đều tạo ra chênh lệch nhiệt độ giữa các vùng trên Trái Đất, gây ra sự chuyển động của không khí và các dòng hải lưu (dòng biển) trong đại dương, tạo ra gió và các hiện tượng thời tiết.\n" +
          "Nước bốc hơi, ngưng tụ thành mây, mưa, tuyết rồi chảy về sông, biển. Năng lượng từ gió, năng lượng từ dòng chảy, năng lượng từ sóng biển, từ dòng biển trên Trái Đất đều đến từ Mặt Trời.",
      },
      {
        kind: "text",
        title: "3. Năng lượng hoá thạch (Hình 16.3)",
        body:
          "Năng lượng hoá thạch được tạo ra từ các nhiên liệu hoá thạch, bao gồm than mỏ, dầu mỏ, khí mỏ dầu và khí thiên nhiên. Nguồn năng lượng này được hình thành từ việc phân huỷ xác các vật sống qua hàng triệu năm, nên năng lượng hoá thạch cũng có nguồn gốc từ Mặt Trời.\n" +
          "Dầu mỏ hình thành từ xác động vật, thực vật bị trầm tích, vùi lấp dưới áp suất và nhiệt độ cao qua hàng triệu năm; vì tốc độ tạo ra quá chậm nên dầu mỏ không bổ sung kịp và sẽ dần cạn kiệt.",
      },
      {
        kind: "text",
        title: "4. Ưu điểm và nhược điểm của năng lượng hoá thạch",
        body:
          "Ưu điểm: có nguồn sẵn có, dễ khai thác, chế biến, vận chuyển, dễ tích trữ với khối lượng lớn; công nghệ khai thác và chuyển hoá phổ biến, chi phí rẻ.\n" +
          "Nhược điểm: Trái Đất mất hàng triệu năm để tạo ra nhiên liệu hoá thạch trong khi con người tiêu thụ quá nhanh nên nguồn nhiên liệu ngày càng cạn kiệt; khai thác, xử lí, phân phối gây nhiều mối đe doạ cho môi trường; đốt cháy tạo ra chất thải rắn, phát thải các khí CO₂, CO, NO₂, NO, SO₂… gây ô nhiễm môi trường và hiệu ứng nhà kính, dẫn tới biến đổi khí hậu (băng tan, nước biển dâng, hạn hán, lũ lụt…).",
      },
      {
        kind: "text",
        title: "5. Các yếu tố ảnh hưởng đến giá nhiên liệu hoá thạch",
        body:
          "Giá nhiên liệu hoá thạch phụ thuộc vào chi phí khai thác và nhiều yếu tố khác như nhu cầu sử dụng, cung cầu trên thị trường, tình hình kinh tế toàn cầu, chính sách của các quốc gia có trữ lượng nhiên liệu lớn…\n" +
          "Chi phí khai thác gồm chi phí thăm dò, chi phí khoan khai thác, chi phí vận chuyển, chi phí tích trữ lưu kho và chi phí xử lí các vấn đề môi trường liên quan. Chi phí này ngày càng tăng vì các mỏ dầu, khí thiên nhiên, than… dễ khai thác trên đất liền hoặc lộ thiên dần cạn kiệt nên phải thăm dò và khai thác các mỏ mới ở vùng biển sâu, ở địa dương hoặc vùng hẻo lánh.\n" +
          "Ví dụ (Hình 16.4): chi phí khai thác chiếm tỉ lệ lớn trong giá thành bán xăng ra thị trường, có thể đến 50% giá bán.",
      },
      {
        kind: "formula",
        title: "Mở rộng: nhiệt lượng toả ra khi đốt nhiên liệu",
        body:
          "Q = q · m\n\nTrong đó: Q – nhiệt lượng toả ra (J); q – năng suất toả nhiệt của nhiên liệu (J/kg); m – khối lượng nhiên liệu bị đốt cháy hoàn toàn (kg).\n" +
          "Giá trị tham khảo (không có trong SGK): than đá ≈ 27·10⁶ J/kg; dầu hoả ≈ 44·10⁶ J/kg; khí đốt ≈ 44·10⁶ J/kg. Thí nghiệm ảo của bài dùng công thức này để minh hoạ.",
      },
    ],
  },
  {
    lessonNumber: 17,
    summary: "Năng lượng tái tạo được bổ sung liên tục từ tự nhiên: năng lượng Mặt Trời, gió, sóng biển, dòng sông…; mỗi dạng có ưu, nhược điểm riêng.",
    objectives: [
      "Nêu được sơ lược ưu điểm và nhược điểm của một số dạng năng lượng tái tạo (năng lượng mặt trời, năng lượng từ gió, năng lượng từ sóng biển, năng lượng từ dòng sông).",
      "Thảo luận để nêu được một số biện pháp sử dụng hiệu quả năng lượng và bảo vệ môi trường.",
    ],
    requirements: [
      "Nêu được sơ lược ưu điểm, nhược điểm của một số dạng năng lượng tái tạo.",
      "Thảo luận để nêu được một số biện pháp sử dụng hiệu quả năng lượng và bảo vệ môi trường.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Năng lượng tái tạo",
        body:
          "Năng lượng tái tạo là năng lượng đến từ các nguồn năng lượng có sẵn trong thiên nhiên, liên tục được bổ sung thông qua các quá trình tự nhiên.\n" +
          "Năng lượng tái tạo bao gồm: năng lượng mặt trời, năng lượng từ gió, năng lượng từ sóng biển, năng lượng từ dòng sông, năng lượng sinh khối, năng lượng địa nhiệt…\n" +
          "Vì sao cần tăng cường sử dụng năng lượng tái tạo? – Vì nguồn năng lượng hoá thạch ngày càng cạn kiệt và gây ô nhiễm môi trường.",
      },
      {
        kind: "text",
        title: "2. Năng lượng mặt trời",
        body:
          "Ưu điểm: luôn có sẵn trong thiên nhiên, khó có khả năng bị cạn kiệt trong tương lai gần; khi sử dụng không gây ra tiếng ồn, không phát thải các chất gây ô nhiễm không khí hay khí gây hiệu ứng nhà kính. Được khai thác trực tiếp như chiếu sáng, làm khô quần áo, sấy nông sản, làm muối; chuyển hoá thành điện năng nhờ pin mặt trời hoặc khai thác gián tiếp qua thiết bị thu nhiệt để làm nóng nước, chạy nhà máy nhiệt điện.\n" +
          "Nhược điểm: giá thành sản xuất tấm pin mặt trời còn cao, hệ thống hấp thụ nhiệt mặt trời có hiệu suất chuyển hoá thấp; pin hết hạn sử dụng (trung bình 25 năm) tạo ra rác thải; lắp đặt quá nhiều tấm pin có thể gây ô nhiễm ánh sáng, chiếm diện tích lớn và ảnh hưởng tới hệ sinh thái.\n" +
          "Việt Nam có tiềm năng năng lượng mặt trời lớn, nhất là ở Tây Nguyên và Nam bộ (Đắk Lắk, Gia Lai, Nha Trang, Ninh Thuận, Bình Thuận, Tây Ninh, Bình Phước).",
      },
      {
        kind: "text",
        title: "3. Năng lượng từ gió",
        body:
          "Ưu điểm: luôn có sẵn trong thiên nhiên; do không phát thải các chất gây ô nhiễm không khí hay khí gây hiệu ứng nhà kính nên khai thác năng lượng từ gió là một trong những giải pháp quan trọng nhằm giảm biến đổi khí hậu toàn cầu. Gió ngoài khơi mạnh và ổn định hơn nên tua-bin gió ngoài khơi là nguồn năng lượng có triển vọng lớn (Hình 17.3).\n" +
          "Nhược điểm: hiệu suất chuyển đổi năng lượng thấp, giá thành đầu tư ban đầu cao; các nhà máy điện gió phát ra tiếng ồn gây ảnh hưởng đến môi trường sống của sinh vật, ảnh hưởng đến vùng hoạt động của các loài chim (đặc biệt là chim di cư) và dơi.",
      },
      {
        kind: "text",
        title: "4. Năng lượng từ sóng biển (Hình 17.4)",
        body:
          "Sóng biển được hình thành chủ yếu do tác động của gió. Năng lượng từ sóng biển là năng lượng có nguồn gốc từ dao động của các con sóng; được khai thác bằng các công nghệ hiện đại (Attenuator, Point Absorber, Oscillating water surge…) và chuyển hoá thành điện năng.\n" +
          "Ưu điểm: nguồn năng lượng luôn có sẵn trong tự nhiên, không tạo chất thải.\n" +
          "Nhược điểm: cần nhiều máy phát điện đặt trong không gian rộng, gây ảnh hưởng đến giao thông đường biển và hệ sinh thái; đòi hỏi giá thành đầu tư ban đầu cao và phụ thuộc rất lớn vào các mùa trong năm, chịu ảnh hưởng của thiên tai.",
      },
      {
        kind: "text",
        title: "5. Năng lượng từ dòng sông (thuỷ điện – Hình 17.5)",
        body:
          "Năng lượng từ dòng sông là năng lượng lấy từ sức chảy của dòng nước, tác động tiêu cực đến môi trường so với năng lượng hoá thạch ít hơn. Người ta xây dựng các nhà máy thuỷ điện (đập, hồ chứa nước) để chuyển hoá năng lượng này thành điện năng, làm quay tua-bin của máy phát điện.\n" +
          "Nhược điểm: sử dụng đập để tích trữ nước cho thuỷ điện có nguy cơ ảnh hưởng đến môi trường; vỡ đập thuỷ điện gây thiệt hại lớn; động vật không di chuyển được từ hạ nguồn lên thượng nguồn; nước ngập ở thượng nguồn và cạn ở hạ nguồn làm thay đổi môi trường sống của sinh vật; diện tích rừng thay đổi khi xây dựng nhà máy thuỷ điện, có thể phải di dời dân cư.",
      },
      {
        kind: "text",
        title: "6. Một số biện pháp sử dụng hiệu quả năng lượng và bảo vệ môi trường",
        body:
          "Sử dụng hiệu quả năng lượng là việc dùng ít năng lượng hơn để thực hiện cùng một công việc hoặc cùng một chức năng của thiết bị, máy móc (ví dụ: dùng đèn LED thay thế đèn huỳnh quang hoặc đèn sợi đốt).\n" +
          "Bảo vệ môi trường là hoạt động phòng ngừa, hạn chế tác động xấu đến môi trường; ứng phó sự cố môi trường; khắc phục ô nhiễm, suy thoái môi trường, cải thiện chất lượng môi trường; sử dụng hợp lí tài nguyên thiên nhiên…\n" +
          "Ví dụ: sử dụng năng lượng tái tạo để chuyển hoá thành điện năng; sử dụng thiết bị tiết kiệm điện (đèn LED, tủ lạnh, điều hoà, bình nóng lạnh… có tính năng tiết kiệm năng lượng); tăng cường sử dụng, cải tiến máy móc tại các công ty, nhà máy, xí nghiệp; sử dụng phương tiện giao thông công cộng thay cho phương tiện cá nhân; tắt các thiết bị điện (ti vi, đèn điện…) khi không sử dụng; tạo ý thức tiết kiệm năng lượng và bảo vệ môi trường.",
      },
      {
        kind: "formula",
        title: "Mở rộng: một số công thức tham khảo (không có trong SGK)",
        body:
          "• Pin Mặt Trời: P = H · S · η   (H – cường độ bức xạ, W/m²; S – diện tích tấm pin, m²; η – hiệu suất).\n" +
          "• Thuỷ điện: P = η · 10 · m · h / t   (công của trọng lực khi khối nước m rơi độ cao h trong thời gian t).\n" +
          "Thí nghiệm ảo của bài dùng các công thức này để minh hoạ.",
      },
    ],
  },
];
