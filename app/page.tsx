import Image from "next/image";
import Link from "next/link";
import {
  ALL_CATEGORIES,
  BEGINNER_FLOWS,
  getBeginnerItems,
  getStats,
  findById,
} from "@/lib/search";
import SearchBox from "@/components/SearchBox";

export default function HomePage() {
  const stats = getStats();
  const beginnerItems = getBeginnerItems().slice(0, 6);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero */}
      <section className="text-center mb-10 sm:mb-16">
        <p className="text-xs font-bold text-[#8a8276] tracking-[3px] uppercase mb-3 sm:mb-4">
          검색 기반 학습 엔진
        </p>
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/[0.15] bg-white/[0.04] text-[12px] sm:text-sm uppercase tracking-[0.35em] text-[#f2e7d2] mb-3 sm:mb-4">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e8c97d] animate-pulse shadow-[0_0_10px_rgba(232,201,125,0.6)]" />
          AI 부동산 튜터
        </div>
        <h1 className="font-display text-[2.35rem] sm:text-[2.9rem] md:text-[3.5rem] font-normal tracking-tight leading-[1.08] mb-4 sm:mb-5">
          <div className="flex flex-col items-center gap-5">
            <Image
              src="/main-logo.png"
              alt="Home-ing Bird 로고"
              width={473}
              height={528}
              className="h-28 sm:h-32 md:h-36 w-auto drop-shadow-[0_18px_60px_rgba(202,163,91,0.35)]"
              priority
            />
            <span className="text-[1rem] sm:text-lg md:text-xl font-semibold tracking-[0.3em] text-[#f6ebd4] uppercase">
              HOMING-BIRD
            </span>
            <p className="text-xs sm:text-sm text-[#8a8276] font-sans">
              비유를 통해 쉽게 이해하는 AI 부동산 튜터
            </p>
          </div>
        </h1>
        <SearchBox />
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-2 sm:gap-4 mb-10 sm:mb-16">
        {[
          {
            label: "전체 용어",
            value: `${stats.total}개`,
            emoji: "📚",
            href: "/search?level=전체",
          },
          {
            label: "입문 용어",
            value: `${stats.byLevel["입문"]}개`,
            emoji: "🌱",
            href: "/search?level=입문",
          },
          {
            label: "고급 용어",
            value: `${stats.byLevel["고급"]}개`,
            emoji: "🎓",
            href: "/search?level=고급",
          },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-[#141414] border border-white/[0.07] rounded-xl p-3 sm:p-5 text-center
              hover:border-white/[0.15] hover:bg-[#1c1c1c] transition-all duration-150"
          >
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{s.emoji}</div>
            <div className="text-xl sm:text-3xl font-bold text-[#e8c97d] tracking-tight">
              {s.value}
            </div>
            <div className="text-[10px] sm:text-xs text-[#4a4640] mt-1">
              {s.label}
            </div>
          </Link>
        ))}
      </section>

      {/* Categories */}
      <section className="mb-10 sm:mb-16">
        <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-5 tracking-tight">
          카테고리 탐색
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5">
          {ALL_CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/category/${encodeURIComponent(cat.value)}`}
              className="flex flex-col items-center gap-1.5 sm:gap-2 py-3.5 sm:py-5 px-2 sm:px-3
                bg-[#141414] border border-white/[0.07] rounded-xl
                text-[11px] sm:text-xs font-medium text-[#8a8276]
                hover:bg-[#1c1c1c] hover:border-white/[0.15] hover:text-[#f0ece4]
                transition-all duration-150"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span>{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Beginner Flow */}
      <section className="mb-10 sm:mb-16">
        <h2 className="text-base sm:text-lg font-bold mb-1.5 tracking-tight">
          🌱 입문자 학습 흐름
        </h2>
        <p className="text-xs sm:text-sm text-[#8a8276] mb-4 sm:mb-5">
          검색이 아닌 &quot;학습 흐름&quot;으로 이어서 공부하세요
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          {BEGINNER_FLOWS.map((flow) => (
            <div
              key={flow.title}
              className="bg-[#141414] border border-white/[0.07] rounded-xl p-3.5 sm:p-5"
            >
              <p className="text-xs sm:text-sm font-bold text-[#e8c97d] mb-2 sm:mb-3">
                {flow.title}
              </p>
              <div className="flex flex-col gap-1.5">
                {flow.ids.map((id, idx) => {
                  const item = findById(id);
                  if (!item) return null;
                  return (
                    <Link
                      key={id}
                      href={`/terms/${item.id}`}
                      className="flex items-center gap-2 text-sm text-[#8a8276]
                        hover:text-[#f0ece4] transition-colors py-1
                        border-b border-white/[0.05] last:border-0"
                    >
                      <span className="text-[11px] text-[#4a4640] w-4 shrink-0">
                        {idx + 1}.
                      </span>
                      {item.term}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Beginner terms */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold tracking-tight">입문 추천 용어</h2>
          <Link
            href="/search?level=입문"
            className="text-sm text-[#e8c97d] font-medium hover:text-[#f0d896] transition-colors"
          >
            전체 보기 →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
          {beginnerItems.map((item) => (
            <Link
              key={item.id}
              href={`/terms/${item.id}`}
              className="block p-4 sm:p-5 bg-[#141414] border border-white/[0.07] rounded-xl
                hover:-translate-y-0.5 hover:border-white/[0.15] hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]
                transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-bold">{item.term}</span>
                <span className="badge badge-beginner">입문</span>
              </div>
              <p className="text-xs text-[#8a8276] leading-relaxed">
                {item.easy_def.slice(0, 60)}…
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
