'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAutocomplete, INITIAL_KEYWORDS } from '@/lib/search';
import { RealEstateGlossaryItem } from '@/lib/types';
import LevelBadge from './LevelBadge';
import FullScreenSpinner from './FullScreenSpinner';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function SearchBox({ initialQuery = '' }: { initialQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<RealEstateGlossaryItem[]>([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 150);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      setSuggestions(getAutocomplete(debouncedQuery));
      setOpen(true);
    } else {
      setSuggestions([]);
      setOpen(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // initialQuery가 바뀌면 (페이지 이동 완료) 스피너 끄기
  useEffect(() => {
    setNavigating(false);
  }, [initialQuery]);

  function handleSearch(q: string) {
    if (!q.trim()) return;
    setOpen(false);
    setNavigating(true);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  function handleAutocompleteClick(id: string) {
    setOpen(false);
    setNavigating(true);
    router.push(`/terms/${id}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch(query);
    if (e.key === 'Escape') setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative max-w-lg mx-auto">
      {navigating && <FullScreenSpinner message="검색 중…" />}

      {/* Input */}
      <div className={`flex items-center bg-[#141414] border rounded-2xl pl-3 sm:pl-4 pr-1.5 py-1.5 transition-all duration-200
        ${focused ? 'border-[rgba(232,201,125,0.5)] shadow-[0_0_0_3px_rgba(232,201,125,0.08)]' : 'border-white/[0.07]'}`}>
        <span className="text-base mr-2 sm:mr-2.5 opacity-40">🔍</span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="용어 검색... (예: 전세, LTV)"
          className="flex-1 min-w-0 bg-transparent border-none outline-none text-[#f0ece4]
            text-[14px] sm:text-[15px] py-2.5 placeholder:text-[#4a4640]"
        />
        <button onClick={() => handleSearch(query)}
          disabled={navigating}
          className="px-3.5 sm:px-5 py-2.5 bg-[#e8c97d] text-[#0d0d0d] rounded-[10px] text-sm font-bold shrink-0
            hover:bg-[#f0d896] transition-colors duration-150 disabled:opacity-50">
          검색
        </button>
      </div>

      {/* Autocomplete */}
      {open && suggestions.length > 0 && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#1c1c1c] border border-white/[0.07]
          rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50">
          {suggestions.map((item) => (
            <button key={item.id}
              onClick={() => handleAutocompleteClick(item.id)}
              className="flex items-center justify-between w-full px-4 py-3 text-left
                border-b border-white/[0.05] last:border-0
                hover:bg-[#232323] transition-colors duration-100">
              <span className="text-sm font-medium text-[#f0ece4]">{item.term}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-[#4a4640]">{item.category}</span>
                <LevelBadge level={item.level} className="text-[10px] px-2 py-0" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Initial keywords */}
      {!query && (
        <div className="flex gap-2 flex-wrap justify-center mt-4">
          {INITIAL_KEYWORDS.map((kw) => (
            <button key={kw}
              onClick={() => { setQuery(kw); handleSearch(kw); }}
              className="px-3.5 py-1.5 bg-[#141414] border border-white/[0.07] rounded-full text-xs text-[#8a8276]
                hover:border-[rgba(232,201,125,0.4)] hover:text-[#e8c97d] transition-all duration-150">
              {kw}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
