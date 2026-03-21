import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getByCategory, ALL_CATEGORIES } from '@/lib/search';
import { TermCategory } from '@/lib/types';
import BackButton from '@/components/BackButton';
import LevelBadge from '@/components/LevelBadge';

export async function generateStaticParams() {
  return ALL_CATEGORIES.map((c) => ({ slug: encodeURIComponent(c.value) }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categoryValue = decodeURIComponent(slug) as TermCategory;
  const catInfo = ALL_CATEGORIES.find((c) => c.value === categoryValue);
  if (!catInfo) notFound();

  const items = getByCategory(categoryValue);
  const byLevel = {
    입문: items.filter((i) => i.level === '입문'),
    중급: items.filter((i) => i.level === '중급'),
    고급: items.filter((i) => i.level === '고급'),
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <BackButton />

      {/* Header */}
      <div className="flex items-center gap-5 bg-[#141414] border border-white/[0.07] rounded-2xl p-7 mb-8">
        <div className="w-16 h-16 flex items-center justify-center text-4xl
          bg-[rgba(232,201,125,0.1)] rounded-2xl shrink-0">
          {catInfo.emoji}
        </div>
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-normal tracking-tight mb-2">
            {catInfo.label}
          </h1>
          <div className="flex gap-3 text-xs text-[#4a4640]">
            <span>총 {items.length}개</span>
            <span>·</span>
            <span>입문 {byLevel.입문.length} / 중급 {byLevel.중급.length} / 고급 {byLevel.고급.length}</span>
          </div>
        </div>
      </div>

      {/* By level */}
      {(['입문', '중급', '고급'] as const).map((level) => {
        const lvItems = byLevel[level];
        if (!lvItems.length) return null;
        return (
          <section key={level} className="mb-8">
            <div className="flex items-center gap-2.5 mb-4">
              <LevelBadge level={level} />
              <span className="text-xs text-[#4a4640]">{lvItems.length}개</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {lvItems.map((item) => (
                <Link key={item.id} href={`/terms/${item.id}`}
                  className="block p-5 bg-[#141414] border border-white/[0.07] rounded-xl
                    hover:-translate-y-0.5 hover:border-white/[0.15] hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]
                    transition-all duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-[#f0ece4]">{item.term}</span>
                    <div className="flex gap-1.5 items-center shrink-0 ml-2">
                      {item.risk && <span className="text-sm">⚠️</span>}
                      {item.is_slang && <span className="badge badge-slang text-[10px] px-1.5 py-0">슬랭</span>}
                    </div>
                  </div>
                  <p className="text-xs text-[#4a4640] leading-relaxed">
                    {item.easy_def.slice(0, 55)}…
                  </p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
