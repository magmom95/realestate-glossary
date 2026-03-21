import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-4">
      <span className="text-5xl sm:text-6xl">🏚️</span>
      <h1 className="font-display text-2xl sm:text-4xl font-normal text-[#f0ece4]">용어를 찾을 수 없어요</h1>
      <p className="text-sm text-[#8a8276]">검색으로 원하는 용어를 찾아보세요</p>
      <div className="flex gap-3 mt-4">
        <Link href="/"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#1c1c1c] border border-white/[0.07] text-[#8a8276] hover:border-white/[0.15] hover:text-[#f0ece4] transition-all duration-150">
          홈으로
        </Link>
        <Link href="/search"
          className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#e8c97d] text-[#0d0d0d] hover:bg-[#f0d896] transition-colors duration-150">
          검색하기
        </Link>
      </div>
    </div>
  );
}
