import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * 오늘의 역사 — 하루에 한 편.
 * 파일 이름은 `YYYY-MM-DD.md` 로 맞춰 주세요. (예: src/content/history/2026-08-11.md)
 */
const history = defineCollection({
  // `_` 로 시작하는 파일(예: _템플릿.md)은 발행되지 않습니다.
  loader: glob({
    pattern: ["**/*.md", "!**/_*.md"],
    base: "./src/content/history",
  }),
  schema: ({ image }) =>
    z.object({
      /** 역사 카드가 다루는 날짜 (달력에 표시되는 기준일) */
      date: z.date(),
      /** 카드 제목. 예: "8월 11일, 바이마르 헌법 제정" */
      title: z.string(),
      /** 한 줄 요약 — 목록·공유 미리보기에 쓰입니다. */
      summary: z.string().optional(),
      /** 아빠가 만든 카드 이미지 (src/assets/history/ 에 넣어 주세요) */
      image: image().optional(),
      imageAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { history };
