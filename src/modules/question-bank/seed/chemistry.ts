import type { Level, LessonQuestions, SeedMultipleChoice, SeedShortAnswer, SeedTrueFalse, TFItem } from "./types";

/**
 * Câu hỏi mẫu Hoá học 9 (Bài 18 – 35), bám theo nội dung SGK KHTN 9 – Kết nối tri thức.
 * Mỗi bài: 3 câu trắc nghiệm, 1 câu đúng – sai (4 ý), thêm 1 câu trả lời ngắn ở các bài có thể tính toán / đếm.
 * Khối lượng nguyên tử dùng: H = 1; C = 12; O = 16; Na = 23; Zn = 65; Ag = 108; Ca = 40; Fe = 56. Thể tích mol khí ở điều kiện chuẩn: 24,79 L/mol.
 */
const mc = (code: string, level: Level, content: string, options: [string, string, string, string], correct: "A" | "B" | "C" | "D", explanation: string, formula?: string): SeedMultipleChoice => ({
  code, level, content, options, correct, explanation, ...(formula ? { formula } : {}), type: "multiple_choice",
});
const tf = (code: string, level: Level, content: string, items: [TFItem, TFItem, TFItem, TFItem], explanation: string): SeedTrueFalse => ({
  code, level, content, items, explanation, type: "true_false",
});
const it = (content: string, isTrue: boolean, explanation: string): TFItem => ({ content, isTrue, explanation });
const sa = (code: string, level: Level, content: string, answerNumber: number, tolerance: number, unit: string, explanation: string, formula?: string): SeedShortAnswer => ({
  code, level, content, answerNumber, tolerance, unit, explanation, ...(formula ? { formula } : {}), type: "short_answer",
});

