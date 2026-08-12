import rss from "@astrojs/rss";
import type { APIRoute } from "astro";

import { SITE } from "@/consts";
import { getHistoryEntries, historyPath } from "@/utils/history";
import { formatKoreanDate, toISODate } from "@/utils/date";

export const GET: APIRoute = async (context) => {
  const entries = await getHistoryEntries();

  return rss({
    title: `${SITE.author} — 오늘의 역사`,
    description: "매일 한 편, 그날 있었던 역사적 사실을 정리해 나눕니다.",
    site: context.site ?? SITE.website,
    trailingSlash: true,
    customData: "<language>ko-kr</language>",
    items: entries.map((entry) => {
      const iso = toISODate(entry.data.date);
      return {
        title: entry.data.title,
        description:
          entry.data.summary ?? `${formatKoreanDate(iso, false)}의 기록`,
        pubDate: entry.data.date,
        link: historyPath(entry),
        categories: [...entry.data.tags],
      };
    }),
  });
};
