import Link from 'next/link';
import NavLinks from './NavLinks';

export default function Header() {
  return (
    <header className="sticky top-0 z-[100] h-[52px] sm:h-[60px] flex items-center px-4 sm:px-6 gap-4 sm:gap-6
      bg-[rgba(13,13,13,0.85)] backdrop-blur-xl border-b border-white/[0.07]">
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <span className="text-lg sm:text-xl">🏠</span>
        <span className="text-[13px] sm:text-[15px] font-bold tracking-tight">홈 잉 버드</span>
      </Link>

      <NavLinks />
    </header>
  );
}
