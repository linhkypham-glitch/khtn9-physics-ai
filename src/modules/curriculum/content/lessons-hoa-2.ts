/**
 * NỘI DUNG KIẾN THỨC HOÁ HỌC 9 – Chương VIII, IX, X (Bài 26 – 35).
 * Biên soạn theo các trang SGK KHTN 9 – Kết nối tri thức với cuộc sống.
 */
import type { LessonContent } from "./lessons";

export const LESSON_CONTENT_HOA_2: LessonContent[] = [
  // ------------------------------------------------------------------ CHƯƠNG VIII
  {
    lessonNumber: 26,
    summary: "Ethylic alcohol (C₂H₅OH) là chất lỏng, tan vô hạn trong nước; nhóm –OH quyết định tính chất: cháy toả nhiệt, tác dụng với natri; được điều chế bằng lên men tinh bột hoặc cộng nước vào ethylene.",
    objectives: [
      "Viết được công thức phân tử, công thức cấu tạo và nêu được đặc điểm cấu tạo của ethylic alcohol.",
      "Quan sát mẫu vật hoặc hình ảnh, trình bày được một số tính chất vật lí của ethylic alcohol: trạng thái, màu sắc, mùi vị, tính tan, khối lượng riêng, nhiệt độ sôi.",
      "Nêu được khái niệm và ý nghĩa của độ cồn.",
      "Trình bày được tính chất hoá học của ethylic alcohol: phản ứng cháy, phản ứng với natri. Viết được các phương trình hoá học xảy ra.",
      "Tiến hành được (hoặc quan sát qua video) thí nghiệm phản ứng cháy, phản ứng với natri của ethylic alcohol, nêu và giải thích hiện tượng thí nghiệm, nhận xét và rút ra kết luận về tính chất hoá học cơ bản của ethylic alcohol.",
      "Trình bày được phương pháp điều chế ethylic alcohol từ tinh bột và từ ethylene.",
      "Nêu được ứng dụng của ethylic alcohol (dung môi, nhiên liệu,...).",
      "Trình bày được tác hại của việc lạm dụng rượu bia.",
    ],
    requirements: [
      "Nhận biết được một số sản phẩm chứa ethylic alcohol trong đời sống.",
      "Sử dụng nhiên liệu sinh học có chứa ethylic alcohol góp phần bảo vệ môi trường.",
      "Tránh lạm dụng các loại đồ uống có chứa cồn để bảo vệ sức khoẻ.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Công thức và đặc điểm cấu tạo",
        body:
          "Ethylic alcohol (ethanol) là hợp chất hữu cơ có công thức phân tử C₂H₆O. Công thức cấu tạo: CH₃–CH₂–OH.\n" +
          "Trong phân tử ethylic alcohol có nhóm –OH, đây là nhóm nguyên tử gây nên tính chất đặc trưng của ethylic alcohol.",
      },
      {
        kind: "text",
        title: "2. Tính chất vật lí",
        body:
          "Ethylic alcohol là chất lỏng, không màu, có mùi đặc trưng, vị cay, sôi ở 78,3 °C, có khối lượng riêng là 0,789 g/mL (ở 20 °C), tan vô hạn trong nước và hoà tan được nhiều chất như iodine, benzene,...\n" +
          "Độ cồn là số mililit ethylic alcohol nguyên chất có trong 100 mL dung dịch ở 20 °C. Độ cồn thường được kí hiệu là Xº hoặc X% vol. Ví dụ: cồn y tế 70° có nghĩa là trong 100 mL cồn 70° có chứa 70 mL ethylic alcohol nguyên chất.\n" +
          "Cồn y tế, nước rửa tay sát khuẩn,... chứa ethylic alcohol với hàm lượng từ 60% đến 85% vì thế có tính diệt khuẩn: khi tiếp xúc với vi khuẩn, ethylic alcohol gây đông tụ protein, phá vỡ cấu trúc của vi khuẩn, làm cho vi khuẩn chết.\n" +
          "Trên nhãn các chai bia, rượu vang, rượu whisky,… có ghi các giá trị như 4% vol, 14% vol, 40% vol,…: độ cồn của đồ uống.",
      },
      {
        kind: "text",
        title: "Thí nghiệm: Tìm hiểu về phản ứng cháy của ethylic alcohol",
        body:
          "Chuẩn bị: ethylic alcohol (có thể dùng cồn 96°), bát sứ, que đóm.\n" +
          "Tiến hành: lấy khoảng 1 mL ethylic alcohol (chú ý không lấy nhiều hơn) cho vào bát sứ và dùng que đóm đang cháy để đốt ethylic alcohol.\n" +
          "Kết quả: ethylic alcohol cháy với ngọn lửa màu xanh nhạt, toả nhiều nhiệt (dấu hiệu: bát sứ và không khí xung quanh nóng lên). Khi đốt cháy, ethylic alcohol phản ứng với khí oxygen trong không khí tạo carbon dioxide và hơi nước.\n" +
          "Lưu ý: chỉ lấy một lượng nhỏ ethylic alcohol. Không được sử dụng diêm, bật lửa để đốt trực tiếp ethylic alcohol. Ethylic alcohol dễ bay hơi và dễ cháy nên cần hết sức chú ý khi sử dụng để tránh bị bỏng, hoả hoạn.",
      },
      {
        kind: "text",
        title: "3. Tính chất hoá học",
        body:
          "a) Phản ứng cháy: ethylic alcohol dễ cháy trong không khí tạo thành carbon dioxide, hơi nước và toả nhiều nhiệt.\n" +
          "C₂H₅OH + 3O₂ →(t°) 2CO₂ + 3H₂O\n" +
          "Ứng dụng: ethylic alcohol được dùng làm nhiên liệu trong đèn cồn,... hoặc phối trộn với xăng làm nhiên liệu cho động cơ đốt trong (xe máy, ô tô,...) dựa vào tính chất cháy toả nhiều nhiệt.\n" +
          "b) Phản ứng với natri:\n" +
          "Thí nghiệm: cho khoảng 5 mL ethylic alcohol tuyệt đối vào ống nghiệm; dùng panh kẹp một mẩu natri bằng hạt ngô đưa vào ống nghiệm. Quan sát: mẩu natri tan dần, có khí thoát ra (bọt khí quanh mẩu natri). Cần làm sạch mẩu natri trước khi phản ứng; dùng panh kẹp mẩu natri, không dùng tay cầm trực tiếp.\n" +
          "2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂\n" +
          "Các kim loại mạnh như Na, K thay thế được nguyên tử hydrogen trong nhóm –OH của ethylic alcohol, sản phẩm phản ứng có khí hydrogen được tạo thành.",
      },
      {
        kind: "text",
        title: "4. Điều chế",
        body:
          "a) Điều chế ethylic alcohol từ tinh bột: ethylic alcohol được điều chế bằng phương pháp lên men các nguyên liệu chứa tinh bột (gạo, ngô, sắn,...):\n" +
          "(C₆H₁₀O₅)ₙ →(+H₂O/enzyme) C₆H₁₂O₆ →(enzyme, −CO₂) C₂H₅OH   (tinh bột → glucose → ethylic alcohol)\n" +
          "Ngoài nguyên liệu giàu tinh bột, người ta còn sử dụng phụ phẩm của công nghiệp sản xuất đường (rỉ đường), nguyên liệu chứa cellulose (rơm, rạ, gỗ phế liệu,...) để sản xuất ethylic alcohol.\n" +
          "b) Điều chế ethylic alcohol từ ethylene: ethylic alcohol còn được điều chế bằng phản ứng cộng nước vào ethylene:\n" +
          "CH₂=CH₂ + H₂O →(t°, H⁺) C₂H₅OH\n" +
          "Phương pháp điều chế ethylic alcohol từ ethylene dùng để sản xuất ethylic alcohol trong công nghiệp.",
      },
      {
        kind: "text",
        title: "5. Ứng dụng",
        body:
          "Ethylic alcohol là một trong những hoá chất được sử dụng phổ biến trong công nghiệp và đời sống (Hình 26.5): làm dung môi trong mĩ phẩm, dược phẩm, vecni, sơn,...; sản xuất dung dịch sát khuẩn; sản xuất đồ uống có cồn (rượu); sản xuất nhiên liệu sinh học; điều chế acetic acid, ester.\n" +
          "Thành phần xăng sinh học: xăng thông thường và ethylic alcohol được phối trộn theo một tỉ lệ nhất định (thường từ 5% đến 20% ethylic alcohol về thể tích). Ví dụ: xăng E5 chứa 5% ethylic alcohol (về thể tích). Việc sử dụng xăng sinh học góp phần giảm bớt tỉ lệ tiêu thụ nhiên liệu hoá thạch, giảm lượng phát thải khí gây hiệu ứng nhà kính, giúp bảo vệ môi trường.",
      },
      {
        kind: "text",
        title: "6. Tác hại của việc lạm dụng rượu, bia, đồ uống có cồn",
        body:
          "Hiện nay, có nhiều loại đồ uống chứa cồn như rượu, bia, nước quả lên men,... Sử dụng quá nhiều đồ uống này sẽ tăng nguy cơ bị viêm gan, viêm loét dạ dày, tăng huyết áp, xơ vữa động mạch, gây tổn thương hệ thần kinh, rối loạn tâm thần. Việc lạm dụng rượu, bia là một trong những nguyên nhân gây tai nạn giao thông, tai nạn lao động, bạo lực trong mối quan hệ gia đình và xã hội. Học sinh không được sử dụng rượu, bia, đồ uống có cồn; người tham gia giao thông không uống rượu, bia khi lái xe.",
      },
      {
        kind: "example",
        title: "Câu hỏi SGK",
        body:
          "Trong các chất CH₃–CH₃; CH₂=CH₂; CH₃–OH; CH₃–CH₂–OH, chất tác dụng được với Na là CH₃–OH và CH₃–CH₂–OH (có nhóm –OH): 2CH₃OH + 2Na → 2CH₃ONa + H₂;  2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂.",
      },
    ],
  },
  {
    lessonNumber: 27,
    summary: "Acetic acid (CH₃COOH) là acid yếu có đủ tính chất của một acid; tác dụng với ethylic alcohol tạo ester; được điều chế bằng lên men giấm từ ethylic alcohol loãng.",
    objectives: [
      "Quan sát mô hình hoặc hình vẽ, viết được công thức phân tử, công thức cấu tạo; nêu được đặc điểm cấu tạo của acid acetic.",
      "Quan sát mẫu vật hoặc hình ảnh, trình bày được một số tính chất vật lí của acetic acid: trạng thái, màu sắc, mùi vị, tính tan, khối lượng riêng, nhiệt độ sôi.",
      "Trình bày được phương pháp điều chế acetic acid bằng cách lên men ethylic alcohol.",
      "Trình bày được tính chất hoá học của acetic acid: phản ứng với quỳ tím, đá vôi, kim loại, oxide kim loại, base, phản ứng cháy, phản ứng ester hoá. Viết được các phương trình hoá học xảy ra.",
      "Tiến hành được (hoặc quan sát qua video) thí nghiệm của acid acetic (phản ứng với quỳ tím, đá vôi, kim loại, oxide kim loại, base, phản ứng cháy, phản ứng ester hoá), nhận xét, rút ra được tính chất hoá học cơ bản của acetic acid.",
      "Trình bày được ứng dụng của acetic acid (làm nguyên liệu, làm giấm).",
    ],
    requirements: [
      "Biết cách tạo ra giấm bằng phương pháp lên men để sử dụng trong gia đình.",
      "Vận dụng các tính chất của acetic acid để ứng dụng trong đời sống như loại bỏ cặn trong ấm nước, thiết bị vệ sinh,...",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Công thức và đặc điểm cấu tạo",
        body:
          "Acetic acid là hợp chất hữu cơ có công thức phân tử C₂H₄O₂. Công thức cấu tạo thu gọn: CH₃–COOH.\n" +
          "Trong phân tử acetic acid có nhóm –COOH, đây là nhóm nguyên tử gây nên tính chất đặc trưng của acetic acid. Nhóm –COOH gồm có nhóm –OH liên kết với nhóm C=O.",
      },
      {
        kind: "text",
        title: "2. Tính chất vật lí",
        body:
          "Acetic acid là chất lỏng, không màu, vị chua, có mùi đặc trưng, sôi ở 118 °C, tan vô hạn trong nước, khối lượng riêng là 1,045 g/mL (ở 25 °C). Giấm ăn có chứa acetic acid với nồng độ thường từ 2% đến 5%.",
      },
      {
        kind: "text",
        title: "Thí nghiệm: Tìm hiểu tính chất hoá học của acetic acid",
        body:
          "Chuẩn bị: dung dịch acetic acid 10%, dung dịch NaOH 10%, Mg, CuO, đá vôi đập nhỏ, ống nghiệm, giấy quỳ tím (hoặc giấy chỉ thị pH), phenolphthalein, đèn cồn, ống hút nhỏ giọt.\n" +
          "Tiến hành và kết quả:\n" +
          "1. Với chất chỉ thị: nhỏ vài giọt dung dịch acetic acid lên mẫu giấy quỳ tím → giấy quỳ chuyển sang màu đỏ.\n" +
          "2. Với kim loại: cho một mảnh Mg vào ống nghiệm có khoảng 2 mL dung dịch acetic acid 10% → Mg tan dần, có khí không màu thoát ra (hydrogen).\n" +
          "3. Với oxide kim loại: cho vào ống nghiệm một ít bột CuO, nhỏ khoảng 2 mL dung dịch acetic acid, đun nhẹ → chất rắn màu đen tan dần, dung dịch chuyển sang màu xanh.\n" +
          "4. Với base: cho vào ống nghiệm 1 mL dung dịch NaOH 10%, thêm vài giọt phenolphthalein (dung dịch có màu hồng), nhỏ từ từ dung dịch acetic acid vào cho tới khi mất màu → màu hồng biến mất.\n" +
          "5. Với đá vôi: cho vào ống nghiệm khoảng 1 thìa thuỷ tinh đá vôi đập nhỏ, thêm khoảng 1 mL dung dịch acetic acid → có khí không màu thoát ra (carbon dioxide).",
      },
      {
        kind: "text",
        title: "3. Tính chất hoá học",
        body:
          "a) Tính acid: acetic acid là một acid yếu và có đầy đủ tính chất của một acid thông thường:\n" +
          "– Làm đổi màu chất chỉ thị acid như giấy quỳ (sang màu đỏ) và giấy chỉ thị pH.\n" +
          "– Phản ứng với kim loại giải phóng khí hydrogen: 2CH₃COOH + Mg → (CH₃COO)₂Mg + H₂\n" +
          "– Phản ứng với oxide kim loại tạo thành muối và nước: 2CH₃COOH + CuO → (CH₃COO)₂Cu + H₂O\n" +
          "– Phản ứng với base tạo muối và nước: CH₃COOH + NaOH → CH₃COONa + H₂O\n" +
          "– Phản ứng với muối carbonate, giải phóng khí carbon dioxide: 2CH₃COOH + CaCO₃ → (CH₃COO)₂Ca + CO₂ + H₂O\n" +
          "Ấm đun nước sử dụng một thời gian có lớp cặn (chứa CaCO₃) bám vào đáy và thành ấm; có thể loại bỏ lớp cặn này bằng giấm ăn.\n" +
          "b) Phản ứng ester hoá: acetic acid phản ứng với ethylic alcohol tạo thành ester và nước:\n" +
          "CH₃COOH + C₂H₅OH ⇌(H₂SO₄ đặc, t°) CH₃COOC₂H₅ + H₂O   (ethyl acetate)\n" +
          "Phản ứng giữa acetic acid và ethylic alcohol tạo ra ester (ethyl acetate) thuộc loại phản ứng ester hoá. Ethyl acetate là chất lỏng ở phía trên, không màu, có mùi thơm. Nhiều hợp chất ester dễ bay hơi, tạo nên mùi hương đặc trưng của nhiều loài hoa và các loại trái cây; được sử dụng làm hương liệu trong công nghiệp mĩ phẩm và thực phẩm.\n" +
          "c) Phản ứng cháy: acetic acid cháy trong khí oxygen tạo thành khí carbon dioxide và hơi nước:\n" +
          "CH₃COOH + 2O₂ →(t°) 2CO₂ + 2H₂O",
      },
      {
        kind: "text",
        title: "Thí nghiệm: Nghiên cứu phản ứng ester hoá giữa acetic acid và ethylic alcohol",
        body:
          "Tiến hành: cho 2 mL ethylic alcohol và 2 mL acetic acid đặc vào ống nghiệm, lắc đều hỗn hợp. Thêm 1 mL dung dịch H₂SO₄ đặc, lắc nhẹ để các chất trộn đều với nhau. Kẹp ống nghiệm rồi đặt vào cốc nước nóng (khoảng 60 °C – 70 °C), thỉnh thoảng lắc ống nghiệm để trộn đều hỗn hợp. Sau khoảng 5 phút, để nguội hỗn hợp rồi đổ sang ống nghiệm khác chứa 5 mL dung dịch muối ăn bão hoà.\n" +
          "Kết quả: thấy xuất hiện lớp chất lỏng ở phía trên, không màu, có mùi thơm (ethyl acetate).\n" +
          "Chú ý: dung dịch H₂SO₄ đặc có thể gây bỏng nên cần cẩn thận khi sử dụng.",
      },
      {
        kind: "text",
        title: "4. Điều chế",
        body:
          "Acetic acid dùng để sản xuất giấm được điều chế từ ethylic alcohol loãng bằng phương pháp lên men giấm:\n" +
          "C₂H₅OH + O₂ →(men giấm) CH₃COOH + H₂O\n" +
          "Khi để các loại rượu có độ cồn thấp (rượu vang, rượu mơ, rượu sâm panh,...) tiếp xúc với không khí, sau một thời gian thì các loại rượu này sẽ có vị chua do có phản ứng lên men giấm tạo acetic acid.",
      },
      {
        kind: "text",
        title: "5. Ứng dụng",
        body:
          "Acetic acid là một trong những hoá chất được sử dụng phổ biến trong công nghiệp và đời sống (Hình 27.4). Acetic acid được sử dụng nhiều trong công nghiệp thực phẩm, dùng làm nguyên liệu đầu để sản xuất nhiều sản phẩm khác nhau như dược phẩm, phẩm nhuộm, tơ nhân tạo, chất dẻo,... (sản xuất tơ, dược phẩm, hoá chất, chất kết dính, giấm ăn, làm dung môi).",
      },
      {
        kind: "example",
        title: "Câu hỏi SGK",
        body:
          "• Chất có tính chất hoá học đặc trưng giống acetic acid: chất có nhóm –COOH, tức HCOOH (phương án C).\n" +
          "• Acetic acid tác dụng với các chất: Zn (2CH₃COOH + Zn → (CH₃COO)₂Zn + H₂); KOH (CH₃COOH + KOH → CH₃COOK + H₂O); ZnO (2CH₃COOH + ZnO → (CH₃COO)₂Zn + H₂O); MgCO₃ (2CH₃COOH + MgCO₃ → (CH₃COO)₂Mg + CO₂ + H₂O). Không tác dụng với NaCl và Cu.\n" +
          "• Propyl acetate: CH₃COOH + CH₃CH₂CH₂OH ⇌(H₂SO₄ đặc, t°) CH₃COOCH₂CH₂CH₃ + H₂O.",
      },
    ],
  },
  // ------------------------------------------------------------------ CHƯƠNG IX
  {
    lessonNumber: 28,
    summary: "Lipid là hợp chất hữu cơ có trong tế bào sống, không tan trong nước; chất béo là triester của glycerol với acid béo, bị thuỷ phân trong môi trường kiềm tạo xà phòng.",
    objectives: [
      "Nêu được khái niệm lipid, khái niệm chất béo, trạng thái thiên nhiên, công thức tổng quát của chất béo đơn giản là (R–COO)₃C₃H₅, đặc điểm cấu tạo.",
      "Trình bày được tính chất vật lí của chất béo (trạng thái, tính tan) và tính chất hoá học (phản ứng xà phòng hoá). Viết được phương trình hoá học xảy ra.",
      "Nêu được vai trò của lipid tham gia cấu tạo tế bào và tích luỹ năng lượng trong cơ thể.",
      "Trình bày được ứng dụng của chất béo và đề xuất biện pháp sử dụng chất béo cho phù hợp trong việc ăn uống hằng ngày để có cơ thể khoẻ mạnh, tránh được bệnh béo phì.",
    ],
    requirements: ["Biết cách lựa chọn, sử dụng chất béo phù hợp trong ăn uống để có lợi cho sức khoẻ."],
    knowledge: [
      {
        kind: "text",
        title: "1. Lipid",
        body:
          "Lipid là những hợp chất hữu cơ có trong tế bào sống, không tan trong nước, nhưng tan được trong một số dung môi hữu cơ như xăng, dầu hoả,...\n" +
          "Một số loại lipid điển hình là chất béo (nguồn dự trữ năng lượng chính trong cơ thể và là thành phần chính của dầu thực vật và mỡ động vật), sáp (thường được tìm thấy trên bề mặt lá, thân cây, trái cây của nhiều loại thực vật và da, lông của một số loài động vật, giúp chống mất nước và một số tác động có hại từ môi trường ngoài),...\n" +
          "Đặc trưng tính chất vật lí của lipid: không tan trong nước, tan trong dung môi hữu cơ. Lipid điển hình: chất béo (dự trữ năng lượng) và sáp (chống mất nước).",
      },
      {
        kind: "text",
        title: "2. Chất béo: khái niệm",
        body:
          "Loại lipid được sử dụng phổ biến nhất trong cuộc sống hằng ngày là chất béo. Khi đun chất béo với nước, có mặt xúc tác acid hoặc enzyme lipase sẽ thu được glycerol và acid béo.\n" +
          "Glycerol là alcohol có công thức cấu tạo: CH₂(OH)–CH(OH)–CH₂(OH), viết gọn: C₃H₅(OH)₃.\n" +
          "Acid béo là các acid hữu cơ có công thức chung R–COOH, với R thường là –C₁₅H₃₁, –C₁₇H₃₅, –C₁₇H₃₃, –C₁₇H₃₁,... và thường có mạch carbon dài, không phân nhánh.\n" +
          "Từ kết quả trên, kết hợp với những phương pháp khác, người ta xác định được: chất béo là các triester (loại ester chứa 3 nhóm –COO– trong phân tử) của glycerol và acid béo, có công thức cấu tạo thu gọn là (RCOO)₃C₃H₅. R có thể giống nhau hoặc khác nhau.",
      },
      {
        kind: "text",
        title: "3. Tính chất vật lí của chất béo",
        body:
          "Ở điều kiện thường, một số chất béo tồn tại ở trạng thái lỏng như dầu lạc, dầu hướng dương, dầu cọ,...; một số chất béo tồn tại ở trạng thái rắn như các loại mỡ động vật, bơ,...\n" +
          "Các chất béo nhẹ hơn nước, không tan trong nước và tan trong một số dung môi hữu cơ như benzene, xăng,...",
      },
      {
        kind: "text",
        title: "4. Tính chất hoá học: phản ứng xà phòng hoá",
        body:
          "Chất béo có thể bị thuỷ phân hoàn toàn trong môi trường kiềm. Khi đun nóng chất béo với dung dịch NaOH (hoặc KOH), sản phẩm thu được là muối Na (hoặc K) của acid béo và glycerol.\n" +
          "Ví dụ: (RCOO)₃C₃H₅ + 3NaOH →(t°) 3RCOONa + C₃H₅(OH)₃\n" +
          "Muối Na (hoặc K) của các acid béo được sử dụng làm xà phòng nên loại phản ứng này có tên là phản ứng xà phòng hoá.\n" +
          "Làm xà phòng thủ công: để làm xà phòng, chất béo (dầu thực vật, mỡ động vật) được đun với dung dịch kiềm, khi đó muối natri của acid béo được tạo thành ở dạng keo. Các muối này được tách ra, sau đó trộn với các chất phụ gia, hương liệu, chất tạo màu,... rồi ép thành bánh.",
      },
      {
        kind: "text",
        title: "5. Ứng dụng và sử dụng chất béo đúng cách",
        body:
          "Chất béo là một trong những thực phẩm thiết yếu của con người, được sử dụng dưới dạng dầu thực vật (như dầu hướng dương, đậu nành, lạc,...), mỡ động vật (như mỡ lợn, bò, cá,...), bơ, hoặc một số loại hạt (lạc, vừng, hạnh nhân, óc chó,...). Chất béo còn được dùng trong công nghiệp mĩ phẩm (chất làm mềm, dưỡng ẩm,...), dược phẩm, nhiên liệu (dầu diesel sinh học), nguyên liệu (sản xuất xà phòng),...\n" +
          "Sử dụng chất béo đúng cách để hạn chế béo phì: béo phì là tình trạng tích tụ mỡ quá mức trong cơ thể, là một trong những nguyên nhân gây ra nhiều bệnh khác nhau như bệnh tim mạch, đột quỵ, đái tháo đường, thoái hoá khớp, gan nhiễm mỡ,... Một trong những nguyên nhân gây bệnh béo phì là do chế độ ăn uống quá nhiều chất béo. Để hạn chế bệnh béo phì cần lưu ý lựa chọn thực phẩm có lượng chất béo phù hợp, ưu tiên sử dụng các chất béo có nguồn gốc thực vật, các chất béo giàu omega-3 (có trong cá hồi, hải sản), hạn chế sử dụng các chất béo có nguồn gốc động vật (mỡ lợn, mỡ bò,...) và các thức ăn đã qua chế biến ở nhiệt độ cao (thức ăn nhanh, đồ chiên, nướng,...).",
      },
    ],
  },
  {
    lessonNumber: 29,
    summary: "Carbohydrate là hợp chất hữu cơ chứa C, H, O thường có công thức Cₙ(H₂O)ₘ; glucose có phản ứng tráng bạc và lên men rượu, saccharose bị thuỷ phân tạo glucose và fructose.",
    objectives: [
      "Nêu được thành phần nguyên tố, công thức chung của carbohydrate.",
      "Nêu được công thức phân tử, trạng thái tự nhiên, tính chất vật lí (trạng thái, màu sắc, mùi, vị, tính tan, khối lượng riêng) của glucose và saccharose.",
      "Trình bày được tính chất hoá học của glucose (phản ứng tráng bạc, phản ứng lên men rượu), của saccharose (phản ứng thuỷ phân có xúc tác acid hoặc enzyme). Viết được các phương trình hoá học xảy ra dưới dạng công thức phân tử.",
      "Tiến hành được thí nghiệm (hoặc quan sát thí nghiệm) phản ứng tráng bạc của glucose.",
      "Trình bày được vai trò và ứng dụng của glucose (chất dinh dưỡng quan trọng của người và động vật) và của saccharose (nguyên liệu quan trọng trong công nghiệp thực phẩm). Ý thức được tầm quan trọng của việc sử dụng hợp lí saccharose. Nhận biết được các loại thực phẩm giàu saccharose và hoa quả giàu glucose.",
    ],
    requirements: [
      "Nêu được vai trò, ứng dụng của glucose, saccharose.",
      "Nêu được tầm quan trọng của việc sử dụng hợp lí saccharose và ảnh hưởng của chúng đến sức khoẻ.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Khái niệm carbohydrate",
        body:
          "Carbohydrate là loại hợp chất hữu cơ chứa các nguyên tố carbon, hydrogen, oxygen, thường có công thức chung là Cₙ(H₂O)ₘ.\n" +
          "Một số carbohydrate (Hình 29.1): glucose C₆H₁₂O₆ (có nhiều trong quả nho chín); saccharose C₁₂H₂₂O₁₁ (có nhiều trong cây mía); tinh bột (C₆H₁₀O₅)ₙ (có nhiều trong gạo, ngô, khoai, sắn,...); cellulose (C₆H₁₀O₅)ₘ (có nhiều trong bông).\n" +
          "Glucose, saccharose, tinh bột và cellulose là những carbohydrate phổ biến trong tự nhiên và có nhiều ứng dụng trong cuộc sống hằng ngày.",
      },
      {
        kind: "text",
        title: "2. Glucose và saccharose: trạng thái tự nhiên và tính chất vật lí",
        body:
          "Glucose có công thức phân tử C₆H₁₂O₆, dạng tinh thể không màu (khối lượng riêng 1,56 g/cm³), không mùi, có vị ngọt. Glucose tan tốt trong nước. Glucose là loại đường có trong nhiều trái cây chín (đặc biệt nho chín). Glucose cũng có trong máu, đóng vai trò là nguồn năng lượng chính cho các hoạt động ở tế bào.\n" +
          "Saccharose có công thức phân tử C₁₂H₂₂O₁₁, dạng tinh thể không màu (khối lượng riêng 1,58 g/cm³), không mùi, có vị ngọt. Saccharose tan tốt trong nước. Saccharose là loại đường có nhiều trong mía, củ cải đường, thốt nốt.",
      },
      {
        kind: "text",
        title: "Thí nghiệm: Phản ứng tráng bạc của glucose",
        body:
          "Chuẩn bị: dung dịch glucose 10%, dung dịch AgNO₃ 1%, dung dịch NH₃ 5%, cốc nước nóng, ống nghiệm.\n" +
          "Tiến hành: cho khoảng 1 mL dung dịch AgNO₃ 1% vào ống nghiệm. Thêm từ từ dung dịch NH₃ 5% vào ống nghiệm và lắc đều đến khi kết tủa tan hoàn toàn. Cho khoảng 1 mL dung dịch glucose 10% vào ống nghiệm, lắc đều. Đặt ống nghiệm vào cốc đựng nước nóng (khoảng 70 – 80 °C), để yên khoảng 5 phút.\n" +
          "Kết quả: trên thành ống nghiệm xuất hiện lớp bạc kim loại sáng bóng như gương (phản ứng tráng bạc). Saccharose không có phản ứng này.",
      },
      {
        kind: "text",
        title: "3. Tính chất hoá học",
        body:
          "a) Phản ứng tráng bạc của glucose: tính chất đặc trưng của glucose là có phản ứng hoá học với silver nitrate trong dung dịch ammonia tạo ra bạc kim loại. Phản ứng này được dùng để tráng bạc kim loại trong sản xuất gương soi, nên có tên là phản ứng tráng bạc.\n" +
          "C₆H₁₂O₆ + Ag₂O →(dung dịch NH₃, t°) C₆H₁₂O₇ + 2Ag\n" +
          "Saccharose không có phản ứng này.\n" +
          "b) Phản ứng lên men rượu của glucose: dưới tác dụng của enzyme, glucose bị lên men tạo thành ethylic alcohol. Phản ứng này được sử dụng để sản xuất bia, rượu hay các đồ uống có cồn khác.\n" +
          "C₆H₁₂O₆ →(enzyme) 2C₂H₅OH + 2CO₂\n" +
          "c) Phản ứng thuỷ phân của saccharose: phản ứng đặc trưng của saccharose là thuỷ phân (trong môi trường acid hoặc dưới tác dụng của enzyme) sinh ra glucose và fructose (một loại đường có công thức phân tử giống glucose nhưng khác công thức cấu tạo):\n" +
          "C₁₂H₂₂O₁₁ + H₂O →(enzyme hoặc acid, t°) C₆H₁₂O₆ (glucose) + C₆H₁₂O₆ (fructose)",
      },
      {
        kind: "text",
        title: "4. Vai trò và ứng dụng",
        body:
          "a) Vai trò: glucose hình thành ở thực vật qua quá trình quang hợp và ở động vật qua quá trình tiêu hoá carbohydrate. Glucose là nguồn năng lượng chính cho cả thực vật và động vật, cung cấp năng lượng cho các tế bào, hỗ trợ tăng trưởng và trao đổi chất. Saccharose có vai trò cung cấp năng lượng cho cơ thể nên được sử dụng phổ biến làm nguyên liệu trong công nghiệp thực phẩm. Tiêu thụ nhiều glucose, saccharose trong thời gian dài có nguy cơ bị béo phì và mắc các bệnh khác như tiểu đường, tim mạch,...\n" +
          "b) Ứng dụng: glucose được dùng làm nguyên liệu trong công nghiệp dược phẩm, thực phẩm. Ngoài ra, glucose cũng là nguyên liệu để sản xuất đồ uống có cồn và tráng gương (Hình 29.3). Saccharose được sử dụng làm chất tạo ngọt cho nhiều loại đồ uống và bánh kẹo.",
      },
    ],
  },
  {
    lessonNumber: 30,
    summary: "Tinh bột và cellulose đều là carbohydrate (C₆H₁₀O₅)ₙ bị thuỷ phân hoàn toàn tạo glucose; hồ tinh bột hoá xanh tím với iodine còn cellulose thì không.",
    objectives: [
      "Nêu được trạng thái tự nhiên, tính chất vật lí của tinh bột và cellulose.",
      "Trình bày được tính chất hoá học của tinh bột và cellulose: phản ứng thuỷ phân; hồ tinh bột có phản ứng màu với iodine. Viết được các phương trình hoá học của phản ứng thuỷ phân dưới dạng công thức phân tử.",
      "Tiến hành được (hoặc quan sát qua video) thí nghiệm phản ứng thuỷ phân; phản ứng màu của hồ tinh bột với iodine; nêu được hiện tượng thí nghiệm, nhận xét và rút ra kết luận về tính chất hoá học của tinh bột và cellulose.",
      "Trình bày được ứng dụng của tinh bột và cellulose trong đời sống và sản xuất, sự tạo thành tinh bột, cellulose và vai trò của chúng trong cây xanh.",
      "Nêu được tầm quan trọng của sự tạo thành tinh bột, cellulose trong cây xanh.",
      "Nhận biết được các loại lương thực, thực phẩm giàu tinh bột và biết cách sử dụng hợp lí tinh bột.",
    ],
    requirements: [
      "Tìm hiểu các sản phẩm chứa tinh bột và cellulose trong gia đình như thực phẩm, quần áo, đồ gia dụng,... để hiểu rõ hơn về sự phổ biến cũng như cách sử dụng hiệu quả chúng trong cuộc sống.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Tính chất vật lí và trạng thái tự nhiên",
        body:
          "Tinh bột, có công thức phân tử (C₆H₁₀O₅)ₙ, là chất rắn, dạng bột, màu trắng, không tan trong nước lạnh, nhưng tan một phần trong nước nóng tạo hệ keo, gọi là hồ tinh bột. Cellulose, có công thức phân tử (C₆H₁₀O₅)ₘ, là chất rắn, dạng sợi, màu trắng, không tan trong nước và các dung môi hữu cơ thông thường.\n" +
          "Tinh bột và cellulose được tìm thấy chủ yếu ở thực vật. Tinh bột tập trung nhiều ở hạt, củ và quả của cây. Các loại hạt và củ chứa nhiều tinh bột là gạo, ngô, khoai, sắn,... Cellulose tập trung nhiều ở thân cây và vỏ cây. Các loại cây thân gỗ, quả bông, các loại tre, nứa và vỏ các cây đay, gai chứa hàm lượng cellulose cao.\n" +
          "Sự hình thành tinh bột và cellulose ở thực vật bắt đầu từ phản ứng quang hợp. Phản ứng đã chuyển hoá carbon dioxide và nước thành glucose và giải phóng khí oxygen, quá trình này đóng góp phần cân bằng lượng khí carbon dioxide và khí oxygen trong bầu khí quyển. Một phần glucose sau đó được biến đổi tiếp thành tinh bột và cellulose (Hình 30.1: CO₂ + H₂O →(quang hợp, giải phóng O₂) glucose → cellulose (xây dựng cấu trúc) / tinh bột (dự trữ năng lượng)).\n" +
          "Tinh bột đóng vai trò quan trọng trong việc dự trữ năng lượng: cây có thể sử dụng năng lượng dự trữ này trong các điều kiện thiếu glucose. Khác với tinh bột, vai trò chính của cellulose là xây dựng thành tế bào thực vật và giúp duy trì độ cứng, hình dáng của cây.",
      },
      {
        kind: "text",
        title: "Thí nghiệm 1: Phản ứng màu của hồ tinh bột với iodine",
        body:
          "Chuẩn bị: dung dịch hồ tinh bột, dung dịch iodine, ống nghiệm.\n" +
          "Tiến hành: thêm 5 mL dung dịch hồ tinh bột vào ống nghiệm, sau đó nhỏ vài giọt dung dịch iodine vào ống nghiệm.\n" +
          "Kết quả: hồ tinh bột phản ứng với iodine tạo ra hợp chất có màu xanh tím.",
      },
      {
        kind: "text",
        title: "Thí nghiệm 2: Thuỷ phân tinh bột",
        body:
          "Chuẩn bị: dung dịch hồ tinh bột, dung dịch HCl 2 M, dung dịch iodine; ống nghiệm, cốc thuỷ tinh chịu nhiệt 100 mL, đèn cồn hoặc bếp điện.\n" +
          "Tiến hành: đổ 50 mL nước vào cốc thuỷ tinh và đun sôi nước bằng đèn cồn hoặc bếp điện. Lấy hai ống nghiệm, đánh số (1) và (2). Thêm khoảng 3 mL dung dịch hồ tinh bột vào mỗi ống. Tiếp theo, thêm 1 mL dung dịch HCl 2 M vào ống nghiệm (1). Đặt cả hai ống nghiệm vào cốc nước sôi và đun trong khoảng 10 phút. Lấy hai ống nghiệm ra và để nguội. Nhỏ vài giọt dung dịch iodine vào ống nghiệm (1) và (2).\n" +
          "Kết quả dự kiến: ống nghiệm (2) (không có acid) vẫn xuất hiện màu xanh tím; ống nghiệm (1) (có HCl, đã đun) không còn màu xanh tím vì tinh bột đã bị thuỷ phân. Phản ứng hoá học xảy ra ở ống nghiệm (1).",
      },
      {
        kind: "text",
        title: "2. Tính chất hoá học",
        body:
          "Tinh bột và cellulose đều có thể bị thuỷ phân tạo thành glucose trong môi trường acid hoặc dưới tác dụng của enzyme. Enzyme trong quá trình thuỷ phân tinh bột khác với enzyme dùng để thuỷ phân cellulose. Cơ thể người chỉ có enzyme thuỷ phân tinh bột (ở tuyến nước bọt và ở ruột non) mà không có enzyme thuỷ phân cellulose.\n" +
          "(C₆H₁₀O₅)ₙ + nH₂O →(enzyme hoặc acid, t°) nC₆H₁₂O₆ (glucose)\n" +
          "Thuỷ phân tinh bột tạo ra glucose, do đó quá trình tiêu hoá thức ăn giàu tinh bột sẽ tạo ra nhiều năng lượng cho cơ thể hoạt động.\n" +
          "Khác với cellulose, tinh bột phản ứng với iodine tạo hợp chất có màu xanh tím.",
      },
      {
        kind: "text",
        title: "3. Ứng dụng",
        body:
          "Tinh bột là một trong những nguồn dinh dưỡng chính của con người, đặc biệt có nhiều trong gạo, bột mì và bột ngô (bắp),... Trong công nghiệp, ứng dụng chính của tinh bột là sản xuất hồ dán, làm nguyên liệu sản xuất ethylic alcohol và một số hoá chất khác.\n" +
          "Một lượng lớn cellulose được sử dụng để sản xuất giấy và tơ sợi. Cellulose dưới dạng gỗ tự nhiên hoặc gỗ chế biến là vật liệu thông dụng. Cellulose còn là nguyên liệu tổng hợp nhiều hoá chất như ethylic alcohol,...\n" +
          "Hình 30.2: ứng dụng của tinh bột (cơm, rượu) và của cellulose (vật dụng bằng giấy, nhà gỗ và vật dụng gỗ, cồn công nghiệp).",
      },
    ],
  },
  {
    lessonNumber: 31,
    summary: "Protein là hợp chất hữu cơ phức tạp, phân tử gồm nhiều amino acid liên kết bằng liên kết peptide; protein bị đông tụ khi gặp acid, base hoặc nhiệt độ và bị thuỷ phân tạo amino acid.",
    objectives: [
      "Nêu được khái niệm, đặc điểm cấu tạo phân tử (do nhiều amino acid tạo nên, liên kết peptide) và khối lượng phân tử của protein.",
      "Trình bày được tính chất hoá học của protein: phản ứng thuỷ phân có xúc tác acid, base hoặc enzyme; bị đông tụ khi có tác dụng của acid, base hoặc nhiệt độ; dễ bị phân huỷ khi đun nóng mạnh.",
      "Tiến hành được (hoặc quan sát qua video) thí nghiệm về tính chất của protein: bị đông tụ khi có tác dụng của HCl, nhiệt độ, dễ bị phân huỷ khi đun nóng mạnh.",
      "Phân biệt được protein (len lông cừu, tơ tằm) với các chất khác (tơ nylon).",
      "Trình bày được vai trò của protein đối với cơ thể con người.",
    ],
    requirements: [
      "Lựa chọn thực phẩm giàu protein cho chế độ ăn uống hằng ngày nhằm cung cấp đủ lượng protein cần thiết, giúp cơ thể phát triển khoẻ mạnh.",
      "Vận dụng tính chất của protein trong chế biến thực phẩm.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Khái niệm và cấu tạo",
        body:
          "Protein là những hợp chất hữu cơ phức tạp có khối lượng phân tử rất lớn, gồm nhiều đơn vị amino acid liên kết với nhau bởi liên kết peptide.\n" +
          "Khối lượng phân tử của protein rất lớn, thường từ khoảng vài chục nghìn đến hàng triệu amu.\n" +
          "Hình 31.1 mô tả một số amino acid (alanine và glycine) và một đoạn mạch protein tạo thành từ các amino acid này: các amino acid giống nhau ở chỗ đều có nhóm amino (–NH₂) và nhóm carboxyl (–COOH), khác nhau ở phần còn lại; chúng kết hợp với nhau bằng liên kết peptide (–CO–NH–) tạo thành mạch protein.",
      },
      {
        kind: "text",
        title: "Thí nghiệm: Tính chất của protein",
        body:
          "Chuẩn bị: lòng trắng trứng, dung dịch HCl 1 M; 3 ống nghiệm, đèn cồn.\n" +
          "Tiến hành: lấy khoảng 2 mL lòng trắng trứng cho vào mỗi ống nghiệm.\n" +
          "1. Thêm vài giọt HCl 1 M vào ống nghiệm thứ nhất.\n" +
          "2. Hơ nóng nhẹ ống nghiệm thứ hai trên ngọn lửa đèn cồn trong khoảng 1 phút.\n" +
          "3. Đun nóng ống nghiệm thứ ba trên ngọn lửa đèn cồn cho đến khi thấy có mùi khét.\n" +
          "Quan sát và nhận xét hiện tượng ở ba ống nghiệm: ống 1 và ống 2: lòng trắng trứng bị đông tụ; ống 3: lòng trắng trứng bị phân huỷ, có mùi khét.",
      },
      {
        kind: "text",
        title: "2. Tính chất hoá học",
        body:
          "Protein bị thay đổi tính chất dưới tác dụng của acid, base hoặc nhiệt độ. Dưới tác dụng của một trong số các tác nhân này, protein có thể bị đông tụ.\n" +
          "Khi bị đun nóng ở nhiệt độ cao và không có nước, protein bị phân huỷ hoặc cháy, tạo ra các chất bay hơi và có mùi khét.\n" +
          "Protein bị thuỷ phân dưới tác dụng của acid, base hoặc enzyme. Quá trình thuỷ phân hoàn toàn protein tạo ra các amino acid cấu thành nên protein đó. Phản ứng thuỷ phân xảy ra tại liên kết peptide:\n" +
          "Protein + H₂O →(acid/base/enzyme) Amino acid",
      },
      {
        kind: "text",
        title: "3. Vai trò và ứng dụng của protein",
        body:
          "Protein có nhiều trong sữa, trứng, thịt, cá, kén tằm (Hình 31.2).\n" +
          "Trong cơ thể người, các protein có cấu trúc đa dạng tương ứng với các vai trò quan trọng khác nhau, như vai trò cấu trúc (cấu tạo nên cơ bắp, da, tóc,...), vai trò xúc tác (các enzyme), vai trò nội tiết tố (các loại hormone), vai trò vận chuyển (như hemoglobin vận chuyển oxygen đến các tế bào),...\n" +
          "Protein là một trong những nguồn thực phẩm quan trọng. Một số protein được dùng làm nguyên liệu sản xuất một loại tơ sợi tự nhiên (như tơ tằm). Khi đốt cháy, các loại tơ này sẽ có mùi khét đặc trưng (giống mùi tóc cháy) nên có thể dùng phương pháp này để phân biệt tơ tự nhiên với loại tơ tổng hợp (như tơ nylon).",
      },
    ],
  },
  {
    lessonNumber: 32,
    summary: "Polymer là chất có khối lượng phân tử rất lớn do nhiều mắt xích liên kết; polymer có nhiều ứng dụng (chất dẻo, tơ, cao su, composite) nhưng cần sử dụng hợp lí để giảm ô nhiễm môi trường.",
    objectives: [
      "Nêu được khái niệm polymer, monomer, mắt xích,...; cấu tạo, phân loại polymer (polymer thiên nhiên và polymer tổng hợp).",
      "Trình bày được tính chất vật lí chung của polymer (trạng thái, khả năng tan).",
      "Viết được các phương trình hoá học của phản ứng điều chế PE, PP từ các monomer.",
      "Nêu được khái niệm chất dẻo, tơ, cao su, vật liệu composite và cách sử dụng, bảo quản một số vật dụng làm bằng chất dẻo, tơ, cao su trong gia đình an toàn, hiệu quả.",
      "Trình bày được ứng dụng của polyethylene; vấn đề ô nhiễm môi trường khi sử dụng polymer không phân huỷ sinh học (polyethylene) và các cách hạn chế gây ô nhiễm môi trường khi sử dụng vật liệu polymer trong đời sống.",
    ],
    requirements: [
      "Nhận biết được các vật dụng làm từ polymer và biết cách sử dụng, bảo quản một số vật dụng làm bằng chất dẻo, tơ, cao su trong gia đình an toàn, hiệu quả.",
      "Biết cách phân loại để tái chế một số rác thải nhựa.",
      "Biết được các tác hại của rác thải nhựa, từ đó có biện pháp để giảm thiểu rác thải nhựa.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Khái niệm, đặc điểm cấu tạo và phân loại",
        body:
          "Khái niệm: polymer là những chất có khối lượng phân tử rất lớn do nhiều đơn vị nhỏ (gọi là mắt xích) liên kết với nhau tạo nên. Các phân tử nhỏ kết hợp với nhau tạo nên polymer được gọi là monomer.\n" +
          "Tinh bột có công thức chung (C₆H₁₀O₅)ₙ, được tạo thành do hàng nghìn đơn vị glucose kết hợp với nhau; các đơn vị glucose (C₆H₁₀O₅) này được gọi là mắt xích.\n" +
          "Một số ví dụ (Bảng 32.1): polyethylene (PE) (–CH₂–CH₂–)ₙ, monomer là ethylene CH₂=CH₂, mắt xích –CH₂–CH₂–; polypropylene (PP) (–CH₂–CH(CH₃)–)ₙ, monomer là propylene CH₂=CH–CH₃, mắt xích –CH₂–CH(CH₃)–.\n" +
          "Đặc điểm cấu tạo: các mắt xích của polymer có thể nối với nhau thành mạch không phân nhánh như amylose (Hình 32.1a); mạch phân nhánh như amylopectin, glycogen (Hình 32.1b); mạng không gian như nhựa bakelite, cao su lưu hoá (Hình 32.1c).\n" +
          "Phân loại theo nguồn gốc: polymer thiên nhiên (có sẵn trong tự nhiên như tinh bột, cellulose, protein (sợi tơ tằm, lông cừu), cao su thiên nhiên,...) và polymer tổng hợp (được tổng hợp bằng phương pháp hoá học, ví dụ PE, PP,...).\n" +
          "Điều chế: nCH₂=CH₂ →(t°, p, xúc tác) (–CH₂–CH₂–)ₙ (PE);  nCH₂=CH–CH₃ →(t°, p, xúc tác) (–CH₂–CH(CH₃)–)ₙ (PP).",
      },
      {
        kind: "text",
        title: "2. Tính chất vật lí của polymer",
        body:
          "Hầu hết polymer là những chất rắn, không bay hơi, không có nhiệt độ nóng chảy xác định (một số polymer không nóng chảy) và không tan trong nước. Một số polymer tan được trong dung môi hữu cơ.\n" +
          "Các polymer bị nóng chảy ở nhiệt độ cao được gọi là các polymer nhiệt dẻo. Tính chất này được ứng dụng trong sản xuất bằng cách cho nóng chảy polymer, sau đó đổ vào khuôn tạo hình rồi làm nguội sẽ thu được các vật dụng có hình thù mong muốn.",
      },
      {
        kind: "text",
        title: "3. Một số vật liệu polymer phổ biến",
        body:
          "a) Chất dẻo: chất dẻo là loại vật liệu được chế tạo từ các polymer có tính dẻo. Tính dẻo của vật liệu là tính bị biến dạng khi chịu tác dụng của nhiệt, áp lực bên ngoài và vẫn giữ được sự biến dạng đó khi thôi tác dụng. Thành phần của chất dẻo gồm polymer, chất độn, chất hoá dẻo, chất tạo màu,... Chất dẻo dễ bị mềm dẻo ở môi trường nhiệt độ cao, một số bị phân huỷ tạo thành các sản phẩm độc hại. Vì vậy, không để các vật dụng làm từ chất dẻo ở gần nguồn nhiệt cao (bếp gas, lò nướng,...). Trên các vỏ chai, hộp, đồ dùng bằng nhựa thường có các kí hiệu an toàn và kí hiệu phân loại nhựa; cần tìm hiểu thông tin để lựa chọn đồ nhựa phù hợp với mục đích sử dụng (Hình 32.3).\n" +
          "b) Tơ: tơ là những vật liệu polymer có cấu tạo không phân nhánh và có thể kéo dài thành sợi. Dựa vào nguồn gốc, tơ thường được chia thành: tơ thiên nhiên (như tơ tằm, bông vải, len lông cừu,...); tơ tổng hợp (như tơ nylon, tơ polyester,...). Mỗi loại tơ có các tính chất đặc trưng khác nhau nên khi sử dụng các vật dụng làm từ tơ (quần áo, chăn, ga,...) được bền, đẹp, cần đọc kĩ hướng dẫn sử dụng trước khi giặt là để lựa chọn chế độ giặt (nếu giặt bằng máy), nhiệt độ là, sấy và chất giặt rửa phù hợp.\n" +
          "c) Cao su: cao su là vật liệu polymer có tính đàn hồi (tính bị biến dạng khi bị tác dụng của lực bên ngoài và trở lại trạng thái ban đầu khi lực đó thôi tác dụng). Cao su được phân thành hai loại: cao su thiên nhiên (được lấy từ mủ cây cao su) và cao su tổng hợp (được tổng hợp từ một số monomer). Cao su có tính đàn hồi, không thấm nước, không thấm khí, chịu mài mòn, cách điện,... nên được sử dụng rộng rãi trong nhiều lĩnh vực như sản xuất các loại lốp xe, băng tải cao su, ống dẫn, gioăng đệm, áo lặn,... Khi sử dụng, chú ý không để ở nơi có nhiệt độ quá cao, nơi có nhiệt độ quá thấp hoặc nơi có ánh sáng mạnh; hạn chế để xăng, dầu, mỡ, hoá chất dính vào cao su.\n" +
          "d) Vật liệu composite: vật liệu composite là vật liệu được tổ hợp từ hai hay nhiều vật liệu khác nhau, gồm vật liệu cốt và vật liệu nền. Vật liệu cốt có vai trò tăng cường tính chất cơ học của vật liệu, thường ở dạng sợi (sợi thuỷ tinh, sợi carbon,...) và dạng hạt. Vật liệu nền thường là các vật liệu có độ dẻo lớn (như một số polymer) đóng vai trò liên kết các vật liệu cốt với nhau. Vật liệu composite được sử dụng rộng rãi như làm ống dẫn nước, bồn chứa nước và hoá chất, vật liệu xây dựng, thân vỏ ô tô, máy bay, tàu thuyền,...",
      },
      {
        kind: "text",
        title: "4. Ứng dụng của polyethylene và vấn đề ô nhiễm môi trường",
        body:
          "Polyethylene (PE) là một polymer được sử dụng rất phổ biến để tạo ra nhiều sản phẩm gia dụng như tải đựng, màng bọc, chai, ống nhựa, vỏ dây điện, đồ chơi trẻ em,... (Hình 32.6).\n" +
          "Hiện nay ô nhiễm môi trường gây ra do sử dụng polyethylene và các polymer không phân huỷ sinh học đang ở mức đáng báo động, ảnh hưởng đến môi trường sinh thái, sự sinh trưởng, phát triển của động, thực vật và sức khoẻ con người. Việc lạm dụng các sản phẩm nhựa được làm từ polyethylene (túi, chai, lọ, bình nhựa, cốc, thìa nhựa dùng một lần,...) đã và đang để lại những hậu quả nghiêm trọng đối với môi trường.\n" +
          "Để hạn chế tình trạng gây ô nhiễm môi trường khi sử dụng vật liệu polymer, theo khuyến cáo của Bộ Tài nguyên và Môi trường, cần áp dụng nguyên tắc 5R để giảm thiểu rác thải nhựa (Hình 32.7): Đổi mới công nghệ (Renew – sử dụng vật liệu polymer được sản xuất từ nguyên liệu tái tạo hoặc có thể phân huỷ sinh học); Từ chối (Refuse – từ chối các sản phẩm làm từ nhựa không phân huỷ sinh học, lựa chọn các sản phẩm làm từ vật liệu thân thiện môi trường); Giảm thiểu (Reduce – giảm thiểu sử dụng các đồ vật bằng nhựa sử dụng một lần, thay thế bằng vật dụng có thể sử dụng nhiều lần); Tái sử dụng (Reuse – tái sử dụng các đồ dùng bằng vật liệu polymer thành các sản phẩm hữu dụng phục vụ đời sống); Tái chế (Recycle – thu gom, phân loại các loại nhựa có thể tái chế, tránh vứt bỏ ra môi trường).",
      },
    ],
  },
  // ------------------------------------------------------------------ CHƯƠNG X
  {
    lessonNumber: 33,
    summary: "Vỏ Trái Đất chứa nhiều nhất oxygen, silicon, nhôm, sắt, calcium, natri, kali, magnesium; các dạng chất chủ yếu là oxide và muối; khai thác tài nguyên cần tiết kiệm, bảo vệ và sử dụng vật liệu tái chế.",
    objectives: [
      "Nêu được hàm lượng các nguyên tố hoá học chủ yếu trong vỏ Trái Đất.",
      "Phân loại được các dạng chất chủ yếu trong vỏ Trái Đất (oxide, muối,...).",
      "Trình bày được những lợi ích cơ bản về kinh tế, xã hội từ việc khai thác vỏ Trái Đất (nhiên liệu, vật liệu, nguyên liệu); lợi ích của sự tiết kiệm và bảo vệ nguồn tài nguyên, sử dụng vật liệu tái chế,... phục vụ cho sự phát triển bền vững.",
    ],
    requirements: [
      "Nêu được thành phần hoá học và công dụng của một số loại đất, đá thông dụng trong cuộc sống.",
      "Giải thích được vì sao cần sử dụng tiết kiệm các nguyên liệu, vật liệu và nhiên liệu khai thác từ tài nguyên thiên nhiên, ưu tiên sử dụng vật liệu tái chế.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Hàm lượng các nguyên tố hoá học chủ yếu trong vỏ Trái Đất",
        body:
          "Vỏ Trái Đất là phần cứng (đất, đá) ở ngoài cùng của Trái Đất. Vỏ Trái Đất có bề dày trung bình khoảng 7 km (dưới đáy đại dương) và 35 km (trên các lục địa). Hầu hết các nguyên tố hoá học đều được tìm thấy ở vỏ Trái Đất, trong đó nhiều nhất là oxygen, silicon, nhôm, sắt, calcium, natri, kali (potassium), magnesium.\n" +
          "Bảng 33.1 – Hàm lượng các nguyên tố hoá học chủ yếu trong vỏ Trái Đất (% khối lượng): O 46,10; Si 28,20; Al 8,23; Fe 5,63; Ca 4,15; Na 2,36; K 2,09; Mg 2,33.\n" +
          "Nhận xét: oxygen và silicon là hai nguyên tố chiếm hàm lượng lớn nhất (tổng khoảng 74,3%).",
      },
      {
        kind: "text",
        title: "2. Các dạng chất chủ yếu trong vỏ Trái Đất",
        body:
          "Lớp vỏ cứng của Trái Đất được tạo thành từ nhiều loại đất, đá và chứa các khoáng chất khác nhau. Thành phần chủ yếu của các khoáng chất này là các oxide và muối.\n" +
          "Các oxide phổ biến nhất là SiO₂ và Al₂O₃. Silicon oxide là thành phần chính của cát trắng, thạch anh (quartz). Aluminium oxide có nhiều trong quặng bauxite.\n" +
          "Muối silicate có trong mica, feldspar, đá hoa cương,... Muối carbonate có trong đá vôi, đá phấn, dolomite, đá cẩm thạch,...\n" +
          "Một số loại đá (Hình 33.1): thạch anh (SiO₂); dolomite (CaCO₃·MgCO₃); đá hoa cương, còn gọi là đá granite (muối silicate của Al, Na, K, Ca,...); đá cẩm thạch (CaCO₃, CaCO₃·MgCO₃,...).",
      },
      {
        kind: "text",
        title: "3. Khai thác tài nguyên từ vỏ Trái Đất",
        body:
          "Nhiều nhiên liệu, nguyên liệu, vật liệu phục vụ cho hoạt động sống và sản xuất của con người được khai thác từ vỏ Trái Đất. Các nhiên liệu như dầu, than và khí đốt được khai thác từ mỏ dầu, mỏ than và mỏ khí thiên nhiên. Các quặng giàu nguyên tố kim loại như nhôm, sắt, đồng,... được khai thác để sản xuất kim loại hay hợp kim, dùng làm vật liệu cho các ngành công nghiệp. Các quặng giàu nguyên tố phi kim như lưu huỳnh, phosphorus, nitrogen dùng làm nguyên liệu để sản xuất hoá chất và phân bón. Đá vôi dùng làm nguyên liệu cho ngành sản xuất vật liệu xây dựng, công nghiệp silicate,...\n" +
          "Hoạt động khai thác tài nguyên sẵn có từ vỏ Trái Đất đã đem lại lợi ích kinh tế, xã hội to lớn. Tuy nhiên, sau nhiều năm khai thác, các mỏ này đang dần cạn kiệt, đồng thời xuất hiện các bãi phế thải khổng lồ, gây ô nhiễm môi trường. Do đó, bắt buộc con người phải biết cùng nhau tiết kiệm, bảo vệ nguồn tài nguyên, sử dụng vật liệu tái chế,... để hướng tới sự phát triển bền vững.",
      },
      {
        kind: "text",
        title: "Em đã học",
        body:
          "Các nguyên tố hoá học chủ yếu trong vỏ Trái Đất là O, Si, Al, Fe, Ca, Na, K,... Lớp đất, đá tạo thành vỏ Trái Đất, có thành phần hoá học là các oxide (SiO₂, Al₂O₃,...), các muối (silicate, carbonate,...), các loại quặng giàu các nguyên tố kim loại và phi kim,... Các mỏ dầu, than, khí thiên nhiên là nguồn năng lượng quý của con người. Việc khai thác tài nguyên từ vỏ Trái Đất để làm nhiên liệu, vật liệu, nguyên liệu đem lại nguồn lợi ích kinh tế khổng lồ. Cần tiết kiệm và bảo vệ nguồn tài nguyên, sử dụng vật liệu tái chế,... phục vụ cho sự phát triển bền vững.",
      },
    ],
  },
  {
    lessonNumber: 34,
    summary: "Đá vôi (thành phần chính CaCO₃) được khai thác để làm vôi sống, vôi tôi, xi măng, thuỷ tinh; silicon và hợp chất silicate là nguyên liệu của công nghiệp gốm, sứ, thuỷ tinh, xi măng.",
    objectives: [
      "Trình bày được nguồn đá vôi, thành phần chính của đá vôi trong tự nhiên; các ứng dụng từ đá vôi: sản phẩm đá vôi nghiền, calcium oxide, calcium hydroxide, nguyên liệu sản xuất xi măng.",
      "Nêu được một số ứng dụng quan trọng của silicon và hợp chất của silicon.",
      "Trình bày được sơ lược ngành công nghiệp silicate.",
      "Mô tả được các công đoạn chính sản xuất đồ gốm, thuỷ tinh, xi măng.",
    ],
    requirements: [
      "Đưa ra được ví dụ minh hoạ cho các ứng dụng quan trọng của silicon và các hợp chất của nó trong đời sống.",
      "Kể được tên các ngành sản xuất sử dụng nguyên liệu là đá vôi, đất sét, cát.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Khai thác đá vôi: nguồn đá vôi và thành phần chính",
        body:
          "Đá vôi có nhiều ở vỏ Trái Đất, được tìm thấy ở những dãy núi đá, mỏ đá hay những bãi vỏ, xương động vật (san hô, vỏ ngao, ốc,...) ở ven biển (hoặc trước đây là ven biển). Ở nước ta, các dãy núi đá vôi tập trung nhiều ở các tỉnh thuộc Bắc Bộ và Bắc Trung Bộ.\n" +
          "Các bước chính khai thác đá vôi: khoan và nổ mìn (khoan lỗ vào đá và lấp đầy chúng bằng chất nổ, chất nổ sau đó được kích nổ, phá vỡ đá thành nhiều mảnh nhỏ hơn); bốc xếp và vận chuyển đá đến nhà máy; chế biến đá vôi (đá vôi được đập nhỏ và phân loại, sau đó được xử lí để sử dụng trong các ngành công nghiệp khác nhau). Việc khai thác đá vôi có thể gây ra các tác động đến môi trường, bao gồm xói mòn đất, ô nhiễm nước và phá huỷ môi trường sống; vì vậy cần được quy hoạch, cấp phép và thực hiện các biện pháp để giảm thiểu những tác động này.\n" +
          "Thành phần chính của đá vôi là calcium carbonate (CaCO₃). Calcium carbonate là chất rắn màu trắng, không tan trong nước. Đá vôi thường lẫn tạp chất nên có nhiều màu sắc khác nhau.\n" +
          "Em có biết: calcium carbonate tan dần trong nước có chứa khí carbon dioxide tạo ra muối tan là calcium hydrogen carbonate Ca(HCO₃)₂; vì vậy đá vôi trong tự nhiên bị bào mòn bởi nước mưa, tạo thành các hang động.",
      },
      {
        kind: "text",
        title: "2. Ứng dụng từ đá vôi",
        body:
          "Đá vôi được sử dụng trong nhiều ngành như: xây dựng, công nghiệp, nông nghiệp.\n" +
          "a) Đá vôi nghiền: đá vôi được nghiền thành hạt nhỏ mịn, dùng làm chất độn cao su trong sản xuất săm lốp xe, chất độn trong sản xuất chất dẻo,...; được sử dụng nhiều trong công nghiệp thuỷ tinh, xi măng,...\n" +
          "b) Calcium oxide, calcium hydroxide: nung nóng đá vôi ở nhiệt độ cao xảy ra phản ứng phân huỷ tạo thành vôi sống (thành phần chính là calcium oxide): CaCO₃ →(t°) CaO + CO₂. Calcium oxide (CaO) là chất rắn, màu trắng, hút ẩm mạnh, phản ứng với nước tạo calcium hydroxide: CaO + H₂O → Ca(OH)₂. Calcium oxide được sử dụng làm nguyên liệu sản xuất thuỷ tinh, làm chất tạo xỉ trong luyện kim và còn được dùng trong xử lí nước thải, khử chua cho đất, khử trùng. Calcium hydroxide (Ca(OH)₂) là chất rắn, màu trắng, ít tan trong nước, tạo dung dịch base mạnh (gọi là nước vôi trong). Calcium hydroxide có nhiều ứng dụng như khử chua đất trồng, sản xuất clorua vôi dùng để tẩy trắng và khử trùng,...",
      },
      {
        kind: "text",
        title: "3. Công nghiệp silicate: silicon và hợp chất của silicon",
        body:
          "Silicon là nguyên tố phổ biến thứ hai trong vỏ Trái Đất (chiếm 28,2% về khối lượng), chỉ sau oxygen.\n" +
          "Trong tự nhiên, silicon chỉ tồn tại ở dạng hợp chất, chủ yếu là oxide (SiO₂) có trong thạch anh, các loại cát, đất sét như cao lanh, mica,... hoặc muối silicate có trong đất sét, cao lanh, mica,... Các hợp chất và khoáng chất này được sử dụng làm nguyên liệu cho công nghiệp silicate, sản xuất gốm, sứ, thuỷ tinh, xi măng,...\n" +
          "Silicon tinh khiết là vật liệu bán dẫn, được sử dụng rộng rãi để chế tạo các vi mạch điện tử, thiết bị quang điện, cảm biến, pin Mặt Trời,... Thạch anh (SiO₂ gần nguyên chất) được sử dụng trong máy phát siêu âm, dụng cụ quang học, sản phẩm thuỷ tinh chịu nhiệt, sợi cáp quang,...",
      },
      {
        kind: "text",
        title: "4. Ngành công nghiệp silicate",
        body:
          "Công nghiệp silicate bao gồm các ngành sản xuất đồ gốm, thuỷ tinh, xi măng.\n" +
          "a) Sản xuất đồ gốm: gạch ngói – nghiền, phối trộn nguyên liệu (đất sét, nước,...) thành khối dẻo; tạo hình; phơi (sấy) khô sản phẩm thô; nung sản phẩm thô trong lò ở nhiệt độ cao trong khoảng thời gian thích hợp. Đồ sứ – nghiền, phối trộn nguyên liệu (đất sét trắng, cát trắng, nước,...) thành khối dẻo; tạo hình; phơi (sấy) khô sản phẩm thô; nung sản phẩm thô lần thứ nhất trong lò ở nhiệt độ cao; tráng men, trang trí lên sản phẩm rồi nung lần hai.\n" +
          "Nước ta có nhiều nhà máy sản xuất gốm, sứ lớn ở Hà Nội, Hải Dương, Thành phố Hồ Chí Minh, Bình Dương, Đồng Nai,... và các làng nghề sản xuất gốm nổi tiếng như Bát Tràng (Hà Nội), Phù Lãng (Bắc Ninh), Thổ Hà (Bắc Giang), Thanh Hà (Hội An), Bàu Trúc (Ninh Thuận),...\n" +
          "b) Sản xuất thuỷ tinh: thuỷ tinh loại thông thường (được dùng làm cửa kính, chai lọ,...) là hỗn hợp của sodium silicate, calcium silicate. Thuỷ tinh loại này được sản xuất từ các nguyên liệu: cát thạch anh (cát trắng), đá vôi và soda (Na₂CO₃). Các công đoạn chính sản xuất thuỷ tinh: trộn hỗn hợp cát trắng, đá vôi, soda theo tỉ lệ thích hợp; nung hỗn hợp trong lò ở nhiệt độ cao khoảng 1 400 °C thành thuỷ tinh dạng nhão; làm nguội từ từ được thuỷ tinh dẻo, ép thổi thuỷ tinh dẻo thành các đồ vật.\n" +
          "CaCO₃ →(t°) CaO + CO₂;  CaO + SiO₂ →(t°) CaSiO₃;  Na₂CO₃ + SiO₂ →(t°) Na₂SiO₃ + CO₂\n" +
          "c) Sản xuất xi măng: xi măng là một loại vật liệu kết dính, được dùng trong xây dựng, đó là chất bột mịn, thường có màu lục xám. Xi măng được sản xuất bằng cách nghiền nhỏ đá vôi, trộn với đất sét có nhiều SiO₂ và một ít quặng sắt rồi nung hỗn hợp trong lò quay, hoặc lò đứng ở 1 400 – 1 600 °C. Sau khi nung, thu được hỗn hợp rắn, màu xám gọi là clanke (clinker). Nghiền clanke với thạch cao (CaSO₄·2H₂O) (khoảng 5%) và một số chất phụ gia khác thành bột mịn sẽ thu được xi măng.",
      },
      {
        kind: "text",
        title: "Em đã học",
        body:
          "Thành phần chính của đá vôi là CaCO₃. Đá vôi được dùng làm nguyên liệu sản xuất vôi, xi măng, thuỷ tinh, cao su, chất dẻo, gang,... Các hợp chất của silicon có trong cát, cao lanh, đất sét,... là nguyên liệu cho các ngành sản xuất gốm, sứ, thuỷ tinh, xi măng,... Silicon là vật liệu bán dẫn được sử dụng trong ngành công nghiệp điện tử.",
      },
    ],
  },
  {
    lessonNumber: 35,
    summary: "Nhiên liệu hoá thạch (than, dầu mỏ, khí thiên nhiên) cung cấp phần lớn năng lượng nhưng cạn kiệt dần và thải ra CO₂, CH₄ gây hiệu ứng nhà kính, ấm lên toàn cầu; carbon luân chuyển trong chu trình carbon tự nhiên.",
    objectives: [
      "Nêu được khái niệm nhiên liệu hoá thạch.",
      "Trình bày được nguồn gốc tự nhiên và nguồn nhân tạo của methane.",
      "Trình bày được lợi ích của việc sử dụng nhiên liệu hoá thạch và thực trạng của việc khai thác nhiên liệu hoá thạch hiện nay.",
      "Nêu được một số giải pháp hạn chế việc sử dụng nhiên liệu hoá thạch.",
      "Nêu được một số dạng tồn tại phổ biến của nguyên tố carbon trong tự nhiên (than, kim cương, carbon dioxide, các muối carbonate, các hợp chất hữu cơ).",
      "Trình bày được sản phẩm và sự phát nhiệt của quá trình đốt cháy than, các hợp chất hữu cơ; chu trình carbon trong tự nhiên và vai trò của carbon dioxide trong chu trình đó.",
      "Nêu được khí carbon dioxide và methane là nguyên nhân chính gây hiệu ứng nhà kính, sự ấm lên toàn cầu.",
      "Trình bày được những bằng chứng của biến đổi khí hậu, thời tiết do tác động của sự ấm lên toàn cầu; những dự đoán về các tác động tiêu cực trước mắt và lâu dài.",
      "Nêu được một số biện pháp giảm lượng khí thải carbon dioxide ở trong nước và ở phạm vi toàn cầu.",
    ],
    requirements: [
      "Vận động mọi người hạn chế sử dụng nhiên liệu hoá thạch (thay bếp than, gas bằng bếp điện, từ đi xe đạp, xe điện thay ô tô chạy xăng, dầu,...).",
      "Trồng rừng và bảo vệ rừng.",
    ],
    knowledge: [
      {
        kind: "text",
        title: "1. Khái niệm nhiên liệu hoá thạch và nguồn gốc hình thành khí methane",
        body:
          "Nhiên liệu hoá thạch là các loại nhiên liệu tự nhiên được tạo thành từ quá trình phân huỷ các sinh vật bị chôn vùi cách đây hàng trăm triệu năm. Các nhiên liệu này chứa hàm lượng carbon cao.\n" +
          "Nhiên liệu hoá thạch tồn tại ở thể rắn, lỏng và khí. Dạng rắn là than mỏ (than đá, than nâu, than bùn,...) chứa hàm lượng chính là carbon. Dạng lỏng là dầu mỏ, có thành phần chủ yếu là các hydrocarbon. Dạng khí chủ yếu là khí mỏ dầu và khí thiên nhiên (có hàm lượng methane lớn), băng cháy (khí tự nhiên đậm đặc ở áp suất cao trên 30 bar và nhiệt độ thấp dưới 0 °C).\n" +
          "Khí methane được hình thành từ các quá trình biến đổi sinh học và địa chất trong tự nhiên. Ngoài ra, một lượng lớn khí methane còn được sinh ra nhân tạo từ các hoạt động của con người như từ sự phân huỷ sinh học các chất hữu cơ trong các bãi rác thải, quá trình sản xuất nông nghiệp, tiêu hoá thức ăn của gia súc, sản xuất công nghiệp và các quá trình chế biến, chưng cất hay sản xuất khí mỏ dầu.\n" +
          "Theo số liệu thống kê của BP, cuối năm 2020, Việt Nam có trữ lượng có thể khai thác: than đá 3,36 tỉ tấn, dầu mỏ 4,4 tỉ thùng và khí thiên nhiên 600 tỉ m³.",
      },
      {
        kind: "text",
        title: "2. Khai thác và sử dụng nhiên liệu hoá thạch",
        body:
          "Thực trạng khai thác: năng lượng hoá thạch là nguồn năng lượng chiếm tỉ lệ lớn nhất trong tổng các nguồn năng lượng khai thác hiện nay. Lượng nhiên liệu hoá thạch được khai thác và tiêu thụ hằng năm trên toàn cầu là rất lớn. Năm 2021, tổng lượng khai thác toàn cầu của dầu mỏ khoảng 95,70 triệu thùng/ngày, khí đốt tự nhiên khoảng 4,177 tỉ mét khối/ngày và than đá khoảng 7,7 tỉ tấn/năm. Năm 1986, tấn dầu mỏ đầu tiên được khai thác ở mỏ Bạch Hổ; năm 1987, Việt Nam bắt đầu xuất khẩu dầu thô.\n" +
          "Lợi ích: nhiên liệu hoá thạch mang lại cho con người rất nhiều lợi ích thiết thực trong cuộc sống. Nhiên liệu này có sẵn trong tự nhiên với trữ lượng lớn, quá trình khai thác dễ dàng và nhanh chóng. Nhiên liệu hoá thạch giữ vai trò rất lớn trong các cuộc cách mạng công nghiệp trên thế giới: than, dầu mỏ và khí thiên nhiên là nguồn nhiên liệu chính cho các nhà máy nhiệt điện, luyện kim, sản xuất xi măng, sản xuất hoá chất, giao thông vận tải,... Chúng đáp ứng được các nhu cầu đa dạng của con người: thắp sáng, sưởi ấm, nấu nướng, đi lại,...\n" +
          "Hạn chế: việc khai thác nhiên liệu hoá thạch với sản lượng lớn đang dẫn đến nguy cơ cạn kiệt nguồn tài nguyên. Mặt khác, quá trình đốt cháy nhiên liệu hoá thạch sinh ra một lượng lớn các chất thải như carbon dioxide, carbon monoxide, các oxide của lưu huỳnh, oxide của nitrogen,... tác động tiêu cực đến môi trường và sức khoẻ con người.\n" +
          "Giải pháp hạn chế sử dụng: thực hiện đồng bộ, tích cực và liên tục: tăng cường tiết kiệm nhiên liệu hoá thạch; tăng cường đi lại bằng phương tiện giao thông công cộng và xe điện; ưu tiên sử dụng xăng pha ethanol, sinh khối, biodiesel; sử dụng lại đồ dùng hay phân loại rác để có thể tái chế đồ dùng; sử dụng năng lượng tái tạo.",
      },
      {
        kind: "text",
        title: "3. Nguồn carbon trong tự nhiên và chu trình carbon",
        body:
          "Trạng thái tự nhiên của carbon: carbon có thể tồn tại ở dạng đơn chất (than chì, kim cương – Hình 35.1), dạng hợp chất vô cơ (carbon dioxide, muối carbonate,...), hợp chất hữu cơ (hydrocarbon, carbohydrate, protein,...).\n" +
          "Chu trình carbon trong tự nhiên: trong tự nhiên luôn có sự chuyển hoá carbon từ dạng này sang dạng khác. Sự chuyển hoá này diễn ra thường xuyên, liên tục và tạo thành chu trình khép kín (Hình 35.2). Chu trình carbon trong tự nhiên là một quá trình phức tạp, liên quan đến sự chuyển động và trao đổi carbon giữa khí quyển, đại dương, đất đai và các hệ sinh thái. Trong chu trình này, CO₂ đóng vai trò quan trọng trong việc duy trì sự cân bằng carbon trong hệ sinh thái và khí quyển của Trái Đất, thông qua các quá trình sau:\n" +
          "– Quá trình phát thải carbon ở dạng khí CO₂: CO₂ được chuyển vào khí quyển thông qua nhiều quá trình khác nhau như quá trình hô hấp của sinh vật, quá trình đốt cháy nhiên liệu hoá thạch, cháy rừng,...\n" +
          "– Quá trình hấp thụ carbon ở dạng khí CO₂: CO₂ được cây xanh sử dụng trong quá trình quang hợp để tạo ra các hợp chất hữu cơ. Các chất này sau đó được chuyển hoá thành hợp chất hữu cơ trong động vật khi động vật sử dụng thực vật làm nguồn dinh dưỡng. Khi thực vật, động vật bị vùi lấp, các hợp chất của carbon trong chúng phân huỷ thành muối carbonate, nhiên liệu hoá thạch,... Ngoài ra, CO₂ còn được hoà tan vào nước biển, sông, hồ,...",
      },
      {
        kind: "text",
        title: "4. Hiệu ứng nhà kính và sự ấm lên toàn cầu",
        body:
          "Khí carbon dioxide và khí methane trong khí quyển tuy chiếm hàm lượng rất thấp nhưng lại là nguyên nhân chính gây ra hiệu ứng nhà kính trên Trái Đất. Trong thời đại công nghiệp (khoảng hơn 200 năm gần đây), hàm lượng carbon dioxide và methane trong khí quyển tăng dần, làm cho nhiệt độ trên bề mặt Trái Đất nóng lên.\n" +
          "Sự ấm lên toàn cầu diễn ra liên tục trong nhiều năm gần đây đã dẫn đến một số hệ quả:\n" +
          "– Thời tiết cực đoan: xuất hiện nhiều cơn bão lớn, lũ lụt và hạn hán kéo dài, gây thiệt hại cho mùa màng, nông sản.\n" +
          "– Băng tan, nước biển dâng: băng, tuyết ở các vùng cực và núi cao tan thành nước chảy ra biển, gây ra hiện tượng nước biển dâng; ngập lụt các khu vực đồng bằng, triều cường và xâm thực mặn, ảnh hưởng đến cuộc sống của hàng triệu người dân sống ở khu vực bờ biển.\n" +
          "– Sự acid hoá nước biển: lượng khí CO₂ tan trong nước biển tăng lên, ảnh hưởng tiêu cực đến môi trường sống của sinh vật biển.\n" +
          "– Thảm thực vật bị co hẹp, gia tăng tình trạng sa mạc hoá trên Trái Đất; giới động vật bị suy giảm tính đa dạng sinh học,...\n" +
          "Để giảm thiểu lượng khí thải carbon dioxide, Việt Nam và các quốc gia cùng thực hiện hạn chế sử dụng nhiên liệu hoá thạch, tăng cường sử dụng năng lượng tái tạo, áp dụng công nghệ tiên tiến trong xử lí rác thải, tăng cường trồng cây gây rừng, phủ xanh đồi trọc, cải tạo đất hoang,...\n" +
          "Từ năm 1901 đến năm 2020, hàm lượng CO₂ trong khí quyển tăng từ 0,030% đến 0,040% góp phần làm cho nhiệt độ Trái Đất tăng thêm 1,5 °C.",
      },
      {
        kind: "example",
        title: "Bài tập SGK",
        body:
          "• Phương trình cháy: C₂H₅OH + 3O₂ →(t°) 2CO₂ + 3H₂O;  CH₄ + 2O₂ →(t°) CO₂ + 2H₂O;  C + O₂ →(t°) CO₂.\n" +
          "• Đốt cháy gỗ (15 – 20 kJ/g), than đá (20 – 30 kJ/g), dầu hoả (42 – 45 kJ/g): với cùng khối lượng, dầu hoả giải phóng nhiều nhiệt nhất.\n" +
          "• Củi gỗ không phải nhiên liệu hoá thạch vì không được hình thành từ xác sinh vật bị chôn vùi hàng triệu năm mà là sinh khối hiện tại.",
      },
    ],
  },
];
