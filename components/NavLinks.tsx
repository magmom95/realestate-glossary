'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 ml-auto">
      {[
        { href: '/', label: '홈' },
        { href: '/search', label: '검색' },
      ].map(({ href, label }) => (
        <Link key={href} href={href}
          className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150
            ${pathname === href
              ? 'text-[#e8c97d] bg-[rgba(232,201,125,0.12)]'
              : 'text-[#8a8276] hover:text-[#f0ece4]'
            }`}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
