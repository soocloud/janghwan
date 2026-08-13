import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * 오늘의 역사 — 하루에 한 편.
 *
 * 페이지는 `src/assets/history/2026-08-11.jpg` 처럼 이미지 파일만 올려도 자동 생성됩니다.
 * 이 컬렉션은 이미지 밑에 '본문 글'까지 붙이고 싶을 때만 씁니다. (파일 이름: YYYY-MM-DD.md)
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
      /** 보통은 생략합니다. 같은 날짜의 이미지가 자동으로 붙습니다. */
      image: image().optional(),
      imageAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { history };
