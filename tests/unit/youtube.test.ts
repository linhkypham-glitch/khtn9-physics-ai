import { describe, expect, it } from "vitest";

import { youtubeEmbedUrl } from "@/modules/curriculum/video";

describe("youtubeEmbedUrl", () => {
  it("nhận các dạng liên kết YouTube", () => {
    const e = "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ";
    expect(youtubeEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10")).toBe(e);
    expect(youtubeEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(e);
    expect(youtubeEmbedUrl("https://m.youtube.com/shorts/dQw4w9WgXcQ")).toBe(e);
    expect(youtubeEmbedUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe(e);
  });
  it("bỏ qua liên kết khác hoặc ID không hợp lệ", () => {
    expect(youtubeEmbedUrl("https://vimeo.com/123")).toBeNull();
    expect(youtubeEmbedUrl("https://evil.com/watch?v=dQw4w9WgXcQ")).toBeNull();
    expect(youtubeEmbedUrl("https://youtu.be/<script>")).toBeNull();
    expect(youtubeEmbedUrl("not a url")).toBeNull();
  });
});
