import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ko";

import { SITE } from "@/consts";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ko");

export const WEEKDAYS_KO = ["일", "월", "화", "수", "목", "금", "토"] as const;

/** 빌드 시점의 '한국 기준 오늘' (YYYY-MM-DD) */
export function todayInSeoul(): string {
  return dayjs().tz(SITE.timezone).format("YYYY-MM-DD");
}

/** Date -> 'YYYY-MM-DD' (프런트매터 날짜는 UTC 자정으로 파싱되므로 UTC 기준으로 읽습니다) */
export function toISODate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Date -> 'YYYY-MM' */
export function toMonthKey(date: Date): string {
  return toISODate(date).slice(0, 7);
}

/** 'YYYY-MM-DD' -> '2026년 8월 11일 (화)' */
export function formatKoreanDate(iso: string, withWeekday = true): string {
  const [y, m, d] = iso.split("-").map(Number);
  const weekday = WEEKDAYS_KO[new Date(Date.UTC(y!, m! - 1, d!)).getUTCDay()];
  const base = `${y}년 ${m}월 ${d}일`;
  return withWeekday ? `${base} (${weekday})` : base;
}

/** 'YYYY-MM-DD' -> '8월 11일' */
export function formatMonthDay(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${m}월 ${d}일`;
}

/** 'YYYY-MM' -> '2026년 8월' */
export function formatKoreanMonth(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  return `${y}년 ${m}월`;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** 해당 월 1일의 요일 (0=일) */
export function firstWeekdayOfMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
}

export function shiftMonth(monthKey: string, delta: number): string {
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(Date.UTC(y!, m! - 1 + delta, 1));
  return toMonthKey(d);
}

/** from ~ to (둘 다 'YYYY-MM') 사이의 모든 월 목록 */
export function monthRange(from: string, to: string): string[] {
  const out: string[] = [];
  let cursor = from;
  // 안전장치: 최대 1200개월(100년)
  for (let i = 0; i < 1200 && cursor <= to; i++) {
    out.push(cursor);
    cursor = shiftMonth(cursor, 1);
  }
  return out;
}
