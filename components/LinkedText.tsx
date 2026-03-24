import Link from 'next/link';
import { glossaryData } from '@/data/glossary';

interface LinkedTextProps {
  text: string;
  /** 현재 용어 id — 자기 자신은 링크하지 않음 */
  currentTermId: string;
  className?: string;
}

/**
 * 텍스트 내에서 glossary 용어를 자동 감지하여 링크로 변환합니다.
 * 긴 용어부터 매칭하여 "전세보증보험"이 "전세"보다 먼저 매칭됩니다.
 */
export default function LinkedText({ text, currentTermId, className = '' }: LinkedTextProps) {
  // 현재 용어 제외, 긴 이름부터 매칭 (부분 매칭 방지)
  const terms = glossaryData
    .filter((item) => item.id !== currentTermId)
    .flatMap((item) => [
      { text: item.term, id: item.id },
      ...item.aliases.map((alias) => ({ text: alias, id: item.id })),
    ])
    .sort((a, b) => b.text.length - a.text.length);

  // 이미 매칭된 구간 추적
  const matched: { start: number; end: number; id: string; term: string }[] = [];

  for (const t of terms) {
    let searchFrom = 0;
    while (searchFrom < text.length) {
      const idx = text.indexOf(t.text, searchFrom);
      if (idx === -1) break;

      const end = idx + t.text.length;

      // 이미 매칭된 구간과 겹치는지 확인
      const overlaps = matched.some(
        (m) => idx < m.end && end > m.start,
      );

      if (!overlaps) {
        matched.push({ start: idx, end, id: t.id, term: t.text });
      }

      searchFrom = idx + 1;
    }
  }

  if (matched.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // 위치순 정렬
  matched.sort((a, b) => a.start - b.start);

  const parts: React.ReactNode[] = [];
  let lastEnd = 0;

  matched.forEach((m, i) => {
    // 매칭 전 일반 텍스트
    if (m.start > lastEnd) {
      parts.push(text.slice(lastEnd, m.start));
    }

    // 링크
    parts.push(
      <Link
        key={`${m.id}-${i}`}
        href={`/terms/${m.id}`}
        className="text-[#e8c97d] hover:text-[#f0d896] underline decoration-[rgba(232,201,125,0.3)]
          underline-offset-2 hover:decoration-[rgba(232,201,125,0.6)] transition-colors duration-150"
      >
        {m.term}
      </Link>,
    );

    lastEnd = m.end;
  });

  // 마지막 남은 텍스트
  if (lastEnd < text.length) {
    parts.push(text.slice(lastEnd));
  }

  return <span className={className}>{parts}</span>;
}
