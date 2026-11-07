/**
 * NỘI DUNG KIẾN THỨC HOÁ HỌC 9 – Chương VI, VII (Bài 18 – 25).
 * Biên soạn theo các trang SGK KHTN 9 – Kết nối tri thức với cuộc sống.
 * Mục tiêu = "Mục tiêu" ở đầu bài; yêu cầu cần đạt = các ý "Em có thể" cuối bài.
 * Nội dung vượt SGK được ghi rõ "Mở rộng".
 */
import type { LessonContent } from "./lessons";

export const LESSON_CONTENT_HOA_1: LessonContent[] = [
  // ------------------------------------------------------------------ CHƯƠNG VI
  {
    lessonNumber: 18,
    summary: "Kim loại có tính dẻo, dẫn điện, dẫn nhiệt, ánh kim; kim loại tác dụng với phi kim, nước, dung dịch hydrochloric acid và dung dịch muối.",
    objectives: [
      "Nêu được tính chất vật lí của kim loại.",
      "Trình bày được tính chất hoá học cơ bản của kim loại: tác dụng với phi kim (oxygen, lưu huỳnh, chlorine), nước hoặc hơi nước, dung dịch hydrochloric acid, dung dịch muối.",
      "Mô tả được một số khác biệt về tính chất giữa các kim loại thông dụng (nhôm, sắt, vàng,...).",
    ],
    requirements: [
      "Dựa vào tính chất của kim loại để giải thích việc lựa chọn kim loại phù hợp với mục đích sử dụng như: làm dây dẫn điện, đồ dùng nấu ăn, đồ trang sức,...",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Tính chất vật lí của kim loại",
        body:
          "Kim loại có các tính chất vật lí chung: tính dẻo, tính dẫn điện, dẫn nhiệt và ánh kim.\n" +
          "• Kim loại dẻo nhất (dễ dát mỏng, dễ kéo sợi): vàng.\n" +
          "• Kim loại dẫn điện tốt nhất: bạc (silver). Kim loại dẫn nhiệt tốt nhất: bạc.\n" +
          "• Kim loại có nhiệt độ nóng chảy cao nhất: tungsten. Kim loại có nhiệt độ nóng chảy thấp nhất: thuỷ ngân (mercury).\n" +
          "Ứng dụng (Hình 18.1): vàng làm đồ trang sức; đồng làm lõi dây điện; nhôm làm xoong, nồi, chảo; thép dùng trong xây dựng, cầu, đường,...\n" +
          "Mỗi kim loại có tính chất khác nhau nên được chọn dùng cho mục đích phù hợp: dây dẫn điện làm bằng đồng (dẫn điện tốt, rẻ hơn bạc) hoặc nhôm; đồ nấu ăn làm bằng nhôm, sắt (dẫn nhiệt tốt).",
      },
      {
        kind: "text",
        title: "2. Tác dụng với phi kim: oxygen",
        body:
          "Hầu hết các kim loại như Ca, Mg, Al, Zn, Fe, Cu,... phản ứng với khí oxygen tạo thành oxide kim loại. Một số kim loại như Au,... không phản ứng với khí oxygen.\n" +
          "Ví dụ: đốt nóng dây sắt (uốn thành hình lò xo) rồi đưa vào bình khí oxygen, dây sắt cháy sáng tạo thành khói màu nâu đỏ (Hình 18.2); rắc bột nhôm trên ngọn lửa đèn cồn, nhôm cháy sáng tạo thành chất rắn màu trắng.\n" +
          "3Fe + 2O₂ →(t°) Fe₃O₄        4Al + 3O₂ →(t°) 2Al₂O₃\n" +
          "Em có biết: một số kim loại như nhôm, kẽm, chromium,... phản ứng được với khí oxygen ngay ở điều kiện thường, tạo thành lớp oxide mỏng, bền vững. Lớp oxide này có tác dụng bảo vệ, ngăn không cho kim loại bên trong phản ứng tiếp với khí oxygen.",
      },
      {
        kind: "text",
        title: "3. Tác dụng với phi kim khác: chlorine, lưu huỳnh",
        body:
          "Kim loại có thể tác dụng với nhiều phi kim tạo thành muối. Ví dụ: kim loại tác dụng với khí chlorine tạo thành muối chloride; tác dụng với lưu huỳnh (sulfur) tạo thành muối sulfide.\n" +
          "• Natri nóng chảy cháy trong bình khí chlorine (màu vàng lục) tạo thành tinh thể muối ăn màu trắng (Hình 18.3): 2Na + Cl₂ →(t°) 2NaCl.\n" +
          "• Dây sắt nung đỏ cháy trong khí chlorine tạo thành muối iron(III) chloride màu nâu đỏ (Hình 18.4): 2Fe + 3Cl₂ →(t°) 2FeCl₃.\n" +
          "• Ví dụ khác: Cu + Cl₂ →(t°) CuCl₂        2Al + 3S →(t°) Al₂S₃",
      },
      {
        kind: "text",
        title: "4. Tác dụng với nước",
        body:
          "Một số kim loại như K, Na, Ca,... tác dụng với nước ở nhiệt độ thường tạo thành hydroxide và khí hydrogen, phản ứng toả ra nhiều nhiệt. Ví dụ: 2Na + 2H₂O → 2NaOH + H₂. Những kim loại này là kim loại hoạt động hoá học mạnh.\n" +
          "Những kim loại như Zn, Fe,... tác dụng với hơi nước ở nhiệt độ cao tạo thành oxide và khí hydrogen. Ví dụ: Zn + H₂O →(t°) ZnO + H₂.\n" +
          "Một số kim loại như Cu, Ag, Au,... không tác dụng với nước: đó là các kim loại hoạt động hoá học yếu.",
      },
      {
        kind: "text",
        title: "5. Tác dụng với dung dịch acid (hydrochloric acid)",
        body:
          "Một số kim loại phản ứng với dung dịch hydrochloric acid tạo thành muối và giải phóng khí hydrogen.\n" +
          "Fe + 2HCl → FeCl₂ + H₂   (iron(II) chloride)\n" +
          "2Al + 6HCl → 2AlCl₃ + 3H₂   (aluminium chloride)\n" +
          "Các kim loại Cu, Ag, Au,... không tác dụng với dung dịch HCl.",
      },
      {
        kind: "text",
        title: "6. Tác dụng với dung dịch muối",
        body:
          "Khi cho đinh sắt vào cốc đựng dung dịch copper(II) sulfate, xảy ra phản ứng: Fe + CuSO₄ → FeSO₄ + Cu.\n" +
          "Sắt đã đẩy đồng ra khỏi muối: sắt hoạt động hoá học mạnh hơn đồng.\n" +
          "Nhiều kim loại khác như Mg, Al, Zn,... cũng tác dụng được với dung dịch CuSO₄, AgNO₃,... tạo thành muối mới và kim loại mới.",
      },
      {
        kind: "example",
        title: "Bài tập SGK",
        body:
          "• Viết PTHH của phản ứng giữa kẽm (zinc), đồng với khí oxygen: 2Zn + O₂ →(t°) 2ZnO; 2Cu + O₂ →(t°) 2CuO.\n" +
          "• Vì sao đồ vật làm bằng sắt, nhôm, kẽm, đồng,... để lâu trong không khí bị mất ánh kim, còn đồ trang sức bằng vàng để lâu trong không khí vẫn sáng, đẹp? – Các kim loại đó phản ứng với oxygen tạo lớp oxide bên ngoài; vàng không phản ứng với oxygen.\n" +
          "• Điều chế hydrogen trong phòng thí nghiệm bằng kẽm với dung dịch HCl: Zn + 2HCl → ZnCl₂ + H₂. Để điều chế 250 mL khí hydrogen (điều kiện chuẩn, 24,79 L/mol) cần khoảng 0,01 mol H₂, tức khoảng 0,65 g Zn và 0,02 mol HCl, tương ứng 20 mL dung dịch HCl 1 M.\n" +
          "• Mg + 2HCl → MgCl₂ + H₂.",
      },
      {
        kind: "text",
        title: "Em đã học",
        body:
          "Kim loại có tính dẫn điện, dẫn nhiệt, tính dẻo và ánh kim. Hầu hết kim loại tác dụng với oxygen tạo thành oxide và với các phi kim khác tạo thành muối. Một số kim loại hoạt động hoá học mạnh như Na, K, Ca,... tác dụng với nước ở nhiệt độ thường tạo thành hydroxide và khí hydrogen; các kim loại như Zn, Fe,... tác dụng với hơi nước ở nhiệt độ cao tạo thành oxide và khí hydrogen. Một số kim loại tác dụng với dung dịch HCl tạo thành muối và giải phóng khí hydrogen. Khi xảy ra phản ứng hoá học giữa dung dịch muối và kim loại (trừ kim loại phản ứng được với nước như K, Na, Ca,...), thường sản phẩm tạo thành là muối mới và kim loại mới.",
      },
    ],
  },
  {
    lessonNumber: 19,
    summary: "Sắp xếp các kim loại theo mức độ hoạt động hoá học giảm dần được dãy hoạt động hoá học; dãy này cho biết kim loại nào phản ứng được với nước, acid, dung dịch muối.",
    objectives: [
      "Tiến hành được một số thí nghiệm hoặc mô tả được thí nghiệm (qua hình vẽ hoặc học liệu điện tử thí nghiệm) khi kim loại tiếp xúc với nước, hydrochloric acid,...",
      "Nêu được dãy hoạt động hoá học (K, Na, Ca, Mg, Al, Zn, Fe, Pb, H, Cu, Ag, Au).",
      "Trình bày được ý nghĩa của dãy hoạt động hoá học.",
    ],
    requirements: ["Dự đoán được phản ứng của kim loại với nước, dung dịch acid, dung dịch muối,..."],
    knowledge: [
      {
        kind: "text",
        title: "1. Xây dựng dãy hoạt động hoá học",
        body:
          "Khi phản ứng với các chất khác nhau, có thể sắp xếp các kim loại thành dãy theo thứ tự khả năng phản ứng giảm dần. Dãy này được gọi là dãy hoạt động hoá học.",
      },
      {
        kind: "text",
        title: "Thí nghiệm 1: Kim loại Na, Fe, Cu với nước",
        body:
          "Chuẩn bị: 1 mẫu kim loại natri bằng hạt đậu xanh, đinh sắt và dây đồng; 2 ống nghiệm đựng nước được đánh số (1), (2); chậu thuỷ tinh đựng nước.\n" +
          "Tiến hành: cho mẫu natri vào chậu thuỷ tinh đựng nước; cho đinh sắt, dây đồng vào ống nghiệm (1), (2).\n" +
          "Kết quả: natri phản ứng với nước ở điều kiện thường (Hình 18.5), giải phóng khí hydrogen; sắt và đồng không phản ứng với nước ở điều kiện thường. Dựa vào khả năng phản ứng với nước có thể chia kim loại natri, đồng, sắt thành nhóm hoạt động mạnh (Na) và nhóm không phản ứng (Fe, Cu).",
      },
      {
        kind: "text",
        title: "Thí nghiệm 2: Kim loại Fe, Cu với dung dịch acid (Hình 19.1)",
        body:
          "Chuẩn bị: đinh sắt, dây đồng, hai ống nghiệm cùng một loại dung dịch HCl cùng nồng độ.\n" +
          "Tiến hành: cho đinh sắt, dây đồng vào từng ống nghiệm riêng biệt đựng dung dịch HCl.\n" +
          "Kết quả: sắt phản ứng với dung dịch HCl, giải phóng khí hydrogen; đồng không phản ứng. Sắt hoạt động hoá học mạnh hơn hydrogen, đồng yếu hơn hydrogen; sắt hoạt động mạnh hơn đồng.",
      },
      {
        kind: "text",
        title: "Thí nghiệm 3: So sánh mức độ hoạt động của Ag và Cu (Hình 19.2)",
        body:
          "Chuẩn bị: dây đồng, dung dịch AgNO₃ 2%; ống nghiệm, panh.\n" +
          "Tiến hành: dùng panh kẹp dây đồng đã được uốn thành hình lò xo đưa vào ống nghiệm chứa dung dịch AgNO₃ 2%.\n" +
          "Kết quả: trên dây đồng xuất hiện lớp kim loại màu trắng bạc bám vào, dung dịch chuyển dần sang màu xanh: Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag. Đồng hoạt động hoá học mạnh hơn bạc.\n" +
          "Từ ba thí nghiệm, sắp xếp theo chiều giảm dần mức độ hoạt động hoá học của các kim loại Na, Fe, Cu, Ag và H: Na > Fe > H > Cu > Ag.",
      },
      {
        kind: "formula",
        title: "Dãy hoạt động hoá học",
        body:
          "K, Na, Ca, Mg, Al, Zn, Fe, Pb, H, Cu, Ag, Au\n\n" +
          "Bằng nhiều thí nghiệm khác nhau, người ta sắp xếp các kim loại và hydrogen thành dãy theo chiều giảm dần mức độ hoạt động hoá học như trên.",
      },
      {
        kind: "text",
        title: "2. Ý nghĩa của dãy hoạt động hoá học",
        body:
          "• Từ trái sang phải, mức độ hoạt động hoá học của kim loại giảm dần.\n" +
          "• Các kim loại hoạt động hoá học mạnh như K, Na, Ca,... tác dụng được với nước ở điều kiện thường, giải phóng khí hydrogen.\n" +
          "• Kim loại đứng trước H có tác dụng với dung dịch acid (H₂SO₄ loãng, HCl,...), giải phóng khí hydrogen.\n" +
          "• Kim loại đứng trước (trừ K, Na, Ca,...) có thể đẩy kim loại đứng sau ra khỏi dung dịch muối.\n" +
          "Vị trí trong dãy: kim loại hoạt động hoá học mạnh (từ K đến Al), trung bình (Zn, Fe, Pb), yếu (Cu, Ag, Au).",
      },
      {
        kind: "example",
        title: "Bài tập dự đoán (SGK)",
        body:
          "1. Rót dung dịch H₂SO₄ loãng vào 3 ống nghiệm chứa Mg, Ag, Zn: Mg và Zn phản ứng giải phóng H₂ (Mg + H₂SO₄ → MgSO₄ + H₂; Zn + H₂SO₄ → ZnSO₄ + H₂); Ag không phản ứng.\n" +
          "2. Cho viên kẽm vào ống nghiệm chứa dung dịch AgNO₃: Zn + 2AgNO₃ → Zn(NO₃)₂ + 2Ag.\n" +
          "3. Cho Cu, Fe, Ca vào cốc nước: Ca phản ứng (Ca + 2H₂O → Ca(OH)₂ + H₂); Cu và Fe không phản ứng với nước ở điều kiện thường.",
      },
    ],
  },
  {
    lessonNumber: 20,
    summary: "Kim loại được tách khỏi quặng bằng điện phân nóng chảy, nhiệt luyện hoặc thuỷ luyện tuỳ mức độ hoạt động hoá học; hợp kim có nhiều ưu điểm hơn kim loại nguyên chất; gang và thép được sản xuất từ quặng sắt.",
    objectives: [
      "Nêu được phương pháp tách kim loại theo mức độ hoạt động hoá học của chúng.",
      "Trình bày được quá trình tách một số kim loại có nhiều ứng dụng: tách sắt ra khỏi iron(III) oxide bởi carbon oxide; tách nhôm ra khỏi aluminium oxide bởi phản ứng điện phân; tách kẽm khỏi zinc sulfide bởi oxygen và carbon (than).",
      "Nêu được khái niệm hợp kim.",
      "Giải thích vì sao trong một số trường hợp thực tiễn, kim loại được sử dụng dưới dạng hợp kim.",
      "Nêu được thành phần, tính chất đặc trưng của một số hợp kim phổ biến, quan trọng, hiện đại.",
      "Trình bày được các giai đoạn cơ bản của quá trình sản xuất gang; quá trình sản xuất thép.",
    ],
    requirements: [
      "Giải thích được mối liên hệ giữa tính chất và ứng dụng của hợp kim.",
      "Trình bày được (thuyết trình/viết/vẽ) về các giai đoạn cơ bản của quá trình sản xuất gang và quá trình sản xuất thép.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Phương pháp tách kim loại",
        body:
          "Trong tự nhiên, kim loại chủ yếu tồn tại ở trong quặng dưới dạng hợp chất như oxide, muối. Ví dụ: aluminium oxide là thành phần chính trong quặng bauxite; iron(III) oxide là thành phần chủ yếu trong quặng hematite; zinc sulfide là thành phần chủ yếu trong quặng sphalerite. Một số kim loại quý như vàng, bạc,... có thể tồn tại dưới dạng đơn chất trong quặng.\n" +
          "Từ các quặng kim loại, người ta làm giàu quặng bằng cách loại bỏ tạp chất như đất, cát, đá,... Sau đó, tuỳ vào mức độ hoạt động hoá học của kim loại, có thể lựa chọn phương pháp hoá học phù hợp để tách kim loại ra khỏi hợp chất của nó:\n" +
          "• Phương pháp điện phân nóng chảy: tách các kim loại hoạt động hoá học mạnh như Na, Ca, Mg, Al,...\n" +
          "• Phương pháp nhiệt luyện: tách các kim loại hoạt động hoá học trung bình như Fe, Zn,...; dùng các chất như C, CO, H₂, Al,... tác dụng với oxide kim loại ở nhiệt độ cao, thu được kim loại.\n" +
          "• Phương pháp thuỷ luyện: tách các kim loại hoạt động hoá học yếu như Ag, Au,...: chuyển hợp chất của kim loại thành muối tan, sau đó dùng kim loại hoạt động hoá học mạnh hơn đẩy kim loại ra khỏi muối, tách chúng khỏi dung dịch.\n" +
          "Quy trình: Quặng →(làm giàu quặng) Hợp chất chứa kim loại →(phương pháp hoá học) Kim loại.",
      },
      {
        kind: "text",
        title: "2. Tách một số kim loại có nhiều ứng dụng",
        body:
          "a) Tách nhôm ra khỏi aluminium oxide bằng phản ứng điện phân (Hình 20.1). Nguyên liệu: quặng bauxite (thành phần chính là Al₂O₃). Trong công nghiệp, nhôm được sản xuất bằng phương pháp điện phân aluminium oxide nóng chảy:\n" +
          "2Al₂O₃ →(điện phân nóng chảy, cryolite) 4Al + 3O₂\n" +
          "Cryolite dùng để hạ nhiệt độ nóng chảy của Al₂O₃, nhằm tiết kiệm năng lượng. Cực dương bằng than chì, cực âm bằng than chì; nhôm nóng chảy được tháo ra ở đáy bể.\n" +
          "b) Tách sắt ra khỏi iron(III) oxide: ở nhiệt độ cao, sắt được tách ra khỏi iron(III) oxide bởi carbon monoxide: Fe₂O₃ + 3CO →(t°) 2Fe + 3CO₂.\n" +
          "c) Tách kẽm ra khỏi zinc sulfide: quặng chứa zinc sulfide (ZnS) được đốt trong không khí để chuyển thành zinc oxide (ZnO): 2ZnS + 3O₂ →(t°) 2ZnO + 2SO₂. Tiếp theo, kẽm được tách ra khỏi zinc oxide bởi carbon: ZnO + C →(t°) Zn + CO.",
      },
      {
        kind: "text",
        title: "3. Hợp kim",
        body:
          "Khái niệm: hợp kim là vật liệu kim loại có chứa ít nhất một kim loại cơ bản và một số kim loại hoặc phi kim khác. Kim loại cơ bản là kim loại chiếm thành phần chính trong hợp kim. Ví dụ: thép có kim loại cơ bản là sắt; đuy-ra (duralumin) có kim loại cơ bản là nhôm,...\n" +
          "Ưu điểm: hợp kim thường có nhiều ưu điểm vượt trội so với kim loại nguyên chất về độ cứng, độ bền, khả năng chống ăn mòn và gỉ sét, phù hợp với nhiều ứng dụng. Do đó, chúng được sử dụng phổ biến trong đời sống và trong công nghiệp.\n" +
          "Một số hợp kim phổ biến:\n" +
          "• Gang và thép là hai hợp kim quan trọng của sắt với carbon và một số nguyên tố khác (carbon chiếm hàm lượng từ 2% đến 5% trong gang và dưới 2% trong thép). Thép có nhiều ưu điểm hơn gang về độ cứng, độ đàn hồi, khả năng chịu lực nên được sử dụng rộng rãi trong các công trình xây dựng, giao thông. Gang cũng giòn hơn thép, thường dùng để đúc các chi tiết máy, ống dẫn nước, nắp cống,...\n" +
          "• Inox là một loại thép đặc biệt, ngoài sắt và carbon còn có các nguyên tố khác như chromium, nickel. Inox cũng khó bị gỉ, được sử dụng làm đồ gia dụng, thiết bị y tế,...\n" +
          "• Đuy-ra (duralumin) là hợp kim của nhôm với đồng, manganese, magnesium,... Đuy-ra nhẹ tương đương nhôm nhưng bền và cứng hơn nhiều, được dùng làm vật liệu chế tạo máy bay, ô tô,...\n" +
          "Em có biết: dây chì của hệ thống dập lửa tự động được làm từ hợp kim có nhiệt độ nóng chảy thấp (hợp kim Wood).",
      },
      {
        kind: "text",
        title: "4. Sản xuất gang, thép",
        body:
          "Sắt tinh khiết hầu như không được sử dụng trong cuộc sống, nhưng các hợp kim của sắt là gang và thép lại được sử dụng phổ biến trong công nghiệp và đời sống.\n" +
          "Sản xuất gang từ nguồn quặng chứa iron(III) oxide (Hình 20.2): nguyên liệu gồm quặng sắt (thường là quặng hematite với thành phần chính là Fe₂O₃), than cốc và chất tạo xỉ như CaCO₃, SiO₂,... Quặng sắt, than cốc, đá vôi được đưa vào lò qua miệng lò, chuyển dần từ trên xuống. Không khí nóng được thổi vào từ dưới lên. Các giai đoạn chính:\n" +
          "– Phản ứng tạo thành khí CO: C + O₂ →(t°) CO₂;  C + CO₂ →(t°) 2CO.\n" +
          "– Khí CO phản ứng với các oxide của sắt trong quặng: 3CO + Fe₂O₃ →(t°) 2Fe + 3CO₂. Sắt nóng chảy hoà tan một lượng nhỏ carbon cùng một số nguyên tố khác tạo thành gang lỏng.\n" +
          "– Đá vôi bị phân huỷ thành CaO; CaO kết hợp với các oxide như SiO₂ trong quặng tạo thành xỉ: CaO + SiO₂ →(t°) CaSiO₃. Xỉ nhẹ nổi lên trên gang lỏng, được đưa ra ngoài qua cửa tháo xỉ.\n" +
          "Sản xuất thép (Hình 20.3): nguyên liệu chính là gang (hoặc thép phế liệu) và khí oxygen. Khí oxygen được thổi vào lò đựng gang nóng chảy ở nhiệt độ cao, đốt cháy các tạp chất trong gang (carbon, sulfur, silicon, manganese,...). Các oxide tạo thành ở dạng khí (CO₂, SO₂,...) thoát ra theo khí thải, còn các oxide dạng rắn (SiO₂, MnO₂,...) tạo xỉ nhẹ nổi lên trên thép lỏng và được tách ra để thu lấy thép.",
      },
      {
        kind: "example",
        title: "Câu hỏi SGK",
        body:
          "• Điểm giống nhau của quá trình tách kẽm và tách sắt: đều là phương pháp nhiệt luyện, dùng carbon (hoặc CO) để tách kim loại khỏi oxide ở nhiệt độ cao. Điểm khác: với kẽm, quặng zinc sulfide phải đốt trong không khí để chuyển thành zinc oxide trước.\n" +
          "• Natri là kim loại hoạt động hoá học mạnh nên không thể tách bằng nhiệt luyện, phải dùng điện phân nóng chảy.\n" +
          "• Phương pháp thường dùng tách K, Na, Al,...: điện phân nóng chảy; tách Zn, Fe: nhiệt luyện.",
      },
    ],
  },
  {
    lessonNumber: 21,
    summary: "Phi kim như carbon, lưu huỳnh, chlorine có nhiều ứng dụng; phi kim khác kim loại về tính dẫn điện, nhiệt độ nóng chảy, nhiệt độ sôi, khối lượng riêng và xu hướng nhận electron.",
    objectives: [
      "Nêu được ứng dụng của một số đơn chất phi kim thiết thực trong cuộc sống (than, lưu huỳnh, khí chlorine,...).",
      "Chỉ ra được sự khác nhau cơ bản về một số tính chất giữa phi kim và kim loại: khả năng dẫn điện, nhiệt độ nóng chảy, nhiệt độ sôi, khối lượng riêng; khả năng tạo ion dương, ion âm; phản ứng với oxygen tạo oxide acid, oxide base.",
    ],
    requirements: [
      "Biết được ưu điểm của khẩu trang than hoạt tính so với khẩu trang thường.",
      "Biết được vai trò của than hoạt tính trong các máy lọc nước.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Ứng dụng của một số phi kim quan trọng",
        body:
          "Carbon: trong tự nhiên, đơn chất carbon tồn tại ở các dạng chính như: kim cương, than chì (graphite), carbon vô định hình (than gỗ, than xương, mồ hóng,...). Các loại than như than gỗ, than xương,... có khả năng giữ trên bề mặt của nó các phân tử chất khí, chất tan trong dung dịch. Tính chất này được gọi là tính hấp phụ. Dựa vào tính hấp phụ, carbon ở dạng than hoạt tính được dùng trong mặt nạ phòng độc, chất khử màu, khử mùi. Ngoài ra: than cốc dùng làm nhiên liệu, nguyên liệu trong công nghiệp luyện kim; than chì làm điện cực, chất bôi trơn, ruột bút chì; kim cương làm đồ trang sức, mũi khoan, dao cắt kính;...\n" +
          "Lưu huỳnh là nguyên liệu quan trọng cho nhiều ngành công nghiệp: lưu hoá cao su, sản xuất dược phẩm, sản xuất sulfuric acid, sản xuất thuốc diệt nấm, sản xuất pháo hoa, diêm (Hình 21.2). Lưu hoá cao su: quá trình lưu hoá cao su được phát minh bởi Charles Goodyear vào năm 1839; bản chất là tạo các cầu nối lưu huỳnh giữa các mạch cao su để hình thành mạng lưới chắc chắn, đàn hồi hơn.\n" +
          "Chlorine có nhiều ứng dụng trong cuộc sống và trong các ngành công nghiệp như khử trùng nước sinh hoạt; sản xuất nước Javel, chất tẩy rửa,...; tẩy trắng vải, sợi, bột giấy,...; sản xuất chất dẻo,...",
      },
      {
        kind: "text",
        title: "Hoạt động tìm hiểu: tính hấp phụ của than gỗ (Hình 21.1)",
        body:
          "Bố trí: phễu lọc có bông, bột than gỗ (kẹp ở giá); rót từ từ nước màu pha loãng vào phễu. Dung dịch thu được trong cốc thuỷ tinh bị mất màu do than gỗ đã giữ lại các phân tử chất màu trên bề mặt (tính hấp phụ).",
      },
      {
        kind: "text",
        title: "2. Sự khác nhau về tính chất vật lí giữa phi kim và kim loại",
        body:
          "a) Tính dẫn điện: trong khi các kim loại dẫn điện tốt thì phi kim thường không dẫn điện. Silicon tinh khiết là chất bán dẫn. Than chì có tính dẫn điện nhưng yếu hơn kim loại.\n" +
          "b) Nhiệt độ nóng chảy, nhiệt độ sôi: phần lớn phi kim có nhiệt độ nóng chảy, nhiệt độ sôi thấp hơn kim loại. Ở nhiệt độ thường, trong khi hầu hết các kim loại ở thể rắn (riêng thuỷ ngân ở thể lỏng) thì phi kim có thể tồn tại ở thể khí (hydrogen, nitrogen, oxygen, fluorine, chlorine,...), thể lỏng (bromine) hay thể rắn (carbon, silicon, phosphorus, lưu huỳnh,...).\n" +
          "c) Khối lượng riêng: phần lớn phi kim có khối lượng riêng nhỏ hơn kim loại.",
      },
      {
        kind: "text",
        title: "3. Sự khác nhau về tính chất hoá học giữa phi kim và kim loại",
        body:
          "a) Phản ứng của kim loại với phi kim: trong phản ứng hoá học, các kim loại dễ nhường electron để tạo ra ion dương, còn các phi kim dễ nhận electron tạo ion âm.\n" +
          "Ví dụ: Na → Na⁺ + 1e;  Cl + 1e → Cl⁻;  2Na + Cl₂ → 2NaCl.\n" +
          "b) Phản ứng của phi kim và kim loại với oxygen: kim loại tác dụng với oxygen thường tạo thành oxide base, trong khi phi kim tác dụng với oxygen thường tạo thành oxide acid.\n" +
          "Ví dụ: 2Mg + O₂ →(t°) 2MgO;  S + O₂ →(t°) SO₂.",
      },
      {
        kind: "text",
        title: "Em đã học",
        body:
          "Phi kim có nhiều ứng dụng quan trọng: than hoạt tính được dùng làm mặt nạ phòng độc, khử màu, khử mùi; than cốc là nhiên liệu, chất phản ứng trong nhiều ngành công nghiệp; lưu huỳnh là nguyên liệu sản xuất sulfuric acid; chlorine dùng để khử trùng, tẩy màu, sản xuất nhựa, hydrochloric acid,... Khác với kim loại, hầu hết các nguyên tố phi kim không dẫn điện; phần lớn phi kim có nhiệt độ nóng chảy, nhiệt độ sôi và khối lượng riêng nhỏ hơn so với kim loại. Trong các phản ứng giữa kim loại và phi kim, kim loại là chất nhường electron, phi kim là chất nhận electron. Nhiều kim loại tác dụng với oxygen tạo thành oxide base. Phi kim tác dụng với oxygen thường tạo thành oxide acid.",
      },
    ],
  },
  // ------------------------------------------------------------------ CHƯƠNG VII
  {
    lessonNumber: 22,
    summary: "Hợp chất hữu cơ là hợp chất của carbon (trừ CO, CO₂, muối carbonate,...); mỗi chất có công thức phân tử và công thức cấu tạo; carbon luôn có hoá trị IV.",
    objectives: [
      "Nêu được khái niệm hợp chất hữu cơ, hoá học hữu cơ.",
      "Nêu được khái niệm công thức phân tử, công thức cấu tạo và ý nghĩa của nó; đặc điểm cấu tạo hợp chất hữu cơ.",
      "Phân biệt được hợp chất hữu cơ hay vô cơ theo công thức phân tử.",
      "Trình bày được sự phân loại sơ bộ hợp chất hữu cơ gồm hydrocarbon và dẫn xuất của hydrocarbon.",
    ],
    requirements: ["Phân biệt được hợp chất hữu cơ và vô cơ."],
    knowledge: [
      {
        kind: "text",
        title: "1. Khái niệm hợp chất hữu cơ và hoá học hữu cơ",
        body:
          "Hợp chất của carbon là hợp chất hữu cơ, trừ carbon monoxide, carbon dioxide, các muối carbonate,...\n" +
          "Ngành khoa học chuyên nghiên cứu về các hợp chất hữu cơ là một chuyên ngành của ngành Hoá học, được đặt tên là chuyên ngành Hoá học hữu cơ.\n" +
          "Một số hợp chất hữu cơ phổ biến (Hình 22.1): butane C₄H₁₀ (một loại khí hoá lỏng, dùng làm nhiên liệu); ethylic alcohol C₂H₅OH (có trong thành phần của đồ uống có cồn); acetic acid CH₃COOH (có trong thành phần của các loại giấm); urea CO(NH₂)₂ (một loại phân đạm).\n" +
          "Em có biết: thuật ngữ “hoá học hữu cơ” được nhà hoá học người Thuỵ Điển Jacob Berzelius đưa ra lần đầu tiên vào năm 1806, khi ông nghiên cứu các hợp chất có nguồn gốc sinh vật. Tại thời điểm đó, các nhà khoa học vẫn cho rằng các hợp chất hữu cơ chỉ được hình thành trong cơ thể sinh vật nhờ “lực sống”. Đến năm 1828, khi nhà hoá học người Đức Friedrich Wöhler tổng hợp được hợp chất hữu cơ urea từ chất vô cơ thì thuật ngữ “hoá học hữu cơ” bắt đầu được hiểu như cách hiểu hiện nay.",
      },
      {
        kind: "text",
        title: "2. Công thức phân tử và công thức cấu tạo",
        body:
          "Để hiểu rõ mối liên hệ giữa cấu tạo và tính chất của mỗi chất hữu cơ, không chỉ cần quan tâm đến công thức phân tử của chất mà còn cần quan tâm cả đến công thức cấu tạo của chất đó.\n" +
          "• Công thức phân tử là công thức cho biết thành phần nguyên tố và số lượng nguyên tử của mỗi nguyên tố trong phân tử.\n" +
          "• Công thức cấu tạo là công thức cho biết trật tự liên kết và cách thức liên kết giữa các nguyên tử trong phân tử.\n" +
          "Trong công thức cấu tạo, liên kết cộng hoá trị giữa hai nguyên tử bằng một cặp electron dùng chung được gọi là liên kết đơn, biểu diễn bằng một gạch nối (–); còn liên kết cộng hoá trị giữa hai nguyên tử bằng hai cặp electron dùng chung gọi là liên kết đôi, biểu diễn bằng hai gạch nối (=).\n" +
          "Công thức cấu tạo còn được viết dưới dạng thu gọn bằng cách viết gộp nguyên tử hydrogen vào nguyên tử liên kết với nó thành từng nhóm.\n" +
          "Ví dụ: C₂H₆ có công thức cấu tạo thu gọn CH₃–CH₃; C₂H₄ có công thức cấu tạo thu gọn CH₂=CH₂.",
      },
      {
        kind: "text",
        title: "3. Đặc điểm cấu tạo hợp chất hữu cơ",
        body:
          "Thành phần phân tử hợp chất hữu cơ nhất thiết phải chứa nguyên tố carbon, thường có các nguyên tố như hydrogen, oxygen, nitrogen, chlorine, sulfur,... Có thể nhận thấy rằng các hợp chất hữu cơ được tạo thành chủ yếu từ các nguyên tố phi kim, vì vậy liên kết hoá học chủ yếu trong các hợp chất này là liên kết cộng hoá trị.\n" +
          "Trong phân tử hợp chất hữu cơ, carbon luôn có hoá trị IV; các nguyên tử carbon không chỉ có khả năng liên kết với nguyên tử của nguyên tố khác mà còn có thể liên kết với nhau tạo thành mạch carbon (Hình 22.3): mạch hở không phân nhánh, mạch hở phân nhánh, mạch vòng. Điều này dẫn đến hệ quả là có rất nhiều chất hữu cơ khác nhau nhưng lại có cùng công thức phân tử.\n" +
          "Tính chất của hợp chất hữu cơ phụ thuộc đồng thời vào thành phần phân tử và cấu tạo hoá học của chúng. Ví dụ (Bảng 22.1): methyl chloride CH₃Cl – chất khí, tan rất ít trong nước, không tác dụng với natri; ethylic alcohol C₂H₆O (CH₃–CH₂–OH) – chất lỏng, tan vô hạn trong nước, tác dụng với natri; dimethyl ether C₂H₆O (CH₃–O–CH₃) – chất khí, tan ít trong nước, không tác dụng với natri. Ethylic alcohol và dimethyl ether cùng công thức phân tử C₂H₆O nhưng cấu tạo khác nhau nên tính chất khác nhau.",
      },
      {
        kind: "text",
        title: "4. Phân loại hợp chất hữu cơ",
        body:
          "Có nhiều cơ sở khác nhau để phân loại hợp chất hữu cơ, trong đó phổ biến nhất là phân loại dựa trên thành phần nguyên tố. Trên cơ sở này hợp chất hữu cơ được chia làm hai loại:\n" +
          "• Hydrocarbon là loại hợp chất hữu cơ mà trong thành phần phân tử chỉ chứa các nguyên tố carbon và hydrogen.\n" +
          "• Dẫn xuất của hydrocarbon là loại hợp chất hữu cơ mà trong thành phần phân tử, ngoài nguyên tố carbon còn có nguyên tố khác như oxygen, nitrogen, chlorine,... và thường có hydrogen.",
      },
      {
        kind: "example",
        title: "Bài tập SGK",
        body:
          "• Sắp xếp các hợp chất C₆H₆, H₂SO₄, C₆H₁₂O₆, H₂CO₃, CaCO₃, KNO₃, C₂H₄, NaOH, Al₂O₃, CH₃Cl, CH₃OH thành hai nhóm. Nhóm hợp chất hữu cơ: C₆H₆, C₆H₁₂O₆, C₂H₄, CH₃Cl, CH₃OH. Nhóm hợp chất vô cơ: H₂SO₄, H₂CO₃, CaCO₃, KNO₃, NaOH, Al₂O₃ (H₂CO₃ và CaCO₃ thuộc loại ngoại lệ: carbonic acid, muối carbonate).\n" +
          "• Hydrocarbon: CH₄, CH₂=CH₂, CH₃CH₂CH₃, CH₃CH=CH₂; dẫn xuất của hydrocarbon: CH₃Cl, CH₃CH₂OH, CH₃COOH, CH₃NH₂, CH₃COOCH₂CH₃.",
      },
    ],
  },
  {
    lessonNumber: 23,
    summary: "Alkane là hydrocarbon mạch hở chỉ có liên kết đơn, công thức chung CₙH₂ₙ₊₂; alkane cháy toả nhiều nhiệt nên được dùng làm nhiên liệu.",
    objectives: [
      "Nêu được khái niệm hydrocarbon, alkane.",
      "Viết được công thức cấu tạo và gọi tên được một số alkane đơn giản và thông dụng (C1 – C4).",
      "Viết được phương trình hoá học phản ứng đốt cháy của butane.",
      "Tiến hành được (hoặc quan sát qua liệu điện tử) thí nghiệm đốt cháy butane từ đó rút ra được tính chất hoá học cơ bản của alkane.",
      "Trình bày được ứng dụng làm nhiên liệu của alkane trong thực tiễn.",
    ],
    requirements: [
      "Nêu được ứng dụng làm nhiên liệu của các alkane.",
      "Sử dụng nhiên liệu như gas, xăng, dầu hoả tiết kiệm, hiệu quả.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Khái niệm hydrocarbon, alkane",
        body:
          "Một số hydrocarbon thông dụng (Hình 23.1): methane (có trong khí bùn ao), propane (có trong bình gas), ethylene (có trong khí sinh ra từ một số loại quả chín).\n" +
          "Hydrocarbon là loại hợp chất hữu cơ mà thành phần phân tử chỉ chứa các nguyên tố carbon và hydrogen. Hydrocarbon gồm nhiều loại khác nhau, như alkane, alkene,...\n" +
          "Alkane là những hydrocarbon mạch hở, phân tử chỉ chứa các liên kết đơn.",
      },
      {
        kind: "text",
        title: "2. Cấu tạo phân tử và danh pháp của alkane (Bảng 23.1)",
        body:
          "• CH₄ – methane\n• C₂H₆: CH₃–CH₃ – ethane\n• C₃H₈: CH₃–CH₂–CH₃ – propane\n• C₄H₁₀: CH₃–CH₂–CH₂–CH₃ – butane\n" +
          "Trong công thức phân tử của alkane, khi tăng thêm một nguyên tử carbon thì số nguyên tử hydrogen tăng thêm 2. Thành phần phân tử của các alkane hơn kém nhau một hay nhiều nhóm CH₂.\n" +
          "Alkane có công thức chung là CₙH₂ₙ₊₂ (n ≥ 1, n là số nguyên, dương).",
      },
      {
        kind: "text",
        title: "Thí nghiệm: Tìm hiểu về phản ứng đốt cháy của butane (Hình 23.2)",
        body:
          "Chuẩn bị: bật lửa gas (chứa butane) loại dài; bình tam giác bằng thuỷ tinh chịu nhiệt, sạch và khô, có nút; ống nghiệm đựng dung dịch nước vôi trong.\n" +
          "Tiến hành: đưa đầu bật lửa vào miệng bình tam giác úp ngược, đánh lửa bật gas và giữ lửa cháy cho tới khi thấy thành bình tam giác mờ đi thì dừng lại. Quay xuống bình tam giác lại và đổ nước vôi trong vào. Sau đó, đậy bình bằng nút và lắc đều.\n" +
          "Kết quả: thành bình mờ đi do có hơi nước tạo thành; nước vôi trong vẩn đục do có carbon dioxide tạo thành. Sản phẩm của phản ứng đốt cháy butane là carbon dioxide và hơi nước.",
      },
      {
        kind: "text",
        title: "3. Phản ứng cháy của alkane",
        body:
          "Khi đốt cháy alkane trong không khí thu được sản phẩm chủ yếu là khí carbon dioxide và hơi nước:\n" +
          "C₃H₈ + 5O₂ →(t°) 3CO₂ + 4H₂O\n" +
          "C₄H₁₀ + 13/2 O₂ →(t°) 4CO₂ + 5H₂O\n" +
          "Phản ứng cháy của alkane toả nhiệt mạnh, vì vậy alkane được sử dụng làm nhiên liệu trong cuộc sống và trong sản xuất. Bên cạnh các sản phẩm trên, một phần alkane cháy không hoàn toàn tạo một lượng nhỏ sản phẩm là muội than (một dạng đơn chất của carbon) và carbon monoxide.\n" +
          "Các alkane khá bền ở điều kiện thường, chúng không phản ứng với acid, base và nhiều chất khác.\n" +
          "Mở rộng: công thức tổng quát CₙH₂ₙ₊₂ + (3n + 1)/2 O₂ →(t°) nCO₂ + (n + 1)H₂O.",
      },
      {
        kind: "text",
        title: "4. Ứng dụng làm nhiên liệu của alkane (Bảng 23.2)",
        body:
          "• Nhiên liệu khí hoá lỏng: propane và butane dễ hoá lỏng, được dùng làm nhiên liệu cho bật lửa, bếp gas,...\n" +
          "• Nhiên liệu lỏng: các alkane ở trạng thái lỏng có thể dùng làm nhiên liệu dưới dạng xăng, dầu hoả, dầu diesel và nhiên liệu phản lực (jet fuel).\n" +
          "• Nhiên liệu rắn: các alkane ở trạng thái rắn có thể dùng làm nhiên liệu dưới dạng nến paraffin.",
      },
      {
        kind: "example",
        title: "Bài tập SGK",
        body:
          "• Phương trình cháy: CH₄ + 2O₂ →(t°) CO₂ + 2H₂O;  2C₂H₆ + 7O₂ →(t°) 4CO₂ + 6H₂O.\n" +
          "• Nhiệt lượng toả ra khi đốt cháy hoàn toàn 1 gam alkane (Bảng): methane 891/16 ≈ 55,7 kJ; ethane 1 561/30 ≈ 52,0 kJ; propane 2 220/44 ≈ 50,5 kJ; butane 2 878/58 ≈ 49,6 kJ. Đốt cháy 1 gam methane toả ra nhiều nhiệt nhất.\n" +
          "• Khí gas là hỗn hợp propane và butane có tỉ lệ thể tích 1 : 1 (tức tỉ lệ mol 1 : 1): 1 mol propane (44 g) và 1 mol butane (58 g) toả 2 220 + 2 878 = 5 098 kJ; đốt 1 kg khí gas toả ra khoảng 5 098/0,102 ≈ 5,0·10⁴ kJ.",
      },
    ],
  },
  {
    lessonNumber: 24,
    summary: "Alkene là hydrocarbon mạch hở có một liên kết đôi C=C, công thức chung CₙH₂ₙ; ethylene cháy, cộng với bromine và trùng hợp thành polyethylene.",
    objectives: [
      "Nêu được khái niệm alkene.",
      "Viết được công thức cấu tạo và nêu được tính chất vật lí của ethylene.",
      "Trình bày được tính chất hoá học của ethylene (phản ứng cháy, phản ứng làm mất màu nước bromine, phản ứng trùng hợp). Viết được các phương trình hoá học xảy ra.",
      "Tiến hành được thí nghiệm (hoặc quan sát thí nghiệm) của ethylene: phản ứng đốt cháy, phản ứng làm mất màu nước bromine, quan sát và giải thích được tính chất hoá học cơ bản của alkene.",
      "Trình bày được một số ứng dụng của ethylene: tổng hợp ethylic alcohol, tổng hợp nhựa polyethylene (PE).",
    ],
    requirements: [
      "Nhận biết và lựa chọn được các sản phẩm làm từ nguyên liệu polyethylene và sử dụng chúng đúng cách để bảo vệ môi trường.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Khái niệm alkene",
        body:
          "Cho công thức cấu tạo của một số alkene: CH₂=CH₂; CH₃–CH=CH₂; CH₃–CH=CH–CH₃. Điểm chung: phân tử có một liên kết đôi C=C.\n" +
          "Alkene là những hydrocarbon mạch hở, trong phân tử có một liên kết đôi C=C. Công thức chung của các alkene có dạng CₙH₂ₙ (với n ≥ 2, n là các số nguyên, dương).",
      },
      {
        kind: "text",
        title: "2. Ethylene: tính chất vật lí và cấu tạo phân tử",
        body:
          "Tính chất vật lí: ethylene là chất khí ở điều kiện thường (hoá lỏng ở −104 °C và hoá rắn ở −169 °C), không màu, hầu như không tan trong nước, tan ít trong các dung môi hữu cơ như ethylic alcohol.\n" +
          "Cấu tạo phân tử: công thức phân tử của ethylene là C₂H₄; công thức cấu tạo là CH₂=CH₂. Phân tử ethylene có liên kết đôi C=C, trong đó có một liên kết kém bền, dễ bị phá vỡ trong các phản ứng hoá học.",
      },
      {
        kind: "text",
        title: "Thí nghiệm: Điều chế và thử tính chất của ethylene (Hình 24.1)",
        body:
          "Chuẩn bị: bình cầu có nhánh 250 mL đựng dung dịch cồn 96° và dung dịch H₂SO₄ đặc đã được trộn đều, đá bọt; ống nghiệm chứa khoảng 2 mL nước bromine; bình thuỷ tinh chứa dung dịch NaOH; ống dẫn thuỷ tinh đầu vuốt nhọn; ống dẫn thuỷ tinh hình chữ L.\n" +
          "Tiến hành: đun nóng bình cầu đến khi khí ethylene sinh ra và đi vào ống dẫn thuỷ tinh có đầu vuốt nhọn. Dùng que đóm đang cháy để đốt ethylene ở đầu vuốt nhọn của ống dẫn. Thay ống dẫn thuỷ tinh đầu vuốt nhọn bằng ống dẫn thuỷ tinh hình chữ L và dẫn khí ethylene vào ống nghiệm đựng nước bromine.\n" +
          "Kết quả: ở đầu ống dẫn vuốt nhọn, ethylene cháy được, toả nhiệt; ở ống nghiệm đựng nước bromine, nước bromine mất màu (màu vàng cam nhạt dần rồi mất màu). Nhận xét: ethylene có phản ứng cháy và phản ứng với nước bromine.",
      },
      {
        kind: "text",
        title: "3. Tính chất hoá học của ethylene",
        body:
          "a) Phản ứng cháy: tương tự alkane, phản ứng đốt cháy alkene tạo ra sản phẩm chủ yếu là khí carbon dioxide và hơi nước. Phản ứng toả ra nhiều nhiệt:\n" +
          "C₂H₄ + 3O₂ →(t°) 2CO₂ + 2H₂O\n" +
          "b) Phản ứng cộng: khi ethylene phản ứng với nước bromine, phân tử bromine đã cộng hợp vào nối đôi C=C trong phân tử ethylene, liên kết kém bền trong liên kết đôi bị phá vỡ, tạo thành sản phẩm 1,2-dibromoethane:\n" +
          "CH₂=CH₂ + Br–Br → CH₂Br–CH₂Br   (viết gọn: C₂H₄ + Br₂ → C₂H₄Br₂)\n" +
          "Phản ứng trên gọi là phản ứng cộng.\n" +
          "c) Phản ứng trùng hợp: ở điều kiện thích hợp, các phân tử ethylene cộng hợp liên tiếp với nhau, liên kết kém bền trong liên kết đôi bị phá vỡ, tạo thành chất có khối lượng phân tử lớn:\n" +
          "nCH₂=CH₂ →(t°, p, xúc tác) (–CH₂–CH₂–)ₙ    (ethylene → polyethylene)\n" +
          "Phản ứng trên gọi là phản ứng trùng hợp. Polyethylene (nhựa PE) là chất rắn, không tan trong nước, không độc, được dùng để sản xuất túi đựng, màng bọc, chai, bình chứa,... Tuy nhiên, nhựa PE rất khó phân huỷ sinh học, có thể tồn tại bền trong môi trường hàng trăm năm, vì vậy cần giảm thiểu việc thải các sản phẩm làm từ nhựa PE ra ngoài môi trường.",
      },
      {
        kind: "text",
        title: "4. Ứng dụng của ethylene (Hình 24.2)",
        body:
          "Ethylene là nguyên liệu quan trọng cho ngành công nghiệp sản xuất hoá chất và tổng hợp polymer: tổng hợp ethylic alcohol; tổng hợp acetic acid; sản xuất dung môi; kích thích quả mau chín; sản xuất polyethylene (PE), poly(vinyl chloride) (PVC).",
      },
      {
        kind: "example",
        title: "Câu hỏi SGK",
        body:
          "Propylene là một alkene, có công thức cấu tạo CH₃–CH=CH₂. Propylene có tính chất hoá học tương tự ethylene vì có liên kết đôi C=C trong phân tử.\n" +
          "• Cháy: 2C₃H₆ + 9O₂ →(t°) 6CO₂ + 6H₂O\n" +
          "• Cộng bromine: CH₃–CH=CH₂ + Br₂ → CH₃–CHBr–CH₂Br\n" +
          "• Trùng hợp: nCH₃–CH=CH₂ →(t°, p, xúc tác) (–CH₂–CH(CH₃)–)ₙ (polypropylene, PP).",
      },
    ],
  },
  {
    lessonNumber: 25,
    summary: "Dầu mỏ, khí mỏ dầu và khí thiên nhiên là nhiên liệu hoá thạch có thành phần chính là hydrocarbon; nhiên liệu là chất cháy được, toả nhiệt và phát sáng, cần sử dụng an toàn, tiết kiệm.",
    objectives: [
      "Nêu được khái niệm, thành phần, trạng thái tự nhiên của dầu mỏ, khí thiên nhiên và khí mỏ dầu.",
      "Trình bày được phương pháp khai thác dầu mỏ, khí thiên nhiên và khí mỏ dầu; một số sản phẩm chế biến từ dầu mỏ; ứng dụng của dầu mỏ và khí thiên nhiên (là nguồn nhiên liệu và nguyên liệu quý trong công nghiệp).",
      "Nêu được khái niệm về nhiên liệu, các dạng nhiên liệu phổ biến (rắn, lỏng, khí).",
      "Trình bày được cách sử dụng nhiên liệu (gas, dầu hoả, than,...), từ đó có cách ứng xử thích hợp đối với việc sử dụng nhiên liệu trong cuộc sống.",
    ],
    requirements: ["Sử dụng các loại nhiên liệu một cách tiết kiệm, hiệu quả, an toàn."],
    knowledge: [
      {
        kind: "text",
        title: "1. Dầu mỏ, khí mỏ dầu và khí thiên nhiên: khái niệm, thành phần, trạng thái tự nhiên",
        body:
          "Dầu mỏ là nhiên liệu hoá thạch, có trong vỏ Trái Đất. Thành phần chính của dầu mỏ là các hydrocarbon. Thành phần dầu mỏ có thể khác nhau tuỳ thuộc vào vị trí mỏ dầu.\n" +
          "Trong tự nhiên, dầu mỏ thường tập trung thành những khu vực ở trong lòng đất, gọi là các mỏ dầu. Mỏ dầu thường có ba lớp (Hình 25.1):\n" +
          "• Lớp trên cùng là khí mỏ dầu (hay còn gọi là khí đồng hành). Khí mỏ dầu chứa chủ yếu là khí methane (khoảng 75%) và một số hydrocarbon khí khác.\n" +
          "• Lớp dầu lỏng có hoà tan khí và hỗn hợp phức tạp của nhiều loại hydrocarbon và một lượng nhỏ các hợp chất khác.\n" +
          "• Dưới đáy mỏ dầu là một lớp nước mặn.\n" +
          "Khí thiên nhiên cũng là nhiên liệu hoá thạch ở dưới lòng đất. Trong tự nhiên, khí thiên nhiên tập trung trong các mỏ khí dưới lòng đất hay rải rác thoát ra từ lớp bùn ở đáy ao. Thành phần chính của khí thiên nhiên là methane (khoảng 95%) và một số hydrocarbon khác như ethane, propane và butane. Trong khí thiên nhiên cũng có một lượng nhỏ carbon dioxide và nitrogen,...",
      },
      {
        kind: "text",
        title: "2. Phương pháp khai thác và chế biến",
        body:
          "a) Dầu mỏ và khí mỏ dầu: khai thác dầu mỏ và khí mỏ dầu gồm nhiều giai đoạn: khoan, thu dầu và khí; loại bỏ tạp chất để thu dầu thô, vận chuyển đến nhà máy lọc dầu (bằng ống dẫn hoặc tàu chở dầu); tại nhà máy lọc dầu, dầu thô được xử lí chủ yếu bằng phương pháp chưng cất để thu được nhiều loại sản phẩm khác nhau ở các khoảng nhiệt độ khác nhau. Sau đó, dầu và khí sẽ được vận chuyển đến cơ sở sử dụng với các mục đích khác nhau (Bảng 25.1).\n" +
          "Ứng dụng của các sản phẩm chưng cất dầu mỏ (Bảng 25.1): khí hoá lỏng – nhiên liệu (sưởi ấm, bếp gas); dầu nhẹ – dung môi; naphtha nhẹ – dung môi; xăng – nhiên liệu cho động cơ đốt trong (xe máy, ô tô,...); dầu hoả – nhiên liệu cho động cơ phản lực; dầu diesel – nhiên liệu cho động cơ diesel và các lò nung; dầu bôi trơn – chất bôi trơn; sáp paraffin – sáp bóng, sáp dầu khoáng; nhựa đường – bề mặt đường, giấy dầu lợp mái.\n" +
          "b) Khí thiên nhiên: được khai thác bằng cách khoan xuống mỏ khí và khí sẽ tự phun lên do áp suất ở các mỏ khí lớn hơn áp suất khí quyển. Sau đó, khí được vận chuyển đến nhà máy để xử lí nhằm đạt được chất lượng mong muốn trước khi phân phối đến các điểm tiêu thụ khác nhau.",
      },
      {
        kind: "text",
        title: "3. Nhiên liệu: khái niệm và phân loại",
        body:
          "Nhiên liệu là những chất cháy được, khi cháy toả nhiệt và phát sáng. Nhiên liệu được phân loại dựa trên một số cơ sở khác nhau.\n" +
          "Dựa trên trạng thái tồn tại, nhiên liệu được phân loại thành nhiên liệu rắn (như gỗ, than mỏ), nhiên liệu lỏng (như xăng, dầu diesel, ethanol) và nhiên liệu khí (như hydrogen, methane, propane hay butane).",
      },
      {
        kind: "text",
        title: "4. Sử dụng nhiên liệu",
        body:
          "Trong cuộc sống hằng ngày, các nhiên liệu như xăng, dầu hoả, gas hay than đáp ứng nhiều nhu cầu sử dụng của con người. Xe máy, ô tô và máy bay dùng nhiên liệu xăng và dầu hoả. Ở nhiều nơi trên thế giới, gas là nguồn nhiên liệu chính để sưởi ấm, nấu ăn, vận hành các thiết bị máy. Than là nhiên liệu quan trọng cho các nhà máy nhiệt điện, công nghiệp luyện kim.\n" +
          "Lựa chọn nhiên liệu phù hợp và sử dụng nhiên liệu một cách tiết kiệm, hiệu quả không chỉ mang lại nhiều lợi ích kinh tế mà còn góp phần bảo vệ môi trường. Vì vậy, cần tắt thiết bị khi không sử dụng, ưu tiên tham gia giao thông bằng phương tiện công cộng, bảo dưỡng xe thường xuyên để đảm bảo động cơ xe hoạt động hiệu quả và tiết kiệm nhiên liệu,...\n" +
          "Nhiên liệu là các chất dễ cháy, vì vậy việc sử dụng và lưu trữ nhiên liệu cần tuân thủ nghiêm ngặt các nguyên tắc về an toàn cháy nổ và hướng dẫn của nhà sản xuất. Xăng phải được bảo quản trong bình chứa đúng tiêu chuẩn. Bình gas cần được đặt nơi thông thoáng và cách xa nguồn nhiệt, đồng thời chúng ta nên thường xuyên kiểm tra để tránh rò rỉ. Không đốt cháy than, gas,... trong không gian kín, tránh nguy cơ ngộ độc khí.",
      },
      {
        kind: "text",
        title: "Em đã học",
        body:
          "Dầu mỏ, khí mỏ dầu và khí thiên nhiên là nhiên liệu hoá thạch dưới bề mặt Trái Đất. Dầu mỏ gồm hỗn hợp của các hydrocarbon và hợp chất khác. Khí thiên nhiên có thành phần chính là methane (khoảng 95%) và ethane, propane, butane,... Phương pháp khai thác và chế biến: khoan, thu khí và dầu từ mỏ dầu, chưng cất dầu mỏ để thu được các sản phẩm khác nhau; khoan xuống mỏ khí thiên nhiên và thu khí. Nhiên liệu là những chất cháy được, khi cháy toả nhiệt và phát sáng. Nhiên liệu là các chất dễ cháy nên khi sử dụng cần tuân thủ nghiêm ngặt các biện pháp phòng cháy và chữa cháy. Trữ lượng nhiên liệu hoá thạch có hạn và việc sử dụng loại nhiên liệu này gây ô nhiễm môi trường, nên cần sử dụng tiết kiệm và hiệu quả.",
      },
    ],
  },
];
