import { describe, expect, it } from "vitest";

import { criticalAngle, describeImage, prismDeviation, rad, refractVec, snell, thinLens } from "@/modules/virtual-lab/optics";

describe("Quang học – công thức dùng trong mô phỏng", () => {
  it("định luật khúc xạ: không khí → nước, i = 45° → r ≈ 32°", () => {
    expect(snell(45, 1, 1.33)).toBeCloseTo(32.1, 1);
    expect(snell(0, 1, 1.5)).toBe(0);
    expect(snell(60, 1.5, 1)).toBeNull(); // phản xạ toàn phần
  });

  it("góc tới hạn: nước 48,8°, thuỷ tinh 41,8°, kim cương 24,4°", () => {
    expect(criticalAngle(1.33, 1)).toBeCloseTo(48.75, 1);
    expect(criticalAngle(1.5, 1)).toBeCloseTo(41.81, 1);
    expect(criticalAngle(2.42, 1)).toBeCloseTo(24.4, 1);
    expect(criticalAngle(1, 1.5)).toBeNull();
  });

  it("khúc xạ vector cho cùng kết quả với định luật Snell", () => {
    const i = 40;
    const d = { x: Math.sin(rad(i)), y: Math.cos(rad(i)) }; // đi xuống, mặt phân cách nằm ngang
    const r = refractVec(d, { x: 0, y: -1 }, 1, 1.33)!;
    expect((Math.asin(r.x) * 180) / Math.PI).toBeCloseTo(snell(i, 1, 1.33)!, 6);
    expect(refractVec({ x: Math.sin(rad(70)), y: Math.cos(rad(70)) }, { x: 0, y: -1 }, 1.5, 1)).toBeNull();
  });

  it("lăng kính: tia tím lệch nhiều hơn tia đỏ", () => {
    const red = prismDeviation(50, 60, 1.513);
    const violet = prismDeviation(50, 60, 1.533);
    expect(violet.D!).toBeGreaterThan(red.D!);
    expect(red.D!).toBeGreaterThan(30);
  });

  it("thấu kính hội tụ: d = 2f cho ảnh thật, ngược chiều, bằng vật", () => {
    const img = thinLens(24, 12)!;
    expect(img.dPrime).toBeCloseTo(24);
    expect(img.k).toBeCloseTo(-1);
    expect(describeImage(img)).toBe("Ảnh thật, ngược chiều, bằng vật");
  });

  it("thấu kính hội tụ: vật trong tiêu cự cho ảnh ảo, cùng chiều, lớn hơn", () => {
    const img = thinLens(5, 10)!;
    expect(img.dPrime).toBeCloseTo(-10);
    expect(img.k).toBeCloseTo(2);
    expect(describeImage(img)).toBe("Ảnh ảo, cùng chiều, lớn hơn vật");
    expect(thinLens(10, 10)).toBeNull();
  });

  it("thấu kính phân kì: luôn ảnh ảo, cùng chiều, nhỏ hơn vật", () => {
    for (const d of [3, 10, 40]) expect(describeImage(thinLens(d, -10))).toBe("Ảnh ảo, cùng chiều, nhỏ hơn vật");
  });

  it("bài tập SGK: f = 10 cm, d = 30 cm → d' = 15 cm; f = 10, d = 15 → d' = 30", () => {
    expect(thinLens(30, 10)!.dPrime).toBeCloseTo(15);
    expect(thinLens(15, 10)!.dPrime).toBeCloseTo(30);
  });
});
