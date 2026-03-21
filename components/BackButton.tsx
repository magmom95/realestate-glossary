'use client';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()}
      className="flex items-center gap-1.5 mb-6 text-sm text-[#8a8276] font-medium
        hover:text-[#f0ece4] transition-colors duration-150">
      ← 뒤로가기
    </button>
  );
}