export const QUESTIONS_HOA: LessonQuestions[] = [
  {
    lessonNumber: 18,
    questions: [
      mc("B18-01", "biet", "Kim loại dẫn điện tốt nhất là", ["đồng (copper)", "bạc (silver)", "vàng (gold)", "nhôm (aluminium)"], "B", "Theo SGK, bạc là kim loại dẫn điện tốt nhất (và dẫn nhiệt tốt nhất)."),
      mc("B18-02", "hieu", "Cho đinh sắt vào dung dịch copper(II) sulfate, hiện tượng quan sát được là", ["có kết tủa trắng xuất hiện", "không có hiện tượng gì", "có khí không màu thoát ra", "có lớp kim loại màu đỏ bám vào đinh sắt, màu xanh của dung dịch nhạt dần"], "D", "Sắt đẩy đồng ra khỏi muối: Fe + CuSO₄ → FeSO₄ + Cu.", "Fe + CuSO₄ → FeSO₄ + Cu"),
      mc("B18-03", "hieu", "Kim loại nào sau đây tác dụng với nước ở nhiệt độ thường?", ["Fe", "Cu", "Na", "Ag"], "C", "Na, K, Ca,... là kim loại hoạt động hoá học mạnh, tác dụng với nước ở nhiệt độ thường: 2Na + 2H₂O → 2NaOH + H₂."),
      tf("B18-04", "van_dung", "Cho các nhận định về tính chất hoá học của kim loại.", [
        it("Hầu hết kim loại tác dụng với khí oxygen tạo thành oxide kim loại.", true, "Ví dụ 3Fe + 2O₂ → Fe₃O₄; 4Al + 3O₂ → 2Al₂O₃."),
        it("Vàng tác dụng với khí oxygen ở nhiệt độ thường tạo lớp oxide bảo vệ.", false, "Vàng không phản ứng với khí oxygen."),
        it("Sắt tác dụng với dung dịch HCl tạo iron(II) chloride và khí hydrogen.", true, "Fe + 2HCl → FeCl₂ + H₂."),
        it("Đồng tác dụng với dung dịch HCl giải phóng khí hydrogen.", false, "Cu, Ag, Au không tác dụng với dung dịch HCl."),
      ], "Dựa vào tính chất hoá học của kim loại (Bài 18)."),
      sa("B18-05", "van_dung", "Cho 6,5 g kẽm (Zn = 65) tác dụng hết với dung dịch HCl dư. Thể tích khí hydrogen thu được ở điều kiện chuẩn (24,79 L/mol) là bao nhiêu lít? (làm tròn đến hai chữ số thập phân)", 2.48, 0.01, "L", "Zn + 2HCl → ZnCl₂ + H₂; n(Zn) = 6,5/65 = 0,1 mol → n(H₂) = 0,1 mol → V = 0,1·24,79 ≈ 2,48 L.", "V = n·24,79"),
    ],
  },
  {
    lessonNumber: 19,
    questions: [
      mc("B19-01", "biet", "Dãy hoạt động hoá học của kim loại (theo chiều giảm dần mức độ hoạt động) là", ["K, Na, Mg, Ca, Al, Zn, Fe, Pb, H, Cu, Ag, Au", "K, Na, Ca, Mg, Al, Zn, Fe, Pb, H, Cu, Ag, Au", "K, Na, Ca, Al, Mg, Zn, Fe, Pb, H, Cu, Ag, Au", "K, Na, Ca, Mg, Al, Zn, Pb, Fe, H, Cu, Ag, Au"], "B", "Dãy hoạt động hoá học theo SGK: K, Na, Ca, Mg, Al, Zn, Fe, Pb, H, Cu, Ag, Au."),
      mc("B19-02", "hieu", "Kim loại nào sau đây không tác dụng với dung dịch HCl?", ["Zn", "Mg", "Cu", "Fe"], "C", "Cu đứng sau H trong dãy hoạt động nên không tác dụng với dung dịch HCl."),
      mc("B19-03", "hieu", "Nhúng dây đồng vào dung dịch AgNO₃, hiện tượng quan sát được là", ["không có hiện tượng gì vì Cu đứng sau Ag", "dây đồng tan hết, dung dịch không đổi màu", "có khí không màu thoát ra", "có lớp kim loại màu trắng bạc bám vào dây đồng, dung dịch chuyển dần sang màu xanh"], "D", "Cu đứng trước Ag nên đẩy Ag ra khỏi muối: Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag.", "Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag"),
      tf("B19-04", "van_dung", "Cho các nhận định về ý nghĩa của dãy hoạt động hoá học.", [
        it("K, Na, Ca tác dụng với nước ở điều kiện thường giải phóng khí hydrogen.", true, "Đó là các kim loại hoạt động hoá học mạnh."),
        it("Kim loại đứng trước H tác dụng với dung dịch H₂SO₄ loãng giải phóng khí hydrogen.", true, "Ví dụ Mg, Zn, Fe."),
        it("Ag đẩy được Cu ra khỏi dung dịch CuSO₄.", false, "Ag đứng sau Cu nên không đẩy được Cu."),
        it("Zn đẩy được Ag ra khỏi dung dịch AgNO₃.", true, "Zn đứng trước Ag: Zn + 2AgNO₃ → Zn(NO₃)₂ + 2Ag."),
      ], "Dãy hoạt động hoá học cho biết khả năng phản ứng của kim loại."),
      sa("B19-05", "hieu", "Trong dãy hoạt động hoá học (K, Na, Ca, Mg, Al, Zn, Fe, Pb, H, Cu, Ag, Au) có bao nhiêu kim loại đứng trước H?", 8, 0, "kim loại", "Các kim loại đứng trước H: K, Na, Ca, Mg, Al, Zn, Fe, Pb (8 kim loại); H không phải kim loại."),
    ],
  },
  {
    lessonNumber: 20,
    questions: [
      mc("B20-01", "biet", "Phương pháp thường dùng để tách các kim loại hoạt động hoá học mạnh như Na, Ca, Mg, Al là", ["nhiệt luyện", "thuỷ luyện", "điện phân nóng chảy", "nghiền quặng"], "C", "Kim loại hoạt động hoá học mạnh được tách bằng phương pháp điện phân nóng chảy."),
      mc("B20-02", "hieu", "Thép là hợp kim của sắt với carbon và một số nguyên tố khác, trong đó carbon chiếm hàm lượng", ["dưới 2%", "từ 2% đến 5%", "trên 5%", "đúng 10%"], "A", "Theo SGK, carbon chiếm từ 2% đến 5% trong gang và dưới 2% trong thép."),
      mc("B20-03", "hieu", "Trong lò luyện gang, sắt được tách ra khỏi iron(III) oxide bởi carbon monoxide theo phản ứng", ["Fe₂O₃ + 3CO → 2Fe + 3CO₂ (nhiệt độ cao)", "Fe₂O₃ + CO → 2Fe + CO₂", "2Fe + 3CO₂ → Fe₂O₃ + 3CO", "FeO + C → Fe + CO₂"], "A", "Phương trình đã cân bằng: Fe₂O₃ + 3CO →(t°) 2Fe + 3CO₂.", "Fe₂O₃ + 3CO → 2Fe + 3CO₂"),
      tf("B20-04", "van_dung", "Cho các nhận định về tách kim loại và hợp kim.", [
        it("Cryolite được thêm vào để hạ nhiệt độ nóng chảy của aluminium oxide.", true, "Nhằm tiết kiệm năng lượng khi điện phân."),
        it("Inox là hợp kim của nhôm với đồng.", false, "Inox là thép đặc biệt, ngoài sắt và carbon còn có chromium, nickel."),
        it("Đuy-ra có kim loại cơ bản là nhôm.", true, "Đuy-ra là hợp kim của nhôm với đồng, manganese, magnesium,..."),
        it("Gang có hàm lượng carbon thấp hơn thép.", false, "Gang có 2% – 5% carbon, thép dưới 2%."),
      ], "Dựa vào nội dung Bài 20."),
      sa("B20-05", "van_dung", "Khử hoàn toàn 16 g iron(III) oxide (Fe₂O₃ = 160) bằng khí CO dư ở nhiệt độ cao. Khối lượng sắt (Fe = 56) thu được là bao nhiêu gam?", 11.2, 0.05, "g", "Fe₂O₃ + 3CO → 2Fe + 3CO₂; n(Fe₂O₃) = 16/160 = 0,1 mol → n(Fe) = 0,2 mol → m = 0,2·56 = 11,2 g."),
    ],
  },
  {
    lessonNumber: 21,
    questions: [
      mc("B21-01", "biet", "Dạng carbon nào được dùng làm đồ trang sức, mũi khoan, dao cắt kính?", ["than chì", "than hoạt tính", "kim cương", "than cốc"], "C", "Theo SGK, kim cương làm đồ trang sức, mũi khoan, dao cắt kính."),
      mc("B21-02", "hieu", "So với kim loại, phần lớn phi kim có", ["tính dẫn điện tốt hơn", "nhiệt độ nóng chảy, nhiệt độ sôi thấp hơn", "khối lượng riêng lớn hơn", "khả năng nhường electron mạnh hơn"], "B", "Phần lớn phi kim có nhiệt độ nóng chảy, nhiệt độ sôi và khối lượng riêng nhỏ hơn kim loại; thường không dẫn điện."),
      mc("B21-03", "hieu", "Trong phản ứng 2Na + Cl₂ → 2NaCl, phát biểu đúng là", ["Na nhận electron, Cl₂ nhường electron", "cả Na và Cl₂ đều nhường electron", "cả Na và Cl₂ đều nhận electron", "Na nhường electron, Cl₂ nhận electron"], "D", "Kim loại dễ nhường electron tạo ion dương (Na → Na⁺ + 1e); phi kim dễ nhận electron tạo ion âm (Cl + 1e → Cl⁻)."),
      tf("B21-04", "van_dung", "Cho các nhận định về phi kim.", [
        it("Than hoạt tính có tính hấp phụ nên dùng trong mặt nạ phòng độc.", true, "Than giữ lại các phân tử chất khí, chất màu trên bề mặt."),
        it("Silicon tinh khiết là chất bán dẫn.", true, "Theo SGK Bài 21."),
        it("Phần lớn phi kim có khối lượng riêng lớn hơn kim loại.", false, "Phần lớn phi kim có khối lượng riêng nhỏ hơn kim loại."),
        it("Bromine là phi kim ở thể lỏng ở nhiệt độ thường.", true, "Phi kim có thể thể khí, thể lỏng (bromine) hoặc thể rắn."),
      ], "Dựa vào nội dung Bài 21."),
    ],
  },
  {
    lessonNumber: 22,
    questions: [
      mc("B22-01", "biet", "Hợp chất nào sau đây là hợp chất hữu cơ?", ["CO₂", "CaCO₃", "CO", "C₂H₅OH"], "D", "Hợp chất của carbon là hợp chất hữu cơ, trừ CO, CO₂, các muối carbonate,..."),
      mc("B22-02", "hieu", "Công thức cấu tạo của một chất cho biết", ["thành phần nguyên tố và số nguyên tử của mỗi nguyên tố", "tính chất vật lí của chất", "khối lượng phân tử của chất", "trật tự liên kết và cách thức liên kết giữa các nguyên tử trong phân tử"], "D", "Công thức phân tử cho biết thành phần; công thức cấu tạo cho biết trật tự và cách thức liên kết."),
      mc("B22-03", "hieu", "Trong phân tử hợp chất hữu cơ, nguyên tử carbon luôn có hoá trị", ["II", "III", "IV", "VI"], "C", "Theo SGK, carbon luôn có hoá trị IV."),
      tf("B22-04", "van_dung", "Cho các nhận định về hợp chất hữu cơ.", [
        it("Ethylic alcohol và dimethyl ether có cùng công thức phân tử C₂H₆O.", true, "Hai chất có cấu tạo khác nhau (CH₃–CH₂–OH và CH₃–O–CH₃)."),
        it("Hai chất có cùng công thức phân tử thì có tính chất hoá học giống nhau.", false, "Tính chất phụ thuộc vào cấu tạo: ethylic alcohol tác dụng với natri, dimethyl ether thì không."),
        it("Hydrocarbon là hợp chất hữu cơ chỉ chứa carbon và hydrogen.", true, "Định nghĩa hydrocarbon."),
        it("Liên kết hoá học chủ yếu trong hợp chất hữu cơ là liên kết ion.", false, "Chủ yếu là liên kết cộng hoá trị."),
      ], "Dựa vào nội dung Bài 22."),
      sa("B22-05", "hieu", "Trong các chất sau có bao nhiêu hợp chất hữu cơ: CH₄, CO₂, C₂H₆O, CaCO₃, C₆H₆, CO, C₂H₄?", 4, 0, "chất", "Hợp chất hữu cơ: CH₄, C₂H₆O, C₆H₆, C₂H₄. CO₂, CaCO₃, CO là hợp chất vô cơ (ngoại lệ)."),
    ],
  },
  {
    lessonNumber: 23,
    questions: [
      mc("B23-01", "biet", "Alkane là hydrocarbon mạch hở, trong phân tử chỉ chứa", ["liên kết đôi", "liên kết đơn", "liên kết ba", "một vòng carbon"], "B", "Alkane là hydrocarbon mạch hở chỉ chứa liên kết đơn."),
      mc("B23-02", "hieu", "Công thức chung của alkane là", ["CₙH₂ₙ", "CₙH₂ₙ₋₂", "CₙH₂ₙ₊₂", "CₙHₙ"], "C", "Alkane có công thức chung CₙH₂ₙ₊₂ (n ≥ 1).", "CₙH₂ₙ₊₂"),
      mc("B23-03", "hieu", "Sản phẩm chủ yếu khi đốt cháy hoàn toàn alkane trong không khí là", ["CO và H₂", "CO₂ và H₂", "C và H₂O", "CO₂ và H₂O"], "D", "Alkane cháy tạo carbon dioxide và hơi nước, toả nhiệt mạnh."),
      tf("B23-04", "van_dung", "Cho các nhận định về alkane.", [
        it("CH₃–CH₂–CH₃ là propane.", true, "Bảng 23.1: C₃H₈ – propane."),
        it("C₄H₁₀ là công thức phân tử của butane.", true, "Bảng 23.1."),
        it("Alkane phản ứng mạnh với acid và base ở điều kiện thường.", false, "Alkane khá bền, không phản ứng với acid, base và nhiều chất khác."),
        it("Đốt cháy 1 gam methane toả nhiều nhiệt hơn đốt cháy 1 gam butane.", true, "891/16 ≈ 55,7 kJ/g so với 2 878/58 ≈ 49,6 kJ/g."),
      ], "Dựa vào nội dung Bài 23."),
      sa("B23-05", "van_dung", "Một alkane có 6 nguyên tử carbon trong phân tử. Phân tử alkane đó có bao nhiêu nguyên tử hydrogen?", 14, 0, "nguyên tử", "Công thức chung CₙH₂ₙ₊₂ với n = 6 → 2·6 + 2 = 14.", "CₙH₂ₙ₊₂"),
    ],
  },
  {
    lessonNumber: 24,
    questions: [
      mc("B24-01", "biet", "Alkene là hydrocarbon mạch hở, trong phân tử có", ["một liên kết đôi C=C", "một liên kết ba", "chỉ liên kết đơn", "hai liên kết đôi"], "A", "Alkene có một liên kết đôi C=C, công thức chung CₙH₂ₙ (n ≥ 2)."),
      mc("B24-02", "hieu", "Chất nào sau đây làm mất màu nước bromine?", ["CH₄", "C₂H₆", "C₂H₄", "C₃H₈"], "C", "Ethylene C₂H₄ có liên kết đôi, cộng với bromine: C₂H₄ + Br₂ → C₂H₄Br₂."),
      mc("B24-03", "hieu", "Phản ứng trùng hợp ethylene tạo ra", ["polyethylene (PE)", "polypropylene (PP)", "ethylic alcohol", "acetic acid"], "A", "nCH₂=CH₂ → (–CH₂–CH₂–)ₙ."),
      tf("B24-04", "van_dung", "Cho các nhận định về ethylene.", [
        it("Công thức chung của alkene là CₙH₂ₙ (n ≥ 2).", true, "Theo SGK."),
        it("Ethylene tan tốt trong nước.", false, "Ethylene hầu như không tan trong nước."),
        it("Phản ứng của ethylene với nước bromine là phản ứng cộng.", true, "Liên kết kém bền trong liên kết đôi bị phá vỡ."),
        it("Nhựa PE rất dễ phân huỷ sinh học.", false, "Nhựa PE rất khó phân huỷ sinh học, tồn tại hàng trăm năm."),
      ], "Dựa vào nội dung Bài 24."),
      sa("B24-05", "van_dung", "Một alkene (công thức CₙH₂ₙ) có phân tử khối bằng 56 (C = 12, H = 1). Phân tử alkene đó có bao nhiêu nguyên tử carbon?", 4, 0, "nguyên tử", "M = 12n + 2n = 14n = 56 → n = 4 (C₄H₈).", "M = 14n"),
    ],
  },
  {
    lessonNumber: 25,
    questions: [
      mc("B25-01", "biet", "Thành phần chính của khí thiên nhiên là", ["ethane", "propane", "methane", "butane"], "C", "Khí thiên nhiên có thành phần chính là methane (khoảng 95%)."),
      mc("B25-02", "hieu", "Sản phẩm chưng cất dầu mỏ nào dùng làm nhiên liệu cho động cơ đốt trong (xe máy, ô tô)?", ["xăng", "nhựa đường", "sáp paraffin", "dầu bôi trơn"], "A", "Bảng 25.1: xăng là nhiên liệu cho động cơ đốt trong."),
      mc("B25-03", "hieu", "Nhiên liệu nào sau đây là nhiên liệu rắn?", ["xăng", "than mỏ", "methane", "ethanol"], "B", "Theo trạng thái: rắn (gỗ, than mỏ), lỏng (xăng, diesel, ethanol), khí (hydrogen, methane,...)."),
      tf("B25-04", "van_dung", "Cho các nhận định về dầu mỏ và nhiên liệu.", [
        it("Mỏ dầu thường có ba lớp: khí, dầu lỏng và nước mặn.", true, "Hình 25.1."),
        it("Khí mỏ dầu chứa chủ yếu methane.", true, "Khoảng 75% methane."),
        it("Xăng là nhiên liệu khí.", false, "Xăng là nhiên liệu lỏng."),
        it("Không nên đốt than, gas trong không gian kín vì nguy cơ ngộ độc khí.", true, "Theo SGK Bài 25."),
      ], "Dựa vào nội dung Bài 25."),
      sa("B25-05", "van_dung", "Xăng E5 chứa 5% ethylic alcohol về thể tích. Trong 20 lít xăng E5 có bao nhiêu lít ethylic alcohol?", 1, 0.01, "L", "20·5% = 1 L."),
    ],
  },
  {
    lessonNumber: 26,
    questions: [
      mc("B26-01", "biet", "Công thức cấu tạo của ethylic alcohol là", ["CH₃–O–CH₃", "CH₂=CH₂", "CH₃–COOH", "CH₃–CH₂–OH"], "D", "Ethylic alcohol: C₂H₆O, CH₃–CH₂–OH."),
      mc("B26-02", "hieu", "Nhóm nguyên tử gây nên tính chất đặc trưng của ethylic alcohol là", ["–COOH", "–CH₃", "C=C", "–OH"], "D", "Trong phân tử ethylic alcohol có nhóm –OH."),
      mc("B26-03", "hieu", "Khi cho mẩu natri vào ethylic alcohol, hiện tượng quan sát được là", ["mẩu natri nổi lên và cháy", "mẩu natri tan dần, có bọt khí thoát ra", "có kết tủa màu trắng", "dung dịch chuyển màu xanh"], "B", "2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂ (khí hydrogen thoát ra).", "2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂"),
      tf("B26-04", "van_dung", "Cho các nhận định về ethylic alcohol.", [
        it("Ethylic alcohol cháy toả nhiều nhiệt tạo CO₂ và H₂O.", true, "C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O."),
        it("Ethylic alcohol tan vô hạn trong nước.", true, "Tính chất vật lí."),
        it("Ethylic alcohol không tác dụng với natri.", false, "Nhóm –OH cho phản ứng với natri giải phóng khí hydrogen."),
        it("Ethylic alcohol có thể được điều chế bằng cách cộng nước vào ethylene.", true, "CH₂=CH₂ + H₂O → C₂H₅OH."),
      ], "Dựa vào nội dung Bài 26."),
      sa("B26-05", "van_dung", "Cồn y tế 70° có nghĩa là trong 100 mL dung dịch có 70 mL ethylic alcohol nguyên chất. Trong 200 mL cồn 70° có bao nhiêu mL ethylic alcohol nguyên chất?", 140, 0.5, "mL", "200·70/100 = 140 mL."),
    ],
  },
  {
    lessonNumber: 27,
    questions: [
      mc("B27-01", "biet", "Giấm ăn chứa acetic acid với nồng độ thường từ", ["2% đến 5%", "10% đến 15%", "20% đến 30%", "50% đến 60%"], "A", "Giấm ăn có chứa acetic acid với nồng độ thường từ 2% đến 5%."),
      mc("B27-02", "hieu", "Nhóm –COOH có trong phân tử của chất nào?", ["ethylic alcohol", "ethylene", "methane", "acetic acid"], "D", "Acetic acid có công thức CH₃–COOH."),
      mc("B27-03", "hieu", "Acetic acid phản ứng với ethylic alcohol (xúc tác H₂SO₄ đặc, đun nóng) tạo ra", ["ethyl acetate và nước", "ethylene và nước", "carbon dioxide và nước", "sodium acetate và hydrogen"], "A", "CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O (phản ứng ester hoá).", "CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O"),
      tf("B27-04", "van_dung", "Cho các nhận định về acetic acid.", [
        it("Acetic acid làm quỳ tím chuyển sang màu đỏ.", true, "Có tính acid."),
        it("Acetic acid phản ứng với CaCO₃ giải phóng khí CO₂.", true, "2CH₃COOH + CaCO₃ → (CH₃COO)₂Ca + CO₂ + H₂O."),
        it("Acetic acid là acid mạnh.", false, "Acetic acid là acid yếu."),
        it("Acetic acid không phản ứng với kim loại Mg.", false, "2CH₃COOH + Mg → (CH₃COO)₂Mg + H₂."),
      ], "Dựa vào nội dung Bài 27."),
      sa("B27-05", "van_dung", "Cho 6 g acetic acid (CH₃COOH = 60) tác dụng vừa đủ với dung dịch NaOH. Khối lượng muối CH₃COONa (M = 82) thu được là bao nhiêu gam?", 8.2, 0.05, "g", "CH₃COOH + NaOH → CH₃COONa + H₂O; n = 6/60 = 0,1 mol → m = 0,1·82 = 8,2 g."),
    ],
  },
  {
    lessonNumber: 28,
    questions: [
      mc("B28-01", "biet", "Lipid là những hợp chất hữu cơ có trong tế bào sống, không tan trong nước nhưng tan được trong", ["nước muối", "dung môi hữu cơ như xăng, dầu hoả", "dung dịch acid", "dung dịch kiềm loãng"], "B", "Theo SGK, lipid tan được trong một số dung môi hữu cơ như xăng, dầu hoả,..."),
      mc("B28-02", "hieu", "Chất béo là", ["triester của glycerol và acid béo", "ester của ethylic alcohol và acetic acid", "polymer của glucose", "muối natri của acid béo"], "A", "Chất béo là các triester của glycerol và acid béo, công thức (RCOO)₃C₃H₅."),
      mc("B28-03", "hieu", "Phản ứng thuỷ phân chất béo trong môi trường kiềm được gọi là", ["phản ứng ester hoá", "phản ứng trùng hợp", "phản ứng xà phòng hoá", "phản ứng tráng bạc"], "C", "Muối của acid béo dùng làm xà phòng nên phản ứng gọi là phản ứng xà phòng hoá."),
      tf("B28-04", "van_dung", "Cho các nhận định về chất béo.", [
        it("Dầu thực vật thường ở thể lỏng ở điều kiện thường.", true, "Ví dụ dầu lạc, dầu hướng dương, dầu cọ."),
        it("Chất béo nặng hơn nước và tan tốt trong nước.", false, "Chất béo nhẹ hơn nước, không tan trong nước."),
        it("Xà phòng hoá chất béo tạo muối của acid béo và glycerol.", true, "(RCOO)₃C₃H₅ + 3NaOH → 3RCOONa + C₃H₅(OH)₃."),
        it("Ăn quá nhiều chất béo là một nguyên nhân gây béo phì.", true, "Theo SGK Bài 28."),
      ], "Dựa vào nội dung Bài 28."),
      sa("B28-05", "van_dung", "Xà phòng hoá hoàn toàn 1 mol chất béo (RCOO)₃C₃H₅ cần bao nhiêu mol NaOH?", 3, 0, "mol", "(RCOO)₃C₃H₅ + 3NaOH → 3RCOONa + C₃H₅(OH)₃."),
    ],
  },
  {
    lessonNumber: 29,
    questions: [
      mc("B29-01", "biet", "Công thức phân tử của glucose là", ["C₁₂H₂₂O₁₁", "C₂H₅OH", "(C₆H₁₀O₅)ₙ", "C₆H₁₂O₆"], "D", "Glucose: C₆H₁₂O₆; saccharose: C₁₂H₂₂O₁₁."),
      mc("B29-02", "hieu", "Chất nào có phản ứng tráng bạc?", ["saccharose", "cellulose", "glucose", "tinh bột"], "C", "Tính chất đặc trưng của glucose là phản ứng tráng bạc; saccharose không có phản ứng này."),
      mc("B29-03", "hieu", "Thuỷ phân saccharose thu được", ["chỉ glucose", "glucose và fructose", "chỉ fructose", "ethylic alcohol và CO₂"], "B", "C₁₂H₂₂O₁₁ + H₂O → C₆H₁₂O₆ (glucose) + C₆H₁₂O₆ (fructose)."),
      tf("B29-04", "van_dung", "Cho các nhận định về carbohydrate.", [
        it("Glucose tan tốt trong nước.", true, "Tính chất vật lí của glucose."),
        it("Saccharose có phản ứng tráng bạc.", false, "Saccharose không có phản ứng tráng bạc."),
        it("Glucose lên men tạo ethylic alcohol và carbon dioxide.", true, "C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ (enzyme)."),
        it("Carbohydrate thường có công thức chung Cₙ(H₂O)ₘ.", true, "Theo SGK Bài 29."),
      ], "Dựa vào nội dung Bài 29."),
      sa("B29-05", "van_dung", "Tráng bạc hoàn toàn 18 g glucose (C₆H₁₂O₆ = 180), theo phương trình C₆H₁₂O₆ + Ag₂O → C₆H₁₂O₇ + 2Ag, thu được bao nhiêu gam bạc (Ag = 108)?", 21.6, 0.1, "g", "n(glucose) = 18/180 = 0,1 mol → n(Ag) = 0,2 mol → m = 0,2·108 = 21,6 g."),
    ],
  },
  {
    lessonNumber: 30,
    questions: [
      mc("B30-01", "biet", "Hồ tinh bột phản ứng với iodine tạo hợp chất có màu", ["đỏ", "trắng", "vàng", "xanh tím"], "D", "Tinh bột phản ứng với iodine tạo hợp chất màu xanh tím."),
      mc("B30-02", "hieu", "Thuỷ phân hoàn toàn tinh bột và cellulose đều tạo ra", ["fructose", "saccharose", "glucose", "ethylic alcohol"], "C", "(C₆H₁₀O₅)ₙ + nH₂O → nC₆H₁₂O₆."),
      mc("B30-03", "hieu", "Vai trò chính của cellulose trong cây xanh là", ["dự trữ năng lượng", "tạo nên bộ khung (thành tế bào) của thực vật", "xúc tác sinh học", "cung cấp oxygen"], "B", "Cellulose xây dựng thành tế bào thực vật, giữ độ cứng, hình dáng của cây."),
      tf("B30-04", "van_dung", "Cho các nhận định về tinh bột và cellulose.", [
        it("Công thức phân tử của tinh bột và cellulose đều có dạng (C₆H₁₀O₅)ₙ.", true, "Theo SGK Bài 30."),
        it("Tinh bột tan tốt trong nước lạnh.", false, "Tinh bột không tan trong nước lạnh."),
        it("Cơ thể người có enzyme thuỷ phân cellulose.", false, "Cơ thể người chỉ có enzyme thuỷ phân tinh bột."),
        it("Gạo, ngô, khoai, sắn chứa nhiều tinh bột.", true, "Tinh bột tập trung nhiều ở hạt, củ và quả."),
      ], "Dựa vào nội dung Bài 30."),
      sa("B30-05", "van_dung", "Thuỷ phân hoàn toàn 162 g tinh bột (mỗi mắt xích C₆H₁₀O₅ = 162) thu được bao nhiêu gam glucose (C₆H₁₂O₆ = 180)?", 180, 0.5, "g", "162 g tinh bột = 1 mol mắt xích C₆H₁₀O₅ → 1 mol glucose = 180 g."),
    ],
  },
  {
    lessonNumber: 31,
    questions: [
      mc("B31-01", "biet", "Protein là hợp chất hữu cơ phức tạp gồm nhiều đơn vị", ["glucose", "amino acid", "acid béo", "ethylene"], "B", "Protein gồm nhiều đơn vị amino acid liên kết với nhau bởi liên kết peptide."),
      mc("B31-02", "hieu", "Khi đun nóng nhẹ, lòng trắng trứng", ["bị đông tụ", "tan thành dung dịch trong suốt", "chuyển thành glucose", "bay hơi hoàn toàn không có mùi"], "A", "Protein bị đông tụ dưới tác dụng của acid, base hoặc nhiệt độ."),
      mc("B31-03", "hieu", "Có thể phân biệt tơ tằm với tơ nylon bằng cách", ["thử bằng dung dịch iodine", "đốt: tơ tằm cháy có mùi khét như tóc cháy", "ngâm vào nước lạnh", "cho vào dung dịch NaCl"], "B", "Tơ tự nhiên chứa protein cháy có mùi khét đặc trưng; tơ nylon thì không."),
      tf("B31-04", "van_dung", "Cho các nhận định về protein.", [
        it("Protein bị thuỷ phân tạo thành amino acid.", true, "Protein + H₂O → amino acid (acid, base hoặc enzyme)."),
        it("Liên kết giữa các amino acid trong protein là liên kết peptide.", true, "Theo SGK Bài 31."),
        it("Protein không có vai trò xúc tác trong cơ thể.", false, "Các enzyme là protein đóng vai trò xúc tác."),
        it("Protein bị đông tụ dưới tác dụng của acid hoặc nhiệt độ.", true, "Thí nghiệm lòng trắng trứng."),
      ], "Dựa vào nội dung Bài 31."),
    ],
  },
  {
    lessonNumber: 32,
    questions: [
      mc("B32-01", "biet", "Các đơn vị nhỏ liên kết với nhau tạo nên phân tử polymer được gọi là", ["monomer", "mắt xích", "alkane", "ester"], "B", "Polymer do nhiều đơn vị nhỏ (mắt xích) liên kết tạo nên; các phân tử nhỏ tạo nên polymer gọi là monomer."),
      mc("B32-02", "hieu", "Polymer nào sau đây là polymer thiên nhiên?", ["PE", "PP", "tinh bột", "nylon"], "C", "Tinh bột, cellulose, protein, cao su thiên nhiên là polymer thiên nhiên."),
      mc("B32-03", "hieu", "Nguyên tắc 5R giúp hạn chế rác thải nhựa gồm", ["Renew, Refuse, Reduce, Reuse, Recycle", "Remove, Refuse, Repair, Reuse, Recycle", "Renew, Reject, Reduce, Return, Recycle", "Reduce, Reuse, Recycle, Reform, Reuse"], "A", "Đổi mới công nghệ, Từ chối, Giảm thiểu, Tái sử dụng, Tái chế."),
      tf("B32-04", "van_dung", "Cho các nhận định về polymer.", [
        it("Hầu hết polymer là chất rắn, không bay hơi.", true, "Tính chất vật lí chung của polymer."),
        it("Polymer có nhiệt độ nóng chảy xác định.", false, "Hầu hết polymer không có nhiệt độ nóng chảy xác định."),
        it("Cao su là vật liệu polymer có tính đàn hồi.", true, "Định nghĩa cao su."),
        it("Vật liệu composite gồm vật liệu cốt và vật liệu nền.", true, "Theo SGK Bài 32."),
      ], "Dựa vào nội dung Bài 32."),
      sa("B32-05", "van_dung", "Mắt xích –CH₂–CH₂– của polyethylene (PE) có khối lượng 28 amu. Một đoạn PE có khối lượng phân tử 28 000 amu gồm bao nhiêu mắt xích?", 1000, 0, "mắt xích", "28 000 / 28 = 1 000 mắt xích."),
    ],
  },
  {
    lessonNumber: 33,
    questions: [
      mc("B33-01", "biet", "Nguyên tố chiếm hàm lượng lớn nhất trong vỏ Trái Đất là", ["silicon", "oxygen", "aluminium", "iron"], "B", "Bảng 33.1: oxygen chiếm 46,10%."),
      mc("B33-02", "hieu", "Thạch anh có thành phần chính là", ["CaCO₃", "Al₂O₃", "CaCO₃·MgCO₃", "SiO₂"], "D", "Silicon oxide là thành phần chính của cát trắng, thạch anh."),
      mc("B33-03", "hieu", "Đá vôi thuộc loại hợp chất nào?", ["muối silicate", "oxide", "base", "muối carbonate"], "D", "Đá vôi có thành phần chính là CaCO₃ – muối carbonate."),
      tf("B33-04", "van_dung", "Cho các nhận định về vỏ Trái Đất.", [
        it("Oxygen và silicon là hai nguyên tố có hàm lượng lớn nhất.", true, "46,10% và 28,20%."),
        it("Hàm lượng nhôm (8,23%) lớn hơn hàm lượng sắt (5,63%).", true, "Bảng 33.1."),
        it("Vỏ Trái Đất chỉ chứa các nguyên tố kim loại.", false, "Chứa cả phi kim như O, Si,..."),
        it("Cần tiết kiệm nguyên liệu, ưu tiên sử dụng vật liệu tái chế.", true, "Phục vụ sự phát triển bền vững."),
      ], "Dựa vào nội dung Bài 33."),
      sa("B33-05", "hieu", "Theo Bảng 33.1, tổng thành phần phần trăm khối lượng của oxygen (46,10%) và silicon (28,20%) trong vỏ Trái Đất là bao nhiêu phần trăm?", 74.3, 0.05, "%", "46,10 + 28,20 = 74,30%."),
    ],
  },
  {
    lessonNumber: 34,
    questions: [
      mc("B34-01", "biet", "Thành phần chính của đá vôi là", ["CaO", "CaCO₃", "Ca(OH)₂", "CaSO₄"], "B", "Thành phần chính của đá vôi là calcium carbonate (CaCO₃)."),
      mc("B34-02", "hieu", "Vôi sống (CaO) tác dụng với nước tạo thành", ["CaCO₃", "CaCl₂", "Ca(OH)₂", "CaSiO₃"], "C", "CaO + H₂O → Ca(OH)₂.", "CaO + H₂O → Ca(OH)₂"),
      mc("B34-03", "hieu", "Nguyên liệu để sản xuất thuỷ tinh thông thường gồm", ["cát trắng, đá vôi, soda", "đất sét, nước", "đá vôi, thạch cao", "than cốc, quặng sắt"], "A", "Thuỷ tinh thông thường sản xuất từ cát thạch anh (cát trắng), đá vôi và soda (Na₂CO₃)."),
      tf("B34-04", "van_dung", "Cho các nhận định về đá vôi và công nghiệp silicate.", [
        it("Nung đá vôi tạo thành CaO và CO₂.", true, "CaCO₃ → CaO + CO₂ (nhiệt độ cao)."),
        it("Silicon là nguyên tố phổ biến thứ hai trong vỏ Trái Đất.", true, "Chiếm 28,2% về khối lượng, chỉ sau oxygen."),
        it("Silicon tinh khiết là vật liệu bán dẫn.", true, "Dùng chế tạo vi mạch điện tử, pin Mặt Trời."),
        it("Xi măng được sản xuất chỉ từ cát và soda.", false, "Xi măng từ đá vôi, đất sét, quặng sắt nung thành clanke rồi nghiền với thạch cao."),
      ], "Dựa vào nội dung Bài 34."),
      sa("B34-05", "van_dung", "Nung hoàn toàn 100 g CaCO₃ (CaCO₃ = 100) thu được bao nhiêu gam CaO (CaO = 56)?", 56, 0.5, "g", "CaCO₃ → CaO + CO₂; n(CaCO₃) = 1 mol → n(CaO) = 1 mol → 56 g."),
    ],
  },
  {
    lessonNumber: 35,
    questions: [
      mc("B35-01", "biet", "Nhiên liệu hoá thạch gồm", ["than mỏ, dầu mỏ, khí thiên nhiên", "gỗ, củi, rơm", "ethanol, biodiesel", "hydrogen, ánh sáng"], "A", "Nhiên liệu hoá thạch gồm than mỏ, dầu mỏ, khí mỏ dầu và khí thiên nhiên."),
      mc("B35-02", "hieu", "Hai khí chủ yếu gây ra hiệu ứng nhà kính là", ["N₂ và O₂", "CO₂ và CH₄", "H₂ và He", "SO₂ và NO"], "B", "Carbon dioxide và methane là nguyên nhân chính gây hiệu ứng nhà kính."),
      mc("B35-03", "hieu", "Biện pháp nào giúp giảm lượng khí CO₂ thải ra khí quyển?", ["tăng sử dụng nhiên liệu hoá thạch", "chặt rừng làm nương rẫy", "trồng và bảo vệ rừng, tăng sử dụng năng lượng tái tạo", "đốt rác thải nhựa"], "C", "Theo SGK: hạn chế nhiên liệu hoá thạch, tăng năng lượng tái tạo, trồng cây gây rừng."),
      tf("B35-04", "van_dung", "Cho các nhận định về nhiên liệu hoá thạch và sự ấm lên toàn cầu.", [
        it("Khai thác nhiên liệu hoá thạch quá mức dẫn đến nguy cơ cạn kiệt tài nguyên.", true, "Theo SGK Bài 35."),
        it("Nước biển dâng là một hệ quả của sự ấm lên toàn cầu.", true, "Băng, tuyết tan chảy ra biển."),
        it("Củi gỗ là nhiên liệu hoá thạch.", false, "Nhiên liệu hoá thạch hình thành từ sinh vật bị chôn vùi hàng triệu năm."),
        it("Cây xanh hấp thụ CO₂ trong quá trình quang hợp.", true, "Một khâu của chu trình carbon."),
      ], "Dựa vào nội dung Bài 35."),
      sa("B35-05", "van_dung", "Đốt cháy hoàn toàn 0,5 mol ethylic alcohol (C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O) thu được bao nhiêu mol CO₂?", 1, 0.001, "mol", "Theo phương trình, 1 mol C₂H₅OH tạo 2 mol CO₂ → 0,5 mol tạo 1 mol CO₂."),
    ],
  },
];
