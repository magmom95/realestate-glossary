# 🐦 홈 잉 버드 (Homing Bird)

> 부동산 용어를 검색하고, 비유로 이해하고, 연관 개념으로 이어서 학습하는 검색 기반 학습 엔진

🔗 **[홈 잉 버드 바로가기](https://homing-bird.vercel.app)**

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 🔍 **스코어링 검색** | 용어명 완전일치 → 별칭 → 키워드 → 정의 순 가중치 검색 |
| 💡 **비유 설명** | 모든 용어에 비유(analogy) 기반 쉬운 설명 제공 |
| ⚡ **자동완성** | 디바운스 적용된 실시간 검색어 자동완성 |
| 🔗 **연관 용어 탐색** | related_terms 기반 학습 흐름 유지 |
| 📚 **12개 카테고리** | 면적, 가격, 거래, 임대, 금융, 청약, 법, 경매, 정비사업, 세금, 플랫폼, 규제 |
| 🌱 **입문자 학습 흐름** | 큐레이션된 학습 경로 (전세 기초, 대출 기초 등) |
| ✏️ **수정 제안** | 여러 필드(정의/비유/예시/실무팁/주의사항) 동시 제안 가능 |
| 📬 **용어 추가 요청** | 검색 결과 없을 시 용어 추가 요청 → 이메일 알림 |

## 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Font | Pretendard (본문), DM Serif Display (타이틀) |
| Email | Resend SDK |
| Deployment | Vercel |
| Data | 정적 배열 (DB 없음) |

## 아키텍처

```
app/
├── page.tsx                  # 홈 — 통계, 카테고리, 입문자 흐름
├── search/page.tsx           # 검색 — 유일한 Client Component 페이지
├── terms/[id]/page.tsx       # 용어 상세 — SSG (generateStaticParams)
├── category/[slug]/page.tsx  # 카테고리 — SSG (generateStaticParams)
├── api/suggest-term/route.ts # 용어 제안 API (Resend)
└── opengraph-image.tsx       # 동적 OG 이미지 생성

components/
├── SearchBox.tsx             # 검색바 + 자동완성 + 디바운스
├── Header.tsx                # 서버 컴포넌트 헤더
├── NavLinks.tsx              # 클라이언트 네비게이션
├── SuggestEditModal.tsx      # 다중 탭 수정 제안 모달
├── SuggestAddButton.tsx      # 용어 추가 요청 버튼
├── LevelBadge.tsx            # 입문/중급/고급 뱃지
├── Toast.tsx                 # 토스트 알림
├── FullScreenSpinner.tsx     # 전체화면 로딩 스피너
└── BackButton.tsx            # 뒤로가기

lib/
├── search.ts                 # 검색 로직, 스코어링, 자동완성
├── types.ts                  # 타입 정의
├── constants.ts              # 카테고리, 키워드, 학습 흐름 상수
└── sanitize.ts               # XSS 방지 유틸

data/
└── glossary.ts               # 전체 용어 데이터 (120+ 용어)
```

## 검색 스코어링

| 매칭 유형 | 점수 |
|-----------|------|
| 용어명 완전 일치 | 100 |
| 별칭 완전 일치 | 80 |
| 키워드 포함 | 50 |
| 용어명 부분 일치 | 40 |
| 정의 포함 | 20 |
| 비유 포함 | 10 |
| 입문 보너스 | +5 |
| 슬랭 패널티 | -5 |

## 로컬 실행

```bash
pnpm install
pnpm dev
```

## 환경 변수

| 변수 | 설명 | 필수 |
|------|------|------|
| `RESEND_API_KEY` | Resend API 키 (용어 제안 이메일 발송) | 제안 기능 사용 시 |

## 용어 추가 방법

`data/glossary.ts` 배열 끝에 새 항목을 추가합니다:

```typescript
{
  id: 'unique-slug',        // URL 슬러그 + related_terms 참조용
  term: '용어명',
  aliases: ['별칭1', '별칭2'],
  category: '금융',          // 12개 TermCategory 중 하나
  easy_def: '초보자를 위한 쉬운 정의',
  analogy: '비유로 설명',
  example: '실제 예시',
  level: '입문',             // 입문 | 중급 | 고급
  related_terms: ['ltv', 'dsr'],
  keywords: ['검색', '키워드'],
  is_slang: false,
}
```

## 라이선스

MIT
