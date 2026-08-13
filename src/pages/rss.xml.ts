import rss from "@astrojs/rss";
import type { APIRoute } from "astro";

import { SITE } from "@/consts";
import { getHistoryItems, historyPath } from "@/utils/history";
import { formatKoreanDate } from "@/utils/date";

export const GET: APIRoute = async (context) => {
  const items = await getHistoryItems();

  return rss({
    title: `${SITE.author} — 오늘의 역사`,
    description: "매일 한 편, 그날 있었던 역사적 사실을 정리해 나눕니다.",
    site: context.site ?? SITE.website,
    trailingSlash: true,
    customData: "<language>ko-kr</language>",
    items: items.map((item) => ({
      title: item.title,
      description:
        item.summary ?? `${formatKoreanDate(item.date, false)}의 기록`,
      pubDate: new Date(`${item.date}T00:00:00+09:00`),
      link: historyPath(item),
      categories: [...item.tags],
    })),
  });
};
