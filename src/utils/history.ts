import { getCollection, type CollectionEntry } from "astro:content";

import { formatKoreanDate, toISODate } from "@/utils/date";

export type HistoryEntry = CollectionEntry<"history">;

/**
 * 한 편의 '오늘의 역사'.
 * 이미지 파일만 올려도 만들어지고, 같은 날짜의 Markdown 이 있으면 그 내용이 우선합니다.
 */
export interface HistoryItem {
  /** 'YYYY-MM-DD' */
  date: string;
  title: string;
  summary?: string;
  /** 대표 이미지 (목록 썸네일 · 공유 미리보기용) */
  image?: ImageMetadata;
  /** 그날의 카드 전체. 하루에 여러 장을 올린 경우 순서대로 담깁니다. */
  images: ImageMetadata[];
  imageAlt?: string;
  tags: string[];
  /** 본문(Markdown)이 있을 때만 채워집니다. */
  entry?: HistoryEntry;
}

const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/history/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}",
  { eager: true },
);

// 2026-08-11 / 20260811 / 2026.08.11 뒤에 공백·밑줄·하이픈으로 제목을 붙일 수 있습니다.
const FILE_NAME_PATTERN = /^(\d{4})[-._]?(\d{2})[-._]?(\d{2})(?:[\s_-]+(.+))?$/;
// 260811 처럼 연도를 두 자리로 줄여 쓴 경우.
const SHORT_NAME_PATTERN = /^(\d{2})(\d{2})(\d{2})(?:[\s_-]+(.+))?$/;
// 하루에 여러 장을 올릴 때 제목 뒤에 붙이는 순번. 예) '2026-07-06 제목 (2).jpg'
const PART_SUFFIX_PATTERN = /\s*\((\d+)\)$/;

function parseImageFileName(path: string) {
  const base = path
    .split("/")
    .pop()!
    .replace(/\.[^.]+$/, "")
    .normalize("NFC")
    .trim();

  const matched = FILE_NAME_PATTERN.exec(base) ?? SHORT_NAME_PATTERN.exec(base);
  if (!matched) return null;

  const [, rawYear, month, day, rawTitle] = matched;
  const year = rawYear!.length === 2 ? `20${rawYear}` : rawYear!;
  const date = `${year}-${month}-${day}`;
  // 2026-13-45 처럼 존재하지 않는 날짜 거르기
  if (new Date(`${date}T00:00:00Z`).getUTCDate() !== Number(day)) return null;

  let title = rawTitle?.trim() || null;
  let part = 1;
  if (title) {
    const partMatch = PART_SUFFIX_PATTERN.exec(title);
    if (partMatch) {
      part = Number(partMatch[1]);
      title = title.replace(PART_SUFFIX_PATTERN, "").trim() || null;
    } else if (/^\d{1,2}$/.test(title)) {
      // '260820-2.jpg' 처럼 제목 없이 순번만 붙인 경우
      part = Number(title);
      title = null;
    }
  }

  return { date, title, part };
}

/** 날짜 내림차순(최신 우선) 목록 */
export async function getHistoryItems(): Promise<HistoryItem[]> {
  const grouped = new Map<
    string,
    { part: number; title: string | null; image: ImageMetadata }[]
  >();

  for (const [path, module] of Object.entries(imageModules)) {
    const parsed = parseImageFileName(path);
    if (!parsed) {
      console.warn(
        `[오늘의 역사] 파일 이름이 규칙에 맞지 않아 건너뜁니다: ${path}\n` +
          `  → '2026-08-11.jpg' 또는 '2026-08-11 제목.jpg' 형식으로 바꿔 주세요.`,
      );
      continue;
    }
    const bucket = grouped.get(parsed.date) ?? [];
    bucket.push({
      part: parsed.part,
      title: parsed.title,
      image: module.default,
    });
    grouped.set(parsed.date, bucket);
  }

  const byDate = new Map<string, HistoryItem>();

  for (const [date, cards] of grouped) {
    cards.sort((a, b) => a.part - b.part);
    const images = cards.map((card) => card.image);
    byDate.set(date, {
      date,
      title:
        cards.find((card) => card.title)?.title ??
        `${formatKoreanDate(date, false)}의 역사`,
      image: images[0],
      images,
      tags: [],
    });
  }

  const entries = await getCollection(
    "history",
    ({ data }) => import.meta.env.DEV || !data.draft,
  );

  for (const entry of entries) {
    const date = toISODate(entry.data.date);
    const fromImage = byDate.get(date);
    const images = entry.data.image
      ? [entry.data.image]
      : (fromImage?.images ?? []);
    byDate.set(date, {
      date,
      title: entry.data.title,
      summary: entry.data.summary,
      image: images[0],
      images,
      imageAlt: entry.data.imageAlt,
      tags: [...entry.data.tags],
      entry,
    });
  }

  return [...byDate.values()].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function historyPath(item: Pick<HistoryItem, "date">): string {
  return `/history/${item.date}/`;
}

export function monthPath(monthKey: string): string {
  return `/history/archive/${monthKey}/`;
}

export function monthKeyOf(date: string): string {
  return date.slice(0, 7);
}

/** 'YYYY-MM-DD' -> 항목 (달력에서 날짜별 조회용) */
export function toDateMap(items: HistoryItem[]): Map<string, HistoryItem> {
  return new Map(items.map((item) => [item.date, item]));
}

export function groupByMonth(items: HistoryItem[]): Map<string, HistoryItem[]> {
  const map = new Map<string, HistoryItem[]>();
  for (const item of items) {
    const key = monthKeyOf(item.date);
    const bucket = map.get(key);
    if (bucket) bucket.push(item);
    else map.set(key, [item]);
  }
  return map;
}
