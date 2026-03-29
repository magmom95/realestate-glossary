import Image from 'next/image';
import Link from 'next/link';
import NavLinks from './NavLinks';

export default function Header() {
  return (
    <header className="sticky top-0 z-[100] h-[52px] sm:h-[60px] flex items-center px-4 sm:px-6 gap-4 sm:gap-6
      bg-[rgba(13,13,13,0.85)] backdrop-blur-xl border-b border-white/[0.07]">
      <Link
        href="/"
        className="flex items-center gap-2 shrink-0"
        aria-label="부동버드 홈으로 이동"
      >
        <Image
          src="/main-logo-sm.png"
          alt="부동버드 로고"
          width={179}
          height={200}
          priority
          className="h-8 sm:h-9 w-auto"
        />
      </Link>

      <NavLinks />
    </header>
  );
}
