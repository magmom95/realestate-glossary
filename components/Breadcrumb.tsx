import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#4a4640] mb-4 sm:mb-6 flex-wrap">
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1.5">
          {idx > 0 && <span className="text-[#333]">›</span>}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-[#8a8276] transition-colors duration-150"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#8a8276]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
