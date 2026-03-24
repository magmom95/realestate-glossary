import { notFound } from 'next/navigation';
import Link from 'next/link';
import { findById, getRelatedTerms } from '@/lib/search';
import { glossaryData } from '@/data/glossary';
import LevelBadge from '@/components/LevelBadge';
import Breadcrumb from '@/components/Breadcrumb';
import LinkedText from '@/components/LinkedText';
import Foldable from '@/components/Foldable';
import { SuggestEditButton } from '@/components/SuggestEditModal';

export async function generateStaticParams() {
  return glossaryData.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = findById(id);
  if (!item) return { title: '용어를 찾을 수 없습니다' };
  return { title: `${item.term} | 홈 잉 버드`, description: item.easy_def };
}

export default async function TermPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = findById(id);
  if (!item) notFound();

  const related = getRelatedTerms(item);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <Breadcrumb items={[
        { label: '홈', href: '/' },
        { label: item.category, href: `/category/${encodeURIComponent(item.category)}` },
        { label: item.term },
      ]} />

      {/* Header card */}
      <div className="bg-[#141414] border border-white/[0.07] rounded-2xl p-5 sm:p-8 mb-3 sm:mb-4">
        {/* Meta tags */}
        <div className="flex gap-2 flex-wrap mb-4">
          <Link href={`/category/${encodeURIComponent(item.category)}`}
            className="text-[11px] text-[#4a4640] bg-[#232323] px-2.5 py-1 rounded-md font-medium hover:text-[#8a8276] transition-colors">
            {item.category}
          </Link>
          {item.subcategory && (
            <span className="text-[11px] text-[#4a4640] bg-[#232323] px-2.5 py-1 rounded-md">{item.subcategory}</span>
          )}
          <LevelBadge level={item.level} />
          {item.is_slang && <span className="badge badge-slang">슬랭</span>}
        </div>

        {/* Title */}
        <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-normal tracking-tight leading-tight mb-3">
          {item.term}
        </h1>

        {/* Aliases */}
        {item.aliases.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-5">
            {item.aliases.map(alias => (
              <span key={alias} className="text-sm text-[#8a8276] bg-[#1c1c1c] border border-white/[0.07] px-3 py-1 rounded-lg">
                = {alias}
              </span>
            ))}
          </div>
        )}

        {/* Definition */}
        <p className="text-base sm:text-lg leading-relaxed text-[#f0ece4] pb-5 sm:pb-6 border-b border-white/[0.07]">
          <LinkedText text={item.easy_def} currentTermId={item.id} />
        </p>

        {/* 수정 제안 버튼 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 sm:mt-5">
          <p className="text-xs text-[#4a4640]">내용이 부정확하거나 더 좋은 설명이 있다면 제안해주세요</p>
          <SuggestEditButton termId={item.id} termName={item.term} />
        </div>
      </div>

      {/* Analogy */}
      <div className="bg-[rgba(232,201,125,0.06)] border border-[rgba(232,201,125,0.18)] rounded-xl p-4 sm:p-6 mb-3">
        <Foldable title="이렇게 이해하세요" emoji="💡" titleColor="#e8c97d">
          <p className="text-[15px] text-[#8a8276] leading-relaxed">
            <LinkedText text={item.analogy} currentTermId={item.id} />
          </p>
        </Foldable>
      </div>

      {/* Example */}
      <div className="bg-[#141414] border border-white/[0.07] rounded-xl p-4 sm:p-6 mb-3">
        <Foldable title="실제 예시" emoji="📌" titleColor="#5b9bd5">
          <p className="text-[15px] text-[#8a8276] leading-relaxed">
            <LinkedText text={item.example} currentTermId={item.id} />
          </p>
        </Foldable>
      </div>

      {/* Note */}
      {item.note && (
        <div className="bg-[#1c1c1c] border border-white/[0.07] rounded-xl p-4 sm:p-6 mb-3">
          <Foldable title="실무 팁" emoji="📝" titleColor="#4a4640" defaultOpen={false}>
            <p className="text-sm text-[#8a8276] leading-relaxed">
              <LinkedText text={item.note} currentTermId={item.id} />
            </p>
          </Foldable>
        </div>
      )}

      {/* Risk */}
      {item.risk && (
        <div className="bg-[rgba(224,82,82,0.07)] border border-[rgba(224,82,82,0.2)] rounded-xl p-4 sm:p-6 mb-5">
          <Foldable title="주의 사항" emoji="⚠️" titleColor="#e05252">
            <p className="text-sm text-[#e05252] opacity-90 leading-relaxed">
              <LinkedText text={item.risk} currentTermId={item.id} />
            </p>
          </Foldable>
        </div>
      )}

      {/* Related terms */}
      {related.length > 0 && (
        <div className="bg-[#141414] border border-white/[0.07] rounded-2xl p-4 sm:p-6">
          <h2 className="text-sm font-bold mb-3 sm:mb-4 text-[#f0ece4]">🔗 연관 용어</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {related.map(r => (
              <Link key={r.id} href={`/terms/${r.id}`}
                className="block p-4 bg-[#1c1c1c] border border-white/[0.07] rounded-xl
                  hover:border-[rgba(232,201,125,0.3)] hover:bg-[rgba(232,201,125,0.04)]
                  transition-all duration-150">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-semibold text-[#f0ece4]">{r.term}</span>
                  <LevelBadge level={r.level} />
                </div>
                <p className="text-xs text-[#4a4640] leading-relaxed">{r.easy_def.slice(0, 50)}…</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
