# 김장환 개인 웹사이트

용인인문학연구소 소장 김장환의 개인 웹사이트입니다.
프로필·저술·강의 이력과, 매일 한 편씩 올리는 **‘오늘의 역사’** 를 달력으로 볼 수 있습니다.

- 디자인 방향: [al-folio](https://alshedivat.github.io/al-folio/) · [academic-website-template](https://sbryngelson.github.io/academic-website-template/) 계열의 차분한 학술 사이트
- 본문 폰트: **Pretendard**, 제목 폰트: **Noto Serif KR**

---

## 1. 기술 스택

| 영역   | 사용 기술                                                              |
| ------ | ---------------------------------------------------------------------- |
| 코어   | Astro 5 (`output: "static"`), TypeScript 5.9, Content Collections      |
| 스타일 | Tailwind CSS 4 (`@tailwindcss/vite`), `@tailwindcss/typography`        |
| 콘텐츠 | Markdown + `glob()` 로더, `astro:assets` 이미지 최적화(Sharp)          |
| 기능   | Pagefind 검색, RSS(`@astrojs/rss`), Sitemap(`@astrojs/sitemap`), dayjs |
| 툴링   | ESLint 9, Prettier 3, `astro check`                                    |
| 배포   | Cloudflare Pages (정적 호스팅)                                         |

---

## 2. 로컬에서 실행하기

### 준비물

- **Node.js 22 이상** (`node -v` 로 확인)
- npm (Node 설치 시 함께 들어옵니다)

### 처음 한 번만

```powershell
npm install
```

### 개발 서버 실행

```powershell
npm run dev
```

브라우저에서 **http://localhost:4321** 을 엽니다.
파일을 저장하면 화면이 자동으로 새로고침됩니다.

> ⚠️ 개발 서버에서는 **검색(`/search/`) 이 동작하지 않습니다.** 검색 색인은 빌드할 때 만들어지기 때문입니다.
> 검색까지 확인하려면 아래 `npm run build` → `npm run preview` 를 쓰세요.

### 배포본과 똑같이 확인하기

```powershell
npm run build     # 타입 검사 + 빌드 + 검색 색인 생성 → dist/
npm run preview   # dist/ 를 실제 배포처럼 띄움 (http://localhost:4321)
```

### 그 밖의 명령어

| 명령어           | 하는 일                                         |
| ---------------- | ----------------------------------------------- |
| `npm run sync`   | 콘텐츠 타입 재생성 (frontmatter 스키마 바꾼 뒤) |
| `npm run format` | Prettier로 코드 정렬                            |
| `npm run lint`   | ESLint 검사                                     |

---

## 3. 폴더 구조

```
src/
├─ assets/
│  ├─ profile.jpg              프로필 사진
│  └─ history/                 '오늘의 역사' 카드 이미지 (날짜 이름)
├─ components/
│  ├─ Calendar.astro           달력 (핵심 컴포넌트)
│  ├─ HistoryList.astro        기록 목록
│  ├─ ShareButtons.astro       링크 복사 / 공유 / 인쇄
│  ├─ Header.astro  Footer.astro  PageHeader.astro  Timeline.astro  ThemeToggle.astro
├─ content/
│  └─ history/                 '오늘의 역사' 글 (Markdown)
│     ├─ _템플릿.md            복사해서 쓰는 서식 (_ 로 시작하면 발행 안 됨)
│     └─ 2026-08-11.md
├─ data/profile.ts             프로필 정보 (이름·경력·저술·수상)
├─ layouts/Layout.astro        공통 레이아웃 + SEO/OG 태그
├─ pages/
│  ├─ index.astro              홈 (프로필 + 달력)
│  ├─ about.astro  publications.astro  lectures.astro  contact.astro
│  ├─ search.astro  404.astro  rss.xml.ts
│  └─ history/
│     ├─ index.astro           오늘의 역사 메인 (이번 달 달력)
│     ├─ [date].astro          하루치 상세 (/history/2026-08-11/)
│     └─ archive/[month].astro 월별 달력 (/history/archive/2026-08/)
├─ styles/global.css           색상 토큰 · 폰트 · 공통 클래스
├─ utils/                      날짜 · 글 목록 헬퍼
├─ consts.ts                   사이트 주소 · 제목 · 메뉴
└─ content.config.ts           '오늘의 역사' frontmatter 스키마
```

---

## 4. ‘오늘의 역사’ 글 올리기

하루에 한 편, 파일 하나를 추가하면 됩니다.

### 1) 카드 이미지 넣기

`src/assets/history/` 안에 **날짜 이름**으로 저장합니다.

```
src/assets/history/2026-08-20.jpg
```

### 2) 글 파일 만들기

`src/content/history/_템플릿.md` 를 복사해서 **날짜 이름**으로 저장합니다.

```
src/content/history/2026-08-20.md
```

```markdown
---
date: 2026-08-20
title: "1919년 8월 20일, 어떤 일이 있었나"
summary: "목록과 카카오톡 공유 미리보기에 보이는 한 줄 요약입니다."
image: "../../assets/history/2026-08-20.jpg"
imageAlt: "카드 이미지 설명"
tags: ["한국사", "근대사"]
---

여기에 본문을 씁니다. 빈 줄로 문단을 나눕니다.

**굵게** 는 별표 두 개로 감쌉니다.

> 인용문은 꺾쇠로 시작합니다.
```

| 항목       | 설명                                                                 |
| ---------- | -------------------------------------------------------------------- |
| `date`     | **필수.** 달력에 표시되는 기준 날짜. 파일 이름과 똑같이 맞춰 주세요. |
| `title`    | **필수.** 카드 제목                                                  |
| `summary`  | 선택. 목록·공유 미리보기 문구                                        |
| `image`    | 선택. 카드 이미지 경로 (`../../assets/history/…`)                    |
| `imageAlt` | 선택. 이미지 대체 텍스트 (화면 낭독기·검색용)                        |
| `tags`     | 선택. 주제 태그                                                      |
| `draft`    | `true` 면 발행되지 않습니다. 공개할 때 이 줄을 지우세요.             |

### 3) 확인 & 반영

```powershell
npm run dev
```

달력에서 해당 날짜가 눌리는지 확인한 뒤, `git push` 하면 자동으로 배포됩니다.

> 파일 이름이 `_` 로 시작하면 발행되지 않습니다. (`_템플릿.md`)

---

## 5. 프로필 내용 수정

`src/data/profile.ts` 한 파일만 고치면 홈·소개·저술·강의 페이지에 모두 반영됩니다.

| 상수               | 반영되는 곳                   |
| ------------------ | ----------------------------- |
| `profile`          | 이름·직함·이메일 등 기본 정보 |
| `affiliations`     | 홈 상단 소속 한 줄            |
| `bio`              | 홈·소개 자기소개 문단         |
| `education`        | 소개 → 학력                   |
| `currentPositions` | 소개 → 현재 직 / 강의·활동    |
| `pastPositions`    | 소개 → 역임                   |
| `teaching`         | 강의·활동 → 강의 이력         |
| `publications`     | 저술·논문 → 저술              |
| `papers`           | 저술·논문 → 논문              |
| `awards`           | 홈·소개 → 수상                |

메뉴 구성과 사이트 제목은 `src/consts.ts` 에 있습니다.

---

## 6. 배포 (Cloudflare Pages)

배포 전에 **사이트 주소 2곳**을 실제 도메인으로 맞춰 주세요.

- `src/consts.ts` → `SITE.website`
- `public/robots.txt` → `Sitemap:` 줄

Cloudflare Pages 설정:

| 항목                   | 값                    |
| ---------------------- | --------------------- |
| Framework preset       | `Astro`               |
| Build command          | `npm run build`       |
| Build output directory | `dist`                |
| 환경 변수              | `NODE_VERSION` = `22` |

`main` 브랜치에 push하면 자동으로 다시 빌드·배포됩니다.

---

## 7. 개인정보 취급 주의 ⚠️

이 저장소는 공개될 수 있으므로 아래 규칙을 지켜 주세요.

- **원본 프로필 PDF는 절대 커밋하지 않습니다.** 강사 프로필 PDF에는 **주민등록번호**가 들어 있습니다.
  `.gitignore` 에서 `profile/` 과 `*.pdf` 를 제외해 두었습니다.
- 사이트에는 **전화번호·상세 주소·생년월일·주민등록번호를 싣지 않습니다.**
  공개하는 연락 수단은 **이메일**, 위치는 **시·구 단위(경기도 용인시 처인구)** 까지입니다.
- CV/이력서 PDF를 다운로드하게 하는 기능은 두지 않습니다.
- 커밋 전 확인:

  ```powershell
  git status              # profile/ 이나 .pdf 가 보이면 안 됩니다
  git add -A --dry-run    # 실제로 올라갈 파일 목록 미리보기
  ```
