import { glossaryData } from '@/data/glossary';
import { RealEstateGlossaryItem, TermCategory, TermLevel } from './types';
import { ALL_CATEGORIES, BEGINNER_FLOWS, INITIAL_KEYWORDS } from './constants';

// re-export for backward compatibility
export { ALL_CATEGORIES, BEGINNER_FLOWS, INITIAL_KEYWORDS };

// ── 검색 스코어링 ───────────────────────────────────────────────
export function getScore(item: RealEstateGlossaryItem, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;

  const termLower = item.term.toLowerCase();

  // 레벨 보정
  const levelBonus = item.level === '입문' ? 5 : 0;
  const slangPenalty = item.is_slang ? -5 : 0;
  const bonus = levelBonus + slangPenalty;

  // 1순위: 용어명 완전일치
  if (termLower === q) return 100 + bonus;

  // 2순위: 별칭 완전일치
  if (item.aliases.some((a) => a.toLowerCase() === q)) return 80 + bonus;

  // 3순위 이하: 누적 점수
  let score = 0;

  // 짧은 쿼리(2글자 미만)는 startsWith만 허용
  if (q.length < 2) {
    if (termLower.startsWith(q)) score += 40;
    if (item.aliases.some((a) => a.toLowerCase().startsWith(q))) score += 30;
    return score > 0 ? score + bonus : 0;
  }

  // 키워드 매칭 — 검색어 길이 대비 비율 가중치
  const keywordMatch = item.keywords.find((k) => k.toLowerCase().includes(q));
  if (keywordMatch) {
    const ratio = q.length / keywordMatch.length;
    score += Math.max(20, Math.floor(50 * ratio));
  }

  if (termLower.includes(q)) score += 40;
  if (item.easy_def.toLowerCase().includes(q)) score += 20;
  if (item.analogy.toLowerCase().includes(q)) score += 10;

  return score > 0 ? score + bonus : 0;
}

// ── 검색 ──────────────────────────────────────────────────────
export function searchGlossary(
  query: string,
): (RealEstateGlossaryItem & { score: number })[] {
  if (!query.trim()) return [];

  const results = glossaryData
    .map((item) => ({ ...item, score: getScore(item, query.trim()) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return results;
}

// ── 자동완성 ─────────────────────────────────────────────────
export function getAutocomplete(query: string): RealEstateGlossaryItem[] {
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();

  return glossaryData
    .filter(
      (item) =>
        item.term.toLowerCase().includes(q) ||
        item.aliases.some((a) => a.toLowerCase().includes(q)) ||
        item.keywords.some((k) => k.toLowerCase().includes(q)),
    )
    .sort((a, b) => {
      // 시작하는 용어 우선
      const aStarts = a.term.toLowerCase().startsWith(q) ? 1 : 0;
      const bStarts = b.term.toLowerCase().startsWith(q) ? 1 : 0;
      return bStarts - aStarts;
    })
    .slice(0, 7);
}

// ── id로 찾기 ────────────────────────────────────────────────
export function findById(id: string): RealEstateGlossaryItem | undefined {
  return glossaryData.find((item) => item.id === id);
}

// ── 연관 용어 추천 ──────────────────────────────────────────
export function getRelatedTerms(item: RealEstateGlossaryItem): RealEstateGlossaryItem[] {
  const related = item.related_terms
    .map((id) => findById(id))
    .filter(Boolean) as RealEstateGlossaryItem[];

  if (related.length < 3) {
    const fallback = glossaryData
      .filter((i) => i.category === item.category && i.id !== item.id)
      .slice(0, 5 - related.length);
    related.push(...fallback);
  }

  // 중복 제거
  const unique = Array.from(new Map(related.map((r) => [r.id, r])).values());
  return unique.slice(0, 5);
}

// ── 카테고리별 조회 ─────────────────────────────────────────
export function getByCategory(category: TermCategory): RealEstateGlossaryItem[] {
  const levelOrder: Record<TermLevel, number> = { 입문: 1, 중급: 2, 고급: 3 };
  return glossaryData
    .filter((i) => i.category === category)
    .sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
}

// ── 입문 용어 ────────────────────────────────────────────────
export function getBeginnerItems(): RealEstateGlossaryItem[] {
  return glossaryData.filter((i) => i.level === '입문');
}

// ── 통계 ────────────────────────────────────────────────────
export function getStats() {
  return {
    total: glossaryData.length,
    byLevel: {
      입문: glossaryData.filter((i) => i.level === '입문').length,
      중급: glossaryData.filter((i) => i.level === '중급').length,
      고급: glossaryData.filter((i) => i.level === '고급').length,
    },
  };
}
