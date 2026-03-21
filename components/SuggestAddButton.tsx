'use client';
import { useState } from 'react';
import { Toast, useToast } from './Toast';
import FullScreenSpinner from './FullScreenSpinner';
import { useRouter } from 'next/navigation';
interface SuggestAddButtonProps {
  query: string;
}

export function SuggestAddButton({ query }: SuggestAddButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast, show, hide } = useToast();
  const router = useRouter();

  async function handleClick() {
    if (!query.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/suggest-term', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'add', term: query.trim() }),
      });

      if (res.ok) {
        show('?붿껌???꾩넚?먯뼱?? 愿由ъ옄 寃????諛섏쁺?⑸땲???솋');
        setTimeout(() => router.push('/'), 1500); // ?좎뒪??蹂댁뿬二쇨퀬 ?대룞
      } else {
        const data = await res.json();
        show(data.error ?? '?꾩넚???ㅽ뙣?덉뼱?? ?ㅼ떆 ?쒕룄?댁＜?몄슂.', 'error');
      }
    } catch {
      show('?ㅽ듃?뚰겕 ?ㅻ쪟媛 諛쒖깮?덉뼱??', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <FullScreenSpinner message="異붽? ?붿껌 ?꾩넚 以묅?" />}
      <button
        onClick={handleClick}
        disabled={loading}
        className="
          w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center text-center sm:text-left
          gap-1.5 sm:gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold
          border border-[rgba(232,201,125,0.25)] text-[#e8c97d] bg-[rgba(232,201,125,0.08)]
          hover:bg-[rgba(232,201,125,0.15)] hover:border-[rgba(232,201,125,0.4)]
          transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        <span className="text-base sm:text-lg leading-none">?벉</span>
        <span className="leading-snug break-words text-pretty">
          &quot;{query}&quot; 異붽? ?붿껌?섍린
        </span>
      </button>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </>
  );
}

