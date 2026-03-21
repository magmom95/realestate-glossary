'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { searchGlossary, getBeginnerItems, ALL_CATEGORIES } from '@/lib/search';
import { glossaryData } from '@/data/glossary';
import { RealEstateGlossaryItem } from '@/lib/types';
import SearchBox from '@/components/SearchBox';
import LevelBadge from '@/components/LevelBadge';
import { SuggestAddButton } from '@/components/SuggestAddButton';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const levelFilter = searchParams.get('level') || '';

  const [results, setResults] = useState<(RealEstateGlossaryItem & { score: number })[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    if (query) {
      setResults(searchGlossary(query));
    } else if (levelFilter === '입문') {
      setResults(getBeginnerItems().map(i => ({ ...i, score: 0 })));
    } else if (levelFilter === '고급') {
      setResults(glossaryData.filter(i => i.level === '고급').map(i => ({ ...i, score: 0 })));
    } else if (levelFilter === '전체') {
      setResults(glossaryData.map(i => ({ ...i, score: 0 })));
    } else {
      setResults([]);
    }
  }, [query, levelFilter]);

  const filtered = categoryFilter ? results.filter(r => r.category === categoryFilter) : results;
  const noResults = query && results.length === 0;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <SearchBox initialQuery={query} />

      {/* 카테고리 필터 */}
      {results.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-6">
          <button
            onClick={() => setCategoryFilter('')}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150
              ${!categoryFilter
                ? 'bg-[#e8c97d] text-[#0d0d0d] border-[#e8c97d]'
                : 'bg-[#1c1c1c] text-[#8a8276] border-white/[0.07] hover:border-white/[0.15]'
              }`}
          >
            전체 {results.length}
          </button>
          {ALL_CATEGORIES.filter(c => results.some(r => r.category === c.value)).map(cat => {
            const count = results.filter(r => r.category === cat.value).length;
            const active = categoryFilter === cat.value;
            return (
              <button key={cat.value}
                onClick={() => setCategoryFilter(active ? '' : cat.value)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150
                  ${active
                    ? 'bg-[rgba(232,201,125,0.15)] text-[#e8c97d] border-[rgba(232,201,125,0.3)]'
                    : 'bg-[#1c1c1c] text-[#8a8276] border-white/[0.07] hover:border-white/[0.15]'
                  }`}
              >
                {cat.emoji} {cat.label} {count}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2.5">
        {/* 결과 없음 */}
        {noResults && (
          <div className="flex flex-col items-center py-16 gap-5 text-center px-4">
            <span className="text-5xl">🔍</span>
            <div>
              <p className="text-base font-semibold text-[#f0ece4] mb-1">
                &quot;{query}&quot;에 대한 결과가 없어요
              </p>
              <p className="text-sm text-[#4a4640] mb-6">
                직접 추가 요청하면 검토 후 사전에 등록됩니다
              </p>
              <SuggestAddButton query={query} />
            </div>
          </div>
        )}

        {/* 검색어 없음 */}
        {!query && !levelFilter && (
          <div className="flex flex-col items-center py-16 gap-3 text-[#4a4640] text-center px-4">
            <span className="text-4xl">🏠</span>
            <p>검색어를 입력하세요</p>
          </div>
        )}

        {/* 필터 결과 없음 */}
        {query && results.length > 0 && filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 gap-3 text-center px-4">
            <span className="text-4xl">📂</span>
            <p className="text-sm text-[#4a4640]">해당 카테고리에 데이터가 없습니다</p>
          </div>
        )}

        {/* 결과 목록 */}
        {filtered.map((item, idx) => (
          <Link key={item.id} href={`/terms/${item.id}`}
            className="card card-slide block p-5 animate-in"
            style={{ animationDelay: `${idx * 25}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                  <span className="text-base font-bold text-[#f0ece4]">{item.term}</span>
                  {item.aliases.length > 0 && (
                    <span className="text-xs text-[#4a4640]">
                      ({item.aliases.slice(0, 2).join(', ')})
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#8a8276] leading-relaxed">{item.easy_def}</p>
                <div className="flex gap-1.5 mt-2.5 flex-wrap items-center">
                  <span className="text-[11px] text-[#4a4640] bg-[#232323] px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <LevelBadge level={item.level} />
                  {item.is_slang && <span className="badge badge-slang">슬랭</span>}
                  {item.risk && (
                    <span className="text-[11px] text-[#e05252] bg-[rgba(224,82,82,0.1)] border border-[rgba(224,82,82,0.2)] px-2 py-0.5 rounded-md">
                      ⚠️ 리스크
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[#4a4640] text-lg flex-shrink-0">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-3">
        <div className="skeleton h-14 rounded-xl mb-2" />
        {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
