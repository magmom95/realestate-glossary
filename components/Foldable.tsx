'use client';
import { useState } from 'react';

interface FoldableProps {
  title: string;
  emoji: string;
  titleColor?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function Foldable({
  title,
  emoji,
  titleColor = '#4a4640',
  defaultOpen = true,
  children,
}: FoldableProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full text-left group"
      >
        <span className="text-xl flex-shrink-0">{emoji}</span>
        <p
          className="text-[11px] font-bold tracking-widest uppercase flex-1"
          style={{ color: titleColor }}
        >
          {title}
        </p>
        <span
          className={`text-[#4a4640] text-xs transition-transform duration-200 group-hover:text-[#8a8276]
            ${open ? 'rotate-0' : '-rotate-90'}`}
        >
          ▼
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? 'max-h-[1000px] opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pl-9">{children}</div>
      </div>
    </div>
  );
}
