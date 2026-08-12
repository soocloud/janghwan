import { getCollection, type CollectionEntry } from "astro:content";

import { toISODate, toMonthKey } from "@/utils/date";

export type HistoryEntry = CollectionEntry<"history">;

/** 날짜 내림차순(최신 우선)으로 정렬된 공개 글 목록 */
export async function getHistoryEntries(): Promise<HistoryEntry[]> {
  const entries = await getCollection(
    "history",
    ({ data }) => import.meta.env.DEV || !data.draft,
  );
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function historyPath(entry: HistoryEntry): string {
  return `/history/${toISODate(entry.data.date)}/`;
}

export function monthPath(monthKey: string): string {
  return `/history/archive/${monthKey}/`;
}

/** 'YYYY-MM-DD' -> 글 맵 (달력에서 날짜별 조회용) */
export function toDateMap(entries: HistoryEntry[]): Map<string, HistoryEntry> {
  const map = new Map<string, HistoryEntry>();
  for (const entry of entries) {
    const key = toISODate(entry.data.date);
    if (!map.has(key)) map.set(key, entry);
  }
  return map;
}

export function groupByMonth(
  entries: HistoryEntry[],
): Map<string, HistoryEntry[]> {
  const map = new Map<string, HistoryEntry[]>();
  for (const entry of entries) {
    const key = toMonthKey(entry.data.date);
    const bucket = map.get(key);
    if (bucket) bucket.push(entry);
    else map.set(key, [entry]);
  }
  return map;
}
