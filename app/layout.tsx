import type { Metadata } from 'next';
import { DM_Serif_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '홈 잉 버드 | 부린이를 위한 검색 학습 엔진',
  description: '부동산 용어를 검색하고, 비유로 이해하고, 연관 개념으로 이어서 학습하세요.',
  keywords: ['부동산', '용어사전', '전세', 'LTV', '재개발', '청약', '부린이'],
  openGraph: {
    images: [
      {
        url: '/op.png',
        width: 1200,
        height: 630,
        alt: '부동버드 | 초보자를 위한 검증된 용어 사전',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/icon16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon128.png', sizes: '128x128', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={dmSerif.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="bg-[#0d0d0d] text-[#f0ece4] min-h-dvh font-sans">
        <Header />
        <main className="min-h-[calc(100dvh-52px)] sm:min-h-[calc(100dvh-60px)]">{children}</main>
        <footer className="border-t border-white/[0.07] py-6 sm:py-8 text-center text-[11px] sm:text-xs text-[#4a4640] px-4">
          © 2026 HOME-ING-BIRD · 초보자를 위한 검색 기반 학습 엔진
        </footer>
      </body>
    </html>
  );
}
