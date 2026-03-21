'use client';
import { useState } from 'react';
import { Toast, useToast } from './Toast';
import FullScreenSpinner from './FullScreenSpinner';

const FIELDS = [
  { key: 'easy_def', label: '정의', desc: '더 정확하거나 이해하기 쉬운 정의를 알고 있나요?' },
  { key: 'analogy',  label: '비유', desc: '이 용어를 더 잘 설명하는 비유가 있나요?' },
  { key: 'example',  label: '예시', desc: '더 현실적인 예시를 알고 있나요?' },
  { key: 'note',     label: '실무팁', desc: '실무에서 알아두면 좋은 내용이 있나요?' },
  { key: 'risk',     label: '주의사항', desc: '놓치면 위험한 포인트를 알고 있나요?' },
] as const;

type FieldKey = typeof FIELDS[number]['key'];

interface Props {
  termId: string;
  termName: string;
}

export function SuggestEditButton({ termId, termName }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
          border border-white/10 text-[#8a8276]
          hover:border-white/20 hover:text-[#f0ece4]
          transition-all duration-150
        "
      >
        <span>✏️</span>
        수정 제안하기
      </button>

      {open && (
        <SuggestEditModal
          termId={termId}
          termName={termName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function SuggestEditModal({ termId, termName, onClose }: Props & { onClose: () => void }) {
  const [selectedField, setSelectedField] = useState<FieldKey>('easy_def');
  const [contents, setContents] = useState<Partial<Record<FieldKey, string>>>({});
  const [loading, setLoading] = useState(false);
  const { toast, show, hide } = useToast();

  const currentField = FIELDS.find(f => f.key === selectedField)!;
  const filledCount = FIELDS.filter(f => contents[f.key]?.trim()).length;

  function updateContent(value: string) {
    setContents(prev => ({ ...prev, [selectedField]: value }));
  }

  async function handleSubmit() {
    const entries = FIELDS.filter(f => contents[f.key]?.trim());
    if (entries.length === 0 || loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/suggest-term', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'edit',
          term: termName,
          fields: entries.map(f => ({ field: f.key, content: contents[f.key]!.trim() })),
        }),
      });

      if (res.ok) {
        show(`${entries.length}건의 제안이 전송됐어요. 관리자 검토 후 반영됩니다 🙏`);
        setTimeout(onClose, 1800);
      } else {
        const data = await res.json();
        show(data.error ?? '전송에 실패했어요.', 'error');
      }
    } catch {
      show('네트워크 오류가 발생했어요.', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <FullScreenSpinner message="수정 제안 전송 중…" />}

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[501] flex items-center justify-center p-4">
        <div
          className="w-full max-w-lg bg-[#141414] border border-white/10 rounded-2xl shadow-[0_16px_64px_rgba(0,0,0,0.7)] animate-in"
          style={{ animationDuration: '0.2s' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-4 sm:p-6 border-b border-white/[0.07]">
            <div>
              <h2 className="text-base font-bold text-[#f0ece4] mb-1">수정 제안하기</h2>
              <p className="text-sm text-[#8a8276]">
                <span className="text-[#e8c97d] font-semibold">{termName}</span>
                &nbsp;— 어떤 내용을 개선하면 좋을까요?
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[#4a4640] hover:text-[#8a8276] transition-colors text-xl leading-none ml-4 mt-0.5"
            >
              ✕
            </button>
          </div>

          {/* Field Tabs */}
          <div className="flex gap-1.5 px-4 sm:px-6 pt-4 sm:pt-5 pb-3 overflow-x-auto scrollbar-none">
            {FIELDS.map(f => (
              <button
                key={f.key}
                onClick={() => setSelectedField(f.key)}
                className={`
                  flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150
                  ${selectedField === f.key
                    ? 'bg-[rgba(232,201,125,0.15)] text-[#e8c97d] border border-[rgba(232,201,125,0.3)]'
                    : 'bg-[#1c1c1c] text-[#8a8276] border border-white/[0.07] hover:border-white/[0.15] hover:text-[#f0ece4]'
                  }
                `}
              >
                {f.label}
                {contents[f.key]?.trim() && selectedField !== f.key && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#52b788] inline-block ml-1" />
                )}
              </button>
            ))}
          </div>

          {/* Content area */}
          <div className="px-4 sm:px-6 pb-5">
            <p className="text-xs text-[#4a4640] mb-3">{currentField.desc}</p>
            <textarea
              value={contents[selectedField] || ''}
              onChange={e => updateContent(e.target.value)}
              placeholder={`더 좋은 ${currentField.label} 내용을 자유롭게 적어주세요…`}
              rows={4}
              className="
                w-full bg-[#1c1c1c] border border-white/[0.07] rounded-xl px-4 py-3
                text-sm text-[#f0ece4] placeholder:text-[#4a4640]
                resize-none outline-none
                focus:border-[rgba(232,201,125,0.3)] focus:bg-[#1e1e1e]
                transition-all duration-150
              "
            />
            <p className="text-[11px] text-[#4a4640] mt-2">
              * 제안 내용은 관리자가 검토 후 반영 여부를 결정합니다.
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-2.5 px-4 sm:px-6 pb-4 sm:pb-6">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-[#1c1c1c] border border-white/[0.07] text-[#8a8276] hover:border-white/[0.15] hover:text-[#f0ece4] transition-all duration-150"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={filledCount === 0 || loading}
              className="
                flex-[2] py-2.5 rounded-xl text-sm font-bold
                bg-[#e8c97d] text-[#0d0d0d]
                hover:bg-[#f0d896]
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-all duration-150
                flex items-center justify-center gap-2
              "
            >
              {filledCount > 1 ? `${filledCount}건 제안 보내기` : '제안 보내기'}
            </button>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </>
  );
}
