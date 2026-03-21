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
        show('요청이 전송됐어요. 관리자 검토 후 반영됩니다 🙏');
        setTimeout(() => router.push('/'), 1500); // 토스트 보여주고 이동
      } else {
        const data = await res.json();
        show(data.error ?? '전송에 실패했어요. 다시 시도해주세요.', 'error');
      }
    } catch {
      show('네트워크 오류가 발생했어요.', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <FullScreenSpinner message="추가 요청 전송 중…" />}
      <button
        onClick={handleClick}
        disabled={loading}
        className="
          inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
          border border-[rgba(232,201,125,0.25)] text-[#e8c97d] bg-[rgba(232,201,125,0.08)]
          hover:bg-[rgba(232,201,125,0.15)] hover:border-[rgba(232,201,125,0.4)]
          transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        <span>📬</span>
        &quot;{query}&quot; 추가 요청하기
      </button>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </>
  );
}
