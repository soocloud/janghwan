export const SITE = {
  // 배포 도메인이 정해지면 이 값만 바꾸면 됩니다. (RSS · sitemap · OG 태그에 사용)
  website: "https://musickor.com/",
  title: "김장환 | 용인인문학연구소",
  desc: "용인인문학연구소 소장 김장환. 용인학·향토사 연구와 강의, 그리고 매일 전하는 '오늘의 역사'.",
  author: "김장환",
  locale: "ko-KR",
  timezone: "Asia/Seoul",
  ogImage: "/og.jpg",
  postPerPage: 12,
} as const;

export const NAV_LINKS = [
  { href: "/", label: "홈" },
  { href: "/about/", label: "소개" },
  { href: "/publications/", label: "저술·논문" },
  { href: "/lectures/", label: "강의·활동" },
  { href: "/history/", label: "오늘의 역사" },
  { href: "/contact/", label: "연락처" },
] as const;
