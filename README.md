# 🏠 부동산 용어 사전

> 모르면 검색하고, 이해하고, 이어서 학습하는 부동산 검색 기반 학습 엔진

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: 순수 CSS (CSS Variables)
- **Deployment**: Vercel

## 핵심 기능

- 🔍 **스코어링 검색** — 용어명 완전일치 → 별칭 → 키워드 → 내용 순서로 가중치 검색
- 💡 **비유 중심 설명** — analogy 필드로 초보자 이해 극대화
- 🔗 **연관 용어 탐색** — related_terms 기반 학습 흐름 유지
- 📚 **카테고리 탐색** — 12개 카테고리, 입문→중급→고급 순서 정렬
- 🌱 **입문자 학습 흐름** — 큐레이션된 학습 경로 제공
- ⚡ **자동완성** — 실시간 검색어 자동완성

## 로컬 실행

```bash
npm install
npm run dev
```

## Vercel 배포

1. GitHub에 푸시
2. Vercel에서 Import
3. 자동 배포 완료

## 데이터 구조

```typescript
interface RealEstateGlossaryItem {
  id: string;          // URL slug & 연관 참조용
  term: string;        // 대표 용어명
  aliases: string[];   // 별칭 (주담대, 공시가 등)
  category: TermCategory;
  easy_def: string;    // 초보자용 정의
  analogy: string;     // 이해를 위한 비유
  example: string;     // 실제 예시
  note?: string;       // 실무 팁
  risk?: string;       // 주의사항
  level: TermLevel;    // 입문 / 중급 / 고급
  related_terms: string[];
  keywords: string[];  // 검색 대응 키워드
  is_slang: boolean;
}
```

## 용어 수

현재 **120개+** 용어 수록 (면적, 가격, 거래, 임대, 금융, 청약, 법, 경매, 정비사업, 세금, 플랫폼, 규제)
